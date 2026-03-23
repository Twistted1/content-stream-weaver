import fs from "fs"

export default async function runAIWorker() {
  const posts = JSON.parse(fs.readFileSync("./cms/posts.json"))

  let updated = false

  for (let post of posts) {
    if (post.status === "idea") {
      try {
        console.log(`Generating post for idea: "${post.idea}"...`)
        
        // 🔥 Real AI plug-in replaces the hardcoded string
        post.text = await generatePostWithAI(post.idea)
        
        // optional: set schedule automatically
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(14, 0, 0)

        post.scheduled_at = tomorrow.toISOString()
        post.status = "approved"

        updated = true
        console.log(`Post ${post.id} generated:`, post.text)
      } catch (err) {
        console.error(`Failed generating post ${post.id}:`, err)
      }
    }
  }

  if (updated) {
    fs.writeFileSync("./cms/posts.json", JSON.stringify(posts, null, 2))
  }
}

// Helper to call your AI assistant
async function generatePostWithAI(idea) {
  // To avoid crashing if no API key is set, we return a fallback string
  if (!process.env.OPENAI_API_KEY) {
    return `AI generated post about: ${idea}\n\n#${idea.replace(/\s+/g, '')} #Innovation`
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert social media manager. Write an engaging, short post (under 280 characters) for Twitter/X based on the user's idea. Do not use hashtags." 
        },
        { role: "user", content: `Write a post about: ${idea}` }
      ],
      max_tokens: 100
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
