"use client"

import { useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { shortenAddress } from "@/lib/blockchain-utils"

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: balance } = useBalance({ address })
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <ConnectButton />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Wallet Connected</CardTitle>
          <Badge variant="outline" className="font-normal">
            {chain?.name || "Unknown Network"}
          </Badge>
        </div>
        <CardDescription>Manage your wallet connection</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4 text-sm">
          <Wallet className="h-4 w-4 opacity-70" />
          <div className="font-medium">{shortenAddress(address || "")}</div>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={copyAddress}>
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="font-medium">Balance:</div>
          <div>{balance ? `${Number.parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "Loading..."}</div>
        </div>
        <div className="flex justify-end">
          <ConnectButton />
        </div>
      </CardContent>
    </Card>
  )
}
