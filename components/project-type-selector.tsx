"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code2, Layout, Database, Wallet, Globe, Layers, Cpu, Smartphone, CheckCircle2 } from "lucide-react"

interface ProjectTypeSelectorProps {
  onSelect: (type: string) => void
  selectedType?: string
}

export function ProjectTypeSelector({ onSelect, selectedType }: ProjectTypeSelectorProps) {
  const [activeTab, setActiveTab] = useState("frontend")

  const projectTypes = {
    frontend: [
      {
        id: "component",
        name: "UI Component",
        description: "Create a reusable UI component",
        icon: Code2,
        tags: ["React", "TypeScript", "Tailwind"],
      },
      {
        id: "landing",
        name: "Landing Page",
        description: "Create a complete landing page",
        icon: Layout,
        tags: ["React", "TypeScript", "Tailwind"],
      },
      {
        id: "dashboard",
        name: "Dashboard",
        description: "Create an analytics dashboard",
        icon: Layers,
        tags: ["React", "TypeScript", "Charts"],
      },
    ],
    fullstack: [
      {
        id: "fullstack-app",
        name: "Full-Stack App",
        description: "Create a complete app with frontend and backend",
        icon: Globe,
        tags: ["Next.js", "API Routes", "Database"],
      },
      {
        id: "crud-app",
        name: "CRUD Application",
        description: "Create a data-driven CRUD application",
        icon: Database,
        tags: ["Next.js", "Prisma", "Forms"],
      },
      {
        id: "saas",
        name: "SaaS Template",
        description: "Create a SaaS application template",
        icon: Cpu,
        tags: ["Next.js", "Auth", "Payments"],
      },
    ],
    blockchain: [
      {
        id: "dapp",
        name: "DApp",
        description: "Create a decentralized application",
        icon: Wallet,
        tags: ["React", "Ethers.js", "Wagmi"],
      },
      {
        id: "defi",
        name: "DeFi Interface",
        description: "Create a DeFi protocol interface",
        icon: Cpu,
        tags: ["React", "Ethers.js", "Contracts"],
      },
      {
        id: "nft",
        name: "NFT Marketplace",
        description: "Create an NFT marketplace interface",
        icon: Smartphone,
        tags: ["React", "IPFS", "Smart Contracts"],
      },
    ],
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Choose Project Type</CardTitle>
        <CardDescription>Select the type of project you want to create</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frontend" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="fullstack">Full-Stack</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          {Object.entries(projectTypes).map(([category, types]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {types.map((type) => {
                  const isSelected = selectedType === type.id
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => onSelect(type.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="p-2 bg-primary/10 rounded-md">
                            <type.icon className="h-5 w-5 text-primary" />
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <CardTitle className="text-base mt-2">{type.name}</CardTitle>
                        <CardDescription className="text-xs">{type.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                        {type.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
