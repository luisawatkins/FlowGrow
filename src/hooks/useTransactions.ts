'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/types'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  // Mock transactions for demonstration
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        value: '150.50',
        gasUsed: '21000',
        status: 'success',
        timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x0987654321098765432109876543210987654321',
        to: '0x1234567890123456789012345678901234567890',
        value: '300.75',
        gasUsed: '25000',
        status: 'pending',
        timestamp: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
      },
      {
        hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        from: '0xabcdef1234567890abcdef1234567890abcdef12',
        to: '0x1234567890123456789012345678901234567890',
        value: '500.00',
        gasUsed: '30000',
        status: 'failed',
        timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      },
    ]

    setTransactions(mockTransactions)
  }, [])

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }

  const updateTransactionStatus = (hash: string, status: Transaction['status']) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.hash === hash ? { ...tx, status } : tx
      )
    )
  }

  const refreshTransactions = async () => {
    setLoading(true)
    try {
      // TODO: Fetch actual transactions from blockchain
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } catch (error) {
      console.error('Failed to refresh transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    transactions,
    loading,
    addTransaction,
    updateTransactionStatus,
    refreshTransactions,
  }
}
