// Database utilities for INNOXAI platform
// Neon database is pre-configured and managed by INNOXAI

import { neon } from "@neondatabase/serverless"

// Use the INNOXAI-provided database connection
const sql = neon(process.env.DATABASE_URL!)

// Database service for user projects
export class INNOXAIDatabase {
  // Initialize user project tables
  static async initializeUserProject(projectId: string, projectType: string) {
    try {
      // Create project-specific tables
      await sql`
        CREATE TABLE IF NOT EXISTS user_projects (
          id SERIAL PRIMARY KEY,
          project_id VARCHAR(255) UNIQUE NOT NULL,
          project_type VARCHAR(100) NOT NULL,
          user_id VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          config JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS project_data (
          id SERIAL PRIMARY KEY,
          project_id VARCHAR(255) REFERENCES user_projects(project_id),
          data_type VARCHAR(100) NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `

      await sql`
        CREATE TABLE IF NOT EXISTS project_ai_interactions (
          id SERIAL PRIMARY KEY,
          project_id VARCHAR(255) REFERENCES user_projects(project_id),
          interaction_type VARCHAR(100) NOT NULL,
          prompt TEXT,
          response TEXT,
          ai_provider VARCHAR(50),
          tokens_used INTEGER,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `

      // Insert project record
      await sql`
        INSERT INTO user_projects (project_id, project_type, name, description)
        VALUES (${projectId}, ${projectType}, ${`INNOXAI ${projectType} Project`}, ${`Generated ${projectType} project`})
        ON CONFLICT (project_id) DO NOTHING
      `

      console.log(`✅ Database initialized for project: ${projectId}`)
      return { success: true }
    } catch (error) {
      console.error("❌ Database initialization failed:", error)
      return { success: false, error: error.message }
    }
  }

  // Save user project data
  static async saveProjectData(projectId: string, dataType: string, data: any) {
    try {
      const [result] = await sql`
        INSERT INTO project_data (project_id, data_type, data)
        VALUES (${projectId}, ${dataType}, ${JSON.stringify(data)})
        RETURNING *
      `
      return { success: true, data: result }
    } catch (error) {
      console.error("Failed to save project data:", error)
      return { success: false, error: error.message }
    }
  }

  // Get user project data
  static async getProjectData(projectId: string, dataType?: string) {
    try {
      const data = dataType
        ? await sql`
            SELECT * FROM project_data 
            WHERE project_id = ${projectId} AND data_type = ${dataType}
            ORDER BY created_at DESC
          `
        : await sql`
            SELECT * FROM project_data 
            WHERE project_id = ${projectId}
            ORDER BY created_at DESC
          `

      return { success: true, data }
    } catch (error) {
      console.error("Failed to get project data:", error)
      return { success: false, error: error.message }
    }
  }

  // Log AI interactions
  static async logAIInteraction(
    projectId: string,
    interaction: {
      type: string
      prompt: string
      response: string
      provider: string
      tokensUsed?: number
    },
  ) {
    try {
      const [result] = await sql`
        INSERT INTO project_ai_interactions 
        (project_id, interaction_type, prompt, response, ai_provider, tokens_used)
        VALUES (
          ${projectId}, 
          ${interaction.type}, 
          ${interaction.prompt}, 
          ${interaction.response}, 
          ${interaction.provider}, 
          ${interaction.tokensUsed || 0}
        )
        RETURNING *
      `
      return { success: true, data: result }
    } catch (error) {
      console.error("Failed to log AI interaction:", error)
      return { success: false, error: error.message }
    }
  }

  // Get project analytics
  static async getProjectAnalytics(projectId: string) {
    try {
      const [stats] = await sql`
        SELECT 
          COUNT(DISTINCT pd.id) as total_data_entries,
          COUNT(DISTINCT pai.id) as total_ai_interactions,
          SUM(pai.tokens_used) as total_tokens_used,
          COUNT(DISTINCT pai.ai_provider) as ai_providers_used
        FROM user_projects up
        LEFT JOIN project_data pd ON up.project_id = pd.project_id
        LEFT JOIN project_ai_interactions pai ON up.project_id = pai.project_id
        WHERE up.project_id = ${projectId}
      `

      const recentInteractions = await sql`
        SELECT interaction_type, ai_provider, created_at
        FROM project_ai_interactions
        WHERE project_id = ${projectId}
        ORDER BY created_at DESC
        LIMIT 10
      `

      return {
        success: true,
        analytics: {
          ...stats,
          recentInteractions,
        },
      }
    } catch (error) {
      console.error("Failed to get project analytics:", error)
      return { success: false, error: error.message }
    }
  }

  // Health check for INNOXAI database
  static async healthCheck() {
    try {
      const [result] = await sql`SELECT NOW() as timestamp, 'INNOXAI Database' as status`
      return {
        success: true,
        timestamp: result.timestamp,
        status: "Connected to INNOXAI Neon Database",
        message: "✅ Database ready for user projects",
      }
    } catch (error) {
      console.error("INNOXAI Database health check failed:", error)
      return {
        success: false,
        error: error.message,
        status: "Database connection failed",
      }
    }
  }
}

// Export database utilities
export const innoxaiDB = {
  initializeUserProject: INNOXAIDatabase.initializeUserProject,
  saveProjectData: INNOXAIDatabase.saveProjectData,
  getProjectData: INNOXAIDatabase.getProjectData,
  logAIInteraction: INNOXAIDatabase.logAIInteraction,
  getProjectAnalytics: INNOXAIDatabase.getProjectAnalytics,
  healthCheck: INNOXAIDatabase.healthCheck,
}

// Initialize database on startup
export async function initializeINNOXAIDatabase() {
  try {
    const health = await INNOXAIDatabase.healthCheck()
    if (health.success) {
      console.log("🚀 INNOXAI Database Status:", health.status)
      return true
    } else {
      console.error("❌ INNOXAI Database Error:", health.error)
      return false
    }
  } catch (error) {
    console.error("❌ INNOXAI Database initialization error:", error)
    return false
  }
}
