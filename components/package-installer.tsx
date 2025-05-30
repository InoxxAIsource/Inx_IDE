"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Download, CheckCircle, AlertCircle, Loader2, RefreshCw, Terminal, FileText, Zap } from "lucide-react"

interface PackageInfo {
  name: string
  version?: string
  dev?: boolean
  description?: string
  size?: string
  license?: string
  homepage?: string
  repository?: string
}

interface InstallationResult {
  success: boolean
  packages: PackageInfo[]
  errors?: string[]
  warnings?: string[]
  installTime?: number
  totalSize?: string
}

interface PackageInstallerProps {
  code: string
  onPackagesInstalled?: (packages: PackageInfo[]) => void
  onCodeFormatted?: (formattedCode: string) => void
  autoDetect?: boolean
}

export function PackageInstaller({
  code,
  onPackagesInstalled,
  onCodeFormatted,
  autoDetect = true,
}: PackageInstallerProps) {
  const [detectedPackages, setDetectedPackages] = useState<PackageInfo[]>([])
  const [installedPackages, setInstalledPackages] = useState<PackageInfo[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installationStatus, setInstallationStatus] = useState<
    "idle" | "analyzing" | "installing" | "success" | "error"
  >("idle")
  const [installationResult, setInstallationResult] = useState<InstallationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [installLogs, setInstallLogs] = useState<string[]>([])

  // Auto-detect packages when code changes
  useEffect(() => {
    if (code && autoDetect) {
      detectPackages()
    }
  }, [code, autoDetect])

  const detectPackages = async () => {
    setIsAnalyzing(true)
    setInstallationStatus("analyzing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/install-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          action: "analyze",
          includeMetadata: true,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setDetectedPackages(result.detected || [])
        setInstallationStatus("idle")
      } else {
        setErrorMessage(result.error || "Failed to analyze packages")
        setInstallationStatus("error")
      }
    } catch (error) {
      console.error("Failed to detect packages:", error)
      setErrorMessage("Network error during package analysis")
      setInstallationStatus("error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const installPackages = async () => {
    if (detectedPackages.length === 0) return

    setIsInstalling(true)
    setInstallationStatus("installing")
    setInstallProgress(0)
    setErrorMessage("")
    setInstallLogs([])

    try {
      // Simulate installation progress with realistic steps
      const progressSteps = [
        { progress: 10, log: "Resolving package dependencies..." },
        { progress: 25, log: "Downloading packages..." },
        { progress: 50, log: "Installing dependencies..." },
        { progress: 75, log: "Building package tree..." },
        { progress: 90, log: "Finalizing installation..." },
      ]

      for (const step of progressSteps) {
        setInstallProgress(step.progress)
        setInstallLogs((prev) => [...prev, step.log])
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const response = await fetch("/api/install-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          action: "install",
          packages: detectedPackages.map((pkg) => pkg.name),
        }),
      })

      const result = await response.json()

      setInstallProgress(100)
      setInstallLogs((prev) => [...prev, "Installation complete!"])

      if (result.success) {
        const installResult: InstallationResult = {
          success: true,
          packages: result.installed || [],
          installTime: result.installTime,
          totalSize: result.totalSize,
          warnings: result.warnings,
        }

        setInstallationResult(installResult)
        setInstalledPackages(result.installed || [])
        setInstallationStatus("success")
        onPackagesInstalled?.(result.installed || [])

        // Auto-format code after installation
        if (onCodeFormatted && result.formattedCode) {
          setTimeout(() => {
            onCodeFormatted(result.formattedCode)
          }, 500)
        }
      } else {
        setInstallationResult({
          success: false,
          packages: [],
          errors: [result.error || "Installation failed"],
        })
        setInstallationStatus("error")
        setErrorMessage(result.error || "Installation failed")
      }
    } catch (error) {
      setInstallationStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Installation failed")
      setInstallationResult({
        success: false,
        packages: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
      })
    } finally {
      setIsInstalling(false)
    }
  }

  const getStatusIcon = () => {
    switch (installationStatus) {
      case "analyzing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "installing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (installationStatus) {
      case "analyzing":
      case "installing":
        return "border-blue-200 bg-blue-50"
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const formatPackageSize = (size: string | undefined) => {
    if (!size) return ""
    return ` (${size})`
  }

  return (
    <Card className={`w-full transition-colors ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            Package Manager
            {detectedPackages.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {detectedPackages.length} detected
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={detectPackages} disabled={isAnalyzing || isInstalling}>
              <RefreshCw className={`h-3 w-3 ${isAnalyzing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packages" className="text-xs">
              Packages
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">
              Logs
            </TabsTrigger>
            <TabsTrigger value="status" className="text-xs">
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-3">
            {detectedPackages.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {detectedPackages.length} package{detectedPackages.length > 1 ? "s" : ""} required
                  </span>
                  <Button
                    size="sm"
                    onClick={installPackages}
                    disabled={isInstalling || installationStatus === "success"}
                    className="gap-2"
                  >
                    {isInstalling ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : installationStatus === "success" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    {installationStatus === "success" ? "Installed" : "Install All"}
                  </Button>
                </div>

                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {detectedPackages.map((pkg, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{pkg.name}</span>
                            {pkg.version && (
                              <Badge variant="outline" className="text-xs">
                                v{pkg.version}
                              </Badge>
                            )}
                            {pkg.dev && (
                              <Badge variant="secondary" className="text-xs">
                                dev
                              </Badge>
                            )}
                            {pkg.size && <span className="text-xs text-gray-500">{pkg.size}</span>}
                          </div>
                          {pkg.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
                          )}
                          {pkg.license && <span className="text-xs text-gray-400">{pkg.license}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {installedPackages.some((installed) => installed.name === pkg.name) && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No packages detected</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isAnalyzing ? "Analyzing code..." : "Generate code to detect dependencies"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Terminal className="h-4 w-4" />
              Installation Logs
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-1 font-mono text-xs">
                {installLogs.length > 0 ? (
                  installLogs.map((log, index) => (
                    <div key={index} className="text-gray-700 p-1">
                      <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 p-2">No logs available</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="status" className="space-y-3">
            {isInstalling && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Installing packages...
                  </span>
                  <span className="font-mono">{installProgress}%</span>
                </div>
                <Progress value={installProgress} className="h-2" />
              </div>
            )}

            {installationResult && (
              <div className="space-y-3">
                {installationResult.success ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully installed {installationResult.packages.length} package
                      {installationResult.packages.length > 1 ? "s" : ""}
                      {installationResult.installTime && ` in ${installationResult.installTime}ms`}
                      {installationResult.totalSize && ` (${installationResult.totalSize})`}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {installationResult.errors?.[0] || "Installation failed"}
                    </AlertDescription>
                  </Alert>
                )}

                {installationResult.warnings && installationResult.warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="space-y-1">
                        <div className="font-medium">Warnings:</div>
                        {installationResult.warnings.map((warning, index) => (
                          <div key={index} className="text-sm">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {installationStatus === "idle" && detectedPackages.length === 0 && (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Ready to analyze code</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
