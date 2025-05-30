"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { File, Folder, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type FileNode = {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
}

interface FileTreeProps {
  onFileClick: (filePath: string, content: string) => void
  activeFile?: string
}

export const FileTree: React.FC<FileTreeProps> = ({ onFileClick, activeFile }) => {
  const [tree, setTree] = useState<FileNode[]>([])
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/files?mode=tree")
      .then((res) => res.json())
      .then((data) => setTree(data.tree))
      .catch((err) => console.error("Failed to load tree:", err))
  }, [])

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }))
  }

  const loadFile = async (path: string) => {
    const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
    const data = await res.json()
    onFileClick(path, data.content)
  }

  const deleteFile = async (path: string) => {
    if (confirm(`Delete ${path}?`)) {
      await fetch(`/api/files?path=${encodeURIComponent(path)}`, { method: "DELETE" })
      location.reload()
    }
  }

  const renderTree = (nodes: FileNode[], parentPath = "") => {
    return nodes.map((node) => {
      const fullPath = `${parentPath}/${node.name}`
      if (node.type === "folder") {
        return (
          <div key={fullPath} className="ml-2">
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
              <Folder className="w-4 h-4" onClick={() => toggleFolder(fullPath)} />
              <span onClick={() => toggleFolder(fullPath)}>{node.name}</span>
              <Button size="icon" variant="ghost" onClick={() => promptNewFile(fullPath)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {openFolders[fullPath] && node.children && (
              <div className="ml-4 border-l border-gray-200 pl-2">{renderTree(node.children, fullPath)}</div>
            )}
          </div>
        )
      }

      return (
        <div
          key={fullPath}
          onClick={() => loadFile(node.path)}
          className={cn(
            "ml-6 cursor-pointer flex items-center gap-2 hover:text-blue-500",
            activeFile === node.path && "text-blue-600 font-semibold",
          )}
        >
          <File className="w-4 h-4" /> {node.name}
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              deleteFile(node.path)
            }}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      )
    })
  }

  const promptNewFile = async (folderPath: string) => {
    const name = prompt("Enter new file or folder name (end with / for folder)")
    if (!name) return
    const isFolder = name.endsWith("/")
    const fullPath = `${folderPath}/${name}`
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: fullPath,
        content: isFolder ? undefined : "// new file",
      }),
    })
    location.reload()
  }

  return <div className="text-sm font-mono p-2">{renderTree(tree)}</div>
}
