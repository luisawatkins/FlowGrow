'use client'

import { useState, useEffect } from 'react'
import { flowClient } from '@/lib/flowClient'
import { FlowError, FlowErrorType, createFlowError, getUserFriendlyMessage } from '@/types/errors'
import { withRetry, retryFlowTransaction, retryFlowQuery } from '@/lib/retry'

interface FlowUser {
  addr: string
  loggedIn: boolean
}

interface FlowState {
  user: FlowUser | null
  isConnected: boolean
  isLoading: boolean
  error: FlowError | null
  retryCount: number
  lastOperation: string | null
}

export function useFlow() {
  const [state, setState] = useState<FlowState>({
    user: null,
    isConnected: false,
    isLoading: true,
    error: null,
    retryCount: 0,
    lastOperation: null,
  })

  // Helper function to handle errors consistently
  const handleError = (error: unknown, operation: string, context?: Record<string, any>): FlowError => {
    let flowError: FlowError
    
    if (error instanceof Error && 'type' in error) {
      flowError = error as FlowError
    } else {
      const message = error instanceof Error ? error.message : String(error)
      flowError = createFlowError(
        FlowErrorType.UNKNOWN_ERROR,
        message,
        { context: { operation, ...context } }
      )
    }
    
    setState(prev => ({
      ...prev,
      error: flowError,
      isLoading: false,
      lastOperation: operation,
    }))
    
    return flowError
  }

  // Helper function to clear errors
  const clearError = () => {
    setState(prev => ({ ...prev, error: null, retryCount: 0 }))
  }

  // Initialize Flow client
  useEffect(() => {
    const initializeFlow = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))
        
        const user = await withRetry(
          () => flowClient.getCurrentUser(),
          { maxRetries: 2, retryDelay: 1000 }
        )
        
        setState({
          user: user,
          isConnected: user.loggedIn,
          isLoading: false,
          error: null,
          retryCount: 0,
          lastOperation: null,
        })
      } catch (error) {
        handleError(error, 'initialize', { step: 'getCurrentUser' })
      }
    }

    initializeFlow()
  }, [])

  // Connect to Flow wallet
  const connect = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await withRetry(
        () => flowClient.authenticate(),
        { maxRetries: 3, retryDelay: 1000 }
      )
      
      const user = await withRetry(
        () => flowClient.getCurrentUser(),
        { maxRetries: 2, retryDelay: 500 }
      )
      
      setState({
        user: user,
        isConnected: user.loggedIn,
        isLoading: false,
        error: null,
        retryCount: 0,
        lastOperation: null,
      })
    } catch (error) {
      handleError(error, 'connect', { step: 'authenticate' })
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
        retryCount: 0,
        lastOperation: null,
      })
    } catch (error) {
      handleError(error, 'disconnect', { step: 'unauthenticate' })
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
      setState(prev => ({ ...prev, isLoading: true, error: null, lastOperation: 'mintProperty' }))
      
      const retryManager = retryFlowTransaction()
      const result = await retryManager.execute(() =>
        flowClient.mintProperty(
          name,
          description,
          physicalAddress,
          squareFootage,
          price,
          imageURL
        )
      )
      
      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false, retryCount: 0 }))
        
        return {
          success: true,
          transactionId: result.data,
          flowScanUrl: flowClient.getFlowScanUrl(result.data),
        }
      } else {
        throw result.error
      }
    } catch (error) {
      const flowError = handleError(error, 'mintProperty', {
        name,
        squareFootage,
        price,
        hasImage: !!imageURL
      })
      
      return {
        success: false,
        error: getUserFriendlyMessage(flowError),
        errorType: flowError.type,
        retryable: flowError.retryable,
      }
    }
  }

  // List property for sale
  const listProperty = async (propertyID: number, price: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, lastOperation: 'listProperty' }))
      
      const retryManager = retryFlowTransaction()
      const result = await retryManager.execute(() =>
        flowClient.listProperty(propertyID, price)
      )
      
      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false, retryCount: 0 }))
        
        return {
          success: true,
          transactionId: result.data,
          flowScanUrl: flowClient.getFlowScanUrl(result.data),
        }
      } else {
        throw result.error
      }
    } catch (error) {
      const flowError = handleError(error, 'listProperty', {
        propertyID,
        price
      })
      
      return {
        success: false,
        error: getUserFriendlyMessage(flowError),
        errorType: flowError.type,
        retryable: flowError.retryable,
      }
    }
  }

  // Buy property
  const buyProperty = async (listingID: number, sellerAddress: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, lastOperation: 'buyProperty' }))
      
      const retryManager = retryFlowTransaction()
      const result = await retryManager.execute(() =>
        flowClient.buyProperty(listingID, sellerAddress)
      )
      
      if (result.success) {
        setState(prev => ({ ...prev, isLoading: false, retryCount: 0 }))
        
        return {
          success: true,
          transactionId: result.data,
          flowScanUrl: flowClient.getFlowScanUrl(result.data),
        }
      } else {
        throw result.error
      }
    } catch (error) {
      const flowError = handleError(error, 'buyProperty', {
        listingID,
        sellerAddress
      })
      
      return {
        success: false,
        error: getUserFriendlyMessage(flowError),
        errorType: flowError.type,
        retryable: flowError.retryable,
      }
    }
  }

  // Get marketplace data
  const getMarketplaceData = async () => {
    try {
      const retryManager = retryFlowQuery()
      
      const [totalSupply, activeListings] = await Promise.all([
        retryManager.execute(() => flowClient.getTotalSupply()),
        retryManager.execute(() => flowClient.getActiveListings()),
      ])
      
      return {
        totalSupply: totalSupply.success ? totalSupply.data : 0,
        activeListings: activeListings.success ? activeListings.data.length : 0,
        listings: activeListings.success ? activeListings.data : [],
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
      const retryManager = retryFlowQuery()
      const result = await retryManager.execute(() => flowClient.getProperty(propertyID))
      
      return result.success ? result.data : null
    } catch (error) {
      console.error('Failed to get property:', error)
      return null
    }
  }

  // Get transaction status
  const getTransactionStatus = async (transactionId: string) => {
    try {
      const retryManager = retryFlowQuery()
      const result = await retryManager.execute(() => flowClient.getTransactionStatus(transactionId))
      
      return result.success ? result.data : 'UNKNOWN'
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      return 'UNKNOWN'
    }
  }

  // Retry last failed operation
  const retryLastOperation = async () => {
    if (!state.lastOperation || state.isLoading) {
      return { success: false, error: 'No operation to retry' }
    }

    setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }))
    
    // This would need to be implemented based on the last operation
    // For now, we'll just clear the error and let the user try again
    clearError()
    return { success: true }
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
    retryLastOperation,
    clearError,
  }
}
