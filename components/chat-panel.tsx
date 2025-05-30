"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Send, Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  onCodeGenerated?: (code: string) => void
  isStreaming?: boolean
  projectType?: string
  initialMessages?: Message[]
}

export function ChatPanel({
  onCodeGenerated,
  isStreaming: externalStreaming,
  projectType,
  initialMessages = [],
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeMode, setActiveMode] = useState<string>("general")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external streaming state if provided
  useEffect(() => {
    if (externalStreaming !== undefined) {
      setIsStreaming(externalStreaming)
    }
  }, [externalStreaming])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsStreaming(true)

    try {
      // Include project type in the message if provided
      const fullMessage = projectType ? `[Project Type: ${projectType}] ${input}` : input

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullMessage,
          mode: activeMode,
          conversationHistory: messages.slice(-6), // Send last 6 messages for context
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to get response")
      }

      if (!res.body) return

      // Add empty assistant message that will be filled
      const assistantMessage: Message = { role: "assistant", content: "", timestamp: new Date() }
      setMessages((prev) => [...prev, assistantMessage])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk

        // Update the last message with the accumulated text
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: assistantText,
          }
          return updated
        })
      }

      // If this is code generation, pass the generated code to the callback
      if (activeMode === "code" && onCodeGenerated) {
        onCodeGenerated(assistantText)
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsStreaming(false)
      // Focus the input after sending
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Show toast or notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    notification.textContent = "Copied to clipboard!"
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 2000)
  }

  const handleRegenerateLastResponse = async () => {
    if (messages.length < 2 || isStreaming) return

    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex((m) => m.role === "user")
    if (lastUserMessageIndex === -1) return

    const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex]

    // Remove the last assistant message
    setMessages((prev) => prev.slice(0, -1))

    // Re-send the last user message
    setInput(lastUserMessage.content)
    setTimeout(() => handleSubmit(), 100)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  // Get suggestions based on project type and active mode
  const getSuggestions = () => {
    if (activeMode === "code") {
      return [
        "Create a responsive navigation bar",
        "Build a form with validation",
        "Create a data table with sorting",
        "Build a dashboard card with metrics",
      ]
    }

    if (activeMode === "debug") {
      return [
        "Fix this React useEffect dependency warning",
        "Debug why my state isn't updating",
        "Fix this TypeScript error in my component",
        "Help with this Next.js hydration error",
      ]
    }

    switch (projectType) {
      case "dapp":
        return [
          "How to connect to MetaMask?",
          "Explain how to use ethers.js",
          "Best practices for Web3 UIs",
          "How to handle wallet events",
        ]
      case "fullstack-app":
        return [
          "Explain server components vs client components",
          "How to implement authentication",
          "Best practices for API routes",
          "How to optimize database queries",
        ]
      default:
        return [
          "How to use React context effectively?",
          "Explain TypeScript generics",
          "Best practices for component design",
          "How to optimize React performance",
        ]
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleClearChat} disabled={messages.length === 0 || isStreaming}>
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerateLastResponse}
              disabled={messages.length === 0 || isStreaming}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" value={activeMode} onValueChange={setActiveMode} className="w-full mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="explain">Explain</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-gray-500">
              <Sparkles className="h-8 w-8 mb-2 text-blue-400" />
              <p>Ask me anything about web development, React, or Next.js!</p>
              <p className="text-sm">I can help with code, debugging, and explanations.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex gap-2 max-w-full", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%]",
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    <span className="text-xs opacity-75">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  {msg.role === "assistant" && (
                    <div className="flex gap-1 mt-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyMessage(msg.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="p-2 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            placeholder={isStreaming ? "Waiting for response..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={isStreaming || !input.trim()}>
            {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>

      {/* Quick suggestions */}
      {messages.length < 3 && !isStreaming && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {getSuggestions().map((suggestion, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setInput(suggestion)
                  inputRef.current?.focus()
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
