'use client'

import React, { useState } from 'react'
import { Commission } from '../../types/agent'
import { CommissionCalculator, CommissionCalculation } from '../../lib/commissionCalculator'

interface CommissionTrackerProps {
  agentId: string
  className?: string
}

export function CommissionTracker({ agentId, className = '' }: CommissionTrackerProps) {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorInputs, setCalculatorInputs] = useState({
    propertyValue: '',
    agentRate: '3.0',
    brokerageRate: '3.0',
  })

  // Mock data for demonstration
  React.useEffect(() => {
    const mockCommissions: Commission[] = [
      {
        id: '1',
        agentId,
        propertyId: 'prop_123',
        transactionId: 'txn_456',
        amount: 15000,
        percentage: 0.03,
        status: 'paid',
        dueDate: '2024-01-15T00:00:00Z',
        paidDate: '2024-01-10T00:00:00Z',
        notes: 'Luxury condo sale in Beverly Hills',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
      {
        id: '2',
        agentId,
        propertyId: 'prop_789',
        transactionId: 'txn_101',
        amount: 12000,
        percentage: 0.025,
        status: 'pending',
        dueDate: '2024-02-15T00:00:00Z',
        notes: 'Single family home in Santa Monica',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '3',
        agentId,
        propertyId: 'prop_456',
        transactionId: 'txn_202',
        amount: 8500,
        percentage: 0.025,
        status: 'approved',
        dueDate: '2024-02-01T00:00:00Z',
        notes: 'Townhouse in West Hollywood',
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-25T00:00:00Z',
      },
    ]
    setCommissions(mockCommissions)
  }, [agentId])

  const calculateCommission = () => {
    const propertyValue = parseFloat(calculatorInputs.propertyValue)
    const agentRate = parseFloat(calculatorInputs.agentRate) / 100
    const brokerageRate = parseFloat(calculatorInputs.brokerageRate) / 100

    if (propertyValue && agentRate && brokerageRate) {
      return CommissionCalculator.calculateCommissionWithAgentRate(
        propertyValue,
        agentRate,
        brokerageRate
      )
    }
    return null
  }

  const commissionCalculation = calculateCommission()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'disputed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'disputed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0)
  const pendingCommission = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
  const paidCommission = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Commission Tracker</h2>
            <p className="text-gray-600 mt-1">Track and manage your commission payments</p>
          </div>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </button>
        </div>
      </div>

      {/* Commission Calculator */}
      {showCalculator && (
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Value ($)</label>
              <input
                type="number"
                placeholder="e.g., 500000"
                value={calculatorInputs.propertyValue}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, propertyValue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent Rate (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="3.0"
                value={calculatorInputs.agentRate}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, agentRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage Rate (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="3.0"
                value={calculatorInputs.brokerageRate}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, brokerageRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {commissionCalculation && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Calculation Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${commissionCalculation.agentCommission.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Agent Commission</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${commissionCalculation.brokerageCommission.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Brokerage Commission</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${commissionCalculation.totalCommission.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Commission</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {((commissionCalculation.agentPercentage + commissionCalculation.brokeragePercentage) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Total Rate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">${totalCommission.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Commission</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">${pendingCommission.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${paidCommission.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
        </div>
      </div>

      {/* Commission List */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Commission History</h3>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="disputed">Disputed</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Add Commission
            </button>
          </div>
        </div>

        {commissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p className="text-lg font-medium">No commissions yet</p>
              <p className="text-sm text-gray-600 mt-1">Commissions will appear here after property sales</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {commissions.map((commission) => (
              <div key={commission.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Property Sale</h4>
                      <p className="text-xs text-gray-600">Property ID: {commission.propertyId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="ml-1 capitalize">{commission.status}</span>
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${commission.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {(commission.percentage * 100).toFixed(1)}% commission
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Due Date</div>
                    <div className="font-medium">{new Date(commission.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Created</div>
                    <div className="font-medium">{new Date(commission.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transaction</div>
                    <div className="font-medium font-mono text-xs">{commission.transactionId.slice(0, 8)}...</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Paid Date</div>
                    <div className="font-medium">
                      {commission.paidDate ? new Date(commission.paidDate).toLocaleDateString() : 'Not paid'}
                    </div>
                  </div>
                </div>

                {commission.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-700">{commission.notes}</div>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    View Details
                  </button>
                  {commission.status === 'pending' && (
                    <button className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}