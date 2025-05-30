"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as LucideIcons from "lucide-react"

interface RealCodeRendererProps {
  code: string
  language?: string
  className?: string
}

export function RealCodeRenderer({ code, language = "tsx", className = "" }: RealCodeRendererProps) {
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create a comprehensive component library for the sandbox
  const componentLibrary = useMemo(
    () => ({
      // React
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useMemo: React.useMemo,
      useCallback: React.useCallback,
      useRef: React.useRef,

      // shadcn/ui components
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      Alert,
      AlertDescription,
      Badge,
      Button,
      Input,
      Label,
      Textarea,
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
      ScrollArea,
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogTrigger,

      // Lucide Icons (commonly used ones)
      ChevronDown: LucideIcons.ChevronDown,
      ChevronUp: LucideIcons.ChevronUp,
      ChevronLeft: LucideIcons.ChevronLeft,
      ChevronRight: LucideIcons.ChevronRight,
      Plus: LucideIcons.Plus,
      Minus: LucideIcons.Minus,
      X: LucideIcons.X,
      Check: LucideIcons.Check,
      Search: LucideIcons.Search,
      Settings: LucideIcons.Settings,
      User: LucideIcons.User,
      Home: LucideIcons.Home,
      Mail: LucideIcons.Mail,
      Phone: LucideIcons.Phone,
      Calendar: LucideIcons.Calendar,
      Clock: LucideIcons.Clock,
      Star: LucideIcons.Star,
      Heart: LucideIcons.Heart,
      ThumbsUp: LucideIcons.ThumbsUp,
      Share: LucideIcons.Share,
      Download: LucideIcons.Download,
      Upload: LucideIcons.Upload,
      Edit: LucideIcons.Edit,
      Trash: LucideIcons.Trash,
      Eye: LucideIcons.Eye,
      EyeOff: LucideIcons.EyeOff,
      Lock: LucideIcons.Lock,
      Unlock: LucideIcons.Unlock,
      Bell: LucideIcons.Bell,
      Menu: LucideIcons.Menu,
      MoreHorizontal: LucideIcons.MoreHorizontal,
      MoreVertical: LucideIcons.MoreVertical,
      ArrowUp: LucideIcons.ArrowUp,
      ArrowDown: LucideIcons.ArrowDown,
      ArrowLeft: LucideIcons.ArrowLeft,
      ArrowRight: LucideIcons.ArrowRight,
      ExternalLink: LucideIcons.ExternalLink,
      Copy: LucideIcons.Copy,
      Clipboard: LucideIcons.Clipboard,
      FileText: LucideIcons.FileText,
      Folder: LucideIcons.Folder,
      Image: LucideIcons.Image,
      Video: LucideIcons.Video,
      Music: LucideIcons.Music,
      Code: LucideIcons.Code,
      Terminal: LucideIcons.Terminal,
      Database: LucideIcons.Database,
      Server: LucideIcons.Server,
      Globe: LucideIcons.Globe,
      Wifi: LucideIcons.Wifi,
      Bluetooth: LucideIcons.Bluetooth,
      Battery: LucideIcons.Battery,
      Zap: LucideIcons.Zap,
      Sun: LucideIcons.Sun,
      Moon: LucideIcons.Moon,
      Cloud: LucideIcons.Cloud,
      Umbrella: LucideIcons.Umbrella,

      // Utility functions
      cn: (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" "),
    }),
    [],
  )

  const transformCode = (rawCode: string): string => {
    let transformedCode = rawCode

    // Remove import statements and replace with component access
    transformedCode = transformedCode.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, "")

    // Handle default exports
    if (transformedCode.includes("export default")) {
      transformedCode = transformedCode.replace(/export\s+default\s+/, "return ")
    } else {
      // If no default export, wrap the entire code in a return statement
      transformedCode = `return (${transformedCode})`
    }

    // Wrap in a function that has access to our component library
    const functionCode = `
      const { 
        React, useState, useEffect, useMemo, useCallback, useRef,
        Card, CardContent, CardHeader, CardTitle,
        Alert, AlertDescription, Badge, Button, Input, Label, Textarea,
        Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea,
        Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
        ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
        Plus, Minus, X, Check, Search, Settings, User, Home,
        Mail, Phone, Calendar, Clock, Star, Heart, ThumbsUp,
        Share, Download, Upload, Edit, Trash, Eye, EyeOff,
        Lock, Unlock, Bell, Menu, MoreHorizontal, MoreVertical,
        ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ExternalLink,
        Copy, Clipboard, FileText, Folder, Image, Video, Music,
        Code, Terminal, Database, Server, Globe, Wifi, Bluetooth,
        Battery, Zap, Sun, Moon, Cloud, Umbrella, cn
      } = arguments[0];
      
      ${transformedCode}
    `

    return functionCode
  }

  useEffect(() => {
    const renderComponent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const transformedCode = transformCode(code)

        // Create a function from the transformed code
        const componentFunction = new Function(transformedCode)

        // Execute the function with our component library
        const ComponentResult = componentFunction(componentLibrary)

        // Handle different return types
        if (React.isValidElement(ComponentResult)) {
          setRenderedComponent(ComponentResult)
        } else if (typeof ComponentResult === "function") {
          // If it's a component function, render it
          const RenderedComponent = ComponentResult
          setRenderedComponent(<RenderedComponent />)
        } else {
          setRenderedComponent(
            <div className="p-4 text-center text-gray-500">
              Component rendered successfully but returned: {String(ComponentResult)}
            </div>,
          )
        }
      } catch (err) {
        console.error("Code execution error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setRenderedComponent(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (code.trim()) {
      renderComponent()
    } else {
      setRenderedComponent(<div className="p-8 text-center text-gray-400">No code to render</div>)
      setIsLoading(false)
    }
  }, [code, componentLibrary])

  if (isLoading) {
    return (
      <div className={`border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Rendering component...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`border rounded-lg p-4 ${className}`}>
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <strong>Render Error:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-3 py-2 border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
        </div>
      </div>
      <div className="p-4 bg-white min-h-[200px]">
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-gray-500">Loading component...</div>
            </div>
          }
        >
          {renderedComponent}
        </React.Suspense>
      </div>
    </div>
  )
}

// Named export for compatibility

// Default export
export default RealCodeRenderer
