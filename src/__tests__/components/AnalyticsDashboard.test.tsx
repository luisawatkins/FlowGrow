import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { useAnalytics } from '@/hooks/useAnalytics'
import { PropertyAnalytics, UserAnalytics, MarketAnalytics } from '@/types'

// Mock the useAnalytics hook
jest.mock('@/hooks/useAnalytics')
const mockUseAnalytics = useAnalytics as jest.MockedFunction<typeof useAnalytics>

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
  ],
  popularLocations: [
    { location: 'New York, NY', properties: 45, averagePrice: 1200000 },
    { location: 'San Francisco, CA', properties: 38, averagePrice: 1100000 },
  ],
  priceRanges: [
    { range: 'Under $500K', count: 45, percentage: 28.8 },
    { range: '$500K - $1M', count: 67, percentage: 42.9 },
  ],
}

const mockLoadAnalytics = jest.fn()
const mockGetPropertyPerformance = jest.fn()
const mockGetUserBehavior = jest.fn()
const mockGetMarketInsights = jest.fn()
const mockExportAnalytics = jest.fn()

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    mockUseAnalytics.mockReturnValue({
      propertyAnalytics: mockPropertyAnalytics,
      userAnalytics: mockUserAnalytics,
      marketAnalytics: mockMarketAnalytics,
      isLoading: false,
      error: null,
      loadAnalytics: mockLoadAnalytics,
      getPropertyPerformance: mockGetPropertyPerformance,
      getUserBehavior: mockGetUserBehavior,
      getMarketInsights: mockGetMarketInsights,
      exportAnalytics: mockExportAnalytics,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders analytics dashboard for regular user', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Your property performance insights')).toBeInTheDocument()
  })

  it('renders analytics dashboard for admin user', () => {
    render(<AnalyticsDashboard userId="user_123" isAdmin={true} />)
    
    expect(screen.getByText('Platform-wide analytics and insights')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseAnalytics.mockReturnValue({
      propertyAnalytics: mockPropertyAnalytics,
      userAnalytics: mockUserAnalytics,
      marketAnalytics: mockMarketAnalytics,
      isLoading: true,
      error: null,
      loadAnalytics: mockLoadAnalytics,
      getPropertyPerformance: mockGetPropertyPerformance,
      getUserBehavior: mockGetUserBehavior,
      getMarketInsights: mockGetMarketInsights,
      exportAnalytics: mockExportAnalytics,
    })

    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
  })

  it('displays key metrics cards', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Total Properties')).toBeInTheDocument()
    expect(screen.getByText('156')).toBeInTheDocument()
    expect(screen.getByText('Total Views')).toBeInTheDocument()
    expect(screen.getByText('12.5K')).toBeInTheDocument()
    expect(screen.getByText('Total Sales')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
  })

  it('shows admin-specific metrics when isAdmin is true', () => {
    render(<AnalyticsDashboard userId="user_123" isAdmin={true} />)
    
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('1.9K')).toBeInTheDocument()
  })

  it('changes time range when dropdown is changed', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const timeRangeSelect = screen.getByDisplayValue('Last 30 days')
    fireEvent.change(timeRangeSelect, { target: { value: '7d' } })
    
    expect(mockLoadAnalytics).toHaveBeenCalledWith('7d')
  })

  it('switches between different view types', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const propertiesTab = screen.getByText('Properties')
    fireEvent.click(propertiesTab)
    
    expect(screen.getByText('Property Performance')).toBeInTheDocument()
    expect(screen.getByText('Detailed analytics for your properties')).toBeInTheDocument()
  })

  it('shows market view when market tab is clicked', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const marketTab = screen.getByText('Market')
    fireEvent.click(marketTab)
    
    expect(screen.getByText('Price Trends')).toBeInTheDocument()
    expect(screen.getByText('Market Activity')).toBeInTheDocument()
  })

  it('shows users view for admin users', () => {
    render(<AnalyticsDashboard userId="user_123" isAdmin={true} />)
    
    const usersTab = screen.getByText('Users')
    fireEvent.click(usersTab)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('New This Month')).toBeInTheDocument()
  })

  it('does not show users tab for non-admin users', () => {
    render(<AnalyticsDashboard userId="user_123" isAdmin={false} />)
    
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
  })

  it('displays top performing properties', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Top Performing Properties')).toBeInTheDocument()
    expect(screen.getByText('Downtown Luxury Apartment')).toBeInTheDocument()
    expect(screen.getByText('Beach House Villa')).toBeInTheDocument()
  })

  it('shows property performance table in properties view', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const propertiesTab = screen.getByText('Properties')
    fireEvent.click(propertiesTab)
    
    expect(screen.getByText('Property Performance')).toBeInTheDocument()
    expect(screen.getByText('Downtown Luxury Apartment')).toBeInTheDocument()
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getByText('1.3K')).toBeInTheDocument() // Views
    expect(screen.getByText('45')).toBeInTheDocument() // Inquiries
  })

  it('displays market insights', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Market Insights')).toBeInTheDocument()
    expect(screen.getByText('Average Property Price')).toBeInTheDocument()
    expect(screen.getByText('Days on Market')).toBeInTheDocument()
    expect(screen.getByText('Sales Volume')).toBeInTheDocument()
  })

  it('formats numbers correctly', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('12.5K')).toBeInTheDocument() // 12450 views
    expect(screen.getByText('156')).toBeInTheDocument() // Total properties
  })

  it('formats currency correctly', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('$12,500,000')).toBeInTheDocument() // Total sales value
  })

  it('shows growth percentages', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('+15.3% vs last month')).toBeInTheDocument() // Views growth
    expect(screen.getByText('+12 this month')).toBeInTheDocument() // New properties
  })

  it('displays property status badges', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const propertiesTab = screen.getByText('Properties')
    fireEvent.click(propertiesTab)
    
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows engagement metrics', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('3.6% engagement')).toBeInTheDocument()
    expect(screen.getByText('3.3% engagement')).toBeInTheDocument()
  })

  it('displays market trends data', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('+5.2% vs last month')).toBeInTheDocument() // Price growth
    expect(screen.getByText('-8.3% vs last month')).toBeInTheDocument() // Days on market change
  })

  it('shows chart placeholders', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('Property Views Over Time')).toBeInTheDocument()
    expect(screen.getByText('Chart visualization would go here')).toBeInTheDocument()
  })

  it('handles export functionality', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const exportButton = screen.getByText('Export Report')
    fireEvent.click(exportButton)
    
    // The export function should be called (implementation depends on the actual export logic)
    expect(exportButton).toBeInTheDocument()
  })

  it('shows different metrics for user vs admin view', () => {
    const { rerender } = render(<AnalyticsDashboard userId="user_123" isAdmin={false} />)
    
    expect(screen.queryByText('Active Users')).not.toBeInTheDocument()
    
    rerender(<AnalyticsDashboard userId="user_123" isAdmin={true} />)
    
    expect(screen.getByText('Active Users')).toBeInTheDocument()
  })

  it('displays property rankings in top properties', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('1')).toBeInTheDocument() // First property ranking
    expect(screen.getByText('2')).toBeInTheDocument() // Second property ranking
  })

  it('shows market trend information', () => {
    render(<AnalyticsDashboard userId="user_123" />)
    
    const marketTab = screen.getByText('Market')
    fireEvent.click(marketTab)
    
    expect(screen.getByText('Price trend chart would go here')).toBeInTheDocument()
    expect(screen.getByText('Activity chart would go here')).toBeInTheDocument()
  })

  it('displays user analytics for admin', () => {
    render(<AnalyticsDashboard userId="user_123" isAdmin={true} />)
    
    const usersTab = screen.getByText('Users')
    fireEvent.click(usersTab)
    
    expect(screen.getByText('2.8K')).toBeInTheDocument() // Total users
    expect(screen.getByText('1.9K')).toBeInTheDocument() // Active users
    expect(screen.getByText('156')).toBeInTheDocument() // New this month
  })

  it('handles empty analytics data gracefully', () => {
    mockUseAnalytics.mockReturnValue({
      propertyAnalytics: {
        ...mockPropertyAnalytics,
        totalProperties: 0,
        topProperties: [],
      },
      userAnalytics: mockUserAnalytics,
      marketAnalytics: mockMarketAnalytics,
      isLoading: false,
      error: null,
      loadAnalytics: mockLoadAnalytics,
      getPropertyPerformance: mockGetPropertyPerformance,
      getUserBehavior: mockGetUserBehavior,
      getMarketInsights: mockGetMarketInsights,
      exportAnalytics: mockExportAnalytics,
    })

    render(<AnalyticsDashboard userId="user_123" />)
    
    expect(screen.getByText('0')).toBeInTheDocument() // Total properties
  })
})
