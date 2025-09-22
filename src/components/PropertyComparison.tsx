'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'

interface PropertyComparisonProps {
  properties: Property[]
  onRemoveProperty: (propertyId: string) => void
  onClearAll: () => void
  className?: string
}

export function PropertyComparison({
  properties,
  onRemoveProperty,
  onClearAll,
  className = '',
}: PropertyComparisonProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const maxProperties = 4
  const canAddMore = properties.length < maxProperties

  const allFeatures = [
    'price',
    'squareFootage',
    'bedrooms',
    'bathrooms',
    'yearBuilt',
    'propertyType',
    'location',
    'amenities',
    'features',
  ]

  const formatValue = (property: Property, feature: string) => {
    switch (feature) {
      case 'price':
        return `${property.price} FLOW`
      case 'squareFootage':
        return `${property.squareFootage.toLocaleString()} sq ft`
      case 'bedrooms':
        return property.bedrooms?.toString() || 'N/A'
      case 'bathrooms':
        return property.bathrooms?.toString() || 'N/A'
      case 'yearBuilt':
        return property.yearBuilt?.toString() || 'N/A'
      case 'propertyType':
        return property.propertyType || 'N/A'
      case 'location':
        return property.location ? 
          `${property.location.city}, ${property.location.state}` : 
          property.address
      case 'amenities':
        return property.amenities?.join(', ') || 'None'
      case 'features':
        return property.features?.join(', ') || 'None'
      default:
        return 'N/A'
    }
  }

  const getComparisonWinner = (feature: string) => {
    if (properties.length < 2) return null

    switch (feature) {
      case 'price':
        const prices = properties.map(p => parseFloat(p.price))
        const minPrice = Math.min(...prices)
        return properties.find(p => parseFloat(p.price) === minPrice)?.id
      case 'squareFootage':
        const sizes = properties.map(p => p.squareFootage)
        const maxSize = Math.max(...sizes)
        return properties.find(p => p.squareFootage === maxSize)?.id
      case 'bedrooms':
        const bedrooms = properties.map(p => p.bedrooms || 0)
        const maxBedrooms = Math.max(...bedrooms)
        return properties.find(p => (p.bedrooms || 0) === maxBedrooms)?.id
      case 'bathrooms':
        const bathrooms = properties.map(p => p.bathrooms || 0)
        const maxBathrooms = Math.max(...bathrooms)
        return properties.find(p => (p.bathrooms || 0) === maxBathrooms)?.id
      default:
        return null
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const generateComparisonReport = () => {
    const report = {
      properties: properties.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        location: p.location ? `${p.location.city}, ${p.location.state}` : p.address,
      })),
      comparison: selectedFeatures.map(feature => ({
        feature,
        values: properties.map(p => ({
          propertyId: p.id,
          value: formatValue(p, feature),
        })),
        winner: getComparisonWinner(feature),
      })),
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `property-comparison-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (properties.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">⚖️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No properties to compare
        </h3>
        <p className="text-gray-600 mb-4">
          Add properties to your comparison to see side-by-side details
        </p>
        <Button>
          Browse Properties
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
            <p className="text-gray-600">
              Compare {properties.length} of {maxProperties} properties
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table View
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </Button>
            </div>
            <Button variant="outline" onClick={generateComparisonReport}>
              Export Report
            </Button>
            <Button variant="outline" onClick={onClearAll}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <GridComparisonView
          properties={properties}
          onRemoveProperty={onRemoveProperty}
          canAddMore={canAddMore}
        />
      ) : (
        <TableComparisonView
          properties={properties}
          onRemoveProperty={onRemoveProperty}
          selectedFeatures={selectedFeatures}
          onFeatureToggle={handleFeatureToggle}
          formatValue={formatValue}
          getComparisonWinner={getComparisonWinner}
          allFeatures={allFeatures}
        />
      )}
    </div>
  )
}

// Grid Comparison View
interface GridComparisonViewProps {
  properties: Property[]
  onRemoveProperty: (propertyId: string) => void
  canAddMore: boolean
}

function GridComparisonView({ properties, onRemoveProperty, canAddMore }: GridComparisonViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="relative">
          <PropertyCard
            property={property}
            currentUser=""
            showComparisonActions={false}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            onClick={() => onRemoveProperty(property.id)}
          >
            ✕
          </Button>
        </div>
      ))}
      
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">➕</div>
            <p className="text-gray-600 mb-2">Add more properties</p>
            <Button variant="outline">
              Browse Properties
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Table Comparison View
interface TableComparisonViewProps {
  properties: Property[]
  onRemoveProperty: (propertyId: string) => void
  selectedFeatures: string[]
  onFeatureToggle: (feature: string) => void
  formatValue: (property: Property, feature: string) => string
  getComparisonWinner: (feature: string) => string | null
  allFeatures: string[]
}

function TableComparisonView({
  properties,
  onRemoveProperty,
  selectedFeatures,
  onFeatureToggle,
  formatValue,
  getComparisonWinner,
  allFeatures,
}: TableComparisonViewProps) {
  return (
    <div className="space-y-6">
      {/* Feature Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Features to Compare</CardTitle>
          <CardDescription>
            Choose which features you want to compare across properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allFeatures.map((feature) => (
              <Button
                key={feature}
                variant={selectedFeatures.includes(feature) ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFeatureToggle(feature)}
              >
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Feature</th>
                  {properties.map((property) => (
                    <th key={property.id} className="text-center py-4 px-6 font-medium text-gray-900 min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold truncate">{property.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {property.location ? 
                              `${property.location.city}, ${property.location.state}` : 
                              property.address
                            }
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveProperty(property.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedFeatures.map((feature) => {
                  const winner = getComparisonWinner(feature)
                  return (
                    <tr key={feature} className="border-b">
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </td>
                      {properties.map((property) => (
                        <td
                          key={property.id}
                          className={`py-4 px-6 text-center ${
                            winner === property.id ? 'bg-green-50 font-semibold text-green-800' : ''
                          }`}
                        >
                          {formatValue(property, feature)}
                          {winner === property.id && (
                            <div className="text-xs text-green-600 mt-1">🏆 Best</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Summary</CardTitle>
            <CardDescription>
              Key insights from your property comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFeatures.map((feature) => {
                const winner = getComparisonWinner(feature)
                const winnerProperty = properties.find(p => p.id === winner)
                
                if (!winnerProperty) return null
                
                return (
                  <div key={feature} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Best {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{winnerProperty.name}</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatValue(winnerProperty, feature)}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
