interface PackageInfo {
  name: string
  version?: string
  dev?: boolean
  description?: string
}

interface PackageDatabase {
  [key: string]: {
    version: string
    dev?: boolean
    description: string
    patterns: string[]
  }
}

// Package database with detection patterns
const packageDatabase: PackageDatabase = {
  // UI Libraries
  "framer-motion": {
    version: "^10.16.4",
    description: "Animation library for React",
    patterns: ["motion\\.", "AnimatePresence", "useAnimation", "variants"],
  },
  "react-spring": {
    version: "^9.7.3",
    description: "Spring-physics based animations",
    patterns: ["useSpring", "animated\\.", "useTransition"],
  },
  recharts: {
    version: "^2.8.0",
    description: "Composable charting library",
    patterns: ["LineChart", "BarChart", "PieChart", "XAxis", "YAxis", "ResponsiveContainer"],
  },
  "react-hook-form": {
    version: "^7.47.0",
    description: "Performant forms with easy validation",
    patterns: ["useForm", "Controller", "register", "handleSubmit"],
  },
  "react-query": {
    version: "^3.39.3",
    description: "Data fetching and caching library",
    patterns: ["useQuery", "useMutation", "QueryClient"],
  },
  "@tanstack/react-query": {
    version: "^5.0.0",
    description: "Powerful data synchronization for React",
    patterns: ["useQuery", "useMutation", "QueryClient"],
  },
  "react-router-dom": {
    version: "^6.17.0",
    description: "Declarative routing for React",
    patterns: ["BrowserRouter", "Route", "Link", "useNavigate", "useParams"],
  },
  axios: {
    version: "^1.5.0",
    description: "Promise based HTTP client",
    patterns: ["axios\\.", "axios\\("],
  },
  "date-fns": {
    version: "^2.30.0",
    description: "Modern JavaScript date utility library",
    patterns: ["format\\(", "parseISO", "addDays", "subDays"],
  },
  lodash: {
    version: "^4.17.21",
    description: "Utility library",
    patterns: ["_\\.", "debounce", "throttle", "cloneDeep"],
  },
  "react-dnd": {
    version: "^16.0.1",
    description: "Drag and drop for React",
    patterns: ["useDrag", "useDrop", "DndProvider"],
  },
  "react-beautiful-dnd": {
    version: "^13.1.1",
    description: "Beautiful drag and drop",
    patterns: ["DragDropContext", "Droppable", "Draggable"],
  },
  "react-select": {
    version: "^5.7.7",
    description: "Select component for React",
    patterns: ["Select from ['\"]react-select"],
  },
  "react-datepicker": {
    version: "^4.21.0",
    description: "Date picker component",
    patterns: ["DatePicker", "react-datepicker"],
  },
  "react-modal": {
    version: "^3.16.1",
    description: "Accessible modal dialog",
    patterns: ["Modal from ['\"]react-modal"],
  },
  "react-tooltip": {
    version: "^5.21.4",
    description: "Tooltip component",
    patterns: ["Tooltip", "react-tooltip"],
  },
  "react-hot-toast": {
    version: "^2.4.1",
    description: "Toast notifications",
    patterns: ["toast\\.", "Toaster"],
  },
  sonner: {
    version: "^1.0.3",
    description: "Opinionated toast component",
    patterns: ["toast from ['\"]sonner", "Toaster from ['\"]sonner"],
  },

  // Blockchain/Web3
  ethers: {
    version: "^6.8.0",
    description: "Ethereum library",
    patterns: ["ethers\\.", "Contract", "Provider", "Signer"],
  },
  wagmi: {
    version: "^1.4.0",
    description: "React hooks for Ethereum",
    patterns: ["useAccount", "useConnect", "useContract", "useBalance"],
  },
  viem: {
    version: "^1.16.0",
    description: "TypeScript interface for Ethereum",
    patterns: ["createPublicClient", "createWalletClient", "parseEther"],
  },
  "@rainbow-me/rainbowkit": {
    version: "^1.3.0",
    description: "Wallet connection UI",
    patterns: ["ConnectButton", "RainbowKitProvider"],
  },
  web3: {
    version: "^4.2.0",
    description: "Ethereum JavaScript API",
    patterns: ["Web3\\(", "web3\\."],
  },

  // State Management
  zustand: {
    version: "^4.4.4",
    description: "Small, fast state management",
    patterns: ["create from ['\"]zustand", "useStore"],
  },
  redux: {
    version: "^4.2.1",
    description: "Predictable state container",
    patterns: ["createStore", "useSelector", "useDispatch"],
  },
  "@reduxjs/toolkit": {
    version: "^1.9.7",
    description: "Official Redux toolkit",
    patterns: ["configureStore", "createSlice", "createAsyncThunk"],
  },
  jotai: {
    version: "^2.4.3",
    description: "Primitive and flexible state management",
    patterns: ["atom\\(", "useAtom", "useAtomValue"],
  },

  // Development Tools
  "@types/react": {
    version: "^18.2.0",
    dev: true,
    description: "TypeScript definitions for React",
    patterns: ["React\\.FC", "React\\.Component", "JSX\\.Element"],
  },
  "@types/node": {
    version: "^20.8.0",
    dev: true,
    description: "TypeScript definitions for Node.js",
    patterns: ["NodeJS\\.", "Buffer", "process\\."],
  },
  typescript: {
    version: "^5.2.0",
    dev: true,
    description: "TypeScript language",
    patterns: ["interface ", "type ", ": string", ": number"],
  },

  // AI and ML Libraries
  openai: {
    version: "^4.0.0",
    description: "OpenAI API client",
    patterns: ["OpenAI", "openai\\."],
  },
  "@ai-sdk/openai": {
    version: "^1.0.0",
    description: "AI SDK for OpenAI",
    patterns: ["openai from ['\"]@ai-sdk/openai"],
  },
  ai: {
    version: "^2.0.0",
    description: "AI utilities for JavaScript",
    patterns: ["generateText", "streamText", "generateImage"],
  },
  langchain: {
    version: "^0.0.75",
    description: "LangChain for JavaScript",
    patterns: ["LLMChain", "PromptTemplate", "ChatOpenAI"],
  },
  "@huggingface/inference": {
    version: "^2.6.1",
    description: "Hugging Face Inference API",
    patterns: ["HfInference", "huggingface"],
  },
  "transformers.js": {
    version: "^2.6.0",
    description: "Run Transformers in the browser",
    patterns: ["pipeline", "AutoTokenizer", "AutoModel"],
  },
}

// Detect required packages from code
export function detectRequiredPackages(code: string): PackageInfo[] {
  const detectedPackages: PackageInfo[] = []

  // First, detect packages from import statements
  const importPackages = detectFromImports(code)
  detectedPackages.push(...importPackages)

  // Then, detect packages from usage patterns
  const patternPackages = detectFromPatterns(code)
  detectedPackages.push(...patternPackages)

  // Remove duplicates
  const uniquePackages = detectedPackages.filter(
    (pkg, index, self) => index === self.findIndex((p) => p.name === pkg.name),
  )

  return uniquePackages
}

function detectFromImports(code: string): PackageInfo[] {
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g
  const requireRegex = /require$$['"]([^'"]+)['"]$$/g

  const packages: PackageInfo[] = []
  const matches = [...code.matchAll(importRegex), ...code.matchAll(requireRegex)]

  for (const match of matches) {
    const packageName = match[1]

    // Skip relative imports and Node.js built-ins
    if (packageName.startsWith(".") || packageName.startsWith("/") || isBuiltInModule(packageName)) {
      continue
    }

    // Extract base package name (handle scoped packages)
    const basePackage = packageName.startsWith("@")
      ? packageName.split("/").slice(0, 2).join("/")
      : packageName.split("/")[0]

    const packageInfo = packageDatabase[basePackage]
    if (packageInfo) {
      packages.push({
        name: basePackage,
        version: packageInfo.version,
        dev: packageInfo.dev,
        description: packageInfo.description,
      })
    } else {
      // For packages not in our database, add with default version
      packages.push({
        name: basePackage,
        version: "latest",
        description: `Package detected from imports`,
      })
    }
  }

  return packages
}

function detectFromPatterns(code: string): PackageInfo[] {
  const packages: PackageInfo[] = []

  for (const [packageName, info] of Object.entries(packageDatabase)) {
    for (const pattern of info.patterns) {
      const regex = new RegExp(pattern, "g")
      if (regex.test(code)) {
        packages.push({
          name: packageName,
          version: info.version,
          dev: info.dev,
          description: info.description,
        })
        break // Found one pattern, no need to check others for this package
      }
    }
  }

  return packages
}

function isBuiltInModule(moduleName: string): boolean {
  const builtIns = [
    "fs",
    "path",
    "http",
    "https",
    "url",
    "crypto",
    "os",
    "util",
    "events",
    "stream",
    "buffer",
    "child_process",
    "cluster",
    "net",
    "dns",
    "readline",
    "zlib",
    "querystring",
    "assert",
    "vm",
  ]
  return builtIns.includes(moduleName)
}

export class PackageManager {
  private static instance: PackageManager

  static getInstance(): PackageManager {
    if (!PackageManager.instance) {
      PackageManager.instance = new PackageManager()
    }
    return PackageManager.instance
  }

  async installPackages(
    packages: PackageInfo[],
  ): Promise<{ success: boolean; installed: PackageInfo[]; errors: string[] }> {
    // Simulate package installation
    const installed: PackageInfo[] = []
    const errors: string[] = []

    for (const pkg of packages) {
      try {
        // In a real implementation, this would actually install packages
        // For now, we'll simulate successful installation
        installed.push(pkg)
      } catch (error) {
        errors.push(`Failed to install ${pkg.name}: ${error}`)
      }
    }

    return {
      success: errors.length === 0,
      installed,
      errors,
    }
  }

  async getInstalledPackages(): Promise<PackageInfo[]> {
    // In a real implementation, this would read from package.json
    // For now, return empty array
    return []
  }

  async uninstallPackage(packageName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, this would actually uninstall the package
      return { success: true }
    } catch (error) {
      return { success: false, error: `Failed to uninstall ${packageName}` }
    }
  }

  async checkPackageUpdates(
    packages: PackageInfo[],
  ): Promise<{ name: string; currentVersion: string; latestVersion: string }[]> {
    // In a real implementation, this would check for package updates
    return []
  }
}
