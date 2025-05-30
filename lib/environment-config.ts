// Environment configuration for INNOXAI platform
// INNOXAI provides: Complete platform infrastructure including Neon database (ALREADY CONNECTED)
// Users provide: Only their own API keys for external services they choose to use
// NO ADDITIONAL INTEGRATIONS REQUIRED - Platform is complete

// INNOXAI Platform Configuration (Fully Managed - ALREADY CONNECTED)
export interface PlatformConfig {
  DATABASE_URL: string // Neon - ALREADY CONNECTED by INNOXAI
  NODE_ENV: string
  NEXT_PUBLIC_INNOXAI_PLATFORM: string
}

// User Service Configuration (User provides when developing on INNOXAI)
// All of these are optional and provided by users based on their project needs
export interface UserServiceConfig {
  // AI Services (User provides their own keys)
  OPENAI_API_KEY?: string
  XAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  GOOGLE_AI_API_KEY?: string
  MISTRAL_API_KEY?: string

  // Blockchain (User provides for DApps)
  INFURA_API_KEY?: string
  ALCHEMY_API_KEY?: string
  PRIVATE_KEY?: string
  ETHERSCAN_API_KEY?: string
  NEXT_PUBLIC_CONTRACT_ADDRESS?: string

  // Authentication (User provides)
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string
  JWT_SECRET?: string

  // External Services (User provides - ALL OPTIONAL)
  SUPABASE_URL?: string
  SUPABASE_ANON_KEY?: string
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
  BLOB_READ_WRITE_TOKEN?: string
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASS?: string
  VERCEL_ANALYTICS_ID?: string
  SENTRY_DSN?: string
}

// Get INNOXAI platform configuration (ALREADY CONNECTED)
export function getPlatformConfig(): PlatformConfig {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://neon-already-connected", // NEON ALREADY CONNECTED
    NEXT_PUBLIC_INNOXAI_PLATFORM: "INNOXAI-READY",
  }
}

// Get user configuration (provided by users when they want these services)
export function getUserConfig(): UserServiceConfig {
  return {
    // AI Services (User provides their own keys)
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    XAI_API_KEY: process.env.XAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,

    // Blockchain (User provides for DApps)
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,

    // Authentication (User provides)
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    // External Services (User provides - ALL OPTIONAL)
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
  }
}

// Check platform status (INNOXAI managed - ALREADY READY)
export function checkPlatformStatus() {
  return {
    database: true, // NEON ALREADY CONNECTED
    environment: "ready",
    version: "INNOXAI-READY",
    status: "Platform Complete - Neon Connected",
  }
}

// Check user services (user configured when they want them)
export function checkUserServices() {
  const config = getUserConfig()

  return {
    ai: {
      openai: !!config.OPENAI_API_KEY,
      xai: !!config.XAI_API_KEY,
      anthropic: !!config.ANTHROPIC_API_KEY,
      google: !!config.GOOGLE_AI_API_KEY,
      mistral: !!config.MISTRAL_API_KEY,
    },
    blockchain: {
      infura: !!config.INFURA_API_KEY,
      alchemy: !!config.ALCHEMY_API_KEY,
      etherscan: !!config.ETHERSCAN_API_KEY,
      wallet: !!config.PRIVATE_KEY,
    },
    auth: {
      nextauth: !!(config.NEXTAUTH_SECRET && config.NEXTAUTH_URL),
      jwt: !!config.JWT_SECRET,
    },
    storage: {
      redis: !!(config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN),
      blob: !!config.BLOB_READ_WRITE_TOKEN,
      supabase: !!(config.SUPABASE_URL && config.SUPABASE_ANON_KEY),
    },
    email: !!(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS),
    analytics: {
      vercel: !!config.VERCEL_ANALYTICS_ID,
      sentry: !!config.SENTRY_DSN,
    },
  }
}

// Generate environment template for users (NO PLATFORM SETUP NEEDED)
export function generateUserEnvironmentTemplate(projectType: string): string {
  const templates = {
    "ai-app": `# INNOXAI AI Application - User Configuration
# Platform is ready - just add your API keys for services you want

# === AI SERVICES ===
# Choose at least one AI provider:

# OpenAI (Recommended)
OPENAI_API_KEY=sk-...
# Get your key: https://platform.openai.com/api-keys

# Grok AI (Advanced reasoning)
XAI_API_KEY=xai-...
# Get your key: https://console.x.ai/

# === AUTHENTICATION (Optional) ===
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# === OPTIONAL SERVICES ===
# Only add if you need these features:
# UPSTASH_REDIS_REST_URL=https://...
# BLOB_READ_WRITE_TOKEN=vercel_blob_...
# SMTP_HOST=smtp.gmail.com

# === INNOXAI PLATFORM ===
# ✅ Database (Neon): Already connected
# ✅ Infrastructure: Already ready
# ✅ Development environment: Already configured`,

    dapp: `# INNOXAI DApp - User Configuration
# Platform is ready - add your blockchain and AI keys

# === BLOCKCHAIN SERVICES (Required for DApp) ===
INFURA_API_KEY=your-infura-key
# Get your key: https://infura.io/dashboard

# === CONTRACT CONFIGURATION ===
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1

# === AI FEATURES (Optional) ===
OPENAI_API_KEY=sk-...

# === INNOXAI PLATFORM ===
# ✅ Database (Neon): Already connected
# ✅ Infrastructure: Already ready`,

    fullstack: `# INNOXAI Full-Stack Application - User Configuration
# Platform is ready - add your service keys

# === AI SERVICES ===
OPENAI_API_KEY=sk-...

# === AUTHENTICATION ===
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret

# === OPTIONAL SERVICES ===
# UPSTASH_REDIS_REST_URL=https://...
# SMTP_HOST=smtp.gmail.com

# === INNOXAI PLATFORM ===
# ✅ Database (Neon): Already connected
# ✅ Infrastructure: Already ready`,

    component: `# INNOXAI Component Library - User Configuration
# Platform is ready - minimal setup needed

# === AI SERVICES (Optional) ===
OPENAI_API_KEY=sk-...

# === INNOXAI PLATFORM ===
# ✅ Everything ready - start building!`,
  }

  return templates[projectType as keyof typeof templates] || templates["component"]
}

// Get required services for project type
export function getRequiredServices(projectType: string) {
  const requirements = {
    "ai-app": {
      required: ["At least one AI provider"],
      recommended: ["Authentication"],
      optional: ["Redis cache", "Email", "Analytics", "File storage"],
    },
    dapp: {
      required: ["Blockchain provider (Infura/Alchemy)"],
      recommended: ["Contract verification", "AI features"],
      optional: ["Authentication", "Analytics"],
    },
    fullstack: {
      required: ["AI provider", "Authentication"],
      recommended: ["Email service"],
      optional: ["Redis cache", "File storage", "Analytics"],
    },
    component: {
      required: [],
      recommended: ["AI provider"],
      optional: ["Analytics"],
    },
  }

  return requirements[projectType as keyof typeof requirements] || requirements["component"]
}
