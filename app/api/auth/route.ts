import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "innoxai-secret"

// Mock user storage for when database is not available
const mockUsers: any[] = []

// Safe database connection
let sql: any = null

function initializeDatabase() {
  if (sql) return sql

  try {
    // Only initialize if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      const { neon } = require("@neondatabase/serverless")
      sql = neon(process.env.DATABASE_URL)
      console.log("Database connection initialized")
    } else {
      console.log("No DATABASE_URL found, using mock storage")
    }
  } catch (error) {
    console.warn("Database initialization failed, using mock storage:", error.message)
  }

  return sql
}

async function createTablesIfNeeded() {
  const db = initializeDatabase()
  if (!db) return

  try {
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await db`
      CREATE TABLE IF NOT EXISTS user_components (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        component_name VARCHAR(255) NOT NULL,
        component_code TEXT NOT NULL,
        prompt TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
  } catch (error) {
    console.warn("Failed to create tables:", error.message)
  }
}

async function createUser(email: string, name: string, passwordHash: string) {
  const db = initializeDatabase()

  if (db) {
    try {
      const [user] = await db`
        INSERT INTO users (email, name, password_hash)
        VALUES (${email}, ${name}, ${passwordHash})
        RETURNING id, email, name
      `
      return user
    } catch (error) {
      console.warn("Database insert failed, using mock storage:", error.message)
    }
  }

  // Fallback to mock storage
  const newUser = {
    id: mockUsers.length + 1,
    email,
    name,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return { id: newUser.id, email: newUser.email, name: newUser.name }
}

async function findUserByEmail(email: string) {
  const db = initializeDatabase()

  if (db) {
    try {
      const [user] = await db`
        SELECT id, email, name, password_hash
        FROM users
        WHERE email = ${email}
      `
      return user
    } catch (error) {
      console.warn("Database query failed, using mock storage:", error.message)
    }
  }

  // Fallback to mock storage
  return mockUsers.find((user) => user.email === email)
}

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name } = await req.json()

    // Validate required fields
    if (!action || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize database tables if using real database
    await createTablesIfNeeded()

    if (action === "register") {
      if (!name) {
        return NextResponse.json({ error: "Name is required for registration" }, { status: 400 })
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await createUser(email, name, hashedPassword)

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)

        return NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, name: user.name },
          token,
        })
      } catch (error: any) {
        if (error.message?.includes("duplicate") || error.code === "23505") {
          return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }
        throw error
      }
    }

    if (action === "login") {
      const user = await findUserByEmail(email)

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET)

      return NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Auth error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  const db = initializeDatabase()

  return NextResponse.json({
    status: "ok",
    database: db ? "connected" : "mock",
    timestamp: new Date().toISOString(),
  })
}
