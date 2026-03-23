import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Scheduled pipeline trigger: checks for automations with trigger="scheduled" 
 * and status="active", then runs the content-pipeline for each.
 * Called by pg_cron or manually.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Find active scheduled automations that are due
    const { data: automations, error: fetchError } = await adminClient
      .from("automations")
      .select("*")
      .eq("status", "active")
      .eq("trigger", "scheduled")
      .or("next_run.is.null,next_run.lte." + new Date().toISOString());

    if (fetchError) throw fetchError;
    if (!automations || automations.length === 0) {
      return new Response(JSON.stringify({ message: "No scheduled automations due", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];

    for (const auto of automations) {
      try {
        // Derive topic from automation name/description
        const topic = auto.description || auto.name;
        const platforms = auto.platforms || ["twitter"];

        // Call the content-pipeline function
        const pipelineUrl = `${supabaseUrl}/functions/v1/content-pipeline`;
        
        // Create a temporary session for the user
        // We use service role to invoke the pipeline on behalf of the user
        const response = await fetch(pipelineUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anonKey}`,
            // We need to pass user context - the pipeline verifies auth
            // For cron jobs, we'll use service role auth directly
            "x-service-role": serviceKey,
          },
          body: JSON.stringify({
            topic,
            platforms,
            scheduleMode: "draft",
          }),
        });

        const result = await response.json();

        // Calculate next run based on schedule
        const scheduleMap: Record<string, number> = {
          hourly: 60 * 60 * 1000,
          daily: 24 * 60 * 60 * 1000,
          weekly: 7 * 24 * 60 * 60 * 1000,
          monthly: 30 * 24 * 60 * 60 * 1000,
        };

        const interval = scheduleMap[auto.schedule || "daily"] || scheduleMap.daily;
        const nextRun = new Date(Date.now() + interval).toISOString();

        await adminClient
          .from("automations")
          .update({
            last_run: new Date().toISOString(),
            next_run: nextRun,
            run_count: (auto.run_count || 0) + 1,
          })
          .eq("id", auto.id);

        // Log the run
        await adminClient
          .from("automation_runs")
          .insert({
            automation_id: auto.id,
            user_id: auto.user_id,
            status: response.ok ? "success" : "failed",
            completed_at: new Date().toISOString(),
            error_message: response.ok ? `Pipeline completed: ${result.title || "OK"}` : result.error,
          });

        results.push({ automationId: auto.id, name: auto.name, success: response.ok });
      } catch (err: any) {
        console.error(`Failed to run automation ${auto.id}:`, err);
        results.push({ automationId: auto.id, name: auto.name, success: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({ message: "Scheduled run complete", results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("scheduled-pipeline error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
