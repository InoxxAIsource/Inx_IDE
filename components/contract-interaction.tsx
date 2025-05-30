"use client"

import type React from "react"

import { useState } from "react"
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import { parseEther } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ContractInteractionProps {
  contractAddress: string
  contractAbi: any[]
  readFunctionName?: string
  writeFunctionName?: string
}

export function ContractInteraction({
  contractAddress,
  contractAbi,
  readFunctionName = "balanceOf",
  writeFunctionName = "transfer",
}: ContractInteractionProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  // Read contract data
  const {
    data: readData,
    isLoading: isReadLoading,
    refetch,
  } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: readFunctionName,
    args: [],
  })

  // Write to contract
  const {
    data: writeData,
    isLoading: isWriteLoading,
    write,
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: writeFunctionName,
  })

  // Wait for transaction
  const { isLoading: isTransactionLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess: () => {
      refetch()
      setRecipient("")
      setAmount("")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    try {
      write({
        args: [recipient, parseEther(amount)],
      })
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  const isLoading = isWriteLoading || isTransactionLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Interaction</CardTitle>
        <CardDescription>
          Interact with smart contract at {contractAddress.substring(0, 6)}...
          {contractAddress.substring(contractAddress.length - 4)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Contract Data</Label>
          <div className="rounded-md bg-muted p-3">
            {isReadLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading data...</span>
              </div>
            ) : (
              <pre className="text-sm overflow-auto">{JSON.stringify(readData, null, 2)}</pre>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading || !recipient || !amount}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Send Transaction"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => refetch()}>
          Refresh Data
        </Button>
        {writeData?.hash && (
          <a
            href={`https://etherscan.io/tx/${writeData.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View Transaction
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
