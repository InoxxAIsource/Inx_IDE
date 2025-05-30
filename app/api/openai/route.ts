import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText, generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { prompt, stream = true, model = "gpt-4o", temperature = 0.7, maxTokens = 2000 } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const modelInstance = openai(model)

    if (stream) {
      // Streaming response
      const result = await streamText({
        model: modelInstance,
        prompt,
        temperature,
        maxTokens,
      })

      return result.toDataStreamResponse()
    } else {
      // Non-streaming response
      const result = await generateText({
        model: modelInstance,
        prompt,
        temperature,
        maxTokens,
      })

      return NextResponse.json({
        text: result.text,
        usage: result.usage,
        finishReason: result.finishReason,
      })
    }
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
