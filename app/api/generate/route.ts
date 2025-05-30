import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `You are INNOXAI, an elite AI full-stack developer agent. Generate production-ready React TypeScript components based on user prompts.

RULES:
1. Always return valid TypeScript React code
2. Use shadcn/ui components: Button, Card, Input, Badge, etc.
3. Include proper imports from '@/components/ui/*'
4. Make components interactive and responsive
5. Add proper TypeScript types
6. Include error handling where appropriate
7. Use Tailwind CSS for styling
8. Make components production-ready

COMPONENT TYPES TO SUPPORT:
- Forms (contact, login, signup, survey)
- Dashboards (analytics, admin, metrics)
- Data tables (sortable, filterable, paginated)
- E-commerce (product cards, checkout, cart)
- Landing pages (hero, features, pricing)
- Navigation (sidebars, headers, menus)
- Content (blogs, portfolios, galleries)

Always include proper state management, event handlers, and realistic data.`

export async function POST(req: NextRequest) {
  try {
    const { prompt, projectType = "component" } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create system prompt based on project type
    const finalSystemPrompt =
      projectType !== "component"
        ? `${SYSTEM_PROMPT}\n\nYou are now generating a complete ${projectType.toUpperCase()}. Ensure all necessary files and components are included.`
        : SYSTEM_PROMPT

    // Stream the response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        { role: "system", content: finalSystemPrompt },
        {
          role: "user",
          content: `Generate a React TypeScript component for: ${prompt}

Requirements:
- Use shadcn/ui components
- Include proper TypeScript types
- Make it interactive and responsive
- Add realistic data and state management
- Include proper error handling
- Use Tailwind CSS for styling

Return ONLY the component code, no explanations.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
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
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Failed to generate component" }, { status: 500 })
  }
}
