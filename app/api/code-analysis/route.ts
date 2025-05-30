import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { code, action = "analyze", requirements } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const systemPrompt = getAnalysisPrompt(action)
    const userPrompt = createUserPrompt(action, code, requirements)

    // For streaming responses (analyze, explain)
    if (action === "analyze" || action === "explain") {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2500,
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
    }
    // For non-streaming responses (improve, debug)
    else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      })

      const result = completion.choices[0]?.message?.content || ""

      return NextResponse.json({
        success: true,
        result,
        action,
        originalCode: code,
        usage: completion.usage,
      })
    }
  } catch (error) {
    console.error("Code analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 })
  }
}

function getAnalysisPrompt(action: string): string {
  switch (action) {
    case "analyze":
      return `You are a senior code reviewer. Analyze the provided code for:
      - Code quality and best practices
      - Performance optimizations
      - Security considerations
      - Accessibility improvements
      - Type safety and error handling
      Provide specific, actionable feedback.`

    case "improve":
      return `You are a code improvement specialist. Take the provided code and improve it while maintaining functionality. Focus on:
      - Better structure and organization
      - Performance optimizations
      - Enhanced readability
      - Modern best practices
      - Proper error handling
      
      Return ONLY the improved code without explanations.`

    case "explain":
      return `You are a technical educator. Explain the provided code in detail:
      - What the code does
      - How it works
      - Key concepts and patterns used
      - Potential improvements
      Make it educational and easy to understand.`

    case "debug":
      return `You are a debugging expert. Analyze the code for potential issues:
      - Syntax errors
      - Logic errors
      - Performance issues
      - Security vulnerabilities
      - Best practice violations
      Provide solutions for any issues found.`

    default:
      return `You are a code analysis expert. Provide comprehensive analysis of the given code.`
  }
}

function createUserPrompt(action: string, code: string, requirements?: string): string {
  let prompt = `${action === "improve" && requirements ? `Requirements: ${requirements}\n\n` : ""}Code to ${action}:\n\n${code}`

  if (action === "improve" && requirements) {
    prompt = `Improve this code based on these requirements: ${requirements}\n\nCode:\n${code}`
  }

  return prompt
}
