'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useFlow } from '@/hooks/useFlow'

interface FlowTransaction {
  id: string
  hash: string
  fromAddress: string
  toAddress: string
  value: string
  gasUsed: string
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  type: 'mint' | 'list' | 'buy' | 'cancel'
}

interface FlowTransactionTrackerProps {
  transactions: FlowTransaction[]
  onRefresh?: () => void
}

export function FlowTransactionTracker({ transactions, onRefresh }: FlowTransactionTrackerProps) {
  const { getTransactionStatus } = useFlow()
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'mint' | 'list' | 'buy' | 'cancel'>('all')

  const filteredTransactions = transactions.filter(tx => {
    const statusMatch = filter === 'all' || tx.status === filter
    const typeMatch = typeFilter === 'all' || tx.type === typeFilter
    return statusMatch && typeMatch
  })

  const getStatusColor = (status: FlowTransaction['status']) => {
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

  const getTypeColor = (type: FlowTransaction['type']) => {
    switch (type) {
      case 'mint':
        return 'text-blue-600 bg-blue-100'
      case 'list':
        return 'text-purple-600 bg-purple-100'
      case 'buy':
        return 'text-green-600 bg-green-100'
      case 'cancel':
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

  const getFlowScanUrl = (hash: string) => {
    return `https://testnet.flowscan.org/transaction/${hash}`
  }

  const getAccountUrl = (address: string) => {
    return `https://testnet.flowscan.org/account/${address}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Flow Transaction History</CardTitle>
            <CardDescription>
              Track all your Flow blockchain transactions
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
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex space-x-1">
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
          <div className="flex space-x-1">
            {(['all', 'mint', 'list', 'buy', 'cancel'] as const).map((type) => (
              <Button
                key={type}
                onClick={() => setTypeFilter(type)}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
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
                key={tx.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}
                    >
                      {tx.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}
                    >
                      {tx.type}
                    </span>
                    <span className="font-mono text-sm text-gray-600">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>From: 
                      <a
                        href={getAccountUrl(tx.fromAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        {tx.fromAddress.slice(0, 6)}...{tx.fromAddress.slice(-4)}
                      </a>
                    </div>
                    <div>To: 
                      <a
                        href={getAccountUrl(tx.toAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        {tx.toAddress.slice(0, 6)}...{tx.toAddress.slice(-4)}
                      </a>
                    </div>
                    <div>Value: {formatValue(tx.value)}</div>
                    <div>Gas Used: {tx.gasUsed}</div>
                    <div>Time: {formatTimestamp(tx.timestamp)}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getFlowScanUrl(tx.hash), '_blank')}
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
