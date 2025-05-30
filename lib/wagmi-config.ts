import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains"
import { createConfig } from "wagmi"

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "INNOXAI DApp",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
    chains: [mainnet, sepolia, polygon, optimism, arbitrum],
    ssr: true,
  }),
)

export const supportedChains = [
  { id: 1, name: "Ethereum", icon: "🔷" },
  { id: 11155111, name: "Sepolia", icon: "🟣" },
  { id: 137, name: "Polygon", icon: "🟪" },
  { id: 10, name: "Optimism", icon: "🔴" },
  { id: 42161, name: "Arbitrum", icon: "🔵" },
]

export function getChainById(chainId: number) {
  return supportedChains.find((chain) => chain.id === chainId)
}

export function getChainName(chainId: number) {
  const chain = getChainById(chainId)
  return chain ? chain.name : "Unknown Chain"
}
