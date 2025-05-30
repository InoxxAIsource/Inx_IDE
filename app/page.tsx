"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  User,
  Send,
  Loader2,
  Zap,
  Code,
  Monitor,
  Sparkles,
  Brain,
  Database,
  Eye,
  CheckCircle,
  Save,
} from "lucide-react"
import { LivePreview } from "@/components/live-preview"
import { CodeEditor } from "@/components/code-editor"
import { SaveComponentDialog } from "@/components/save-component-dialog"
import { ComponentLibrary } from "@/components/component-library"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface Metrics {
  total_users: number
  revenue: number
  growth_rate: number
  active_users: number
  components_generated: number
  api_calls: number
}

interface SavedComponent {
  id: string
  name: string
  code: string
  prompt: string
  userId?: string
  createdAt: string
  blobUrl: string
}

export default function INNOXAIHomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "🚀 Welcome to INNOXAI! I'm your AI full-stack developer agent.\n\n✨ Try these examples:\n• 'Create a dashboard with charts'\n• 'Build a contact form'\n• 'Make a todo list app'\n• 'Design a pricing page'\n• 'Create a data table'",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [showDashboard, setShowDashboard] = useState(false)
  const [componentName, setComponentName] = useState("GeneratedComponent")
  const [metrics, setMetrics] = useState<Metrics>({
    total_users: 12847,
    revenue: 89432,
    growth_rate: 235,
    active_users: 1247,
    components_generated: 156,
    api_calls: 2341,
  })
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        active_users: prev.active_users + Math.floor(Math.random() * 10),
        api_calls: prev.api_calls + Math.floor(Math.random() * 5),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleTestDashboard = () => {
    setIsGenerating(true)
    setActiveTab("preview")
    setComponentName("AnalyticsDashboard")

    const generatingMessage: Message = {
      role: "assistant",
      content: "🚀 Generating Analytics Dashboard...\n\n⚡ Creating interactive components with real-time data...",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, generatingMessage])

    // Simulate code generation
    setTimeout(() => {
      const dashboardCode = `"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const [metrics, setMetrics] = useState({
    users: 12847,
    revenue: 89432,
    growth: 23.5,
    active: 1247
  });

  const updateMetrics = () => {
    setMetrics(prev => ({
      users: prev.users + Math.floor(Math.random() * 100),
      revenue: prev.revenue + Math.floor(Math.random() * 1000),
      growth: +(prev.growth + Math.random() * 2).toFixed(1),
      active: prev.active + Math.floor(Math.random() * 50)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{metrics.users.toLocaleString()}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-200">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Revenue</p>
                <p className="text-3xl font-bold">${metrics.revenue.toLocaleString()}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-200">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Growth Rate</p>
                <p className="text-3xl font-bold">{metrics.growth}%</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-200">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Now</p>
                <p className="text-3xl font-bold">{metrics.active}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-200">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={updateMetrics} className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
            </svg>
            Update Metrics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`

      setGeneratedCode(dashboardCode)
      setShowDashboard(true)

      const testMessage: Message = {
        role: "assistant",
        content:
          "✅ Generated Advanced Analytics Dashboard!\n\n🎯 Features:\n• Real-time metrics display\n• Interactive components\n• Responsive design\n• TypeScript support\n• Production-ready code",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, testMessage])
      setIsGenerating(false)
    }, 2000)
  }

  const handleSendMessage = () => {
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const prompt = input
    setInput("")
    setIsGenerating(true)
    setActiveTab("code")
    setComponentName(
      prompt
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "") || "GeneratedComponent",
    )

    // Simulate AI generation
    setTimeout(() => {
      const code = `"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">${prompt}</h2>
          <p className="text-gray-600 mb-4">Generated by INNOXAI</p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl font-bold">{count}</div>
            <div className="flex gap-2">
              <Button onClick={() => setCount(count - 1)}>Decrease</Button>
              <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
              <Button onClick={() => setCount(count + 1)}>Increase</Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Badge>Interactive</Badge>
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">Tailwind</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`

      setGeneratedCode(code)
      setShowDashboard(false)

      const completionMessage: Message = {
        role: "assistant",
        content: `✅ Successfully generated "${prompt}" component!\n\nCheck the code tab to edit and the preview tab to see it live!`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, completionMessage])
      setIsGenerating(false)
    }, 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const handleLoadComponent = (component: SavedComponent) => {
    setGeneratedCode(component.code)
    setComponentName(component.name)
    setShowLibrary(false)
    setActiveTab("preview")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                INNOXAI
              </h1>
              <p className="text-sm text-gray-600">AI Full-Stack Developer Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Badge variant="secondary" className="gap-1">
                <Database className="h-3 w-3" />
                Database Ready
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Brain className="h-3 w-3" />
                AI Active
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Online
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowLibrary(true)}>
                <Code className="h-4 w-4 mr-2" />
                Component Library
              </Button>

              {generatedCode && (
                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Component
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat Interface */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">AI Agent Console</span>
                </div>
                <Button
                  onClick={handleTestDashboard}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  disabled={isGenerating}
                >
                  <Zap className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "🧪 Test Analytics Dashboard"}
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                      {message.role !== "user" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <Card
                        className={`max-w-[85%] ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : message.role === "system"
                              ? "bg-green-50 border-green-200"
                              : "bg-white"
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                        </CardContent>
                      </Card>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </div>
                      <Card className="bg-gray-50">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            AI is generating your code...
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me to create any component..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={isGenerating}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isGenerating}>
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 flex flex-col m-0">
              <CodeEditor code={generatedCode} onChange={setGeneratedCode} isStreaming={isGenerating} />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 flex flex-col m-0">
              <LivePreview code={generatedCode} isStreaming={isGenerating} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Full Preview */}
        <div className="flex-1 bg-gray-100 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Full Screen Preview
                {generatedCode && (
                  <Badge variant="secondary" className="ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0">
              {generatedCode ? (
                <div className="h-full">
                  <LivePreview code={generatedCode} isStreaming={isGenerating} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Eye className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate</h3>
                    <p className="text-gray-600 mb-6">Click the test button or ask for any component to see it here</p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="outline">AI Integration</Badge>
                      <Badge variant="outline">Real-time</Badge>
                      <Badge variant="outline">Production-Ready</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Component Dialog */}
      {showSaveDialog && (
        <SaveComponentDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          componentCode={generatedCode}
          componentName={componentName}
          prompt={messages.find((m) => m.role === "user")?.content}
          user={user}
          onSaved={() => {
            setShowSaveDialog(false)
            // Show success message
          }}
        />
      )}

      {/* Component Library */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Component Library
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowLibrary(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </CardHeader>
            <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
              <ComponentLibrary user={user} onLoadComponent={handleLoadComponent} />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
