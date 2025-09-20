'use client'

import { useState, useEffect } from 'react'
import { flowClient } from '@/lib/flowClient'

interface FlowUser {
  addr: string
  loggedIn: boolean
}

interface FlowState {
  user: FlowUser | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export function useFlow() {
  const [state, setState] = useState<FlowState>({
    user: null,
    isConnected: false,
    isLoading: true,
    error: null,
  })

  // Initialize Flow client
  useEffect(() => {
    const initializeFlow = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const user = await flowClient.getCurrentUser()
        
        setState({
          user: user,
          isConnected: user.loggedIn,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          user: null,
          isConnected: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize Flow client',
        })
      }
    }

    initializeFlow()
  }, [])

  // Connect to Flow wallet
  const connect = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await flowClient.authenticate()
      const user = await flowClient.getCurrentUser()
      
      setState({
        user: user,
        isConnected: user.loggedIn,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Flow wallet',
      }))
    }
  }

  // Disconnect from Flow wallet
  const disconnect = async () => {
    try {
      await flowClient.unauthenticate()
      
      setState({
        user: null,
        isConnected: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to disconnect from Flow wallet',
      }))
    }
  }

  // Mint property NFT
  const mintProperty = async (
    name: string,
    description: string,
    physicalAddress: string,
    squareFootage: number,
    price: number,
    imageURL?: string
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const transactionId = await flowClient.mintProperty(
        name,
        description,
        physicalAddress,
        squareFootage,
        price,
        imageURL
      )
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      return {
        success: true,
        transactionId,
        flowScanUrl: flowClient.getFlowScanUrl(transactionId),
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to mint property',
      }))
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint property',
      }
    }
  }

  // List property for sale
  const listProperty = async (propertyID: number, price: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const transactionId = await flowClient.listProperty(propertyID, price)
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      return {
        success: true,
        transactionId,
        flowScanUrl: flowClient.getFlowScanUrl(transactionId),
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to list property',
      }))
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list property',
      }
    }
  }

  // Buy property
  const buyProperty = async (listingID: number, sellerAddress: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const transactionId = await flowClient.buyProperty(listingID, sellerAddress)
      
      setState(prev => ({ ...prev, isLoading: false }))
      
      return {
        success: true,
        transactionId,
        flowScanUrl: flowClient.getFlowScanUrl(transactionId),
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to buy property',
      }))
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to buy property',
      }
    }
  }

  // Get marketplace data
  const getMarketplaceData = async () => {
    try {
      const [totalSupply, activeListings] = await Promise.all([
        flowClient.getTotalSupply(),
        flowClient.getActiveListings(),
      ])
      
      return {
        totalSupply,
        activeListings: activeListings.length,
        listings: activeListings,
      }
    } catch (error) {
      console.error('Failed to get marketplace data:', error)
      return {
        totalSupply: 0,
        activeListings: 0,
        listings: [],
      }
    }
  }

  // Get property details
  const getProperty = async (propertyID: number) => {
    try {
      return await flowClient.getProperty(propertyID)
    } catch (error) {
      console.error('Failed to get property:', error)
      return null
    }
  }

  // Get transaction status
  const getTransactionStatus = async (transactionId: string) => {
    try {
      return await flowClient.getTransactionStatus(transactionId)
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      return 'UNKNOWN'
    }
  }

  return {
    ...state,
    connect,
    disconnect,
    mintProperty,
    listProperty,
    buyProperty,
    getMarketplaceData,
    getProperty,
    getTransactionStatus,
  }
}
