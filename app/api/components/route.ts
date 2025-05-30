import { type NextRequest, NextResponse } from "next/server"
import { put, list, del } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const { componentName, code, prompt, userId } = await req.json()

    if (!componentName || !code) {
      return NextResponse.json({ error: "Component name and code are required" }, { status: 400 })
    }

    // Create component data
    const componentData = {
      name: componentName,
      code,
      prompt,
      userId,
      createdAt: new Date().toISOString(),
      id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    // Save to blob storage
    const blob = await put(`components/${componentData.id}.json`, JSON.stringify(componentData), {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      component: componentData,
      blobUrl: blob.url,
    })
  } catch (error) {
    console.error("Failed to save component:", error)
    return NextResponse.json({ error: "Failed to save component" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    // List all components
    const { blobs } = await list({
      prefix: "components/",
      limit: 100,
    })

    const components = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        const componentData = await response.json()

        // Filter by user if specified
        if (!userId || componentData.userId === userId) {
          components.push({
            ...componentData,
            blobUrl: blob.url,
          })
        }
      } catch (error) {
        console.error("Failed to parse component:", error)
      }
    }

    return NextResponse.json({
      success: true,
      components: components.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    })
  } catch (error) {
    console.error("Failed to fetch components:", error)
    return NextResponse.json({ error: "Failed to fetch components" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const componentId = searchParams.get("id")

    if (!componentId) {
      return NextResponse.json({ error: "Component ID is required" }, { status: 400 })
    }

    // Delete from blob storage
    await del(`components/${componentId}.json`)

    return NextResponse.json({
      success: true,
      message: "Component deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete component:", error)
    return NextResponse.json({ error: "Failed to delete component" }, { status: 500 })
  }
}
