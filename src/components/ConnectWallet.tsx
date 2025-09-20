'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/hooks/useWallet'

export function ConnectWallet() {
  const { connectWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      await connectWallet()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="text-center">
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
      >
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </Button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Make sure you have MetaMask installed and switch to Flow EVM Testnet</p>
        <p className="mt-2">
          <a 
            href="https://testnet.flowscan.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Get testnet FLOW tokens here
          </a>
        </p>
      </div>
    </div>
  )
}
