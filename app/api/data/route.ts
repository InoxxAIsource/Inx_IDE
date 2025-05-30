import { type NextRequest, NextResponse } from "next/server"
import { getPrismaClient, checkDatabaseConnection, isPrismaAvailable } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    // Check if Prisma is available
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        {
          error: "Database not available",
          message: "The application is running in limited mode. Database features are not available.",
          status: "limited",
        },
        { status: 503 },
      )
    }

    // Check if database is connected
    const dbStatus = await checkDatabaseConnection()
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          message:
            "The application is running but cannot connect to the database. Please check your database configuration.",
          status: "degraded",
        },
        { status: 503 },
      )
    }

    const prisma = getPrismaClient()
    const { searchParams } = new URL(request.url)
    const model = searchParams.get("model")
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!model) {
      return NextResponse.json({ error: "Missing model parameter" }, { status: 400 })
    }

    switch (model) {
      case "users":
        if (id) {
          const user = await prisma.user.findUnique({
            where: { id },
          })
          return NextResponse.json(user)
        } else {
          const users = await prisma.user.findMany()
          return NextResponse.json(users)
        }

      case "projects":
        if (id) {
          const project = await prisma.project.findUnique({
            where: { id },
            include: { components: true },
          })
          return NextResponse.json(project)
        } else if (userId) {
          const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
          })
          return NextResponse.json(projects)
        } else {
          const projects = await prisma.project.findMany({
            orderBy: { updatedAt: "desc" },
          })
          return NextResponse.json(projects)
        }

      case "components":
        if (id) {
          const component = await prisma.component.findUnique({
            where: { id },
          })
          return NextResponse.json(component)
        } else {
          const projectId = searchParams.get("projectId")
          if (projectId) {
            const components = await prisma.component.findMany({
              where: { projectId },
              orderBy: { updatedAt: "desc" },
            })
            return NextResponse.json(components)
          } else {
            const components = await prisma.component.findMany({
              orderBy: { updatedAt: "desc" },
            })
            return NextResponse.json(components)
          }
        }

      case "contracts":
        if (id) {
          const contract = await prisma.smartContract.findUnique({
            where: { id },
          })
          return NextResponse.json(contract)
        } else {
          const contracts = await prisma.smartContract.findMany({
            orderBy: { updatedAt: "desc" },
          })
          return NextResponse.json(contracts)
        }

      default:
        return NextResponse.json({ error: "Invalid model parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Data API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        message: "The application is running but encountered an error with the database operation.",
        status: "error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Prisma is available
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        {
          error: "Database not available",
          message: "The application is running in limited mode. Database features are not available.",
          status: "limited",
        },
        { status: 503 },
      )
    }

    // Check if database is connected
    const dbStatus = await checkDatabaseConnection()
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          message:
            "The application is running but cannot connect to the database. Please check your database configuration.",
          status: "degraded",
        },
        { status: 503 },
      )
    }

    const prisma = getPrismaClient()
    const body = await request.json()
    const { model, data } = body

    if (!model || !data) {
      return NextResponse.json({ error: "Missing model or data parameter" }, { status: 400 })
    }

    switch (model) {
      case "users":
        const user = await prisma.user.create({ data })
        return NextResponse.json(user)

      case "projects":
        const project = await prisma.project.create({ data })
        return NextResponse.json(project)

      case "components":
        const component = await prisma.component.create({ data })
        return NextResponse.json(component)

      case "contracts":
        const contract = await prisma.smartContract.create({ data })
        return NextResponse.json(contract)

      default:
        return NextResponse.json({ error: "Invalid model parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Data API error:", error)
    return NextResponse.json({ error: "Failed to create data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if Prisma is available
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        {
          error: "Database not available",
          message: "The application is running in limited mode. Database features are not available.",
          status: "limited",
        },
        { status: 503 },
      )
    }

    // Check if database is connected
    const dbStatus = await checkDatabaseConnection()
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          message:
            "The application is running but cannot connect to the database. Please check your database configuration.",
          status: "degraded",
        },
        { status: 503 },
      )
    }

    const prisma = getPrismaClient()
    const body = await request.json()
    const { model, id, data } = body

    if (!model || !id || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    switch (model) {
      case "users":
        const user = await prisma.user.update({
          where: { id },
          data,
        })
        return NextResponse.json(user)

      case "projects":
        const project = await prisma.project.update({
          where: { id },
          data,
        })
        return NextResponse.json(project)

      case "components":
        const component = await prisma.component.update({
          where: { id },
          data,
        })
        return NextResponse.json(component)

      case "contracts":
        const contract = await prisma.smartContract.update({
          where: { id },
          data,
        })
        return NextResponse.json(contract)

      default:
        return NextResponse.json({ error: "Invalid model parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Data API error:", error)
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if Prisma is available
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        {
          error: "Database not available",
          message: "The application is running in limited mode. Database features are not available.",
          status: "limited",
        },
        { status: 503 },
      )
    }

    // Check if database is connected
    const dbStatus = await checkDatabaseConnection()
    if (!dbStatus.connected) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          message:
            "The application is running but cannot connect to the database. Please check your database configuration.",
          status: "degraded",
        },
        { status: 503 },
      )
    }

    const prisma = getPrismaClient()
    const { searchParams } = new URL(request.url)
    const model = searchParams.get("model")
    const id = searchParams.get("id")

    if (!model || !id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    switch (model) {
      case "users":
        await prisma.user.delete({
          where: { id },
        })
        return NextResponse.json({ success: true })

      case "projects":
        await prisma.project.delete({
          where: { id },
        })
        return NextResponse.json({ success: true })

      case "components":
        await prisma.component.delete({
          where: { id },
        })
        return NextResponse.json({ success: true })

      case "contracts":
        await prisma.smartContract.delete({
          where: { id },
        })
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid model parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Data API error:", error)
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 })
  }
}
