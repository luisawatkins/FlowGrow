'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/types'

interface PropertyValuationProps {
  property: Property
  onValuationComplete: (valuation: PropertyValuation) => void
  className?: string
}

interface PropertyValuation {
  id: string
  propertyId: string
  valuationDate: string
  valuationType: ValuationType
  estimatedValue: number
  confidence: number
  methodology: string
  factors: ValuationFactor[]
  comparableProperties: ComparableProperty[]
  marketConditions: MarketCondition
  recommendations: string[]
  appraiser?: string
  reportUrl?: string
}

interface ValuationFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
  value: number
}

interface ComparableProperty {
  id: string
  address: string
  salePrice: number
  saleDate: string
  squareFootage: number
  bedrooms: number
  bathrooms: number
  distance: number
  similarity: number
}

interface MarketCondition {
  trend: 'rising' | 'falling' | 'stable'
  averageDaysOnMarket: number
  inventoryLevel: 'low' | 'normal' | 'high'
  priceGrowth: number
  marketActivity: 'hot' | 'warm' | 'cool' | 'cold'
}

type ValuationType = 'automated' | 'professional' | 'broker' | 'tax' | 'insurance'

export function PropertyValuation({
  property,
  onValuationComplete,
  className = ''
}: PropertyValuationProps) {
  const [valuations, setValuations] = useState<PropertyValuation[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [selectedValuationType, setSelectedValuationType] = useState<ValuationType>('automated')
  const [showValuationModal, setShowValuationModal] = useState(false)

  // Mock valuation data
  useEffect(() => {
    const mockValuation: PropertyValuation = {
      id: '1',
      propertyId: property.id,
      valuationDate: '2024-01-15',
      valuationType: 'automated',
      estimatedValue: parseFloat(property.price) * 1.1, // 10% above current price
      confidence: 0.85,
      methodology: 'Automated valuation model using comparable sales and property characteristics',
      factors: [
        {
          factor: 'Location',
          impact: 'positive',
          weight: 0.3,
          description: 'Prime location with good amenities',
          value: 15000
        },
        {
          factor: 'Property Size',
          impact: 'positive',
          weight: 0.25,
          description: 'Above average square footage',
          value: 12000
        },
        {
          factor: 'Condition',
          impact: 'neutral',
          weight: 0.2,
          description: 'Good condition, minor updates needed',
          value: 0
        },
        {
          factor: 'Market Trends',
          impact: 'positive',
          weight: 0.15,
          description: 'Rising market conditions',
          value: 8000
        },
        {
          factor: 'Age',
          impact: 'negative',
          weight: 0.1,
          description: 'Property age reduces value',
          value: -5000
        }
      ],
      comparableProperties: [
        {
          id: '1',
          address: '123 Main St',
          salePrice: 450000,
          saleDate: '2023-12-01',
          squareFootage: 1800,
          bedrooms: 3,
          bathrooms: 2,
          distance: 0.5,
          similarity: 0.92
        },
        {
          id: '2',
          address: '456 Oak Ave',
          salePrice: 420000,
          saleDate: '2023-11-15',
          squareFootage: 1750,
          bedrooms: 3,
          bathrooms: 2,
          distance: 0.8,
          similarity: 0.88
        },
        {
          id: '3',
          address: '789 Pine Rd',
          salePrice: 480000,
          saleDate: '2023-10-20',
          squareFootage: 1900,
          bedrooms: 4,
          bathrooms: 2,
          distance: 1.2,
          similarity: 0.85
        }
      ],
      marketConditions: {
        trend: 'rising',
        averageDaysOnMarket: 45,
        inventoryLevel: 'low',
        priceGrowth: 5.2,
        marketActivity: 'warm'
      },
      recommendations: [
        'Consider minor cosmetic updates to increase value',
        'Market timing is favorable for selling',
        'Property is priced competitively',
        'Location premium is significant'
      ]
    }

    setValuations([mockValuation])
  }, [property.id, property.price])

  const currentValuation = valuations[0]

  const calculateAutomatedValuation = async () => {
    setIsCalculating(true)
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const basePrice = parseFloat(property.price)
    const marketMultiplier = 1 + (Math.random() - 0.5) * 0.2 // ±10% variation
    const estimatedValue = basePrice * marketMultiplier
    
    const newValuation: PropertyValuation = {
      id: Date.now().toString(),
      propertyId: property.id,
      valuationDate: new Date().toISOString().split('T')[0],
      valuationType: 'automated',
      estimatedValue,
      confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
      methodology: 'Automated valuation model using comparable sales and property characteristics',
      factors: [
        {
          factor: 'Location',
          impact: 'positive',
          weight: 0.3,
          description: 'Prime location with good amenities',
          value: Math.floor(Math.random() * 20000) + 10000
        },
        {
          factor: 'Property Size',
          impact: 'positive',
          weight: 0.25,
          description: 'Above average square footage',
          value: Math.floor(Math.random() * 15000) + 8000
        },
        {
          factor: 'Condition',
          impact: 'neutral',
          weight: 0.2,
          description: 'Good condition, minor updates needed',
          value: Math.floor(Math.random() * 10000) - 5000
        },
        {
          factor: 'Market Trends',
          impact: 'positive',
          weight: 0.15,
          description: 'Rising market conditions',
          value: Math.floor(Math.random() * 10000) + 5000
        },
        {
          factor: 'Age',
          impact: 'negative',
          weight: 0.1,
          description: 'Property age reduces value',
          value: -Math.floor(Math.random() * 10000) - 2000
        }
      ],
      comparableProperties: [],
      marketConditions: {
        trend: 'rising',
        averageDaysOnMarket: Math.floor(Math.random() * 60) + 30,
        inventoryLevel: 'low',
        priceGrowth: Math.random() * 10,
        marketActivity: 'warm'
      },
      recommendations: [
        'Consider minor cosmetic updates to increase value',
        'Market timing is favorable for selling',
        'Property is priced competitively'
      ]
    }

    setValuations(prev => [newValuation, ...prev])
    onValuationComplete(newValuation)
    setIsCalculating(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈'
      case 'falling': return '📉'
      case 'stable': return '➡️'
      default: return '➡️'
    }
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600'
    if (confidence > 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Property Valuation & Appraisal
        </CardTitle>
        <CardDescription>
          Get accurate property valuations and appraisal estimates for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Valuation */}
        {currentValuation && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Estimated Value</div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatCurrency(currentValuation.estimatedValue)}
                </div>
                <div className="text-sm text-blue-600">
                  vs. Listed: {formatCurrency(parseFloat(property.price))}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Confidence Level</div>
                <div className={`text-2xl font-bold ${getConfidenceColor(currentValuation.confidence)}`}>
                  {Math.round(currentValuation.confidence * 100)}%
                </div>
                <div className="text-sm text-green-600">
                  {currentValuation.valuationType} valuation
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Market Trend</div>
                <div className="text-2xl font-bold text-purple-800">
                  {getTrendIcon(currentValuation.marketConditions.trend)}
                </div>
                <div className="text-sm text-purple-600">
                  {currentValuation.marketConditions.priceGrowth.toFixed(1)}% growth
                </div>
              </div>
            </div>

            {/* Valuation Factors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Valuation Factors</h3>
              <div className="space-y-3">
                {currentValuation.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(factor.impact)}`}>
                        {factor.impact.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{factor.factor}</div>
                        <div className="text-sm text-gray-600">{factor.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${factor.value > 0 ? 'text-green-600' : factor.value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {factor.value > 0 ? '+' : ''}{formatCurrency(factor.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(factor.weight * 100)}% weight
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Conditions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Market Conditions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Market Activity</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getMarketActivityColor(currentValuation.marketConditions.marketActivity)}`}>
                    {currentValuation.marketConditions.marketActivity.toUpperCase()}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Days on Market</div>
                  <div className="font-semibold">{currentValuation.marketConditions.averageDaysOnMarket}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Inventory Level</div>
                  <div className="font-semibold capitalize">{currentValuation.marketConditions.inventoryLevel}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Price Growth</div>
                  <div className="font-semibold text-green-600">
                    +{currentValuation.marketConditions.priceGrowth.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Comparable Properties */}
            {currentValuation.comparableProperties.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Comparable Properties</h3>
                <div className="space-y-3">
                  {currentValuation.comparableProperties.map(comp => (
                    <div key={comp.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{comp.address}</div>
                          <div className="text-sm text-gray-600">
                            {comp.squareFootage} sq ft • {comp.bedrooms} bed • {comp.bathrooms} bath
                          </div>
                          <div className="text-sm text-gray-500">
                            Sold {comp.saleDate} • {comp.distance} miles away
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(comp.salePrice)}</div>
                          <div className="text-sm text-gray-500">
                            {Math.round(comp.similarity * 100)}% similar
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-2">
                {currentValuation.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">💡</span>
                    <span className="text-sm text-blue-800">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={calculateAutomatedValuation}
            disabled={isCalculating}
            className="flex-1"
          >
            {isCalculating ? 'Calculating...' : 'Get New Valuation'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowValuationModal(true)}
            className="flex-1"
          >
            Request Professional Appraisal
          </Button>
        </div>

        {/* Valuation History */}
        {valuations.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Valuation History</h3>
            <div className="space-y-2">
              {valuations.slice(1).map(valuation => (
                <div key={valuation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{valuation.valuationDate}</div>
                    <div className="text-sm text-gray-600 capitalize">{valuation.valuationType} valuation</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(valuation.estimatedValue)}</div>
                    <div className="text-sm text-gray-500">
                      {Math.round(valuation.confidence * 100)}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Appraisal Modal */}
        {showValuationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Request Professional Appraisal</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get a professional appraisal from a certified appraiser for the most accurate valuation.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appraisal Type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="full">Full Appraisal</option>
                    <option value="drive-by">Drive-by Appraisal</option>
                    <option value="desktop">Desktop Appraisal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="sale">For Sale</option>
                    <option value="refinance">Refinance</option>
                    <option value="insurance">Insurance</option>
                    <option value="tax">Tax Assessment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="standard">Standard (5-7 days)</option>
                    <option value="rush">Rush (2-3 days)</option>
                    <option value="express">Express (24 hours)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowValuationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Request Appraisal
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
