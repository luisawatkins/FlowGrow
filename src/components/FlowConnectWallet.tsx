'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { useFlow } from '@/hooks/useFlow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function FlowConnectWallet() {
  const { user, isConnected, isLoading, error, connect, disconnect } = useFlow()

  const handleConnect = async () => {
    await connect()
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Connecting to Flow...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 text-sm mb-2">Connection Error</div>
            <p className="text-xs text-gray-600 mb-4">{error}</p>
            <Button onClick={handleConnect} size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConnected && user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Flow Wallet Connected</CardTitle>
          <CardDescription>
            Connected to Flow blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">Address:</span>
              <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                {user.addr}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Disconnect
            </Button>
            <Button
              onClick={() => window.open(`https://testnet.flowscan.org/account/${user.addr}`, '_blank')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              View on FlowScan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Connect Flow Wallet</CardTitle>
        <CardDescription>
          Connect your Flow wallet to start trading property NFTs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleConnect} className="w-full">
          Connect Flow Wallet
        </Button>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Supported wallets:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Flow Wallet</li>
            <li>Blocto</li>
            <li>Ledger</li>
            <li>Dapper Wallet</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
