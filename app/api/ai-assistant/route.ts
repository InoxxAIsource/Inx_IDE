import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { message, mode = "general", context, conversationHistory = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = getSystemPromptForMode(mode)

    // Build messages array with conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      // Add previous conversation history
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      // Add current context if provided
      ...(context ? [{ role: "user", content: `Context: ${context}` }] : []),
      // Add current message
      { role: "user", content: message },
    ]

    // Stream the response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages,
      temperature: mode === "code" ? 0.3 : 0.7,
      max_tokens: 2000,
    })

    // Create a readable stream for the response
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
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

function getSystemPromptForMode(mode: string): string {
  switch (mode) {
    case "code":
      return `You are a senior software engineer. Provide accurate, well-documented code solutions with explanations. Focus on best practices, performance, and maintainability. Use TypeScript, React, and Next.js when applicable.`

    case "debug":
      return `You are a debugging expert. Analyze code issues, identify problems, and provide step-by-step solutions. Be thorough and explain the root cause. Focus on TypeScript, React, and Next.js issues.`

    case "review":
      return `You are a code reviewer. Analyze code quality, suggest improvements, identify potential issues, and recommend best practices. Be constructive and specific. Focus on TypeScript, React, and Next.js best practices.`

    case "explain":
      return `You are a technical educator. Explain code concepts clearly and thoroughly. Break down complex topics into understandable parts with examples. Focus on web development concepts, especially TypeScript, React, and Next.js.`

    case "optimize":
      return `You are a performance optimization expert. Analyze code for performance bottlenecks and suggest specific optimizations with explanations. Focus on React and Next.js performance patterns.`

    case "design":
      return `You are a UI/UX design expert. Provide guidance on component design, layout, accessibility, and user experience. Focus on modern web interfaces using Tailwind CSS and shadcn/ui components.`

    default:
      return `You are a helpful AI assistant specialized in web development with TypeScript, React, and Next.js. Provide accurate, helpful responses to technical questions.`
  }
}
