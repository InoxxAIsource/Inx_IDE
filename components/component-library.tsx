"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  Code,
  Sparkles,
  Plus,
  Search,
  Filter,
  Download,
  Copy,
  Eye,
  Calendar,
  User,
  Tag,
  Heart,
  Share2,
  Edit3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SavedComponent {
  id: string
  name: string
  code: string
  prompt: string
  userId?: string
  createdAt: string
  blobUrl: string
  category?: string
  tags?: string[]
  likes?: number
  isPublic?: boolean
  framework?: "react" | "vue" | "angular" | "svelte"
  complexity?: "beginner" | "intermediate" | "advanced"
}

interface ComponentLibraryProps {
  user?: any
  onInsert?: (component: SavedComponent) => void
  onPreview?: (component: SavedComponent) => void
  onEdit?: (component: SavedComponent) => void
}

export function ComponentLibrary({ user, onInsert, onPreview, onEdit }: ComponentLibraryProps) {
  const [components, setComponents] = useState<SavedComponent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null)

  useEffect(() => {
    fetchComponents()
  }, [user])

  const fetchComponents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/components${user ? `?userId=${user.id}` : ""}`)
      const data = await response.json()
      if (data.success) {
        setComponents(data.components)
      }
    } catch (error) {
      console.error("Failed to fetch components:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (componentId: string) => {
    if (!confirm("Delete this component?")) return

    try {
      await fetch(`/api/components?id=${componentId}`, { method: "DELETE" })
      setComponents((prev) => prev.filter((c) => c.id !== componentId))
    } catch (error) {
      console.error("Failed to delete component:", error)
    }
  }

  const handleInsert = async (component: SavedComponent) => {
    try {
      await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `components/${component.name}.tsx`,
          content: component.code,
        }),
      })

      // Show success notification
      const notification = document.createElement("div")
      notification.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      notification.textContent = `Component "${component.name}" inserted successfully!`
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 3000)

      onInsert?.(component)
    } catch (error) {
      console.error("Failed to insert component:", error)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Show copy notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    notification.textContent = "Code copied to clipboard!"
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 2000)
  }

  const handleExport = async (component: SavedComponent) => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName: component.name,
          code: component.code,
          includePackageJson: true,
        }),
      })

      const data = await response.json()
      if (data.success) {
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.filename
        link.click()
      }
    } catch (error) {
      console.error("Failed to export component:", error)
    }
  }

  const handleLike = async (componentId: string) => {
    try {
      await fetch(`/api/components/${componentId}/like`, { method: "POST" })
      setComponents((prev) => prev.map((c) => (c.id === componentId ? { ...c, likes: (c.likes || 0) + 1 } : c)))
    } catch (error) {
      console.error("Failed to like component:", error)
    }
  }

  // Filter and sort components
  const filteredComponents = components
    .filter((component) => {
      const matchesSearch =
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "likes":
          return (b.likes || 0) - (a.likes || 0)
        default:
          return 0
      }
    })

  const categories = ["all", ...new Set(components.map((c) => c.category).filter(Boolean))]

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFrameworkIcon = (framework?: string) => {
    switch (framework) {
      case "react":
        return "⚛️"
      case "vue":
        return "🟢"
      case "angular":
        return "🔺"
      case "svelte":
        return "🧡"
      default:
        return "⚛️"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Component Library
          </h2>
          <p className="text-gray-600">
            {filteredComponents.length} component{filteredComponents.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            Grid
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search components, prompts, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Components Display */}
      <ScrollArea className="h-[600px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredComponents.length > 0 ? (
          <div
            className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4")}
          >
            {filteredComponents.map((component) => (
              <Card key={component.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getFrameworkIcon(component.framework)}</span>
                        {component.name}
                        {component.isPublic && (
                          <Badge variant="outline" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </CardTitle>
                      {component.prompt && (
                        <CardDescription className="text-sm line-clamp-2 mt-1">{component.prompt}</CardDescription>
                      )}
                    </div>
                  </div>

                  {/* Tags and Metadata */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {component.category && (
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {component.category}
                      </Badge>
                    )}
                    {component.complexity && (
                      <Badge className={cn("text-xs", getComplexityColor(component.complexity))}>
                        {component.complexity}
                      </Badge>
                    )}
                    {component.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(component.createdAt).toLocaleDateString()}
                      </span>
                      {component.userId && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Private
                        </span>
                      )}
                      {component.likes && (
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {component.likes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => onPreview?.(component)} className="gap-1">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => handleInsert(component)} className="gap-1">
                      <Plus className="h-3 w-3" />
                      Insert
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Code className="h-3 w-3" />
                          Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>{component.name} - Source Code</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleCopyCode(component.code)} className="gap-1">
                              <Copy className="h-3 w-3" />
                              Copy Code
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExport(component)}
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Export
                            </Button>
                          </div>
                          <ScrollArea className="h-[400px] w-full border rounded-lg">
                            <pre className="p-4 text-sm font-mono">
                              <code>{component.code}</code>
                            </pre>
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {onEdit && (
                      <Button size="sm" variant="outline" onClick={() => onEdit(component)} className="gap-1">
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                    )}

                    <Button size="sm" variant="outline" onClick={() => handleLike(component.id)} className="gap-1">
                      <Heart className="h-3 w-3" />
                      Like
                    </Button>

                    {user && component.userId === user.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(component.id)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Components Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "No components match your current filters."
                  : "Start generating components to build your library!"}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  )
}
