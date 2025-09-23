'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'

interface MarketTrendsChartProps {
  properties: Property[]
  selectedLocation?: string
  selectedPropertyType?: string
  className?: string
}

interface MarketTrend {
  month: string
  averagePrice: number
  medianPrice: number
  salesVolume: number
  daysOnMarket: number
  pricePerSqFt: number
}

interface PriceForecast {
  month: string
  predictedPrice: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
}

interface NeighborhoodAnalytics {
  location: string
  averagePrice: number
  priceGrowth: number
  salesVolume: number
  averageDaysOnMarket: number
  pricePerSqFt: number
  marketActivity: 'hot' | 'warm' | 'cool' | 'cold'
}

export function MarketTrendsChart({
  properties,
  selectedLocation,
  selectedPropertyType,
  className = ''
}: MarketTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | '2y' | '5y'>('1y')
  const [viewType, setViewType] = useState<'trends' | 'forecast' | 'neighborhoods'>('trends')

  // Generate market trends data
  const marketTrends = useMemo((): MarketTrend[] => {
    const filteredProperties = properties.filter(prop => {
      if (selectedLocation && prop.location?.city !== selectedLocation) return false
      if (selectedPropertyType && prop.propertyType !== selectedPropertyType) return false
      return true
    })

    const months = 12
    const trends: MarketTrend[] = []

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7)

      // Simulate historical data based on current properties
      const basePrice = parseFloat(filteredProperties[0]?.price || '100000')
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
      const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.05 // Seasonal variation
      
      const averagePrice = basePrice * (1 + variation) * seasonalFactor
      const medianPrice = averagePrice * (0.95 + Math.random() * 0.1)
      const salesVolume = Math.floor(Math.random() * 50) + 10
      const daysOnMarket = Math.floor(Math.random() * 60) + 30
      const pricePerSqFt = averagePrice / (filteredProperties[0]?.squareFootage || 1500)

      trends.push({
        month: monthKey,
        averagePrice,
        medianPrice,
        salesVolume,
        daysOnMarket,
        pricePerSqFt
      })
    }

    return trends
  }, [properties, selectedLocation, selectedPropertyType])

  // Generate price forecast
  const priceForecast = useMemo((): PriceForecast[] => {
    const lastTrend = marketTrends[marketTrends.length - 1]
    const forecast: PriceForecast[] = []

    for (let i = 1; i <= 12; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)
      const monthKey = date.toISOString().slice(0, 7)

      // Simple linear trend with some randomness
      const growthRate = 0.02 + (Math.random() - 0.5) * 0.01 // 1.5-2.5% monthly growth
      const predictedPrice = lastTrend.averagePrice * Math.pow(1 + growthRate, i)
      const confidence = Math.max(0.6, 1 - (i * 0.03)) // Decreasing confidence over time
      
      let trend: 'up' | 'down' | 'stable' = 'stable'
      if (growthRate > 0.02) trend = 'up'
      else if (growthRate < 0.015) trend = 'down'

      forecast.push({
        month: monthKey,
        predictedPrice,
        confidence,
        trend
      })
    }

    return forecast
  }, [marketTrends])

  // Generate neighborhood analytics
  const neighborhoodAnalytics = useMemo((): NeighborhoodAnalytics[] => {
    const locations = [...new Set(properties.map(p => p.location?.city).filter(Boolean))]
    
    return locations.map(location => {
      const locationProperties = properties.filter(p => p.location?.city === location)
      const prices = locationProperties.map(p => parseFloat(p.price)).filter(p => !isNaN(p))
      
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      const priceGrowth = (Math.random() - 0.5) * 20 // ±10% growth
      const salesVolume = locationProperties.length
      const averageDaysOnMarket = Math.floor(Math.random() * 60) + 30
      const pricePerSqFt = averagePrice / 1500 // Assume average 1500 sq ft
      
      let marketActivity: 'hot' | 'warm' | 'cool' | 'cold' = 'warm'
      if (priceGrowth > 10 && salesVolume > 20) marketActivity = 'hot'
      else if (priceGrowth < -5 || salesVolume < 5) marketActivity = 'cold'
      else if (priceGrowth > 5 || salesVolume > 15) marketActivity = 'warm'
      else marketActivity = 'cool'

      return {
        location: location!,
        averagePrice,
        priceGrowth,
        salesVolume,
        averageDaysOnMarket,
        pricePerSqFt,
        marketActivity
      }
    }).sort((a, b) => b.salesVolume - a.salesVolume)
  }, [properties])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getMarketActivityColor = (activity: string) => {
    switch (activity) {
      case 'hot': return 'text-red-600 bg-red-100'
      case 'warm': return 'text-orange-600 bg-orange-100'
      case 'cool': return 'text-blue-600 bg-blue-100'
      case 'cold': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
      default: return '➡️'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Market Trends & Forecasting
        </CardTitle>
        <CardDescription>
          Analyze market trends, price forecasts, and neighborhood analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            {[
              { id: 'trends', label: 'Market Trends' },
              { id: 'forecast', label: 'Price Forecast' },
              { id: 'neighborhoods', label: 'Neighborhoods' }
            ].map(view => (
              <Button
                key={view.id}
                variant={viewType === view.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType(view.id as any)}
              >
                {view.label}
              </Button>
            ))}
          </div>
          
          {viewType === 'trends' && (
            <div className="flex gap-2">
              {[
                { id: '6m', label: '6 Months' },
                { id: '1y', label: '1 Year' },
                { id: '2y', label: '2 Years' },
                { id: '5y', label: '5 Years' }
              ].map(range => (
                <Button
                  key={range.id}
                  variant={timeRange === range.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range.id as any)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Market Trends View */}
        {viewType === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Average Price</div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatCurrency(marketTrends[marketTrends.length - 1]?.averagePrice || 0)}
                </div>
                <div className="text-sm text-blue-600">
                  {marketTrends.length > 1 && (
                    <span>
                      {((marketTrends[marketTrends.length - 1].averagePrice - marketTrends[0].averagePrice) / marketTrends[0].averagePrice * 100).toFixed(1)}% vs last period
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Sales Volume</div>
                <div className="text-2xl font-bold text-green-800">
                  {marketTrends[marketTrends.length - 1]?.salesVolume || 0}
                </div>
                <div className="text-sm text-green-600">properties sold</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Days on Market</div>
                <div className="text-2xl font-bold text-purple-800">
                  {marketTrends[marketTrends.length - 1]?.daysOnMarket || 0}
                </div>
                <div className="text-sm text-purple-600">average</div>
              </div>
            </div>

            {/* Simple Chart Representation */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-4">Price Trend (Last 12 Months)</h4>
              <div className="flex items-end justify-between h-32 space-x-1">
                {marketTrends.map((trend, index) => {
                  const maxPrice = Math.max(...marketTrends.map(t => t.averagePrice))
                  const height = (trend.averagePrice / maxPrice) * 100
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 w-full rounded-t"
                        style={{ height: `${height}%` }}
                        title={`${trend.month}: ${formatCurrency(trend.averagePrice)}`}
                      />
                      <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                        {trend.month.slice(5)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Price Forecast View */}
        {viewType === 'forecast' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Current Price</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {formatCurrency(marketTrends[marketTrends.length - 1]?.averagePrice || 0)}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">12-Month Forecast</div>
                <div className="text-2xl font-bold text-green-800">
                  {formatCurrency(priceForecast[priceForecast.length - 1]?.predictedPrice || 0)}
                </div>
                <div className="text-sm text-green-600">
                  {priceForecast[priceForecast.length - 1] && (
                    <span>
                      {getTrendIcon(priceForecast[priceForecast.length - 1].trend)} 
                      {((priceForecast[priceForecast.length - 1].predictedPrice - marketTrends[marketTrends.length - 1].averagePrice) / marketTrends[marketTrends.length - 1].averagePrice * 100).toFixed(1)}% change
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Monthly Forecast</h4>
              {priceForecast.slice(0, 6).map((forecast, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTrendIcon(forecast.trend)}</span>
                    <div>
                      <div className="font-medium">{forecast.month}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(forecast.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(forecast.predictedPrice)}</div>
                    <div className="text-sm text-gray-500">
                      {index > 0 && (
                        <span>
                          {((forecast.predictedPrice - priceForecast[index - 1].predictedPrice) / priceForecast[index - 1].predictedPrice * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neighborhood Analytics View */}
        {viewType === 'neighborhoods' && (
          <div className="space-y-4">
            {neighborhoodAnalytics.map((neighborhood, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{neighborhood.location}</h3>
                    <p className="text-gray-600">
                      {neighborhood.salesVolume} properties • {neighborhood.averageDaysOnMarket} days avg
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMarketActivityColor(neighborhood.marketActivity)}`}>
                      {neighborhood.marketActivity.toUpperCase()} MARKET
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Average Price</div>
                    <div className="font-semibold">{formatCurrency(neighborhood.averagePrice)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Price Growth</div>
                    <div className={`font-semibold ${neighborhood.priceGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {neighborhood.priceGrowth > 0 ? '+' : ''}{neighborhood.priceGrowth.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Price per Sq Ft</div>
                    <div className="font-semibold">{formatCurrency(neighborhood.pricePerSqFt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Sales Volume</div>
                    <div className="font-semibold">{neighborhood.salesVolume}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
