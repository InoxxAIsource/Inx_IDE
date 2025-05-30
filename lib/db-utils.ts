// Safe Prisma client initialization that handles build-time issues
let prisma: any = null

// Initialize Prisma client only when needed and available
function initializePrisma() {
  if (prisma) return prisma

  try {
    // Dynamic import to prevent build-time errors
    // This will only execute at runtime when needed
    if (typeof window === "undefined") {
      // Only run on server
      const { PrismaClient } = require("@prisma/client")

      const globalForPrisma = global as unknown as { prisma: any }

      prisma =
        globalForPrisma.prisma ||
        new PrismaClient({
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        })

      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = prisma
      }
    }

    return prisma
  } catch (error) {
    console.warn("Prisma client not available:", error.message)
    return null
  }
}

// Get Prisma client with error handling
export function getPrismaClient() {
  if (!prisma) {
    prisma = initializePrisma()
  }
  return prisma
}

// Check if Prisma is available
export function isPrismaAvailable() {
  try {
    const client = getPrismaClient()
    return client !== null
  } catch {
    return false
  }
}

// Optional: Add a function to check if the database is connected
export async function checkDatabaseConnection() {
  try {
    const client = getPrismaClient()
    if (!client) {
      return { connected: false, error: "Prisma client not available" }
    }

    await client.$connect()
    return { connected: true }
  } catch (error) {
    console.error("Database connection error:", error)
    return { connected: false, error: error.message }
  }
}

// Mock implementations for when Prisma is not available
const mockDb = {
  users: [],
  projects: [],
  components: [],
}

// Helper functions for common database operations with safety checks

export async function createUser(data: {
  email: string
  name?: string
  walletAddress?: string
}) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    const newUser = { id: `mock-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() }
    mockDb.users.push(newUser)
    return newUser
  }

  return client.user.create({
    data,
  })
}

export async function getUserByEmail(email: string) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    return mockDb.users.find((u) => u.email === email) || null
  }

  return client.user.findUnique({
    where: { email },
  })
}

export async function getUserByWallet(walletAddress: string) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    return mockDb.users.find((u) => u.walletAddress === walletAddress) || null
  }

  return client.user.findFirst({
    where: { walletAddress },
  })
}

export async function updateUser(id: string, data: any) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    const index = mockDb.users.findIndex((u) => u.id === id)
    if (index >= 0) {
      mockDb.users[index] = { ...mockDb.users[index], ...data, updatedAt: new Date() }
      return mockDb.users[index]
    }
    return null
  }

  return client.user.update({
    where: { id },
    data,
  })
}

// Project related helpers
export async function createProject(data: {
  name: string
  description?: string
  userId: string
  projectType: string
}) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    const newProject = {
      id: `mock-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.projects.push(newProject)
    return newProject
  }

  return client.project.create({
    data,
  })
}

export async function getProjectsByUser(userId: string) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    return mockDb.projects
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  return client.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getProjectById(id: string) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    return mockDb.projects.find((p) => p.id === id) || null
  }

  return client.project.findUnique({
    where: { id },
  })
}

// Component related helpers
export async function saveComponent(data: {
  name: string
  code: string
  projectId: string
  description?: string
}) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    const newComponent = {
      id: `mock-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockDb.components.push(newComponent)
    return newComponent
  }

  return client.component.create({
    data,
  })
}

export async function getComponentsByProject(projectId: string) {
  const client = getPrismaClient()
  if (!client) {
    console.log("Database not available, using mock implementation")
    return mockDb.components
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  return client.component.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  })
}
