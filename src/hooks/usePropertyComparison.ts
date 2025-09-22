'use client'

import { useState, useCallback, useEffect } from 'react'
import { Property } from '@/types'

interface ComparisonState {
  properties: Property[]
  maxProperties: number
  isLoading: boolean
  error: string | null
}

export function usePropertyComparison(maxProperties: number = 4) {
  const [state, setState] = useState<ComparisonState>({
    properties: [],
    maxProperties,
    isLoading: false,
    error: null,
  })

  // Load comparison from localStorage
  const loadComparison = useCallback(() => {
    try {
      const saved = localStorage.getItem('property-comparison')
      if (saved) {
        const properties = JSON.parse(saved)
        setState(prev => ({
          ...prev,
          properties: properties.slice(0, maxProperties),
        }))
      }
    } catch (error) {
      console.error('Failed to load comparison:', error)
    }
  }, [maxProperties])

  // Save comparison to localStorage
  const saveComparison = useCallback((properties: Property[]) => {
    try {
      localStorage.setItem('property-comparison', JSON.stringify(properties))
    } catch (error) {
      console.error('Failed to save comparison:', error)
    }
  }, [])

  // Add property to comparison
  const addToComparison = useCallback((property: Property) => {
    setState(prev => {
      // Check if property is already in comparison
      if (prev.properties.some(p => p.id === property.id)) {
        return prev
      }

      // Check if we've reached the maximum
      if (prev.properties.length >= prev.maxProperties) {
        setState(prev => ({
          ...prev,
          error: `Maximum ${prev.maxProperties} properties allowed in comparison`,
        }))
        return prev
      }

      const newProperties = [...prev.properties, property]
      saveComparison(newProperties)
      
      return {
        ...prev,
        properties: newProperties,
        error: null,
      }
    })
  }, [saveComparison])

  // Remove property from comparison
  const removeFromComparison = useCallback((propertyId: string) => {
    setState(prev => {
      const newProperties = prev.properties.filter(p => p.id !== propertyId)
      saveComparison(newProperties)
      
      return {
        ...prev,
        properties: newProperties,
        error: null,
      }
    })
  }, [saveComparison])

  // Clear all properties from comparison
  const clearComparison = useCallback(() => {
    setState(prev => {
      saveComparison([])
      return {
        ...prev,
        properties: [],
        error: null,
      }
    })
  }, [saveComparison])

  // Check if property is in comparison
  const isInComparison = useCallback((propertyId: string) => {
    return state.properties.some(p => p.id === propertyId)
  }, [state.properties])

  // Get comparison count
  const getComparisonCount = useCallback(() => {
    return state.properties.length
  }, [state.properties])

  // Check if comparison is full
  const isComparisonFull = useCallback(() => {
    return state.properties.length >= state.maxProperties
  }, [state.properties, maxProperties])

  // Get comparison summary
  const getComparisonSummary = useCallback(() => {
    if (state.properties.length === 0) {
      return {
        totalProperties: 0,
        priceRange: { min: 0, max: 0 },
        averagePrice: 0,
        propertyTypes: [],
        locations: [],
      }
    }

    const prices = state.properties.map(p => parseFloat(p.price))
    const propertyTypes = [...new Set(state.properties.map(p => p.propertyType).filter(Boolean))]
    const locations = [...new Set(state.properties.map(p => 
      p.location ? `${p.location.city}, ${p.location.state}` : p.address
    ))]

    return {
      totalProperties: state.properties.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      propertyTypes,
      locations,
    }
  }, [state.properties])

  // Generate comparison report
  const generateComparisonReport = useCallback(() => {
    const summary = getComparisonSummary()
    const report = {
      properties: state.properties.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        squareFootage: p.squareFootage,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        propertyType: p.propertyType,
        location: p.location ? `${p.location.city}, ${p.location.state}` : p.address,
        features: p.features,
        amenities: p.amenities,
      })),
      summary,
      generatedAt: new Date().toISOString(),
    }

    return report
  }, [state.properties, getComparisonSummary])

  // Export comparison as JSON
  const exportComparison = useCallback((format: 'json' | 'csv' = 'json') => {
    const report = generateComparisonReport()
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-comparison-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      // Convert to CSV format
      const headers = ['Name', 'Price', 'Square Footage', 'Bedrooms', 'Bathrooms', 'Type', 'Location']
      const rows = state.properties.map(p => [
        p.name,
        p.price,
        p.squareFootage,
        p.bedrooms || 'N/A',
        p.bathrooms || 'N/A',
        p.propertyType || 'N/A',
        p.location ? `${p.location.city}, ${p.location.state}` : p.address,
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property-comparison-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [state.properties, generateComparisonReport])

  // Share comparison link
  const shareComparison = useCallback(() => {
    const propertyIds = state.properties.map(p => p.id).join(',')
    const shareUrl = `${window.location.origin}/compare?properties=${propertyIds}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Property Comparison',
        text: `Check out this property comparison on FlowGrow`,
        url: shareUrl,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        setState(prev => ({
          ...prev,
          error: null,
        }))
        // You could show a toast notification here
      }).catch(() => {
        setState(prev => ({
          ...prev,
          error: 'Failed to copy link to clipboard',
        }))
      })
    }
  }, [state.properties])

  // Initialize comparison from URL parameters
  const initializeFromUrl = useCallback(async (propertyIds: string[]) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // In a real app, you would fetch properties by IDs from your API
      const properties: Property[] = [] // This would be populated from API
      
      setState(prev => ({
        ...prev,
        properties: properties.slice(0, maxProperties),
        isLoading: false,
      }))
      
      saveComparison(properties.slice(0, maxProperties))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load properties',
        isLoading: false,
      }))
    }
  }, [maxProperties, saveComparison])

  // Load comparison on mount
  useEffect(() => {
    loadComparison()
  }, [loadComparison])

  return {
    ...state,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonCount,
    isComparisonFull,
    getComparisonSummary,
    generateComparisonReport,
    exportComparison,
    shareComparison,
    initializeFromUrl,
    loadComparison,
  }
}
