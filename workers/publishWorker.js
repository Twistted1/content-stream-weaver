import { promises as fs } from "fs"

export default async function runPublishWorker() {
  try {
    const fileContent = await fs.readFile("./cms/posts.json", "utf-8")
    if (!fileContent.trim()) return; // Handle empty file
    
    const posts = JSON.parse(fileContent)
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

          const webhookUrl = process.env.MAKE_WEBHOOK_URL;

          if (webhookUrl) {
            const response = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: post.id,
                platform: post.platform,
                text: post.text,
                image: post.image
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
      await fs.writeFile("./cms/posts.json", JSON.stringify(posts, null, 2))
    }
  } catch (err) {
    console.error("Publish Worker file error:", err)
  }
}

