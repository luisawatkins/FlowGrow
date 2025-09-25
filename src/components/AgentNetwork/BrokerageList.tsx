'use client'

import React, { useState, useEffect } from 'react'
import { Brokerage } from '../../types/agent'
import { useBrokerage } from '../../hooks/useAgent'
import { LoadingSpinner } from '../LoadingSpinner'

export function BrokerageList() {
  const [brokerages, setBrokerages] = useState<Brokerage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrokerage, setSelectedBrokerage] = useState<Brokerage | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockBrokerages: Brokerage[] = [
      {
        id: '1',
        name: 'Premier Realty Group',
        description: 'Leading luxury real estate brokerage with over 20 years of experience in high-end properties.',
        logo: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=PRG',
        website: 'https://premierrealty.com',
        phone: '(555) 123-4567',
        email: 'info@premierrealty.com',
        address: {
          street: '123 Main Street',
          city: 'Beverly Hills',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        licenseNumber: 'BRE-123456',
        licenseState: 'CA',
        isVerified: true,
        isActive: true,
        agents: [],
        stats: {
          totalAgents: 45,
          totalSales: 234,
          totalSalesValue: 125000000,
          averageAgentRating: 4.8,
          marketShare: 15.2,
          activeListings: 89,
          pendingSales: 23,
        },
        createdAt: '2020-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        name: 'Metro Properties',
        description: 'Full-service real estate brokerage specializing in urban and suburban properties.',
        logo: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=MP',
        website: 'https://metroproperties.com',
        phone: '(555) 987-6543',
        email: 'contact@metroproperties.com',
        address: {
          street: '456 Business Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90028',
          country: 'USA',
        },
        licenseNumber: 'BRE-789012',
        licenseState: 'CA',
        isVerified: true,
        isActive: true,
        agents: [],
        stats: {
          totalAgents: 32,
          totalSales: 189,
          totalSalesValue: 89000000,
          averageAgentRating: 4.6,
          marketShare: 12.8,
          activeListings: 67,
          pendingSales: 18,
        },
        createdAt: '2018-06-20T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '3',
        name: 'Coastal Real Estate',
        description: 'Specializing in beachfront and coastal properties with expert local knowledge.',
        logo: 'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=CRE',
        website: 'https://coastalrealestate.com',
        phone: '(555) 456-7890',
        email: 'hello@coastalrealestate.com',
        address: {
          street: '789 Ocean Drive',
          city: 'Malibu',
          state: 'CA',
          zipCode: '90265',
          country: 'USA',
        },
        licenseNumber: 'BRE-345678',
        licenseState: 'CA',
        isVerified: true,
        isActive: true,
        agents: [],
        stats: {
          totalAgents: 28,
          totalSales: 156,
          totalSalesValue: 145000000,
          averageAgentRating: 4.9,
          marketShare: 18.5,
          activeListings: 45,
          pendingSales: 12,
        },
        createdAt: '2019-03-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
    ]

    // Simulate loading
    setTimeout(() => {
      setBrokerages(mockBrokerages)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredBrokerages = brokerages.filter(brokerage =>
    brokerage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brokerage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brokerage.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium">Error loading brokerages</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search brokerages by name, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Brokerage List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrokerages.map((brokerage) => (
          <div
            key={brokerage.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedBrokerage(brokerage)}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={brokerage.logo}
                  alt={brokerage.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {brokerage.name}
                    </h3>
                    {brokerage.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {brokerage.address.city}, {brokerage.address.state}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {brokerage.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {brokerage.stats.totalAgents}
                  </div>
                  <div className="text-xs text-gray-600">Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {brokerage.stats.totalSales}
                  </div>
                  <div className="text-xs text-gray-600">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${(brokerage.stats.totalSalesValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-600">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {brokerage.stats.averageAgentRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600">
                {brokerage.phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{brokerage.phone}</span>
                  </div>
                )}
                {brokerage.email && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{brokerage.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  View Details
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBrokerages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-lg font-medium">No brokerages found</p>
            <p className="text-sm text-gray-600 mt-1">
              Try adjusting your search terms to find more brokerages.
            </p>
          </div>
        </div>
      )}

      {/* Brokerage Detail Modal */}
      {selectedBrokerage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedBrokerage.logo}
                    alt={selectedBrokerage.name}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-white"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBrokerage.name}</h2>
                    <p className="text-blue-100">
                      {selectedBrokerage.address.city}, {selectedBrokerage.address.state}
                    </p>
                    {selectedBrokerage.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        Verified Brokerage
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBrokerage(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedBrokerage.description}</p>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedBrokerage.stats.totalAgents}</div>
                      <div className="text-sm text-gray-600">Total Agents</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedBrokerage.stats.totalSales}</div>
                      <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        ${(selectedBrokerage.stats.totalSalesValue / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600">Sales Volume</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedBrokerage.stats.averageAgentRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">
                        {selectedBrokerage.address.street}, {selectedBrokerage.address.city}, {selectedBrokerage.address.state} {selectedBrokerage.address.zipCode}
                      </span>
                    </div>
                    
                    {selectedBrokerage.phone && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{selectedBrokerage.phone}</span>
                      </div>
                    )}
                    
                    {selectedBrokerage.email && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">{selectedBrokerage.email}</span>
                      </div>
                    )}
                    
                    {selectedBrokerage.website && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        <a href={selectedBrokerage.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {selectedBrokerage.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">License Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">License Number</div>
                        <div className="text-sm text-gray-600">{selectedBrokerage.licenseNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">State</div>
                        <div className="text-sm text-gray-600">{selectedBrokerage.licenseState}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  View Agents
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Contact Brokerage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
