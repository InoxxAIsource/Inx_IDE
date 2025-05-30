"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, FileCode, Play, Save, Github, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface CodeEditorAdvancedProps {
  code: string
  onChange: (code: string) => void
  onPreview: () => void
  componentName: string
  isStreaming?: boolean
  user?: any
}

export function CodeEditorAdvanced({
  code,
  onChange,
  onPreview,
  componentName,
  isStreaming,
  user,
}: CodeEditorAdvancedProps) {
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("editor")

  // Basic TypeScript validation
  useEffect(() => {
    if (!code) return

    const newErrors: string[] = []

    // Check for basic syntax issues
    if (!code.includes("export default")) {
      newErrors.push("Missing default export")
    }

    if (!code.includes("import") && code.includes("Button")) {
      newErrors.push("Missing imports for UI components")
    }

    if (code.includes("useState") && !code.includes("import { useState }")) {
      newErrors.push("Missing useState import")
    }

    setErrors(newErrors)
  }, [code])

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save components")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/components", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          componentName,
          componentCode: code,
          prompt: `Generated component: ${componentName}`,
        }),
      })

      if (response.ok) {
        alert("Component saved successfully!")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      alert("Failed to save component")
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async (type: "zip" | "github") => {
    setExporting(true)
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          componentCode: code,
          componentName,
          exportType: type,
        }),
      })

      if (type === "zip") {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${componentName}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        const result = await response.json()
        alert(result.message)
      }
    } catch (error) {
      alert(`Failed to export as ${type}`)
    } finally {
      setExporting(false)
    }
  }

  const formatCode = () => {
    // Basic code formatting
    const formatted = code.replace(/;/g, ";\n").replace(/{/g, "{\n  ").replace(/}/g, "\n}").replace(/,/g, ",\n  ")

    onChange(formatted)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          <span className="font-medium">Advanced Code Editor</span>
          <Badge variant="secondary">TypeScript React</Badge>
          {isStreaming && (
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              AI Generating...
            </Badge>
          )}
          {errors.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.length} Error{errors.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!code}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button variant="ghost" size="sm" onClick={formatCode} disabled={!code}>
            Format
          </Button>

          <Button variant="ghost" size="sm" onClick={onPreview} disabled={!code}>
            <Play className="h-4 w-4" />
            Preview
          </Button>

          {user && (
            <Button variant="ghost" size="sm" onClick={handleSave} disabled={!code || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={() => handleExport("zip")} disabled={!code || exporting}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            ZIP
          </Button>

          <Button variant="ghost" size="sm" onClick={() => handleExport("github")} disabled={!code || exporting}>
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="errors">Issues ({errors.length})</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 m-0">
          {!code ? (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FileCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Code Generated Yet</h3>
                <p className="text-gray-600 mb-4">Start a conversation with the AI to generate code</p>
                <div className="flex items-center gap-2 justify-center">
                  <Play className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Live editing with instant preview</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 relative">
              <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
                placeholder="// Your generated code will appear here..."
                spellCheck={false}
              />
              {isStreaming && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Streaming...
                  </Badge>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="errors" className="flex-1 m-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Code Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.length === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>No issues found</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="flex-1 m-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Component Name:</label>
                <p className="text-sm text-gray-600">{componentName}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Lines of Code:</label>
                <p className="text-sm text-gray-600">{code ? code.split("\n").length : 0}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Characters:</label>
                <p className="text-sm text-gray-600">{code ? code.length : 0}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Language:</label>
                <p className="text-sm text-gray-600">TypeScript React</p>
              </div>

              <div>
                <label className="text-sm font-medium">Framework:</label>
                <p className="text-sm text-gray-600">Next.js 14</p>
              </div>

              <div>
                <label className="text-sm font-medium">Styling:</label>
                <p className="text-sm text-gray-600">Tailwind CSS</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
