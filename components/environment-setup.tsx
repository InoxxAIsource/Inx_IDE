"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Download, ExternalLink, Settings, Database, Brain, Shield, Zap } from "lucide-react"
import { generateEnvironmentTemplate, getAvailableServices } from "@/lib/environment-config"

interface EnvironmentSetupProps {
  projectType: string
  onComplete?: () => void
}

export function EnvironmentSetup({ projectType, onComplete }: EnvironmentSetupProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [services, setServices] = useState<any>(null)

  useEffect(() => {
    setServices(getAvailableServices())
  }, [])

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadEnvFile = () => {
    const template = generateEnvironmentTemplate(projectType)
    const blob = new Blob([template], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = ".env.example"
    link.click()
    URL.revokeObjectURL(url)
  }

  const serviceCategories = [
    {
      title: "AI Services",
      icon: Brain,
      services: [
        {
          name: "OpenAI",
          key: "openai",
          url: "https://platform.openai.com/api-keys",
          description: "GPT models for code generation",
        },
        {
          name: "Grok (xAI)",
          key: "xai",
          url: "https://console.x.ai/",
          description: "Advanced reasoning and analysis",
        },
        {
          name: "Anthropic",
          key: "anthropic",
          url: "https://console.anthropic.com/",
          description: "Claude models for complex tasks",
        },
        {
          name: "Google AI",
          key: "google",
          url: "https://makersuite.google.com/app/apikey",
          description: "Gemini models",
        },
        { name: "Mistral", key: "mistral", url: "https://console.mistral.ai/", description: "Open-source AI models" },
      ],
    },
    {
      title: "Database",
      icon: Database,
      services: [
        {
          name: "Neon",
          key: "neon",
          url: "https://console.neon.tech/",
          description: "Serverless PostgreSQL (Recommended)",
        },
        {
          name: "Supabase",
          key: "supabase",
          url: "https://supabase.com/dashboard",
          description: "Open-source Firebase alternative",
        },
      ],
    },
    {
      title: "Blockchain",
      icon: Zap,
      services: [
        { name: "Infura", key: "infura", url: "https://infura.io/dashboard", description: "Ethereum node provider" },
        {
          name: "Alchemy",
          key: "alchemy",
          url: "https://dashboard.alchemy.com/",
          description: "Web3 development platform",
        },
        { name: "Etherscan", key: "etherscan", url: "https://etherscan.io/apis", description: "Contract verification" },
      ],
    },
    {
      title: "Authentication",
      icon: Shield,
      services: [
        {
          name: "NextAuth",
          key: "nextauth",
          url: "https://next-auth.js.org/getting-started/example",
          description: "Authentication for Next.js",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Environment Setup</h2>
        <p className="text-gray-600">Configure your {projectType} project with the services you need</p>
      </div>

      {/* Service Status Overview */}
      {services && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Service Status
            </CardTitle>
            <CardDescription>Services currently configured in your environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(services.ai).filter(Boolean).length}/5
                </div>
                <div className="text-sm text-gray-600">AI Services</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(services.database).filter(Boolean).length}/2
                </div>
                <div className="text-sm text-gray-600">Databases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(services.blockchain).filter(Boolean).length}/4
                </div>
                <div className="text-sm text-gray-600">Blockchain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(services.auth.nextauth ? 1 : 0) + (services.email ? 1 : 0)}/2
                </div>
                <div className="text-sm text-gray-600">Auth & Email</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Available Services</TabsTrigger>
          <TabsTrigger value="template">Environment Template</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {serviceCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.services.map((service) => {
                    const isConfigured =
                      services?.[category.title.toLowerCase()]?.[service.key] || services?.[service.key] || false

                    return (
                      <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant={isConfigured ? "default" : "secondary"}>
                              {isConfigured ? "Configured" : "Not Set"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={service.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <ExternalLink className="h-3 w-3" />
                            Get API Key
                          </a>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Template</CardTitle>
              <CardDescription>Copy this template to your .env.local file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(generateEnvironmentTemplate(projectType), "template")}
                    className="gap-2"
                  >
                    {copiedSection === "template" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Template
                      </>
                    )}
                  </Button>
                  <Button onClick={downloadEnvFile} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download .env.example
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generateEnvironmentTemplate(projectType)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup Guide</CardTitle>
                <CardDescription>Follow these steps to configure your {projectType} project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Create .env.local file</h4>
                      <p className="text-sm text-gray-600">
                        Copy the environment template to a new .env.local file in your project root
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Get API Keys</h4>
                      <p className="text-sm text-gray-600">Sign up for the services you need and get your API keys</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Add Keys to Environment</h4>
                      <p className="text-sm text-gray-600">Replace the placeholder values with your actual API keys</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Start Development</h4>
                      <p className="text-sm text-gray-600">Run npm run dev to start your development server</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> You don't need all services at once! Start with the basics (like one AI
                provider) and add more services as your project grows. INNOXAI will automatically detect available
                services and enable features accordingly.
              </AlertDescription>
            </Alert>

            {onComplete && (
              <div className="text-center">
                <Button onClick={onComplete} size="lg" className="gap-2">
                  <Check className="h-4 w-4" />
                  Complete Setup
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
