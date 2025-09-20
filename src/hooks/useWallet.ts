'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface WalletState {
  isConnected: boolean
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  chainId: number | null
}

const FLOW_EVM_TESTNET = {
  chainId: '0x1f91a3', // 2076538 in hex
  chainName: 'Flow EVM Testnet',
  rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
  blockExplorerUrls: ['https://testnet.flowscan.org'],
  nativeCurrency: {
    name: 'Flow',
    symbol: 'FLOW',
    decimals: 18,
  },
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    chainId: null,
  })

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      
      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      // Check if we're on Flow EVM Testnet
      if (network.chainId !== BigInt(FLOW_EVM_TESTNET.chainId)) {
        await switchToFlowTestnet()
      }

      setWalletState({
        isConnected: true,
        address,
        provider,
        signer,
        chainId: Number(network.chainId),
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const switchToFlowTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [FLOW_EVM_TESTNET],
      })
    } catch (error) {
      console.error('Failed to switch to Flow Testnet:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      chainId: null,
    })
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum === 'undefined') return

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const network = await provider.getNetwork()

          setWalletState({
            isConnected: true,
            address,
            provider,
            signer,
            chainId: Number(network.chainId),
          })
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    checkConnection()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        checkConnection()
      }
    }

    // Listen for chain changes
    const handleChainChanged = () => {
      checkConnection()
    }

    window.ethereum?.on('accountsChanged', handleAccountsChanged)
    window.ethereum?.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  }
}
