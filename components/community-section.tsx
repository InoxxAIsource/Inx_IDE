import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitFork, ExternalLink } from "lucide-react"
import Image from "next/image"

export function CommunitySection() {
  const communityProjects = [
    {
      title: "E-commerce Dashboard",
      description: "Complete admin dashboard with analytics, product management, and order tracking",
      forks: "8.2K",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Dashboard", "E-commerce", "Analytics"],
    },
    {
      title: "AI Chat Interface",
      description: "Modern chat interface with AI integration and real-time messaging",
      forks: "12.1K",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["AI", "Chat", "Real-time"],
    },
    {
      title: "SaaS Landing Page",
      description: "High-converting landing page template for SaaS products",
      forks: "15.3K",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Landing", "SaaS", "Marketing"],
    },
  ]

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">From the Community</h2>
          <p className="text-muted-foreground">Explore what the community is building with INNOXAI.</p>
        </div>
        <Button variant="outline" className="gap-2">
          Browse All →
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityProjects.map((project, index) => (
          <Card key={index} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GitFork className="h-3 w-3" />
                  {project.forks} Forks
                </div>
              </div>
              <CardDescription className="mb-3">{project.description}</CardDescription>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
