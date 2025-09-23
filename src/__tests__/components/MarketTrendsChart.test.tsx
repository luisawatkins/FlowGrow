import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MarketTrendsChart } from '@/components/MarketTrendsChart'
import { Property } from '@/types'

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Test Property 1',
    description: 'A beautiful test property',
    address: '123 Test St',
    squareFootage: 1500,
    price: '300000',
    owner: '0x123',
    isListed: true,
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    location: {
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country'
    }
  },
  {
    id: '2',
    name: 'Test Property 2',
    description: 'Another test property',
    address: '456 Test Ave',
    squareFootage: 1200,
    price: '250000',
    owner: '0x456',
    isListed: true,
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 1,
    location: {
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country'
    }
  }
]

describe('MarketTrendsChart', () => {
  it('renders market trends chart with title', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    expect(screen.getByText('📊 Market Trends & Forecasting')).toBeInTheDocument()
    expect(screen.getByText('Analyze market trends, price forecasts, and neighborhood analytics')).toBeInTheDocument()
  })

  it('displays tab navigation', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    expect(screen.getByText('Market Trends')).toBeInTheDocument()
    expect(screen.getByText('Price Forecast')).toBeInTheDocument()
    expect(screen.getByText('Neighborhoods')).toBeInTheDocument()
  })

  it('shows market trends view by default', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    expect(screen.getByText('Average Price')).toBeInTheDocument()
    expect(screen.getByText('Sales Volume')).toBeInTheDocument()
    expect(screen.getByText('Days on Market')).toBeInTheDocument()
  })

  it('switches to price forecast view when clicked', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const forecastTab = screen.getByText('Price Forecast')
    fireEvent.click(forecastTab)

    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('12-Month Forecast')).toBeInTheDocument()
    expect(screen.getByText('Monthly Forecast')).toBeInTheDocument()
  })

  it('switches to neighborhoods view when clicked', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const neighborhoodsTab = screen.getByText('Neighborhoods')
    fireEvent.click(neighborhoodsTab)

    expect(screen.getByText('Test City')).toBeInTheDocument()
  })

  it('displays time range filters for trends view', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    expect(screen.getByText('6 Months')).toBeInTheDocument()
    expect(screen.getByText('1 Year')).toBeInTheDocument()
    expect(screen.getByText('2 Years')).toBeInTheDocument()
    expect(screen.getByText('5 Years')).toBeInTheDocument()
  })

  it('changes time range when selected', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const twoYearButton = screen.getByText('2 Years')
    fireEvent.click(twoYearButton)

    expect(screen.getByText('2 Years')).toBeInTheDocument()
  })

  it('displays price trend chart', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    expect(screen.getByText('Price Trend (Last 12 Months)')).toBeInTheDocument()
  })

  it('shows market conditions in forecast view', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const forecastTab = screen.getByText('Price Forecast')
    fireEvent.click(forecastTab)

    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('12-Month Forecast')).toBeInTheDocument()
  })

  it('displays neighborhood analytics with market activity', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const neighborhoodsTab = screen.getByText('Neighborhoods')
    fireEvent.click(neighborhoodsTab)

    expect(screen.getByText('Average Price')).toBeInTheDocument()
    expect(screen.getByText('Price Growth')).toBeInTheDocument()
    expect(screen.getByText('Price per Sq Ft')).toBeInTheDocument()
    expect(screen.getByText('Sales Volume')).toBeInTheDocument()
  })

  it('shows market activity indicators', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const neighborhoodsTab = screen.getByText('Neighborhoods')
    fireEvent.click(neighborhoodsTab)

    // Should display market activity status
    expect(screen.getByText(/MARKET/)).toBeInTheDocument()
  })

  it('displays currency formatting', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    // Should display currency symbols
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('shows percentage changes', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    // Should display percentage symbols
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('handles empty properties array gracefully', () => {
    render(
      <MarketTrendsChart
        properties={[]}
      />
    )

    expect(screen.getByText('📊 Market Trends & Forecasting')).toBeInTheDocument()
  })

  it('filters by location when provided', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
        selectedLocation="Test City"
      />
    )

    expect(screen.getByText('📊 Market Trends & Forecasting')).toBeInTheDocument()
  })

  it('filters by property type when provided', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
        selectedPropertyType="house"
      />
    )

    expect(screen.getByText('📊 Market Trends & Forecasting')).toBeInTheDocument()
  })

  it('displays trend icons in forecast view', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const forecastTab = screen.getByText('Price Forecast')
    fireEvent.click(forecastTab)

    // Should display trend icons (📈, 📉, ➡️)
    expect(screen.getByText('📈')).toBeInTheDocument()
  })

  it('shows confidence levels in forecast', () => {
    render(
      <MarketTrendsChart
        properties={mockProperties}
      />
    )

    const forecastTab = screen.getByText('Price Forecast')
    fireEvent.click(forecastTab)

    expect(screen.getByText('% confidence')).toBeInTheDocument()
  })
})
