import fs from "fs"

export default async function runPublishWorker() {
  const posts = JSON.parse(fs.readFileSync("./cms/posts.json"))

  let updated = false
  const now = new Date()

  for (let post of posts) {
    if (
      post.status === "approved" &&
      post.scheduled_at &&
      new Date(post.scheduled_at) <= now
    ) {
      try {
        console.log(`[Publisher] Going LIVE with post ${post.id} to ${post.platform}...`)

        // 🔥 THE REAL PUBLISH LOGIC 🔥
        // To launch in the next few hours WITHOUT building full OAuth flows for X and Instagram yourself, 
        // the most bulletproof way is to fire this data to a Make.com or Zapier Webhook!
        
        const webhookUrl = process.env.MAKE_WEBHOOK_URL; // Add your webhook URL here

        if (webhookUrl) {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: post.id,
              platform: post.platform,
              text: post.text,
              image: post.image // URL to the image generated earlier
            })
          });

          if (!response.ok) throw new Error(`Webhook failed: ${response.statusText}`);
          console.log(`✅ Successfully published post ${post.id}!`);
        } else {
          console.warn("⚠️ No MAKE_WEBHOOK_URL set. Simulating publish.");
        }

        post.status = "published"
        updated = true
      } catch (err) {
        console.error(`❌ Failed to publish post ${post.id}:`, err)
      }
    }
  }

  if (updated) {
    fs.writeFileSync("./cms/posts.json", JSON.stringify(posts, null, 2))
  }
}

