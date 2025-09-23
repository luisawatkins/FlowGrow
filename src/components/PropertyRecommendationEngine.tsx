'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'

interface RecommendationEngineProps {
  userId: string
  userPreferences: UserPreferences
  userHistory: UserActivity[]
  availableProperties: Property[]
  onRecommendationClick: (property: Property) => void
  className?: string
}

interface UserPreferences {
  priceRange: { min: number; max: number }
  propertyTypes: string[]
  locations: string[]
  features: string[]
  amenities: string[]
  investmentGoals: 'rental' | 'flip' | 'primary' | 'vacation'
}

interface UserActivity {
  id: string
  type: string
  propertyId: string
  timestamp: string
  metadata?: Record<string, any>
}

interface RecommendationScore {
  property: Property
  score: number
  reasons: string[]
  confidence: number
}

export function PropertyRecommendationEngine({
  userId,
  userPreferences,
  userHistory,
  availableProperties,
  onRecommendationClick,
  className = ''
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-confidence' | 'new-listings' | 'price-drop'>('all')

  // AI Recommendation Algorithm
  const calculateRecommendationScore = useMemo(() => {
    return (property: Property): RecommendationScore => {
      let score = 0
      const reasons: string[] = []
      let confidence = 0

      // Price range matching (40% weight)
      const propertyPrice = parseFloat(property.price)
      if (propertyPrice >= userPreferences.priceRange.min && propertyPrice <= userPreferences.priceRange.max) {
        score += 40
        reasons.push('Matches your price range')
        confidence += 0.3
      } else if (propertyPrice < userPreferences.priceRange.min) {
        score += 20
        reasons.push('Below your price range (good value)')
        confidence += 0.2
      }

      // Property type matching (25% weight)
      if (property.propertyType && userPreferences.propertyTypes.includes(property.propertyType)) {
        score += 25
        reasons.push(`Matches your preferred ${property.propertyType} type`)
        confidence += 0.25
      }

      // Location matching (20% weight)
      if (property.location && userPreferences.locations.some(loc => 
        property.location?.city.toLowerCase().includes(loc.toLowerCase()) ||
        property.location?.state.toLowerCase().includes(loc.toLowerCase())
      )) {
        score += 20
        reasons.push('In your preferred location')
        confidence += 0.2
      }

      // Features matching (10% weight)
      if (property.features && userPreferences.features.length > 0) {
        const matchingFeatures = property.features.filter(feature =>
          userPreferences.features.some(pref => feature.toLowerCase().includes(pref.toLowerCase()))
        )
        if (matchingFeatures.length > 0) {
          score += Math.min(10, matchingFeatures.length * 2)
          reasons.push(`Has ${matchingFeatures.length} of your preferred features`)
          confidence += 0.1
        }
      }

      // Amenities matching (5% weight)
      if (property.amenities && userPreferences.amenities.length > 0) {
        const matchingAmenities = property.amenities.filter(amenity =>
          userPreferences.amenities.some(pref => amenity.toLowerCase().includes(pref.toLowerCase()))
        )
        if (matchingAmenities.length > 0) {
          score += Math.min(5, matchingAmenities.length)
          reasons.push(`Has ${matchingAmenities.length} of your preferred amenities`)
          confidence += 0.05
        }
      }

      // Investment goal matching
      if (userPreferences.investmentGoals === 'rental' && property.squareFootage && property.squareFootage > 1000) {
        score += 5
        reasons.push('Good size for rental property')
        confidence += 0.05
      }

      // Recent activity boost
      const recentViews = userHistory.filter(activity => 
        activity.type === 'property_viewed' && 
        activity.propertyId === property.id &&
        new Date(activity.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )
      if (recentViews.length > 0) {
        score += 10
        reasons.push('You recently viewed this property')
        confidence += 0.1
      }

      // New listing boost
      if (property.createdAt && new Date(property.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) {
        score += 5
        reasons.push('New listing')
        confidence += 0.05
      }

      return {
        property,
        score: Math.min(100, score),
        reasons,
        confidence: Math.min(1, confidence)
      }
    }
  }, [userPreferences, userHistory])

  useEffect(() => {
    const generateRecommendations = async () => {
      setIsLoading(true)
      
      // Calculate scores for all properties
      const scoredProperties = availableProperties
        .map(calculateRecommendationScore)
        .filter(rec => rec.score > 20) // Only show properties with meaningful scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Top 10 recommendations

      setRecommendations(scoredProperties)
      setIsLoading(false)
    }

    generateRecommendations()
  }, [availableProperties, calculateRecommendationScore])

  const filteredRecommendations = useMemo(() => {
    switch (selectedFilter) {
      case 'high-confidence':
        return recommendations.filter(rec => rec.confidence > 0.7)
      case 'new-listings':
        return recommendations.filter(rec => 
          rec.property.createdAt && 
          new Date(rec.property.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )
      case 'price-drop':
        return recommendations.filter(rec => 
          rec.property.updatedAt && 
          new Date(rec.property.updatedAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        )
      default:
        return recommendations
    }
  }, [recommendations, selectedFilter])

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600 bg-green-100'
    if (confidence > 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-600'
    if (score > 60) return 'text-yellow-600'
    if (score > 40) return 'text-orange-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Property Recommendations</CardTitle>
          <CardDescription>Analyzing your preferences to find the perfect properties...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Property Recommendations
          <span className="text-sm font-normal text-gray-500">
            ({filteredRecommendations.length} matches)
          </span>
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on your preferences and behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'high-confidence', label: 'High Confidence' },
            { id: 'new-listings', label: 'New Listings' },
            { id: 'price-drop', label: 'Recent Updates' }
          ].map(filter => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id as any)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recommendations match your current filters.</p>
              <p className="text-sm">Try adjusting your preferences or filters.</p>
            </div>
          ) : (
            filteredRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.property.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onRecommendationClick(recommendation.property)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{recommendation.property.name}</h3>
                    <p className="text-gray-600">{recommendation.property.address}</p>
                    <p className="text-sm text-gray-500">
                      {recommendation.property.propertyType} • {recommendation.property.squareFootage} sq ft
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(recommendation.score)}`}>
                      {recommendation.score}%
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                      {Math.round(recommendation.confidence * 100)}% confidence
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-green-600">
                    {recommendation.property.price} FLOW
                  </div>
                  <div className="text-sm text-gray-500">
                    #{index + 1} recommendation
                  </div>
                </div>

                {/* Recommendation Reasons */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Why we recommend this:</p>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.reasons.slice(0, 3).map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                    {recommendation.reasons.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{recommendation.reasons.length - 3} more reasons
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Insights */}
        {recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 AI Insights</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Based on your preferences, we found {recommendations.length} properties that match your criteria</p>
              <p>• {recommendations.filter(r => r.confidence > 0.7).length} high-confidence matches available</p>
              <p>• Average recommendation score: {Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length)}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
