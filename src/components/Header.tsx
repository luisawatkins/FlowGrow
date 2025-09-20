'use client'

import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-blue-600">FlowEstate</h1>
            <span className="text-sm text-gray-500">🏠</span>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <Button onClick={disconnectWallet} variant="outline">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
