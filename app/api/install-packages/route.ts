import { type NextRequest, NextResponse } from "next/server"
import { detectRequiredPackages } from "@/lib/package-manager"
import { PackageManager } from "@/lib/package-manager"

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Code is required" }, { status: 400 })
    }

    const detectedPackages = detectRequiredPackages(code)

    // (Optional real installation logic can be placed here)
    const simulatedInstall = detectedPackages.map((pkg) => ({
      name: pkg.name,
      version: pkg.version || "latest",
      type: pkg.dev ? "devDependency" : "dependency",
    }))

    return NextResponse.json({
      success: true,
      details: { packages: simulatedInstall },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const installedPackages = PackageManager.getInstalledPackages()
    const packageStats = {
      totalInstalled: installedPackages.length,
      packages: installedPackages,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Package installer API is running",
      stats: packageStats,
      endpoints: {
        POST: "/api/install-packages - Install packages from code analysis",
        GET: "/api/install-packages - Get installation statistics",
      },
      features: [
        "Automatic package detection from imports",
        "Pattern-based package recognition",
        "Simulated package installation",
        "Development vs production dependency classification",
        "Comprehensive package database (25+ libraries)",
        "Real-time installation progress tracking",
      ],
      supportedPackages: [
        "UI Libraries: framer-motion, react-spring, recharts",
        "Forms: react-hook-form, react-select, react-datepicker",
        "State: zustand, redux, jotai, react-query",
        "Blockchain: ethers, wagmi, viem, rainbowkit",
        "Utilities: lodash, date-fns, axios",
        "Development: typescript, @types/react, @types/node",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get package stats",
        endpoints: {
          POST: "/api/install-packages - Install packages from code analysis",
          GET: "/api/install-packages - Get installation statistics",
        },
      },
      { status: 500 },
    )
  }
}

// Add a new endpoint for package search/info
export async function PUT(request: NextRequest) {
  try {
    const { packageName } = await request.json()

    if (!packageName || typeof packageName !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Package name is required",
        },
        { status: 400 },
      )
    }

    const isInstalled = PackageManager.isPackageInstalled(packageName)

    return NextResponse.json({
      success: true,
      packageName,
      isInstalled,
      message: isInstalled ? `${packageName} is already installed` : `${packageName} is not installed`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Package check failed",
      },
      { status: 500 },
    )
  }
}

// Add endpoint for manual package installation
export async function PATCH(request: NextRequest) {
  try {
    const { packages } = await request.json()

    if (!packages || !Array.isArray(packages)) {
      return NextResponse.json(
        {
          success: false,
          error: "Packages array is required",
        },
        { status: 400 },
      )
    }

    const packageInfos = packages.map((pkg) => ({
      name: typeof pkg === "string" ? pkg : pkg.name,
      version: typeof pkg === "object" ? pkg.version : undefined,
      dev: typeof pkg === "object" ? pkg.dev : false,
      description:
        typeof pkg === "object"
          ? pkg.description
          : `Manually installed package: ${typeof pkg === "string" ? pkg : pkg.name}`,
    }))

    const installationResult = await PackageManager.simulateInstallation(packageInfos)

    return NextResponse.json({
      success: installationResult.success,
      installed: installationResult.installed,
      installedCount: installationResult.installed.length,
      message: `Manually installed ${installationResult.installed.length} package${installationResult.installed.length !== 1 ? "s" : ""}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Manual installation failed",
      },
      { status: 500 },
    )
  }
}
