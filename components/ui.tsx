// Re-export all shadcn/ui components
export * from "./ui/accordion"
export * from "./ui/alert"
export * from "./ui/alert-dialog"
export * from "./ui/avatar"
export * from "./ui/badge"
export * from "./ui/button"
export * from "./ui/calendar"
export * from "./ui/card"
export * from "./ui/checkbox"
export * from "./ui/collapsible"
export * from "./ui/command"
export * from "./ui/context-menu"
export * from "./ui/dialog"
export * from "./ui/dropdown-menu"
export * from "./ui/form"
export * from "./ui/hover-card"
export * from "./ui/input"
export * from "./ui/label"
export * from "./ui/menubar"
export * from "./ui/navigation-menu"
export * from "./ui/popover"
export * from "./ui/progress"
export * from "./ui/radio-group"
export * from "./ui/scroll-area"
export * from "./ui/select"
export * from "./ui/separator"
export * from "./ui/sheet"
export * from "./ui/skeleton"
export * from "./ui/slider"
export * from "./ui/switch"
export * from "./ui/table"
export * from "./ui/tabs"
export * from "./ui/textarea"
export * from "./ui/toast"
export * from "./ui/toggle"
export * from "./ui/tooltip"

// Import individual components for namespace exports
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Badge, badgeVariants } from "./ui/badge"
import { Button, buttonVariants } from "./ui/button"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Textarea } from "./ui/textarea"

// Create namespace exports using the actual imported components
export const components = {
  // Alert components
  Alert,
  AlertDescription,
  AlertTitle,

  // Badge components
  Badge,
  badgeVariants,

  // Button components
  Button,
  buttonVariants,

  // Card components
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,

  // Dialog components
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  // Input components
  Input,

  // Label components
  Label,

  // ScrollArea components
  ScrollArea,
  ScrollBar,

  // Tabs components
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,

  // Textarea components
  Textarea,
}

export const shadcnComponents = components
