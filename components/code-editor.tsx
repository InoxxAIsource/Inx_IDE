"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileCode, Save, Check, AlertCircle } from "lucide-react"

interface CodeEditorProps {
  filename: string
  code: string
  onChange: (code: string) => void
  isStreaming?: boolean
}

export function CodeEditor({ filename, code, onChange, isStreaming }: CodeEditorProps) {
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus("idle")

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          content: code,
        }),
      })

      if (res.ok) {
        setSaveStatus("success")
      } else {
        setSaveStatus("error")
      }
    } catch (err) {
      setSaveStatus("error")
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileCode className="h-4 w-4 text-gray-500" />
          <span>{filename || "No file selected"}</span>
          <Badge variant="secondary">TypeScript React</Badge>
          {isStreaming && (
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Generating...
            </Badge>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="default" size="sm" disabled={saving || !filename} onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          {saveStatus === "success" && <Check className="text-green-600 w-4 h-4" title="Saved" />}
          {saveStatus === "error" && <AlertCircle className="text-red-500 w-4 h-4" title="Save failed" />}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing code..."
        className="flex-1 font-mono text-sm p-4 resize-none outline-none"
        style={{ fontFamily: "monospace", whiteSpace: "pre" }}
      />
    </div>
  )
}
