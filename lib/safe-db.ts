// Safe database utilities that work with or without a database connection

let dbConnection: any = null
let isInitialized = false

export function initializeSafeDatabase() {
  if (isInitialized) return dbConnection

  try {
    if (process.env.DATABASE_URL && typeof window === "undefined") {
      const { neon } = require("@neondatabase/serverless")
      dbConnection = neon(process.env.DATABASE_URL)
      console.log("✅ Database connection established")
    } else {
      console.log("ℹ️ No database URL found, using mock storage")
      dbConnection = null
    }
  } catch (error) {
    console.warn("⚠️ Database connection failed, using mock storage:", error.message)
    dbConnection = null
  }

  isInitialized = true
  return dbConnection
}

export function getDatabaseConnection() {
  if (!isInitialized) {
    return initializeSafeDatabase()
  }
  return dbConnection
}

export function isDatabaseAvailable(): boolean {
  return getDatabaseConnection() !== null
}

// Mock storage for when database is not available
const mockStorage = {
  users: [] as any[],
  components: [] as any[],
  projects: [] as any[],
}

export async function safeQuery(query: string, params: any[] = []): Promise<any[]> {
  const db = getDatabaseConnection()

  if (db) {
    try {
      // For neon, we use template literals
      return await db(query, ...params)
    } catch (error) {
      console.warn("Database query failed:", error.message)
      return []
    }
  }

  // Return mock data based on query type
  if (query.toLowerCase().includes("users")) {
    return mockStorage.users
  } else if (query.toLowerCase().includes("components")) {
    return mockStorage.components
  } else if (query.toLowerCase().includes("projects")) {
    return mockStorage.projects
  }

  return []
}

export function addToMockStorage(table: string, data: any): any {
  const id = Date.now()
  const record = { id, ...data, created_at: new Date().toISOString() }

  switch (table) {
    case "users":
      mockStorage.users.push(record)
      break
    case "components":
      mockStorage.components.push(record)
      break
    case "projects":
      mockStorage.projects.push(record)
      break
  }

  return record
}

export function findInMockStorage(table: string, condition: (item: any) => boolean): any {
  switch (table) {
    case "users":
      return mockStorage.users.find(condition)
    case "components":
      return mockStorage.components.find(condition)
    case "projects":
      return mockStorage.projects.find(condition)
    default:
      return null
  }
}

export function getConnectionStatus() {
  return {
    database: isDatabaseAvailable() ? "connected" : "mock",
    timestamp: new Date().toISOString(),
    mockData: {
      users: mockStorage.users.length,
      components: mockStorage.components.length,
      projects: mockStorage.projects.length,
    },
  }
}
