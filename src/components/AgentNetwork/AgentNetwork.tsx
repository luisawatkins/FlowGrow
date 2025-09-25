'use client'

import React, { useState } from 'react'
import { useAgentSearch } from '../../hooks/useAgent'
import { AgentSearchFilters, AgentMatchingCriteria } from '../../types/agent'
import { AgentSearch } from './AgentSearch'
import { AgentList } from './AgentList'
import { AgentMatching } from './AgentMatching'
import { BrokerageList } from './BrokerageList'

interface AgentNetworkProps {
  className?: string
}

export function AgentNetwork({ className = '' }: AgentNetworkProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'matching' | 'brokerages'>('search')
  const { agents, isLoading, error, searchAgents, findMatchingAgents, clearSearch } = useAgentSearch()

  const handleSearch = async (filters: AgentSearchFilters) => {
    await searchAgents(filters)
    setActiveTab('search')
  }

  const handleMatching = async (criteria: AgentMatchingCriteria) => {
    await findMatchingAgents(criteria)
    setActiveTab('matching')
  }

  const handleClearSearch = () => {
    clearSearch()
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Agent Network</h2>
        <p className="text-gray-600 mt-1">Connect with verified real estate professionals</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Search Agents
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'matching'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Find My Agent
          </button>
          <button
            onClick={() => setActiveTab('brokerages')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brokerages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Brokerages
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'search' && (
          <div className="space-y-6">
            <AgentSearch onSearch={handleSearch} onClear={handleClearSearch} />
            <AgentList 
              agents={agents} 
              isLoading={isLoading} 
              error={error}
              title="Search Results"
            />
          </div>
        )}

        {activeTab === 'matching' && (
          <div className="space-y-6">
            <AgentMatching onMatch={handleMatching} />
            <AgentList 
              agents={agents} 
              isLoading={isLoading} 
              error={error}
              title="Recommended Agents"
            />
          </div>
        )}

        {activeTab === 'brokerages' && (
          <BrokerageList />
        )}
      </div>
    </div>
  )
}