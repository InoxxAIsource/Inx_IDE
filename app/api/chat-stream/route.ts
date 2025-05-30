import type { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `
You are a senior full-stack AI coding assistant specialized in React, Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui components, and serverless API routes.

You must generate:
- Fully valid TypeScript React components.
- Always include imports.
- Always use shadcn/ui components (Button, Card, Input, etc.)
- Use TailwindCSS classes for styling.
- Use proper TypeScript types.
- NEVER return explanations or text, only pure code block wrapped in markdown.

If user asks for a multi-file project, generate one full code block per file as separate file headers (e.g. \`\`\`/app/page.tsx\n...\`\`\`).

Stay highly accurate.
`

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const stream = await openai.chat.completions.create({
    model: "gpt-4o", // Or use "gpt-4" if needed
    stream: true,
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ""
        controller.enqueue(encoder.encode(content))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
