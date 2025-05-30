"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, Loader2, CheckCircle } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuth: (user: any, token: string) => void
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  if (!isOpen) return null

  const handleSubmit = async (action: "login" | "register") => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...formData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("token", result.token)
        onAuth(result.user, result.token)
        onClose()
      } else {
        alert(result.error || "Authentication failed")
      }
    } catch (error) {
      alert("Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="h-5 w-5" />
            Welcome to INNOXAI
          </CardTitle>
          <p className="text-sm text-gray-600">Sign in to save your components</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                onClick={() => handleSubmit("login")}
                className="w-full"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Sign In
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                onClick={() => handleSubmit("register")}
                className="w-full"
                disabled={isLoading || !formData.email || !formData.password || !formData.name}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={onClose}>
              Continue without account
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Badge variant="secondary">Free • No credit card required</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
