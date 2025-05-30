"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, Loader2 } from "lucide-react"

interface SaveComponentDialogProps {
  isOpen: boolean
  onClose: () => void
  componentCode: string
  componentName: string
  prompt?: string
  user?: any
  onSaved?: () => void
}

export function SaveComponentDialog({
  isOpen,
  onClose,
  componentCode,
  componentName,
  prompt,
  user,
  onSaved,
}: SaveComponentDialogProps) {
  const [name, setName] = useState(componentName)
  const [description, setDescription] = useState(prompt || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName: name,
          code: componentCode,
          prompt: description,
          userId: user?.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSaved?.()
        onClose()
        setName(componentName)
        setDescription(prompt || "")
      }
    } catch (error) {
      console.error("Failed to save component:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Component
          </DialogTitle>
          <DialogDescription>Save this component to your library for future use.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter component name..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this component does..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Component
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
