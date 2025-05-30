"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeEditor } from "./code-editor"
import { LivePreview } from "./live-preview"
import { PackageInstaller } from "./package-installer"
import {
  Sparkles,
  Play,
  Package,
  Terminal,
  Loader2,
  CheckCircle,
  XCircle,
  Code2,
  Eye,
  Download,
  Zap,
  Brain,
} from "lucide-react"
import { toast } from "sonner"

interface LogEntry {
  id: string
  type: "info" | "success" | "error" | "warning" | "package"
  message: string
  timestamp: Date
  details?: string
}

interface AIProvider {
  name: string
  model: string
  icon: React.ReactNode
  description: string
}

const AI_PROVIDERS: AIProvider[] = [
  {
    name: "OpenAI",
    model: "gpt-4-turbo",
    icon: <Brain className="w-4 h-4" />,
    description: "Most capable model for complex components",
  },
  {
    name: "OpenAI",
    model: "gpt-3.5-turbo",
    icon: <Zap className="w-4 h-4" />,
    description: "Fast and efficient for simple components",
  },
  {
    name: "xAI",
    model: "grok-beta",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Creative and innovative solutions",
  },
]

const EXAMPLE_PROMPTS = [
  "Create a modern dashboard with analytics charts and metrics cards",
  "Build a contact form with validation and success states",
  "Design a pricing table with three tiers and feature comparison",
  "Create a todo list app with add, delete, and toggle functionality",
  "Build a user profile card with avatar, stats, and social links",
  "Design a file upload component with drag and drop",
  "Create a cryptocurrency wallet interface with balance and transactions",
  "Build a chat interface with message bubbles and typing indicators",
]

export function V0Interface() {
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AI_PROVIDERS[0])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [activeTab, setActiveTab] = useState("preview")
  const [componentName, setComponentName] = useState("GeneratedComponent")
  const [installedPackages, setInstalledPackages] = useState<string[]>([])
  const [showPackageManager, setShowPackageManager] = useState(false)
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: 0,
    packagesInstalled: 0,
    lastGeneration: null as Date | null,
  })

  const addLog = (type: LogEntry["type"], message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      details,
      timestamp: new Date(),
    }
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]) // Keep last 50 logs
  }

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setLogs([])
    addLog("info", "🚀 Starting code generation...", `Using ${selectedProvider.name} ${selectedProvider.model}`)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          provider: selectedProvider,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response stream")

      let accumulatedCode = ""
      const decoder = new TextDecoder()

      addLog("info", "🤖 AI is generating code...", "Streaming response in real-time")

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === "text-delta") {
                accumulatedCode += data.textDelta
                setGeneratedCode(accumulatedCode)
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }

      addLog("success", "✅ Code generation completed", `Generated ${accumulatedCode.length} characters`)

      // Extract component name
      const nameMatch = accumulatedCode.match(/export\s+default\s+function\s+(\w+)|function\s+(\w+)|const\s+(\w+)\s*=/)
      const extractedName = nameMatch?.[1] || nameMatch?.[2] || nameMatch?.[3] || "GeneratedComponent"
      setComponentName(extractedName)

      // Update stats
      setGenerationStats((prev) => ({
        totalGenerated: prev.totalGenerated + 1,
        packagesInstalled: prev.packagesInstalled,
        lastGeneration: new Date(),
      }))

      if (accumulatedCode) {
        addLog("info", "📦 Analyzing required packages...", "Checking imports and usage patterns")
        await installRequiredPackages(accumulatedCode)
      }

      setActiveTab("preview")
      toast.success("Component generated successfully!")
    } catch (error) {
      console.error("Generation error:", error)
      addLog("error", `❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      toast.error("Failed to generate code")
    } finally {
      setIsGenerating(false)
    }
  }

  const installRequiredPackages = async (code: string) => {
    try {
      const response = await fetch("/api/install-packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.installed && result.installed.length > 0) {
          const packageNames = result.installed.map((pkg: any) => pkg.name || pkg)
          addLog(
            "package",
            `📦 Auto-installed packages: ${packageNames.join(", ")}`,
            `${result.installed.length} packages added to project`,
          )
          setInstalledPackages((prev) => [...new Set([...prev, ...packageNames])])
          setGenerationStats((prev) => ({
            ...prev,
            packagesInstalled: prev.packagesInstalled + result.installed.length,
          }))
          toast.success(`Installed ${result.installed.length} packages automatically`)
        } else {
          addLog("info", "📦 No new packages required", "All dependencies already available")
        }
      } else {
        addLog("warning", `⚠️ Package installation issue: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      addLog("error", `❌ Package installation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      generateCode()
    }
  }

  const clearAll = () => {
    setPrompt("")
    setGeneratedCode("")
    setLogs([])
    setComponentName("GeneratedComponent")
    toast.info("Workspace cleared")
  }

  const useExamplePrompt = useCallback(
    (example: string) => {
      setPrompt(example)
      toast.info("Example prompt loaded")
    },
    [setPrompt],
  )

  const downloadCode = () => {
    if (!generatedCode) {
      toast.error("No code to download")
      return
    }

    const blob = new Blob([generatedCode], { type: "text/typescript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${componentName}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Code downloaded successfully")
  }

  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <Terminal className="w-4 h-4 text-yellow-500" />
      case "package":
        return <Package className="w-4 h-4 text-purple-500" />
      default:
        return <Terminal className="w-4 h-4 text-blue-500" />
    }
  }

  const getLogTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-700 bg-green-50 border-green-200"
      case "error":
        return "text-red-700 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "package":
        return "text-purple-700 bg-purple-50 border-purple-200"
      default:
        return "text-blue-700 bg-blue-50 border-blue-200"
    }
  }

  const ExampleButton = ({ example }: { example: string }) => {
    const handleExampleClick = () => {
      useExamplePrompt(example)
    }

    return (
      <button
        onClick={handleExampleClick}
        className="w-full text-left text-xs p-2 rounded border hover:bg-muted transition-colors"
        disabled={isGenerating}
      >
        {example}
      </button>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">INNOXAI</h1>
              </div>
              <Badge variant="secondary">AI Code Generator</Badge>
              {generationStats.totalGenerated > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Zap className="w-3 h-3" />
                  {generationStats.totalGenerated} generated
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={`${selectedProvider.name}-${selectedProvider.model}`}
                onValueChange={(value) => {
                  const [name, model] = value.split("-")
                  const provider = AI_PROVIDERS.find((p) => p.name === name && p.model === model)
                  if (provider) setSelectedProvider(provider)
                }}
              >
                <SelectTrigger className="w-56">
                  <div className="flex items-center gap-2">
                    {selectedProvider.icon}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={`${provider.name}-${provider.model}`} value={`${provider.name}-${provider.model}`}>
                      <div className="flex items-center gap-2">
                        {provider.icon}
                        <div>
                          <div className="font-medium">
                            {provider.name} - {provider.model}
                          </div>
                          <div className="text-xs text-muted-foreground">{provider.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPackageManager(!showPackageManager)}
                className="gap-2"
              >
                <Package className="w-4 h-4" />
                Packages ({installedPackages.length})
              </Button>

              <Button variant="outline" onClick={clearAll} size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Package Manager Panel */}
      {showPackageManager && (
        <div className="border-b bg-muted/30 p-4">
          <PackageInstaller
            code={generatedCode}
            onPackagesInstalled={(packages) => {
              const names = packages.map((pkg) => pkg.name)
              setInstalledPackages((prev) => [...new Set([...prev, ...names])])
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Prompt Section */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Component
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Describe your component:</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Create a modern dashboard with charts and metrics..."
                    className="w-full h-32 p-3 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-muted-foreground">Press Cmd/Ctrl + Enter to generate</p>
                </div>

                {/* Example Prompts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Examples:</label>
                  <ScrollArea className="h-24">
                    <div className="space-y-1">
                      {EXAMPLE_PROMPTS.map((example, index) => (
                        <ExampleButton key={index} example={example} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Button onClick={generateCode} disabled={isGenerating || !prompt.trim()} className="w-full" size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Component
                    </>
                  )}
                </Button>

                {/* Activity Logs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      Activity Log
                    </h3>
                    {logs.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setLogs([])} className="text-xs">
                        Clear
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-48 border rounded-md">
                    {logs.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        No activity yet. Start by generating a component!
                      </p>
                    ) : (
                      <div className="p-2 space-y-2">
                        {logs.map((log) => (
                          <div
                            key={log.id}
                            className={`flex items-start gap-2 text-xs p-2 rounded border ${getLogTypeColor(log.type)}`}
                          >
                            {getLogIcon(log.type)}
                            <div className="flex-1">
                              <div className="font-medium">{log.message}</div>
                              {log.details && <div className="text-xs opacity-75 mt-1">{log.details}</div>}
                              <div className="text-xs opacity-50 mt-1">{log.timestamp.toLocaleTimeString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code & Preview Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b px-6 pt-6">
                  <div className="flex items-center justify-between">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                      <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Code
                      </TabsTrigger>
                    </TabsList>

                    {generatedCode && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Package className="w-3 h-3" />
                          {componentName}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={downloadCode} className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-0">
                  <TabsContent value="preview" className="h-full m-0 p-0">
                    <LivePreview code={generatedCode} isStreaming={isGenerating} />
                  </TabsContent>

                  <TabsContent value="code" className="h-full m-0 p-0">
                    <CodeEditor code={generatedCode} onChange={setGeneratedCode} isStreaming={isGenerating} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
