import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { getProvider, getContract, ERC20_ABI } from "@/lib/blockchain-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const address = searchParams.get("address")
    const tokenAddress = searchParams.get("tokenAddress")

    if (!action) {
      return NextResponse.json({ error: "Missing action parameter" }, { status: 400 })
    }

    const provider = getProvider()

    switch (action) {
      case "balance": {
        if (!address) {
          return NextResponse.json({ error: "Missing address parameter" }, { status: 400 })
        }

        const balance = await provider.getBalance(address)
        return NextResponse.json({
          balance: ethers.formatEther(balance),
          wei: balance.toString(),
        })
      }

      case "token-balance": {
        if (!address || !tokenAddress) {
          return NextResponse.json({ error: "Missing address or tokenAddress parameter" }, { status: 400 })
        }

        const contract = getContract(tokenAddress, ERC20_ABI)
        const balance = await contract.balanceOf(address)
        const decimals = await contract.decimals()
        const symbol = await contract.symbol()
        const name = await contract.name()

        return NextResponse.json({
          balance: ethers.formatUnits(balance, decimals),
          raw: balance.toString(),
          token: {
            address: tokenAddress,
            name,
            symbol,
            decimals,
          },
        })
      }

      case "gas-price": {
        const feeData = await provider.getFeeData()
        return NextResponse.json({
          gasPrice: ethers.formatUnits(feeData.gasPrice || 0n, "gwei"),
          maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") : null,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
            ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei")
            : null,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blockchain API error:", error)
    return NextResponse.json({ error: "Failed to process blockchain request" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contractAddress, abi, functionName, args, value } = body

    if (!action || !contractAddress) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // This would require a private key, which should be securely managed
    // For demonstration purposes only
    if (process.env.PRIVATE_KEY) {
      const provider = getProvider()
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
      const contract = getContract(contractAddress, abi || ERC20_ABI, wallet)

      switch (action) {
        case "call": {
          if (!functionName) {
            return NextResponse.json({ error: "Missing functionName parameter" }, { status: 400 })
          }

          const result = await contract[functionName](...(args || []))
          return NextResponse.json({ result })
        }

        case "send": {
          if (!functionName) {
            return NextResponse.json({ error: "Missing functionName parameter" }, { status: 400 })
          }

          const tx = await contract[functionName](...(args || []), {
            value: value ? ethers.parseEther(value) : undefined,
          })
          const receipt = await tx.wait()

          return NextResponse.json({
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            status: receipt.status === 1 ? "success" : "failed",
          })
        }

        default:
          return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Server not configured for transactions" }, { status: 501 })
    }
  } catch (error) {
    console.error("Blockchain transaction error:", error)
    return NextResponse.json({ error: "Failed to process blockchain transaction" }, { status: 500 })
  }
}
