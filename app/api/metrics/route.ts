import { type NextRequest, NextResponse } from "next/server"

// Mock metrics data
const mockMetrics = [
  { metric_name: "total_users", metric_value: 12847, updated_at: new Date().toISOString() },
  { metric_name: "revenue", metric_value: 89432, updated_at: new Date().toISOString() },
  { metric_name: "growth_rate", metric_value: 235, updated_at: new Date().toISOString() },
  { metric_name: "active_users", metric_value: 1247, updated_at: new Date().toISOString() },
  { metric_name: "components_generated", metric_value: 156, updated_at: new Date().toISOString() },
  { metric_name: "api_calls", metric_value: 2341, updated_at: new Date().toISOString() },
]

const mockGenerations = {
  total_generations: 3456,
  today_generations: 123,
  provider_count: 3456,
  provider: "openai",
}

const mockRecentActivity = [
  { prompt: "Create a login form with validation", provider: "openai", created_at: new Date().toISOString() },
  { prompt: "Build a dashboard with charts", provider: "openai", created_at: new Date().toISOString() },
  { prompt: "Generate a product card component", provider: "anthropic", created_at: new Date().toISOString() },
  { prompt: "Create a responsive navbar", provider: "openai", created_at: new Date().toISOString() },
  { prompt: "Build a file upload component", provider: "mistral", created_at: new Date().toISOString() },
]

// Function to get database connection at runtime only
async function getDatabaseConnection() {
  // Only attempt database connection at runtime, not during build
  if (typeof window === "undefined" && process.env.DATABASE_URL) {
    try {
      // Dynamic import to prevent build-time errors
      const { neon } = await import("@neondatabase/serverless")
      return neon(process.env.DATABASE_URL)
    } catch (error) {
      console.warn("Database connection failed:", error)
      return null
    }
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
    // Try to get database connection at runtime
    const sql = await getDatabaseConnection()

    if (sql) {
      try {
        // If we have a database connection, use it
        await sql`
          CREATE TABLE IF NOT EXISTS ai_generations (
            id SERIAL PRIMARY KEY,
            prompt TEXT NOT NULL,
            provider VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `

        await sql`
          CREATE TABLE IF NOT EXISTS user_metrics (
            id SERIAL PRIMARY KEY,
            metric_name VARCHAR(100) NOT NULL,
            metric_value INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `

        // Insert sample metrics if table is empty
        const [existingMetrics] = await sql`SELECT COUNT(*) as count FROM user_metrics`

        if (existingMetrics.count === "0") {
          await sql`
            INSERT INTO user_metrics (metric_name, metric_value) VALUES
            ('total_users', 12847),
            ('revenue', 89432),
            ('growth_rate', 235),
            ('active_users', 1247),
            ('components_generated', 156),
            ('api_calls', 2341)
          `
        }

        // Fetch real-time metrics
        const metrics = await sql`
          SELECT metric_name, metric_value, updated_at 
          FROM user_metrics 
          ORDER BY updated_at DESC
        `

        const generations = await sql`
          SELECT COUNT(*) as total_generations,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as today_generations,
                provider,
                COUNT(*) as provider_count
          FROM ai_generations 
          GROUP BY provider
        `

        const recentActivity = await sql`
          SELECT prompt, provider, created_at
          FROM ai_generations
          ORDER BY created_at DESC
          LIMIT 10
        `

        // Simulate real-time updates by adding some randomness
        const liveMetrics = metrics.map((metric) => ({
          ...metric,
          metric_value:
            metric.metric_name === "active_users"
              ? metric.metric_value + Math.floor(Math.random() * 50)
              : metric.metric_value,
        }))

        return NextResponse.json({
          success: true,
          metrics: liveMetrics,
          generations: generations[0] || { total_generations: 0, today_generations: 0 },
          recentActivity,
          timestamp: new Date().toISOString(),
          source: "database",
        })
      } catch (dbError) {
        console.error("Database query error:", dbError)
        // Fall back to mock data if database queries fail
      }
    }

    // If no database or query failed, return mock data
    // Add some randomness to mock data to simulate real-time updates
    const liveMetrics = mockMetrics.map((metric) => ({
      ...metric,
      metric_value:
        metric.metric_name === "active_users"
          ? metric.metric_value + Math.floor(Math.random() * 50)
          : metric.metric_value,
      updated_at: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      metrics: liveMetrics,
      generations: mockGenerations,
      recentActivity: mockRecentActivity,
      timestamp: new Date().toISOString(),
      source: "mock",
    })
  } catch (error) {
    console.error("Metrics error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        success: false,
        metrics: mockMetrics,
        generations: mockGenerations,
        recentActivity: mockRecentActivity,
        timestamp: new Date().toISOString(),
        source: "error_fallback",
      },
      { status: 200 },
    ) // Return 200 with mock data even on error
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json()
    const sql = await getDatabaseConnection()

    if (action === "update" && sql) {
      try {
        // Try to update real database if available
        await sql`
          UPDATE user_metrics 
          SET metric_value = metric_value + FLOOR(RANDOM() * 100),
              updated_at = NOW()
          WHERE metric_name IN ('total_users', 'revenue', 'active_users')
        `

        await sql`
          UPDATE user_metrics 
          SET metric_value = FLOOR(RANDOM() * 50) + 200,
              updated_at = NOW()
          WHERE metric_name = 'growth_rate'
        `

        return NextResponse.json({
          success: true,
          message: "Metrics updated in database",
          source: "database",
        })
      } catch (dbError) {
        console.error("Database update error:", dbError)
        // Fall back to mock response
      }
    }

    // Return mock update response if no database or action isn't update
    return NextResponse.json({
      success: true,
      message: "Metrics updated (simulated)",
      source: "mock",
    })
  } catch (error) {
    console.error("Metrics update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update metrics",
        message: "Update simulation available",
      },
      { status: 200 },
    ) // Return 200 with message even on error
  }
}
