"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Plus, Check, X } from "lucide-react"

interface PackageManagerProps {
  installedPackages: string[]
  onPackageInstall: (packageName: string) => void
}

export function PackageManager({ installedPackages, onPackageInstall }: PackageManagerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const availablePackages = [
    { name: "framer-motion", description: "Animation library for React", category: "Animation" },
    { name: "react-hook-form", description: "Performant forms with easy validation", category: "Forms" },
    { name: "date-fns", description: "Modern JavaScript date utility library", category: "Utilities" },
    { name: "recharts", description: "Composable charting library", category: "Charts" },
    { name: "react-query", description: "Data fetching library", category: "Data" },
    { name: "zustand", description: "Small, fast state management", category: "State" },
  ]

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 gap-2 shadow-lg z-50" size="lg">
        <Package className="h-4 w-4" />
        Packages ({installedPackages.length})
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Package Manager
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Installed Packages */}
          <div>
            <h3 className="font-medium mb-3">Installed Packages</h3>
            <div className="flex flex-wrap gap-2">
              {installedPackages.map((pkg) => (
                <Badge key={pkg} variant="secondary" className="gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  {pkg}
                </Badge>
              ))}
            </div>
          </div>

          {/* Available Packages */}
          <div>
            <h3 className="font-medium mb-3">Popular Packages</h3>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {availablePackages.map((pkg) => {
                  const isInstalled = installedPackages.includes(pkg.name)
                  return (
                    <div key={pkg.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pkg.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {pkg.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                      </div>
                      <Button
                        size="sm"
                        variant={isInstalled ? "secondary" : "default"}
                        onClick={() => onPackageInstall(pkg.name)}
                        disabled={isInstalled}
                        className="gap-1"
                      >
                        {isInstalled ? (
                          <>
                            <Check className="h-3 w-3" />
                            Installed
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            Install
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
