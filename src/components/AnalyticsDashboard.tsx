'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PropertyAnalytics, UserAnalytics, MarketAnalytics } from '@/types'
import { useAnalytics } from '@/hooks/useAnalytics'

interface AnalyticsDashboardProps {
  userId?: string
  isAdmin?: boolean
  className?: string
}

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all'
type ViewType = 'overview' | 'properties' | 'market' | 'users'

export function AnalyticsDashboard({ userId, isAdmin = false, className = '' }: AnalyticsDashboardProps) {
  const {
    propertyAnalytics,
    userAnalytics,
    marketAnalytics,
    isLoading,
    loadAnalytics,
  } = useAnalytics(userId, isAdmin)

  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [viewType, setViewType] = useState<ViewType>('overview')

  useEffect(() => {
    loadAnalytics(timeRange)
  }, [timeRange, loadAnalytics])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      case '1y': return 'Last year'
      case 'all': return 'All time'
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">
              {isAdmin ? 'Platform-wide analytics and insights' : 'Your property performance insights'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'properties', label: 'Properties', icon: '🏠' },
            { id: 'market', label: 'Market', icon: '📈' },
            ...(isAdmin ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewType(tab.id as ViewType)}
              className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                viewType === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {viewType === 'overview' && (
        <OverviewView
          propertyAnalytics={propertyAnalytics}
          userAnalytics={userAnalytics}
          marketAnalytics={marketAnalytics}
          isAdmin={isAdmin}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      )}

      {viewType === 'properties' && (
        <PropertiesView
          propertyAnalytics={propertyAnalytics}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      )}

      {viewType === 'market' && (
        <MarketView
          marketAnalytics={marketAnalytics}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      )}

      {viewType === 'users' && isAdmin && (
        <UsersView
          userAnalytics={userAnalytics}
          formatNumber={formatNumber}
        />
      )}
    </div>
  )
}

// Overview View Component
interface OverviewViewProps {
  propertyAnalytics: PropertyAnalytics
  userAnalytics: UserAnalytics
  marketAnalytics: MarketAnalytics
  isAdmin: boolean
  formatNumber: (num: number) => string
  formatCurrency: (amount: number) => string
}

function OverviewView({
  propertyAnalytics,
  userAnalytics,
  marketAnalytics,
  isAdmin,
  formatNumber,
  formatCurrency,
}: OverviewViewProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(propertyAnalytics.totalProperties)}
                </p>
                <p className="text-sm text-green-600">
                  +{propertyAnalytics.newPropertiesThisMonth} this month
                </p>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(propertyAnalytics.totalViews)}
                </p>
                <p className="text-sm text-green-600">
                  +{propertyAnalytics.viewsGrowth}% vs last month
                </p>
              </div>
              <div className="text-3xl">👁️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(propertyAnalytics.totalSales)}
                </p>
                <p className="text-sm text-green-600">
                  {formatCurrency(propertyAnalytics.totalSalesValue)}
                </p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(userAnalytics.activeUsers)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{userAnalytics.newUsersThisMonth} new this month
                  </p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Views Over Time</CardTitle>
            <CardDescription>Daily view count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propertyAnalytics.topProperties.slice(0, 5).map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-gray-500">{property.views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(property.price)}</p>
                    <p className="text-sm text-green-600">{property.engagement}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Key market trends and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(marketAnalytics.averagePrice)}
              </div>
              <div className="text-sm text-gray-600">Average Property Price</div>
              <div className="text-xs text-green-600">
                +{marketAnalytics.priceGrowth}% vs last month
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {marketAnalytics.averageDaysOnMarket}
              </div>
              <div className="text-sm text-gray-600">Days on Market</div>
              <div className="text-xs text-red-600">
                -{marketAnalytics.daysOnMarketChange}% vs last month
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {marketAnalytics.salesVolume}
              </div>
              <div className="text-sm text-gray-600">Sales Volume</div>
              <div className="text-xs text-green-600">
                +{marketAnalytics.volumeGrowth}% vs last month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Properties View Component
interface PropertiesViewProps {
  propertyAnalytics: PropertyAnalytics
  formatNumber: (num: number) => string
  formatCurrency: (amount: number) => string
}

function PropertiesView({ propertyAnalytics, formatNumber, formatCurrency }: PropertiesViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Detailed analytics for your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Property</th>
                  <th className="text-left py-3 px-4">Views</th>
                  <th className="text-left py-3 px-4">Inquiries</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {propertyAnalytics.topProperties.map((property) => (
                  <tr key={property.id} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatNumber(property.views)}</td>
                    <td className="py-3 px-4">{property.inquiries}</td>
                    <td className="py-3 px-4">{formatCurrency(property.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Market View Component
interface MarketViewProps {
  marketAnalytics: MarketAnalytics
  formatNumber: (num: number) => string
  formatCurrency: (amount: number) => string
}

function MarketView({ marketAnalytics, formatNumber, formatCurrency }: MarketViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
            <CardDescription>Market price movements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📈</div>
                <p>Price trend chart would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Activity</CardTitle>
            <CardDescription>Sales and listing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>Activity chart would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Users View Component (Admin only)
interface UsersViewProps {
  userAnalytics: UserAnalytics
  formatNumber: (num: number) => string
}

function UsersView({ userAnalytics, formatNumber }: UsersViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(userAnalytics.totalUsers)}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(userAnalytics.activeUsers)}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatNumber(userAnalytics.newUsersThisMonth)}
              </div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
