'use client'

import { useState, useEffect } from 'react'
import { ConnectWallet } from '@/components/ConnectWallet'
import { PropertyMintForm } from '@/components/PropertyMintForm'
import { Marketplace } from '@/components/Marketplace'
import { TransactionTracker } from '@/components/TransactionTracker'
import { Header } from '@/components/Header'
import { useWallet } from '@/hooks/useWallet'
import { useTransactions } from '@/hooks/useTransactions'

export default function Home() {
  const { isConnected, address } = useWallet()
  const { transactions, refreshTransactions } = useTransactions()
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint' | 'transactions'>('marketplace')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to FlowEstate 🏠
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Turn real-world properties into tradeable NFTs on the Flow blockchain
            </p>
            <ConnectWallet />
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
                  Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('mint')}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === 'mint'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mint Property
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

            {activeTab === 'marketplace' && <Marketplace />}
            {activeTab === 'mint' && <PropertyMintForm />}
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
