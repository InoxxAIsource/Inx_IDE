"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Copy, Check, Download, Share } from "lucide-react"
import { LivePreview } from "@/components/live-preview"

interface CodePreviewProps {
  code: string
  prompt: string
}

export function CodePreview({ code, prompt }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "component.tsx"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyCode} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <TabsContent value="preview" className="h-full mt-0">
            <Card className="h-full">
              <LivePreview code={code} />
            </Card>
          </TabsContent>

          <TabsContent value="code" className="h-full mt-0">
            <Card className="h-full p-0">
              <ScrollArea className="h-full">
                <pre className="p-6 text-sm bg-slate-950 text-slate-50 rounded-lg overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </ScrollArea>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
