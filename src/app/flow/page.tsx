'use client'

import { useState } from 'react'
import { FlowConnectWallet } from '@/components/FlowConnectWallet'
import { FlowPropertyMintForm } from '@/components/FlowPropertyMintForm'
import { FlowMarketplace } from '@/components/FlowMarketplace'
import { TransactionTracker } from '@/components/TransactionTracker'
import { Header } from '@/components/Header'
import { useFlow } from '@/hooks/useFlow'
import { useTransactions } from '@/hooks/useTransactions'

export default function FlowPage() {
  const { isConnected } = useFlow()
  const { transactions, refreshTransactions } = useTransactions()
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint' | 'transactions'>('marketplace')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to FlowEstate on Flow Blockchain 🏠
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the power of Flow blockchain with Cadence smart contracts
            </p>
            <FlowConnectWallet />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'marketplace'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Flow Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('mint')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'mint'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mint on Flow
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'transactions'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Transactions
                </button>
              </div>
            </div>

            {activeTab === 'marketplace' && <FlowMarketplace />}
            {activeTab === 'mint' && <FlowPropertyMintForm />}
            {activeTab === 'transactions' && (
              <TransactionTracker 
                transactions={transactions} 
                onRefresh={refreshTransactions}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
