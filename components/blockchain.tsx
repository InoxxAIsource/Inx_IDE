"use client"

// Re-export blockchain components
export * from "./wallet-connect"
export * from "./contract-interaction"
export * from "./blockchain-provider"

// Import blockchain components for namespace export
import * as WalletConnectComponents from "./wallet-connect"
import * as ContractInteractionComponents from "./contract-interaction"
import * as BlockchainProviderComponents from "./blockchain-provider"

// Additional blockchain utility components
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// Token Balance Component
export const TokenBalance: React.FC<{
  address?: string
  tokenAddress?: string
  symbol?: string
}> = ({ address, tokenAddress, symbol = "ETH" }) => {
  const [balance, setBalance] = React.useState("0.00")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Token Balance
          <Badge variant="secondary">{symbol}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance}</div>
        <p className="text-sm text-muted-foreground">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect wallet"}
        </p>
      </CardContent>
    </Card>
  )
}

// Transaction Form Component
export const TransactionForm: React.FC<{
  onSubmit?: (data: { to: string; amount: string }) => void
}> = ({ onSubmit }) => {
  const [to, setTo] = React.useState("")
  const [amount, setAmount] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ to, amount })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">To Address</label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." required />
          </div>
          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Network Status Component
export const NetworkStatus: React.FC<{
  chainId?: number
  networkName?: string
}> = ({ chainId = 1, networkName = "Ethereum" }) => {
  const getNetworkColor = (id: number) => {
    switch (id) {
      case 1:
        return "bg-blue-500"
      case 137:
        return "bg-purple-500"
      case 56:
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getNetworkColor(chainId)}`} />
      <span className="text-sm font-medium">{networkName}</span>
      <Badge variant="outline">Chain {chainId}</Badge>
    </div>
  )
}

// DeFi Pool Component
export const DeFiPool: React.FC<{
  token0?: string
  token1?: string
  tvl?: string
  apr?: string
}> = ({ token0 = "ETH", token1 = "USDC", tvl = "$0", apr = "0%" }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {token0}/{token1} Pool
          </span>
          <Badge variant="secondary">{apr} APR</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">TVL</span>
            <span className="font-medium">{tvl}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              Add Liquidity
            </Button>
            <Button variant="outline" className="flex-1">
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create namespace export for blockchain components
export const blockchainComponents = {
  ...WalletConnectComponents,
  ...ContractInteractionComponents,
  ...BlockchainProviderComponents,
  TokenBalance,
  TransactionForm,
  NetworkStatus,
  DeFiPool,
}
