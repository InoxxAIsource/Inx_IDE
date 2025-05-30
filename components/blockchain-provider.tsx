"use client"

import type { ReactNode } from "react"
import { WagmiConfig } from "wagmi"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { wagmiConfig } from "@/lib/wagmi-config"
import "@rainbow-me/rainbowkit/styles.css"

interface BlockchainProviderProps {
  children: ReactNode
  theme?: "light" | "dark"
}

export function BlockchainProvider({ children, theme = "light" }: BlockchainProviderProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={theme === "light" ? lightTheme() : darkTheme()} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
