import { promises as fs } from "fs"

export default async function runAIWorker() {
  try {
    const fileContent = await fs.readFile("./cms/posts.json", "utf-8")
    if (!fileContent.trim()) return; // Handle empty file
    
    const posts = JSON.parse(fileContent)
    let updated = false

    for (let post of posts) {
      if (post.status === "idea" && post.idea) {
        try {
          console.log(`Generating post for idea: "${post.idea}"...`)
          
          post.text = await generatePostWithAI(post.idea)
          
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
      } else if (post.status === "idea" && !post.idea) {
        console.warn(`Post ${post.id} has status "idea" but no idea text!`)
      }
    }

    if (updated) {
      await fs.writeFile("./cms/posts.json", JSON.stringify(posts, null, 2))
    }
  } catch (err) {
    console.error("AI Worker file error:", err)
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
