import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              INNOXAI
            </h1>
            <p className="text-sm text-gray-600">AI Full-Stack Developer Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AI Agent Active
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Zap className="h-3 w-3 text-blue-600" />
            Ready to Generate
          </Badge>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
