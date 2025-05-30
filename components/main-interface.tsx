"use client"

import type React from "react"
import { useState } from "react"
import ChatPanel from "./chat-panel"
import type Message from "./message"
import { BlockchainProvider } from "./blockchain-provider"
import { WalletConnect } from "./wallet-connect"
import { ProjectTypeSelector } from "./project-type-selector"
import { PackageInstaller } from "./package-installer"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

const MainInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [projectType, setProjectType] = useState<string>("component")
  const [showPackageInstaller, setShowPackageInstaller] = useState(false)
  const [autoInstallPackages, setAutoInstallPackages] = useState(true)
  const [installedPackages, setInstalledPackages] = useState<any[]>([])
  const [generatedCode, setGeneratedCode] = useState<string>("")

  const handleMessageSent = (newMessage: Message) => {
    setMessages([...messages, newMessage])
  }

  const handlePackagesInstalled = (packages: any[]) => {
    setInstalledPackages(packages)
    console.log("Packages installed:", packages)
  }

  const handleCodeFormatted = (formattedCode: string) => {
    setGeneratedCode(formattedCode)
    console.log("Code formatted")
  }

  const handleCodeGenerated = async (code: string) => {
    setGeneratedCode(code)
    // setShowPreview(true)

    // Automatically detect and install packages if enabled
    if (autoInstallPackages && code) {
      try {
        const response = await fetch("/api/install-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })

        const result = await response.json()

        if (result.success && result.installed.length > 0) {
          const installMessage: Message = {
            role: "assistant",
            content: `📦 Automatically installed ${result.installed.length} package${result.installed.length > 1 ? "s" : ""}:
${result.installed.map((pkg) => `• ${pkg.name} - ${pkg.description}`).join("\n")}`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, installMessage])
        }
      } catch (error) {
        console.error("Auto package installation failed:", error)
      }
    }
  }

  const handleTestDashboard = () => {
    const dashboardCode = `// Analytics Dashboard Component
import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AnalyticsDashboard() {
  // ... rest of the dashboard code
}`

    handleCodeGenerated(dashboardCode)

    const testMessage: Message = {
      role: "assistant",
      content: "✅ Generated an Interactive Analytics Dashboard with automatic package detection!",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, testMessage])
  }

  const handleSendMessage = async () => {
    // if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      role: "user",
      content: "input",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    // setInput("")
    // setIsGenerating(true)

    setTimeout(() => {
      const code = `// Generated Component: input
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function GeneratedComponent() {
  const [count, setCount] = useState(0);
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">input</h2>
        <Button onClick={() => setCount(count + 1)}>
          Clicked {count} times
        </Button>
      </div>
    </div>
  );
}`

      handleCodeGenerated(code)

      const completionMessage: Message = {
        role: "assistant",
        content: `✅ Generated "input" component with automatic package management!`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, completionMessage])
      // setIsGenerating(false)
    }, 2000)
  }

  return (
    <BlockchainProvider>
      <div className="flex flex-col h-screen">
        <WalletConnect />
        <ProjectTypeSelector onSelect={setProjectType} selectedType={projectType} />
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end p-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPackageInstaller(!showPackageInstaller)}>
            <Package className="h-4 w-4" />
            Packages
          </Button>
        </div>
        {showPackageInstaller && generatedCode && (
          <div className="border-b">
            <PackageInstaller
              code={generatedCode}
              onPackagesInstalled={(packages) => {
                console.log("Packages installed:", packages)
              }}
              onCodeFormatted={(formattedCode) => {
                setGeneratedCode(formattedCode)
              }}
            />
          </div>
        )}
        <ChatPanel onMessageSent={handleMessageSent} isStreaming={isStreaming} projectType={projectType} />
      </div>
    </BlockchainProvider>
  )
}

export default MainInterface
