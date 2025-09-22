'use client'

import { useState, useEffect, useCallback } from 'react'
import { PropertyAnalytics, UserAnalytics, MarketAnalytics } from '@/types'

interface AnalyticsState {
  propertyAnalytics: PropertyAnalytics
  userAnalytics: UserAnalytics
  marketAnalytics: MarketAnalytics
  isLoading: boolean
  error: string | null
}

const DEFAULT_PROPERTY_ANALYTICS: PropertyAnalytics = {
  totalProperties: 0,
  totalViews: 0,
  totalSales: 0,
  totalSalesValue: 0,
  newPropertiesThisMonth: 0,
  viewsGrowth: 0,
  topProperties: [],
  averagePrice: 0,
  averageDaysOnMarket: 0,
  conversionRate: 0,
}

const DEFAULT_USER_ANALYTICS: UserAnalytics = {
  totalUsers: 0,
  activeUsers: 0,
  newUsersThisMonth: 0,
  userGrowth: 0,
  averageSessionDuration: 0,
  topUsers: [],
  userEngagement: 0,
}

const DEFAULT_MARKET_ANALYTICS: MarketAnalytics = {
  averagePrice: 0,
  priceGrowth: 0,
  averageDaysOnMarket: 0,
  daysOnMarketChange: 0,
  salesVolume: 0,
  volumeGrowth: 0,
  marketTrends: [],
  popularLocations: [],
  priceRanges: [],
}

export function useAnalytics(userId?: string, isAdmin: boolean = false) {
  const [state, setState] = useState<AnalyticsState>({
    propertyAnalytics: DEFAULT_PROPERTY_ANALYTICS,
    userAnalytics: DEFAULT_USER_ANALYTICS,
    marketAnalytics: DEFAULT_MARKET_ANALYTICS,
    isLoading: true,
    error: null,
  })

  // Load analytics data
  const loadAnalytics = useCallback(async (timeRange: string = '30d') => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // In a real app, this would fetch from your backend
      const mockPropertyAnalytics: PropertyAnalytics = {
        totalProperties: 156,
        totalViews: 12450,
        totalSales: 23,
        totalSalesValue: 12500000,
        newPropertiesThisMonth: 12,
        viewsGrowth: 15.3,
        topProperties: [
          {
            id: 'prop_1',
            name: 'Downtown Luxury Apartment',
            location: 'New York, NY',
            views: 1250,
            inquiries: 45,
            price: 850000,
            status: 'active',
            engagement: 3.6,
          },
          {
            id: 'prop_2',
            name: 'Beach House Villa',
            location: 'Miami, FL',
            views: 980,
            inquiries: 32,
            price: 1200000,
            status: 'active',
            engagement: 3.3,
          },
          {
            id: 'prop_3',
            name: 'Mountain Cabin Retreat',
            location: 'Aspen, CO',
            views: 750,
            inquiries: 28,
            price: 650000,
            status: 'sold',
            engagement: 3.7,
          },
          {
            id: 'prop_4',
            name: 'Urban Loft Space',
            location: 'San Francisco, CA',
            views: 680,
            inquiries: 25,
            price: 950000,
            status: 'active',
            engagement: 3.7,
          },
          {
            id: 'prop_5',
            name: 'Suburban Family Home',
            location: 'Austin, TX',
            views: 520,
            inquiries: 18,
            price: 450000,
            status: 'active',
            engagement: 3.5,
          },
        ],
        averagePrice: 820000,
        averageDaysOnMarket: 45,
        conversionRate: 2.8,
      }

      const mockUserAnalytics: UserAnalytics = {
        totalUsers: 2847,
        activeUsers: 1923,
        newUsersThisMonth: 156,
        userGrowth: 8.2,
        averageSessionDuration: 12.5,
        topUsers: [
          {
            id: 'user_1',
            name: 'John Smith',
            propertiesListed: 8,
            propertiesSold: 5,
            totalValue: 4200000,
            rating: 4.9,
          },
          {
            id: 'user_2',
            name: 'Sarah Johnson',
            propertiesListed: 6,
            propertiesSold: 4,
            totalValue: 3800000,
            rating: 4.8,
          },
          {
            id: 'user_3',
            name: 'Mike Davis',
            propertiesListed: 10,
            propertiesSold: 7,
            totalValue: 5200000,
            rating: 4.7,
          },
        ],
        userEngagement: 68.5,
      }

      const mockMarketAnalytics: MarketAnalytics = {
        averagePrice: 820000,
        priceGrowth: 5.2,
        averageDaysOnMarket: 45,
        daysOnMarketChange: -8.3,
        salesVolume: 156,
        volumeGrowth: 12.7,
        marketTrends: [
          { month: 'Jan', price: 780000, volume: 12 },
          { month: 'Feb', price: 790000, volume: 15 },
          { month: 'Mar', price: 800000, volume: 18 },
          { month: 'Apr', price: 810000, volume: 22 },
          { month: 'May', price: 820000, volume: 25 },
          { month: 'Jun', price: 820000, volume: 28 },
        ],
        popularLocations: [
          { location: 'New York, NY', properties: 45, averagePrice: 1200000 },
          { location: 'San Francisco, CA', properties: 38, averagePrice: 1100000 },
          { location: 'Miami, FL', properties: 32, averagePrice: 850000 },
          { location: 'Austin, TX', properties: 28, averagePrice: 650000 },
          { location: 'Seattle, WA', properties: 25, averagePrice: 750000 },
        ],
        priceRanges: [
          { range: 'Under $500K', count: 45, percentage: 28.8 },
          { range: '$500K - $1M', count: 67, percentage: 42.9 },
          { range: '$1M - $2M', count: 32, percentage: 20.5 },
          { range: 'Over $2M', count: 12, percentage: 7.7 },
        ],
      }

      // If userId is provided, filter property analytics for that user
      let filteredPropertyAnalytics = mockPropertyAnalytics
      if (userId && !isAdmin) {
        filteredPropertyAnalytics = {
          ...mockPropertyAnalytics,
          totalProperties: 8,
          totalViews: 1250,
          totalSales: 3,
          totalSalesValue: 2400000,
          newPropertiesThisMonth: 2,
          viewsGrowth: 12.5,
          topProperties: mockPropertyAnalytics.topProperties.slice(0, 3),
        }
      }

      setState({
        propertyAnalytics: filteredPropertyAnalytics,
        userAnalytics: isAdmin ? mockUserAnalytics : DEFAULT_USER_ANALYTICS,
        marketAnalytics: mockMarketAnalytics,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load analytics',
        isLoading: false,
      }))
    }
  }, [userId, isAdmin])

  // Get property performance data
  const getPropertyPerformance = useCallback((propertyId: string) => {
    // In a real app, this would fetch specific property analytics
    return {
      views: 1250,
      inquiries: 45,
      favorites: 23,
      shares: 8,
      conversionRate: 3.6,
      averageTimeOnPage: 2.5,
      trafficSources: {
        direct: 45,
        search: 30,
        social: 15,
        referral: 10,
      },
    }
  }, [])

  // Get user behavior analytics
  const getUserBehavior = useCallback((userId: string) => {
    // In a real app, this would fetch user behavior data
    return {
      sessionDuration: 12.5,
      pagesPerSession: 4.2,
      bounceRate: 35.2,
      returnVisits: 68.5,
      favoriteProperties: 12,
      searchesPerformed: 45,
    }
  }, [])

  // Get market insights
  const getMarketInsights = useCallback((location?: string) => {
    // In a real app, this would fetch market insights
    return {
      marketTrend: 'growing',
      pricePrediction: 'stable',
      demandLevel: 'high',
      competitionLevel: 'medium',
      recommendedPrice: 850000,
      marketAdvice: 'Consider pricing competitively to attract more buyers',
    }
  }, [])

  // Export analytics data
  const exportAnalytics = useCallback(async (format: 'csv' | 'pdf' | 'excel' = 'csv') => {
    try {
      // In a real app, this would generate and download the export
      const data = {
        propertyAnalytics: state.propertyAnalytics,
        userAnalytics: state.userAnalytics,
        marketAnalytics: state.marketAnalytics,
        exportedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export analytics:', error)
    }
  }, [state])

  // Initialize when userId or isAdmin changes
  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  return {
    ...state,
    loadAnalytics,
    getPropertyPerformance,
    getUserBehavior,
    getMarketInsights,
    exportAnalytics,
  }
}
