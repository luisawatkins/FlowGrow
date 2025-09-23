import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PropertyAnalyticsDashboard } from '@/components/PropertyAnalyticsDashboard'
import { Property } from '@/types'

// Mock data
const mockProperty: Property = {
  id: '1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St',
  squareFootage: 1500,
  price: '300000',
  owner: '0x123',
  isListed: true,
  propertyType: 'house',
  bedrooms: 3,
  bathrooms: 2
}

describe('PropertyAnalyticsDashboard', () => {
  const mockOnAnalyticsUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders analytics dashboard with title', () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    expect(screen.getByText('📊 Property Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive analytics and performance insights for Test Property')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    expect(screen.getByText('Loading analytics data...')).toBeInTheDocument()
  })

  it('displays time range selector buttons', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('7 Days')).toBeInTheDocument()
      expect(screen.getByText('30 Days')).toBeInTheDocument()
      expect(screen.getByText('90 Days')).toBeInTheDocument()
      expect(screen.getByText('1 Year')).toBeInTheDocument()
      expect(screen.getByText('All Time')).toBeInTheDocument()
    })
  })

  it('displays tab navigation', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Views')).toBeInTheDocument()
      expect(screen.getByText('Engagement')).toBeInTheDocument()
      expect(screen.getByText('Performance')).toBeInTheDocument()
      expect(screen.getByText('Market')).toBeInTheDocument()
      expect(screen.getByText('Financial')).toBeInTheDocument()
      expect(screen.getByText('Demographics')).toBeInTheDocument()
      expect(screen.getByText('Trends')).toBeInTheDocument()
    })
  })

  it('shows overview tab by default', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Total Views')).toBeInTheDocument()
      expect(screen.getByText('Engagement Score')).toBeInTheDocument()
      expect(screen.getByText('Market Position')).toBeInTheDocument()
      expect(screen.getByText('Estimated Value')).toBeInTheDocument()
    })
  })

  it('switches to views tab when clicked', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const viewsTab = screen.getByText('Views')
      fireEvent.click(viewsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Views by Device')).toBeInTheDocument()
      expect(screen.getByText('Views by Time')).toBeInTheDocument()
    })
  })

  it('switches to market tab when clicked', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const marketTab = screen.getByText('Market')
      fireEvent.click(marketTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Comparable Properties')).toBeInTheDocument()
    })
  })

  it('switches to demographics tab when clicked', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const demographicsTab = screen.getByText('Demographics')
      fireEvent.click(demographicsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Buyer Personas')).toBeInTheDocument()
      expect(screen.getByText('Age Groups')).toBeInTheDocument()
      expect(screen.getByText('Income Levels')).toBeInTheDocument()
    })
  })

  it('switches to financial tab when clicked', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const financialTab = screen.getByText('Financial')
      fireEvent.click(financialTab)
    })

    await waitFor(() => {
      expect(screen.getByText('ROI')).toBeInTheDocument()
      expect(screen.getByText('Cap Rate')).toBeInTheDocument()
      expect(screen.getByText('Cash Flow')).toBeInTheDocument()
      expect(screen.getByText('Financial Metrics')).toBeInTheDocument()
    })
  })

  it('displays traffic sources in overview', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Top Traffic Sources')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Social Media')).toBeInTheDocument()
    })
  })

  it('displays engagement metrics in overview', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Engagement Metrics')).toBeInTheDocument()
      expect(screen.getByText('Favorites')).toBeInTheDocument()
      expect(screen.getByText('Shares')).toBeInTheDocument()
      expect(screen.getByText('Inquiries')).toBeInTheDocument()
      expect(screen.getByText('Tour Views')).toBeInTheDocument()
    })
  })

  it('shows device breakdown in views tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const viewsTab = screen.getByText('Views')
      fireEvent.click(viewsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Desktop')).toBeInTheDocument()
      expect(screen.getByText('Mobile')).toBeInTheDocument()
      expect(screen.getByText('Tablet')).toBeInTheDocument()
    })
  })

  it('shows time breakdown in views tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const viewsTab = screen.getByText('Views')
      fireEvent.click(viewsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Morning (6-12)')).toBeInTheDocument()
      expect(screen.getByText('Afternoon (12-18)')).toBeInTheDocument()
      expect(screen.getByText('Evening (18-24)')).toBeInTheDocument()
      expect(screen.getByText('Night (0-6)')).toBeInTheDocument()
    })
  })

  it('displays comparable properties in market tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const marketTab = screen.getByText('Market')
      fireEvent.click(marketTab)
    })

    await waitFor(() => {
      expect(screen.getByText('123 Oak St')).toBeInTheDocument()
      expect(screen.getByText('456 Pine Ave')).toBeInTheDocument()
      expect(screen.getByText('789 Maple Rd')).toBeInTheDocument()
    })
  })

  it('shows buyer personas in demographics tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const demographicsTab = screen.getByText('Demographics')
      fireEvent.click(demographicsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('First-time Buyer')).toBeInTheDocument()
      expect(screen.getByText('Investor')).toBeInTheDocument()
      expect(screen.getByText('Upgrader')).toBeInTheDocument()
      expect(screen.getByText('Downsizer')).toBeInTheDocument()
    })
  })

  it('displays age groups in demographics tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const demographicsTab = screen.getByText('Demographics')
      fireEvent.click(demographicsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('25-34')).toBeInTheDocument()
      expect(screen.getByText('35-44')).toBeInTheDocument()
      expect(screen.getByText('45-54')).toBeInTheDocument()
      expect(screen.getByText('55+')).toBeInTheDocument()
    })
  })

  it('shows income levels in demographics tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const demographicsTab = screen.getByText('Demographics')
      fireEvent.click(demographicsTab)
    })

    await waitFor(() => {
      expect(screen.getByText('$50k-$75k')).toBeInTheDocument()
      expect(screen.getByText('$75k-$100k')).toBeInTheDocument()
      expect(screen.getByText('$100k+')).toBeInTheDocument()
      expect(screen.getByText('Under $50k')).toBeInTheDocument()
    })
  })

  it('displays financial metrics in financial tab', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      const financialTab = screen.getByText('Financial')
      fireEvent.click(financialTab)
    })

    await waitFor(() => {
      expect(screen.getByText('Rental Yield')).toBeInTheDocument()
      expect(screen.getByText('Appreciation')).toBeInTheDocument()
      expect(screen.getByText('Total Return')).toBeInTheDocument()
      expect(screen.getByText('Value Growth')).toBeInTheDocument()
    })
  })

  it('calls onAnalyticsUpdate with analytics data', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      expect(mockOnAnalyticsUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          propertyId: mockProperty.id,
          timeRange: '30d',
          views: expect.any(Object),
          engagement: expect.any(Object),
          performance: expect.any(Object),
          market: expect.any(Object),
          financial: expect.any(Object),
          demographics: expect.any(Object),
          trends: expect.any(Object)
        })
      )
    })
  })

  it('displays currency formatting', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      // Should display currency symbols
      expect(screen.getByText('$')).toBeInTheDocument()
    })
  })

  it('shows percentage formatting', async () => {
    render(
      <PropertyAnalyticsDashboard
        property={mockProperty}
        timeRange="30d"
        onAnalyticsUpdate={mockOnAnalyticsUpdate}
      />
    )

    await waitFor(() => {
      // Should display percentage symbols
      expect(screen.getByText('%')).toBeInTheDocument()
    })
  })
})
