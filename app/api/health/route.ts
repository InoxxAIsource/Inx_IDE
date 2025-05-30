import { NextResponse } from "next/server"
import { isPrismaAvailable, checkDatabaseConnection } from "@/lib/db-utils"

export async function GET() {
  try {
    const prismaAvailable = isPrismaAvailable()
    let dbStatus = { connected: false, error: "Prisma not available" }

    if (prismaAvailable) {
      dbStatus = await checkDatabaseConnection()
    }

    return NextResponse.json({

      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        api: "healthy",
        prisma: prismaAvailable ? "available" : "unavailable",
        database: dbStatus.connected ? "connected" : "disconnected",
      },
      message: "INNOXAI API is running",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          api: "healthy",
          prisma: "error",
          database: "error",
        },
        message: "INNOXAI API is running with limited functionality",
        error: error.message,
      },
      { status: 200 }, // Still return 200 so the app can start
    )
  }
}
