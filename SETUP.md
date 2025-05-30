# INNOXAI Complete Setup Guide

## 📦 Package Dependencies

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with latest features
- **TypeScript** - Type safety and better DX

### UI Components
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### AI & ML
- **AI SDK** - Unified AI provider interface
- **OpenAI SDK** - GPT models integration
- **xAI SDK** - Grok AI integration
- **Anthropic SDK** - Claude models
- **Google AI SDK** - Gemini models
- **Mistral SDK** - Open-source AI models

### Database & Storage
- **Neon** - Serverless PostgreSQL
- **Drizzle ORM** - Type-safe database toolkit
- **Supabase** - Alternative database option
- **Upstash Redis** - Serverless Redis cache
- **Vercel Blob** - File storage solution

### Blockchain & Web3
- **Ethers.js** - Ethereum library
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript Ethereum interface

### Authentication & Security
- **NextAuth.js** - Authentication solution
- **JWT** - JSON Web Tokens
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Drizzle Kit** - Database migrations

## 🔧 Installation Commands

### 1. Install All Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Development Tools
\`\`\`bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# Testing
npm run test
\`\`\`

### 3. Database Setup
\`\`\`bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# Open database studio
npm run db:studio
\`\`\`

## 🌐 Service Providers & API Keys

### AI Services (Choose at least one)

#### OpenAI
- **Website**: https://platform.openai.com/
- **API Key**: `OPENAI_API_KEY=sk-...`
- **Models**: GPT-4, GPT-3.5, DALL-E
- **Use Case**: Code generation, text completion

#### Grok (xAI)
- **Website**: https://console.x.ai/
- **API Key**: `XAI_API_KEY=xai-...`
- **Models**: Grok-beta
- **Use Case**: Advanced reasoning, analysis

#### Anthropic
- **Website**: https://console.anthropic.com/
- **API Key**: `ANTHROPIC_API_KEY=sk-ant-...`
- **Models**: Claude-3, Claude-2
- **Use Case**: Complex reasoning, safety

#### Google AI
- **Website**: https://makersuite.google.com/
- **API Key**: `GOOGLE_AI_API_KEY=...`
- **Models**: Gemini Pro, Gemini Vision
- **Use Case**: Multimodal AI, reasoning

#### Mistral
- **Website**: https://console.mistral.ai/
- **API Key**: `MISTRAL_API_KEY=...`
- **Models**: Mistral-7B, Mixtral-8x7B
- **Use Case**: Open-source AI, efficiency

### Database Services (Choose one)

#### Neon (Recommended)
- **Website**: https://console.neon.tech/
- **Connection**: `DATABASE_URL=postgresql://...`
- **Features**: Serverless, auto-scaling, branching
- **Free Tier**: 3 GB storage, 100 hours compute

#### Supabase
- **Website**: https://supabase.com/dashboard
- **Keys**: 
  - `SUPABASE_URL=https://...`
  - `SUPABASE_ANON_KEY=eyJ...`
- **Features**: Real-time, auth, storage
- **Free Tier**: 500 MB database, 1 GB bandwidth

### Blockchain Services (For DApps)

#### Infura
- **Website**: https://infura.io/dashboard
- **API Key**: `INFURA_API_KEY=...`
- **Networks**: Ethereum, Polygon, Arbitrum
- **Free Tier**: 100k requests/day

#### Alchemy
- **Website**: https://dashboard.alchemy.com/
- **API Key**: `ALCHEMY_API_KEY=...`
- **Features**: Enhanced APIs, webhooks
- **Free Tier**: 300M compute units/month

#### Etherscan
- **Website**: https://etherscan.io/apis
- **API Key**: `ETHERSCAN_API_KEY=...`
- **Use Case**: Contract verification
- **Free Tier**: 5 calls/second

### Storage & Cache (Optional)

#### Upstash Redis
- **Website**: https://console.upstash.com/
- **Keys**:
  - `UPSTASH_REDIS_REST_URL=https://...`
  - `UPSTASH_REDIS_REST_TOKEN=...`
- **Free Tier**: 10k commands/day

#### Vercel Blob
- **Website**: https://vercel.com/dashboard
- **API Key**: `BLOB_READ_WRITE_TOKEN=vercel_blob_...`
- **Free Tier**: 1 GB storage

### Email Services (Optional)

#### Gmail SMTP
- **Setup**: Enable 2FA, create App Password
- **Config**:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your-email@gmail.com`
  - `SMTP_PASS=your-app-password`

#### SendGrid
- **Website**: https://sendgrid.com/
- **API Key**: `SENDGRID_API_KEY=SG...`
- **Free Tier**: 100 emails/day

### Analytics (Optional)

#### Vercel Analytics
- **Setup**: Enable in Vercel dashboard
- **Config**: `VERCEL_ANALYTICS_ID=...`
- **Features**: Web vitals, page views

#### Sentry
- **Website**: https://sentry.io/
- **DSN**: `SENTRY_DSN=https://...`
- **Features**: Error tracking, performance

## 📋 Environment Templates

### AI Application
\`\`\`env
# AI Services (Choose at least one)
OPENAI_API_KEY=sk-...
XAI_API_KEY=xai-...

# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret
\`\`\`

### DApp
\`\`\`env
# Blockchain
INFURA_API_KEY=your-infura-key
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...

# Frontend
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1

# AI (Optional)
OPENAI_API_KEY=sk-...
\`\`\`

### Full-Stack
\`\`\`env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret

# AI
OPENAI_API_KEY=sk-...

# Cache
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
\`\`\`

## 🚀 Quick Start Commands

\`\`\`bash
# 1. Clone and install
git clone <your-repo>
cd innoxai
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Start development
npm run dev

# 4. Open browser
open http://localhost:3000
\`\`\`

## 🔍 Service Detection

INNOXAI automatically detects available services and enables features accordingly:

- **No API keys**: Works with fallback templates
- **AI keys**: Enables AI-powered features
- **Database**: Enables data persistence
- **Blockchain**: Enables Web3 features
- **All services**: Full enterprise features

## 📞 Support

- **Documentation**: Check component README files
- **Issues**: Create GitHub issues for bugs
- **Community**: Join our Discord for help
- **Enterprise**: Contact for custom solutions

---

**INNOXAI** - Your AI-Powered Development Agent 🚀
