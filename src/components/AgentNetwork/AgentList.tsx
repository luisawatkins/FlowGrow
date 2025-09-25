'use client'

import React from 'react'
import { Agent } from '../../types/agent'
import { AgentCard } from './AgentCard'
import { LoadingSpinner } from '../LoadingSpinner'

interface AgentListProps {
  agents: Agent[]
  isLoading: boolean
  error: string | null
  title?: string
  className?: string
}

export function AgentList({ agents, isLoading, error, title, className = '' }: AgentListProps) {
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium">Error loading agents</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-lg font-medium">No agents found</p>
          <p className="text-sm text-gray-600 mt-1">
            Try adjusting your search criteria to find more agents.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {agents.length} agent{agents.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {agents.length >= 20 && (
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Load More Agents
          </button>
        </div>
      )}
    </div>
  )
}
