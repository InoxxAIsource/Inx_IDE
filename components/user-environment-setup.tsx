"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Download, ExternalLink, Settings, Database, Brain, Shield, Zap, Info } from "lucide-react"
import { generateUserEnvironmentTemplate, getAvailableServices, getRequiredServices } from "@/lib/environment-config"

interface UserEnvironmentSetupProps {
  projectType: string
  onComplete?: () => void
}

export function UserEnvironmentSetup({ projectType, onComplete }: UserEnvironmentSetupProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [services, setServices] = useState<any>(null)
  const [requirements, setRequirements] = useState<any>(null)

  useEffect(() => {
    setServices(getAvailableServices())
    setRequirements(getRequiredServices(projectType))
  }, [projectType])

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
    const template = generateUserEnvironmentTemplate(projectType)
    const blob = new Blob([template], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = ".env.local"
    link.click()
    URL.revokeObjectURL(url)
  }

  const serviceProviders = [
    {
      category: "AI Services",
      icon: Brain,
      description: "Choose at least one AI provider for your project",
      services: [
        {
          name: "OpenAI",
          key: "openai",
          url: "https://platform.openai.com/api-keys",
          description: "GPT models - Best for general use",
          envVar: "OPENAI_API_KEY=sk-...",
          recommended: true,
        },
        {
          name: "Grok (xAI)",
          key: "xai",
          url: "https://console.x.ai/",
          description: "Advanced reasoning and analysis",
          envVar: "XAI_API_KEY=xai-...",
        },
        {
          name: "Anthropic",
          key: "anthropic",
          url: "https://console.anthropic.com/",
          description: "Claude models - Safety-focused AI",
          envVar: "ANTHROPIC_API_KEY=sk-ant-...",
        },
        {
          name: "Google AI",
          key: "google",
          url: "https://makersuite.google.com/app/apikey",
          description: "Gemini models - Multimodal AI",
          envVar: "GOOGLE_AI_API_KEY=...",
        },
        {
          name: "Mistral",
          key: "mistral",
          url: "https://console.mistral.ai/",
          description: "Open-source AI models",
          envVar: "MISTRAL_API_KEY=...",
        },
      ],
    },
    {
      category: "Blockchain",
      icon: Zap,
      description: "Required for DApp projects",
      services: [
        {
          name: "Infura",
          key: "infura",
          url: "https://infura.io/dashboard",
          description: "Ethereum node provider - Recommended",
          envVar: "INFURA_API_KEY=...",
          recommended: true,
        },
        {
          name: "Alchemy",
          key: "alchemy",
          url: "https://dashboard.alchemy.com/",
          description: "Alternative blockchain provider",
          envVar: "ALCHEMY_API_KEY=...",
        },
        {
          name: "Etherscan",
          key: "etherscan",
          url: "https://etherscan.io/apis",
          description: "Contract verification",
          envVar: "ETHERSCAN_API_KEY=...",
        },
      ],
    },
    {
      category: "Authentication",
      icon: Shield,
      description: "User login and session management",
      services: [
        {
          name: "NextAuth Setup",
          key: "nextauth",
          url: "https://next-auth.js.org/getting-started/example",
          description: "Generate secure secrets",
          envVar: "NEXTAUTH_SECRET=your-secret\nNEXTAUTH_URL=http://localhost:3000",
        },
      ],
    },
    {
      category: "Optional Services",
      icon: Settings,
      description: "Enhance your project with additional features",
      services: [
        {
          name: "Upstash Redis",
          key: "redis",
          url: "https://console.upstash.com/",
          description: "Optional caching for better performance (Neon database already connected)",
          envVar: "UPSTASH_REDIS_REST_URL=...\nUPSTASH_REDIS_REST_TOKEN=...",
        },
        {
          name: "Vercel Blob",
          key: "blob",
          url: "https://vercel.com/dashboard",
          description: "File storage",
          envVar: "BLOB_READ_WRITE_TOKEN=vercel_blob_...",
        },
        {
          name: "Email (SMTP)",
          key: "email",
          url: "https://support.google.com/accounts/answer/185833",
          description: "Email notifications",
          envVar: "SMTP_HOST=smtp.gmail.com\nSMTP_USER=your-email@gmail.com",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Configure Your {projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project
        </h2>
        <p className="text-gray-600">Add your API keys to unlock powerful features</p>
      </div>

      {/* Platform Status */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>✅ INNOXAI Platform Complete:</strong> Your development environment with Neon database, backend
          infrastructure, and all platform services are fully managed by INNOXAI. You only add API keys for external
          services you want to use!
        </AlertDescription>
      </Alert>

      {/* Requirements Overview */}
      {requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Project Requirements
            </CardTitle>
            <CardDescription>Configure your API keys to unlock features for your {projectType} project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {requirements.required.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Required:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {requirements.required.map((req: string, index: number) => (
                      <li key={index} className="text-sm">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requirements.recommended.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">Recommended:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {requirements.recommended.map((req: string, index: number) => (
                      <li key={index} className="text-sm">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requirements.optional.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Optional:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {requirements.optional.map((req: string, index: number) => (
                      <li key={index} className="text-sm">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>🏢 Platform Managed:</strong> INNOXAI provides and manages your database, backend infrastructure, and
          development environment. You only configure the external services you want to use.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Service Providers</TabsTrigger>
          <TabsTrigger value="template">Environment File</TabsTrigger>
          <TabsTrigger value="guide">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {serviceProviders.map((category) => {
            // Filter services based on project type
            const relevantServices = category.services.filter((service) => {
              if (projectType === "component" && category.category === "Blockchain") return false
              if (projectType !== "dapp" && category.category === "Blockchain") return false
              return true
            })

            if (relevantServices.length === 0) return null

            return (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {relevantServices.map((service) => {
                      const isConfigured = services?.[category.category.toLowerCase()]?.[service.key] || false

                      return (
                        <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{service.name}</h4>
                              {service.recommended && (
                                <Badge variant="default" className="text-xs">
                                  Recommended
                                </Badge>
                              )}
                              <Badge variant={isConfigured ? "default" : "secondary"}>
                                {isConfigured ? "✅ Configured" : "Not Set"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{service.envVar}</code>
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
            )
          })}
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration File</CardTitle>
              <CardDescription>Copy this to your .env.local file and add your API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(generateUserEnvironmentTemplate(projectType), "template")}
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
                        Copy Configuration
                      </>
                    )}
                  </Button>
                  <Button onClick={downloadEnvFile} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download .env.local
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96">
                  <pre className="text-sm whitespace-pre-wrap">{generateUserEnvironmentTemplate(projectType)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup Steps</CardTitle>
                <CardDescription>Get your {projectType} project running in minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Download Environment File</h4>
                      <p className="text-sm text-gray-600">
                        Click "Download .env.local" above to get your configuration template
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Get Your API Keys</h4>
                      <p className="text-sm text-gray-600">
                        Visit the service provider links above to create accounts and get API keys
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Add Keys to Environment File</h4>
                      <p className="text-sm text-gray-600">Replace the placeholder values with your actual API keys</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Start Building</h4>
                      <p className="text-sm text-gray-600">
                        Your project will automatically detect available services and enable features
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>💡 Pro Tip:</strong> You can start with just one AI provider and add more services later.
                INNOXAI automatically detects what's available and enables features progressively.
              </AlertDescription>
            </Alert>

            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                <strong>🎉 Database Included:</strong> Your Neon PostgreSQL database is already connected and ready to
                use. No additional database setup required!
              </AlertDescription>
            </Alert>

            {onComplete && (
              <div className="text-center">
                <Button onClick={onComplete} size="lg" className="gap-2">
                  <Check className="h-4 w-4" />
                  Continue to Project
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
