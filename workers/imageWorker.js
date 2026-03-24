import { promises as fs } from "fs"

export default async function runImageWorker() {
  try {
    const fileContent = await fs.readFile("./cms/posts.json", "utf-8")
    if (!fileContent.trim()) return; // Handle empty file
    
    const posts = JSON.parse(fileContent)
    let updated = false

    for (let post of posts) {
      if (post.status === "awaiting_image") {
        try {
          console.log(`Generating image for post: ${post.id}...`)
          
          post.image = await generateImageWithAI(post.text)
          
          post.status = "approved" // ready to publish
          updated = true
          console.log(`Image created for ${post.id}`)
        } catch (err) {
          console.error(`Failed generating image for post ${post.id}:`, err)
        }
      }
    }

    if (updated) {
      await fs.writeFile("./cms/posts.json", JSON.stringify(posts, null, 2))
    }
  } catch (err) {
    console.error("Image Worker file error:", err)
  }
}

// Helper to simulate calling your AI image generator
async function generateImageWithAI(text) {
  if (!process.env.OPENAI_API_KEY) {
    return "https://dummyimage.com/600x400/000/fff&text=AI+Generated+Image"
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `Create a social media image representing the following post: ${text}`,
      n: 1,
      size: "1024x1024"
    })
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data[0].url
}
