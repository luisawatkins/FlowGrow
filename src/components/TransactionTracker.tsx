'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getFlowExplorerUrl } from '@/lib/contracts'
import { Transaction } from '@/types'

interface TransactionTrackerProps {
  transactions: Transaction[]
  onRefresh?: () => void
}

export function TransactionTracker({ transactions, onRefresh }: TransactionTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all')

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.status === filter
  )

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatValue = (value: string) => {
    return `${parseFloat(value).toFixed(4)} FLOW`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Track all your property transactions on Flow blockchain
            </CardDescription>
          </div>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter buttons */}
        <div className="flex space-x-2 mb-4">
          {(['all', 'pending', 'success', 'failed'] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Transaction list */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}
                    >
                      {tx.status}
                    </span>
                    <span className="font-mono text-sm text-gray-600">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}</div>
                    <div>To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</div>
                    <div>Value: {formatValue(tx.value)}</div>
                    <div>Gas Used: {tx.gasUsed}</div>
                    <div>Time: {formatTimestamp(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getFlowExplorerUrl(tx.hash), '_blank')}
                  >
                    View on FlowScan
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
