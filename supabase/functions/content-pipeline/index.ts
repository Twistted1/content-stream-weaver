import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");
    if (!openaiKey) throw new Error("OPENAI_API_KEY not configured");

    // Verify user
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader! } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { topic, platforms, scheduleMode, scheduledAt } = await req.json();

    if (!topic || !platforms?.length) {
      return new Response(JSON.stringify({ error: "topic and platforms are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create pipeline run
    const { data: pipelineRun, error: insertError } = await adminClient
      .from("pipeline_runs")
      .insert({
        user_id: user.id,
        topic,
        platforms,
        schedule_mode: scheduleMode || "immediate",
        scheduled_at: scheduledAt || null,
        status: "running",
        steps: [{ step: "started", ts: new Date().toISOString() }],
      })
      .select()
      .single();

    if (insertError) throw insertError;
    const runId = pipelineRun.id;

    const updateStep = async (step: string, data?: any) => {
      const { data: current } = await adminClient
        .from("pipeline_runs")
        .select("steps")
        .eq("id", runId)
        .single();
      const steps = [...((current?.steps as any[]) || []), { step, ts: new Date().toISOString(), ...data }];
      await adminClient.from("pipeline_runs").update({ steps }).eq("id", runId);
    };

    // 2. IDEA GENERATION - Generate content with AI
    await updateStep("generating_content");

    const platformList = platforms.join(", ");
    const contentPrompt = `You are a professional social media content creator. Generate a complete post about: "${topic}"

Target platforms: ${platformList}

Return a JSON object with:
{
  "title": "A compelling title (max 80 chars)",
  "content": "The full post content optimized for ${platformList}. Include relevant hashtags. Make it engaging and professional.",
  "excerpt": "A 1-2 sentence summary",
  "type": "text",
  "tags": ["tag1", "tag2", "tag3"],
  "imagePrompt": "A detailed description for generating a cover image that matches this content. Be specific about composition, style, and mood."
}

Return ONLY the JSON, no markdown or explanation.`;

    const contentResponse = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: contentPrompt }],
      }),
    });

    if (!contentResponse.ok) {
      const errText = await contentResponse.text();
      throw new Error(`AI content generation failed [${contentResponse.status}]: ${errText}`);
    }

    const contentData = await contentResponse.json();
    let rawContent = contentData.choices?.[0]?.message?.content || "";
    // Strip markdown code fences if present
    rawContent = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let generatedContent: any;
    try {
      generatedContent = JSON.parse(rawContent);
    } catch {
      throw new Error("AI returned invalid JSON for content generation");
    }

    await updateStep("content_generated", { title: generatedContent.title });

    // 3. IMAGE GENERATION - Generate cover image with DALL-E
    await updateStep("generating_image");

    let coverImageUrl: string | null = null;
    try {
      const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: generatedContent.imagePrompt || `Professional social media image for: ${topic}`,
          n: 1,
          size: "1792x1024",
          quality: "standard",
        }),
      });

      if (dalleResponse.ok) {
        const dalleData = await dalleResponse.json();
        coverImageUrl = dalleData.data?.[0]?.url || null;
        await updateStep("image_generated", { url: coverImageUrl ? "success" : "no_url" });
      } else {
        const errText = await dalleResponse.text();
        console.error("DALL-E error:", errText);
        await updateStep("image_failed", { error: errText.substring(0, 200) });
      }
    } catch (imgErr: any) {
      console.error("Image generation error:", imgErr);
      await updateStep("image_skipped", { reason: imgErr.message });
    }

    // 4. SCHEDULING - Create the post
    await updateStep("creating_post");

    const postStatus = scheduleMode === "scheduled" && scheduledAt ? "scheduled" : "draft";
    const { data: post, error: postError } = await adminClient
      .from("posts")
      .insert({
        user_id: user.id,
        title: generatedContent.title,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt || null,
        type: generatedContent.type || "text",
        status: postStatus,
        scheduled_at: scheduledAt || null,
        tags: generatedContent.tags || [],
        cover_image_url: coverImageUrl,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Create post_platforms entries
    const platformInserts = platforms.map((p: string) => ({
      post_id: post.id,
      platform: p,
      status: postStatus,
    }));
    await adminClient.from("post_platforms").insert(platformInserts);

    await updateStep("post_created", { postId: post.id, status: postStatus });

    // 5. PUBLISHING - Fire webhooks if immediate
    if (scheduleMode === "immediate" || (!scheduledAt && scheduleMode !== "draft")) {
      await updateStep("firing_webhooks");

      const { data: webhooks } = await adminClient
        .from("webhook_configs")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      let webhookResults: any[] = [];
      if (webhooks && webhooks.length > 0) {
        for (const webhook of webhooks) {
          // Check if webhook matches any of the target platforms
          const matchingPlatforms = platforms.filter((p: string) =>
            webhook.platforms.length === 0 || webhook.platforms.includes(p)
          );

          if (matchingPlatforms.length > 0) {
            try {
              const webhookPayload = {
                event: "post.published",
                post: {
                  id: post.id,
                  title: generatedContent.title,
                  content: generatedContent.content,
                  excerpt: generatedContent.excerpt,
                  tags: generatedContent.tags,
                  coverImageUrl: coverImageUrl,
                  platforms: matchingPlatforms,
                  scheduledAt: scheduledAt,
                },
                timestamp: new Date().toISOString(),
              };

              const whHeaders: Record<string, string> = {
                "Content-Type": "application/json",
                ...(webhook.headers as Record<string, string> || {}),
              };

              const whResp = await fetch(webhook.url, {
                method: "POST",
                headers: whHeaders,
                body: JSON.stringify(webhookPayload),
              });

              webhookResults.push({
                webhook: webhook.name,
                status: whResp.status,
                success: whResp.ok,
              });
            } catch (whErr: any) {
              webhookResults.push({
                webhook: webhook.name,
                status: 0,
                success: false,
                error: whErr.message,
              });
            }
          }
        }
      }

      // Mark post as published if webhooks were sent
      if (webhookResults.some(r => r.success)) {
        await adminClient
          .from("posts")
          .update({ status: "published", published_at: new Date().toISOString() })
          .eq("id", post.id);

        await adminClient
          .from("post_platforms")
          .update({ status: "published", published_at: new Date().toISOString() })
          .eq("post_id", post.id);
      }

      await updateStep("webhooks_fired", { results: webhookResults });
    }

    // 6. Complete pipeline
    await adminClient
      .from("pipeline_runs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        post_id: post.id,
        result: {
          title: generatedContent.title,
          hasImage: !!coverImageUrl,
          postStatus,
          postId: post.id,
        },
      })
      .eq("id", runId);

    return new Response(
      JSON.stringify({
        success: true,
        pipelineId: runId,
        postId: post.id,
        title: generatedContent.title,
        status: postStatus,
        hasImage: !!coverImageUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("content-pipeline error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Pipeline failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
