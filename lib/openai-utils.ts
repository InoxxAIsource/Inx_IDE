import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"

export interface OpenAIConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export class OpenAIService {
  private defaultConfig: OpenAIConfig = {
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 2000,
    stream: false,
  }

  constructor(private config: OpenAIConfig = {}) {
    this.config = { ...this.defaultConfig, ...config }
  }

  async generateCode(prompt: string, language = "typescript"): Promise<string> {
    const systemPrompt = `You are an expert ${language} developer. Generate clean, production-ready code based on the user's request. Include proper types, error handling, and best practices.`

    const result = await generateText({
      model: openai(this.config.model!),
      system: systemPrompt,
      prompt,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    })

    return result.text
  }

  async generateComponent(prompt: string): Promise<string> {
    const systemPrompt = `You are INNOXAI, an elite React TypeScript component generator. Create production-ready React components with:
    - TypeScript interfaces and types
    - shadcn/ui components
    - Tailwind CSS styling
    - Proper error handling
    - Accessibility features
    - Responsive design
    
    Return ONLY the component code, no explanations.`

    const result = await generateText({
      model: openai(this.config.model!),
      system: systemPrompt,
      prompt: `Generate a React TypeScript component for: ${prompt}`,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    })

    return result.text
  }

  async streamResponse(prompt: string, systemPrompt?: string) {
    return streamText({
      model: openai(this.config.model!),
      system: systemPrompt,
      prompt,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    })
  }

  async analyzeCode(code: string): Promise<string> {
    const systemPrompt = `You are a code review expert. Analyze the provided code and give constructive feedback on:
    - Code quality and best practices
    - Performance optimizations
    - Security considerations
    - Accessibility improvements
    - Type safety
    
    Provide specific, actionable suggestions.`

    const result = await generateText({
      model: openai(this.config.model!),
      system: systemPrompt,
      prompt: `Analyze this code:\n\n${code}`,
      temperature: 0.3,
      maxTokens: 1500,
    })

    return result.text
  }

  async improveCode(code: string, requirements: string): Promise<string> {
    const systemPrompt = `You are a code improvement specialist. Take the provided code and improve it based on the requirements. Maintain the original functionality while implementing the requested improvements.`

    const result = await generateText({
      model: openai(this.config.model!),
      system: systemPrompt,
      prompt: `Improve this code based on these requirements: ${requirements}\n\nCode:\n${code}`,
      temperature: 0.5,
      maxTokens: 2000,
    })

    return result.text
  }
}

// Export a default instance
export const openaiService = new OpenAIService()

// Export utility functions
export async function generateWithOpenAI(prompt: string, config?: OpenAIConfig) {
  const service = new OpenAIService(config)
  return service.generateCode(prompt)
}

export async function generateReactComponent(prompt: string) {
  const service = new OpenAIService({ temperature: 0.7 })
  return service.generateComponent(prompt)
}
