import { ethers } from "ethers"
import type { Contract } from "ethers"

// Standard ERC-20 ABI for token interactions
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

// Get ethers provider based on environment
export function getProvider() {
  // For server-side
  if (typeof window === "undefined") {
    const rpcUrl = process.env.INFURA_API_KEY
      ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
      : process.env.ALCHEMY_API_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        : "https://eth.llamarpc.com"

    return new ethers.JsonRpcProvider(rpcUrl)
  }

  // For client-side
  return new ethers.BrowserProvider(window.ethereum)
}

// Get contract instance
export function getContract(address: string, abi: any, signer?: ethers.Signer): Contract {
  const provider = getProvider()

  if (signer) {
    return new ethers.Contract(address, abi, signer)
  }

  return new ethers.Contract(address, abi, provider)
}

// Format ETH value with specified decimals
export function formatEther(value: bigint | string, decimals = 18): string {
  return ethers.formatUnits(value, decimals)
}

// Parse ETH string to BigInt
export function parseEther(value: string, decimals = 18): bigint {
  return ethers.parseUnits(value, decimals)
}

// Get token balance for address
export async function getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
  const contract = getContract(tokenAddress, ERC20_ABI)
  const balance = await contract.balanceOf(userAddress)
  const decimals = await contract.decimals()
  return formatEther(balance, decimals)
}

// Shortens an Ethereum address for display
export function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address)
}
