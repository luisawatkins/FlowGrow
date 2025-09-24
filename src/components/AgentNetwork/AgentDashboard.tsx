import React, { useEffect, useState } from 'react';
import { AgentDashboard as AgentDashboardType } from '@/types/agent';
import { useAgent } from '@/hooks/useAgent';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AgentDashboardProps {
  agentId: string;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agentId }) => {
  const { dashboard, dashboardLoading, loadDashboard } = useAgent();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'clients' | 'leads' | 'commissions' | 'performance'>('overview');

  useEffect(() => {
    if (agentId) {
      loadDashboard(agentId);
    }
  }, [agentId, loadDashboard]);

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard not found</h3>
          <p className="text-gray-500">Unable to load agent dashboard data.</p>
        </div>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'commissions', label: 'Commissions', icon: '💰' },
    { id: 'performance', label: 'Performance', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dashboard.agent.name}</h1>
          <p className="text-gray-600">{dashboard.agent.brokerage}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {dashboard.agent.isVerified ? 'Verified' : 'Unverified'}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {dashboard.agent.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.performance.totalSales}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Volume</p>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(dashboard.performance.totalVolume)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Days on Market</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.performance.averageDaysOnMarket}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Client Satisfaction</p>
                  <p className="text-2xl font-semibold text-gray-900">{dashboard.performance.clientSatisfactionScore}/5</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Upcoming Tasks */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            {dashboard.upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
            ) : (
              <div className="space-y-3">
                {dashboard.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(task.date).toLocaleDateString()} at {new Date(task.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{task.type}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Market Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{dashboard.marketInsights.averageDaysOnMarket}</p>
                <p className="text-sm text-gray-500">Market Avg Days on Market</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-semibold ${
                  dashboard.marketInsights.marketTrend === 'up' ? 'text-green-600' :
                  dashboard.marketInsights.marketTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {dashboard.marketInsights.priceChange > 0 ? '+' : ''}{dashboard.marketInsights.priceChange}%
                </p>
                <p className="text-sm text-gray-500">Price Change</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 capitalize">{dashboard.marketInsights.inventoryLevel}</p>
                <p className="text-sm text-gray-500">Inventory Level</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedTab === 'clients' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Clients</h3>
          {dashboard.activeClients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active clients</p>
          ) : (
            <div className="space-y-4">
              {dashboard.activeClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Client #{client.clientId}</p>
                    <p className="text-sm text-gray-500 capitalize">{client.relationshipType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{client.totalTransactions} transactions</p>
                    <p className="text-sm text-gray-500">{formatCurrency(client.totalVolume)} volume</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {selectedTab === 'leads' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          {dashboard.recentLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent leads</p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{lead.type} Lead</p>
                    <p className="text-sm text-gray-500">{lead.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                      lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {selectedTab === 'commissions' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission History</h3>
          {dashboard.commissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No commission history</p>
          ) : (
            <div className="space-y-4">
              {dashboard.commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Property #{commission.propertyId}</p>
                    <p className="text-sm text-gray-500">{commission.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(commission.amount)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      commission.status === 'paid' ? 'bg-green-100 text-green-800' :
                      commission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      commission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {commission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {selectedTab === 'performance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.performance.totalListings}</p>
                <p className="text-sm text-gray-500">Total Listings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{(dashboard.performance.listToSaleRatio * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-500">List to Sale Ratio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">#{dashboard.performance.ranking}</p>
                <p className="text-sm text-gray-500">Market Ranking</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboard.performance.commissionEarned)}</p>
                <p className="text-sm text-gray-500">Commission Earned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.performance.marketShare.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Market Share</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{dashboard.performance.growthRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Growth Rate</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
