'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'

interface PropertyAnalyticsDashboardProps {
  property: Property
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all'
  onAnalyticsUpdate: (analytics: PropertyAnalytics) => void
  className?: string
}

interface PropertyAnalytics {
  id: string
  propertyId: string
  timeRange: string
  views: ViewAnalytics
  engagement: EngagementAnalytics
  performance: PerformanceAnalytics
  market: MarketAnalytics
  financial: FinancialAnalytics
  demographics: DemographicsAnalytics
  trends: TrendAnalytics
  generatedAt: string
}

interface ViewAnalytics {
  totalViews: number
  uniqueViews: number
  viewsBySource: SourceBreakdown[]
  viewsByDevice: DeviceBreakdown[]
  viewsByLocation: LocationBreakdown[]
  viewsByTime: TimeBreakdown[]
  averageViewDuration: number
  bounceRate: number
}

interface EngagementAnalytics {
  totalInteractions: number
  favorites: number
  shares: number
  inquiries: number
  tourViews: number
  documentDownloads: number
  interactionRate: number
  engagementScore: number
}

interface PerformanceAnalytics {
  searchRanking: number
  clickThroughRate: number
  conversionRate: number
  averageTimeOnPage: number
  pageLoadSpeed: number
  mobilePerformance: number
  seoScore: number
  accessibilityScore: number
}

interface MarketAnalytics {
  marketPosition: number
  priceCompetitiveness: number
  daysOnMarket: number
  priceChanges: PriceChange[]
  comparableProperties: ComparableProperty[]
  marketTrend: 'rising' | 'falling' | 'stable'
  demandLevel: 'high' | 'medium' | 'low'
}

interface FinancialAnalytics {
  estimatedValue: number
  valueGrowth: number
  rentalYield: number
  capRate: number
  roi: number
  cashFlow: number
  appreciation: number
  totalReturn: number
}

interface DemographicsAnalytics {
  ageGroups: AgeGroup[]
  incomeLevels: IncomeLevel[]
  interests: Interest[]
  locations: DemographicsLocation[]
  buyerPersonas: BuyerPersona[]
}

interface TrendAnalytics {
  viewsTrend: TrendData[]
  priceTrend: TrendData[]
  interestTrend: TrendData[]
  marketTrend: TrendData[]
  seasonalPatterns: SeasonalPattern[]
  peakTimes: PeakTime[]
}

interface SourceBreakdown {
  source: string
  views: number
  percentage: number
  conversionRate: number
}

interface DeviceBreakdown {
  device: string
  views: number
  percentage: number
  averageDuration: number
}

interface LocationBreakdown {
  location: string
  views: number
  percentage: number
  conversionRate: number
}

interface TimeBreakdown {
  time: string
  views: number
  percentage: number
}

interface PriceChange {
  date: string
  oldPrice: number
  newPrice: number
  change: number
  reason: string
}

interface ComparableProperty {
  id: string
  address: string
  price: number
  similarity: number
  daysOnMarket: number
  status: 'active' | 'sold' | 'pending'
}

interface AgeGroup {
  range: string
  percentage: number
  averageIncome: number
}

interface IncomeLevel {
  range: string
  percentage: number
  averageAge: number
}

interface Interest {
  category: string
  percentage: number
  engagement: number
}

interface DemographicsLocation {
  location: string
  percentage: number
  averageIncome: number
}

interface BuyerPersona {
  name: string
  description: string
  percentage: number
  characteristics: string[]
}

interface TrendData {
  date: string
  value: number
  change: number
}

interface SeasonalPattern {
  season: string
  averageViews: number
  averagePrice: number
  trend: 'up' | 'down' | 'stable'
}

interface PeakTime {
  time: string
  views: number
  engagement: number
}

export function PropertyAnalyticsDashboard({
  property,
  timeRange,
  onAnalyticsUpdate,
  className = ''
}: PropertyAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'engagement' | 'performance' | 'market' | 'financial' | 'demographics' | 'trends'>('overview')

  // Mock analytics data
  useEffect(() => {
    const generateMockAnalytics = (): PropertyAnalytics => ({
      id: '1',
      propertyId: property.id,
      timeRange,
      views: {
        totalViews: 1247,
        uniqueViews: 892,
        viewsBySource: [
          { source: 'Search', views: 456, percentage: 36.6, conversionRate: 0.12 },
          { source: 'Social Media', views: 234, percentage: 18.8, conversionRate: 0.08 },
          { source: 'Direct', views: 189, percentage: 15.2, conversionRate: 0.15 },
          { source: 'Referral', views: 156, percentage: 12.5, conversionRate: 0.10 },
          { source: 'Email', views: 123, percentage: 9.9, conversionRate: 0.18 },
          { source: 'Other', views: 89, percentage: 7.1, conversionRate: 0.06 }
        ],
        viewsByDevice: [
          { device: 'Desktop', views: 567, percentage: 45.5, averageDuration: 180 },
          { device: 'Mobile', views: 456, percentage: 36.6, averageDuration: 120 },
          { device: 'Tablet', views: 224, percentage: 18.0, averageDuration: 150 }
        ],
        viewsByLocation: [
          { location: 'Local', views: 456, percentage: 36.6, conversionRate: 0.15 },
          { location: 'National', views: 389, percentage: 31.2, conversionRate: 0.08 },
          { location: 'International', views: 402, percentage: 32.2, conversionRate: 0.05 }
        ],
        viewsByTime: [
          { time: 'Morning (6-12)', views: 234, percentage: 18.8 },
          { time: 'Afternoon (12-18)', views: 456, percentage: 36.6 },
          { time: 'Evening (18-24)', views: 389, percentage: 31.2 },
          { time: 'Night (0-6)', views: 168, percentage: 13.5 }
        ],
        averageViewDuration: 142,
        bounceRate: 0.34
      },
      engagement: {
        totalInteractions: 234,
        favorites: 45,
        shares: 23,
        inquiries: 12,
        tourViews: 67,
        documentDownloads: 34,
        interactionRate: 0.19,
        engagementScore: 7.8
      },
      performance: {
        searchRanking: 3,
        clickThroughRate: 0.08,
        conversionRate: 0.12,
        averageTimeOnPage: 142,
        pageLoadSpeed: 2.3,
        mobilePerformance: 85,
        seoScore: 92,
        accessibilityScore: 88
      },
      market: {
        marketPosition: 2,
        priceCompetitiveness: 0.85,
        daysOnMarket: 23,
        priceChanges: [
          { date: '2024-01-15', oldPrice: 300000, newPrice: 295000, change: -5000, reason: 'Market adjustment' },
          { date: '2024-01-01', oldPrice: 310000, newPrice: 300000, change: -10000, reason: 'Initial pricing' }
        ],
        comparableProperties: [
          { id: '1', address: '123 Oak St', price: 285000, similarity: 0.92, daysOnMarket: 18, status: 'sold' },
          { id: '2', address: '456 Pine Ave', price: 305000, similarity: 0.88, daysOnMarket: 31, status: 'active' },
          { id: '3', address: '789 Maple Rd', price: 290000, similarity: 0.85, daysOnMarket: 12, status: 'pending' }
        ],
        marketTrend: 'rising',
        demandLevel: 'high'
      },
      financial: {
        estimatedValue: 295000,
        valueGrowth: 0.05,
        rentalYield: 0.06,
        capRate: 0.055,
        roi: 0.12,
        cashFlow: 1200,
        appreciation: 0.04,
        totalReturn: 0.16
      },
      demographics: {
        ageGroups: [
          { range: '25-34', percentage: 35, averageIncome: 65000 },
          { range: '35-44', percentage: 28, averageIncome: 78000 },
          { range: '45-54', percentage: 22, averageIncome: 85000 },
          { range: '55+', percentage: 15, averageIncome: 72000 }
        ],
        incomeLevels: [
          { range: '$50k-$75k', percentage: 32, averageAge: 38 },
          { range: '$75k-$100k', percentage: 28, averageAge: 42 },
          { range: '$100k+', percentage: 25, averageAge: 45 },
          { range: 'Under $50k', percentage: 15, averageAge: 35 }
        ],
        interests: [
          { category: 'Real Estate', percentage: 45, engagement: 0.8 },
          { category: 'Investment', percentage: 32, engagement: 0.7 },
          { category: 'Home Improvement', percentage: 28, engagement: 0.6 },
          { category: 'Lifestyle', percentage: 22, engagement: 0.5 }
        ],
        locations: [
          { location: 'Local Area', percentage: 40, averageIncome: 72000 },
          { location: 'Metro Area', percentage: 35, averageIncome: 68000 },
          { location: 'Out of State', percentage: 25, averageIncome: 75000 }
        ],
        buyerPersonas: [
          { name: 'First-time Buyer', description: 'Young professionals looking for starter home', percentage: 35, characteristics: ['Budget-conscious', 'Location-focused', 'Modern amenities'] },
          { name: 'Investor', description: 'Real estate investors seeking rental properties', percentage: 28, characteristics: ['ROI-focused', 'Market analysis', 'Long-term view'] },
          { name: 'Upgrader', description: 'Families looking to upgrade from current home', percentage: 22, characteristics: ['Space needs', 'School district', 'Lifestyle fit'] },
          { name: 'Downsizer', description: 'Empty nesters looking to downsize', percentage: 15, characteristics: ['Low maintenance', 'Accessibility', 'Location convenience'] }
        ]
      },
      trends: {
        viewsTrend: [
          { date: '2024-01-01', value: 45, change: 0.05 },
          { date: '2024-01-02', value: 52, change: 0.16 },
          { date: '2024-01-03', value: 38, change: -0.27 },
          { date: '2024-01-04', value: 61, change: 0.61 },
          { date: '2024-01-05', value: 48, change: -0.21 }
        ],
        priceTrend: [
          { date: '2024-01-01', value: 300000, change: 0 },
          { date: '2024-01-02', value: 300000, change: 0 },
          { date: '2024-01-03', value: 300000, change: 0 },
          { date: '2024-01-04', value: 295000, change: -0.017 },
          { date: '2024-01-05', value: 295000, change: 0 }
        ],
        interestTrend: [
          { date: '2024-01-01', value: 12, change: 0.2 },
          { date: '2024-01-02', value: 15, change: 0.25 },
          { date: '2024-01-03', value: 11, change: -0.27 },
          { date: '2024-01-04', value: 18, change: 0.64 },
          { date: '2024-01-05', value: 14, change: -0.22 }
        ],
        marketTrend: [
          { date: '2024-01-01', value: 0.05, change: 0.02 },
          { date: '2024-01-02', value: 0.06, change: 0.2 },
          { date: '2024-01-03', value: 0.04, change: -0.33 },
          { date: '2024-01-04', value: 0.07, change: 0.75 },
          { date: '2024-01-05', value: 0.05, change: -0.29 }
        ],
        seasonalPatterns: [
          { season: 'Spring', averageViews: 45, averagePrice: 295000, trend: 'up' },
          { season: 'Summer', averageViews: 52, averagePrice: 300000, trend: 'up' },
          { season: 'Fall', averageViews: 38, averagePrice: 290000, trend: 'down' },
          { season: 'Winter', averageViews: 31, averagePrice: 285000, trend: 'down' }
        ],
        peakTimes: [
          { time: 'Tuesday 2-4 PM', views: 67, engagement: 0.8 },
          { time: 'Saturday 10-12 PM', views: 58, engagement: 0.7 },
          { time: 'Wednesday 6-8 PM', views: 52, engagement: 0.6 }
        ]
      },
      generatedAt: new Date().toISOString()
    })

    setIsLoading(true)
    setTimeout(() => {
      const mockAnalytics = generateMockAnalytics()
      setAnalytics(mockAnalytics)
      onAnalyticsUpdate(mockAnalytics)
      setIsLoading(false)
    }, 1000)
  }, [property.id, timeRange, onAnalyticsUpdate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈'
      case 'falling': return '📉'
      case 'stable': return '➡️'
      default: return '➡️'
    }
  }

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Property Analytics Dashboard</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) return null

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Property Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Comprehensive analytics and performance insights for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: '1y', label: '1 Year' },
            { id: 'all', label: 'All Time' }
          ].map(range => (
            <Button
              key={range.id}
              variant={timeRange === range.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('overview')}
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'views', label: 'Views', icon: '👁️' },
            { id: 'engagement', label: 'Engagement', icon: '💬' },
            { id: 'performance', label: 'Performance', icon: '⚡' },
            { id: 'market', label: 'Market', icon: '📈' },
            { id: 'financial', label: 'Financial', icon: '💰' },
            { id: 'demographics', label: 'Demographics', icon: '👥' },
            { id: 'trends', label: 'Trends', icon: '📉' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Views</div>
                <div className="text-2xl font-bold text-blue-800">{analytics.views.totalViews.toLocaleString()}</div>
                <div className="text-sm text-blue-600">{analytics.views.uniqueViews} unique</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Engagement Score</div>
                <div className="text-2xl font-bold text-green-800">{analytics.engagement.engagementScore}/10</div>
                <div className="text-sm text-green-600">{formatPercentage(analytics.engagement.interactionRate)} interaction rate</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Market Position</div>
                <div className="text-2xl font-bold text-purple-800">#{analytics.market.marketPosition}</div>
                <div className="text-sm text-purple-600">{analytics.market.daysOnMarket} days on market</div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Estimated Value</div>
                <div className="text-2xl font-bold text-orange-800">{formatCurrency(analytics.financial.estimatedValue)}</div>
                <div className="text-sm text-orange-600">{formatPercentage(analytics.financial.valueGrowth)} growth</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Traffic Sources</h3>
                <div className="space-y-2">
                  {analytics.views.viewsBySource.slice(0, 5).map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-gray-600">{source.views} views</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatPercentage(source.percentage / 100)}</div>
                        <div className="text-sm text-gray-600">{formatPercentage(source.conversionRate)} conversion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Favorites</span>
                    <span className="font-semibold">{analytics.engagement.favorites}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Shares</span>
                    <span className="font-semibold">{analytics.engagement.shares}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Inquiries</span>
                    <span className="font-semibold">{analytics.engagement.inquiries}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Tour Views</span>
                    <span className="font-semibold">{analytics.engagement.tourViews}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Views Tab */}
        {activeTab === 'views' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Views</div>
                <div className="text-2xl font-bold text-blue-800">{analytics.views.totalViews.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Unique Views</div>
                <div className="text-2xl font-bold text-green-800">{analytics.views.uniqueViews.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Avg. Duration</div>
                <div className="text-2xl font-bold text-purple-800">{analytics.views.averageViewDuration}s</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Views by Device</h3>
                <div className="space-y-2">
                  {analytics.views.viewsByDevice.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{device.device}</div>
                        <div className="text-sm text-gray-600">{device.averageDuration}s avg duration</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{device.views}</div>
                        <div className="text-sm text-gray-600">{formatPercentage(device.percentage / 100)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Views by Time</h3>
                <div className="space-y-2">
                  {analytics.views.viewsByTime.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="font-medium">{time.time}</div>
                      <div className="text-right">
                        <div className="font-semibold">{time.views}</div>
                        <div className="text-sm text-gray-600">{formatPercentage(time.percentage / 100)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Market Position</div>
                <div className="text-2xl font-bold text-blue-800">#{analytics.market.marketPosition}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Price Competitiveness</div>
                <div className="text-2xl font-bold text-green-800">{formatPercentage(analytics.market.priceCompetitiveness)}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Days on Market</div>
                <div className="text-2xl font-bold text-purple-800">{analytics.market.daysOnMarket}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Comparable Properties</h3>
              <div className="space-y-3">
                {analytics.market.comparableProperties.map((comp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{comp.address}</h4>
                        <p className="text-sm text-gray-600">
                          {comp.daysOnMarket} days • {Math.round(comp.similarity * 100)}% similar
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(comp.price)}</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          comp.status === 'sold' ? 'bg-green-100 text-green-800' :
                          comp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {comp.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Buyer Personas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.demographics.buyerPersonas.map((persona, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{persona.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{persona.description}</p>
                    <div className="text-sm font-medium text-blue-600 mb-2">
                      {formatPercentage(persona.percentage / 100)} of visitors
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.characteristics.map((char, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Age Groups</h3>
                <div className="space-y-2">
                  {analytics.demographics.ageGroups.map((age, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{age.range}</div>
                        <div className="text-sm text-gray-600">Avg income: {formatCurrency(age.averageIncome)}</div>
                      </div>
                      <div className="font-semibold">{formatPercentage(age.percentage / 100)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Income Levels</h3>
                <div className="space-y-2">
                  {analytics.demographics.incomeLevels.map((income, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{income.range}</div>
                        <div className="text-sm text-gray-600">Avg age: {income.averageAge}</div>
                      </div>
                      <div className="font-semibold">{formatPercentage(income.percentage / 100)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Estimated Value</div>
                <div className="text-2xl font-bold text-blue-800">{formatCurrency(analytics.financial.estimatedValue)}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">ROI</div>
                <div className="text-2xl font-bold text-green-800">{formatPercentage(analytics.financial.roi)}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Cap Rate</div>
                <div className="text-2xl font-bold text-purple-800">{formatPercentage(analytics.financial.capRate)}</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Cash Flow</div>
                <div className="text-2xl font-bold text-orange-800">{formatCurrency(analytics.financial.cashFlow)}/month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Rental Yield</span>
                    <span className="font-semibold">{formatPercentage(analytics.financial.rentalYield)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Appreciation</span>
                    <span className="font-semibold">{formatPercentage(analytics.financial.appreciation)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Total Return</span>
                    <span className="font-semibold">{formatPercentage(analytics.financial.totalReturn)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Value Growth</h3>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Annual Growth</div>
                  <div className="text-2xl font-bold text-green-800">{formatPercentage(analytics.financial.valueGrowth)}</div>
                  <div className="text-sm text-green-600">Based on market trends</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
