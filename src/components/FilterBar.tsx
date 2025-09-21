'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SearchInputWithSuggestions } from './SearchSuggestions'
import { Property } from '@/types'

export interface FilterOptions {
  searchTerm: string
  priceRange: {
    min: number
    max: number
  }
  squareFootageRange: {
    min: number
    max: number
  }
  propertyType: 'all' | 'condo' | 'house' | 'villa' | 'apartment'
  location: string
  sortBy: 'price' | 'name' | 'date' | 'squareFootage'
  sortOrder: 'asc' | 'desc'
  availability: 'all' | 'available' | 'sold'
}

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  totalResults: number
  properties: Property[]
  className?: string
}

const DEFAULT_FILTERS: FilterOptions = {
  searchTerm: '',
  priceRange: { min: 0, max: 1000 },
  squareFootageRange: { min: 0, max: 10000 },
  propertyType: 'all',
  location: '',
  sortBy: 'date',
  sortOrder: 'desc',
  availability: 'all',
}

export function FilterBar({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalResults,
  properties,
  className = '' 
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }, [localFilters, onFiltersChange])

  const handleSearchChange = useCallback((value: string) => {
    updateFilter('searchTerm', value)
  }, [updateFilter])

  const handlePriceRangeChange = useCallback((field: 'min' | 'max', value: number) => {
    updateFilter('priceRange', { ...localFilters.priceRange, [field]: value })
  }, [updateFilter, localFilters.priceRange])

  const handleSquareFootageRangeChange = useCallback((field: 'min' | 'max', value: number) => {
    updateFilter('squareFootageRange', { ...localFilters.squareFootageRange, [field]: value })
  }, [updateFilter, localFilters.squareFootageRange])

  const handleClearFilters = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS)
    onClearFilters()
  }, [onClearFilters])

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof FilterOptions]
    if (key === 'priceRange' || key === 'squareFootageRange') {
      const range = value as { min: number; max: number }
      return range.min !== DEFAULT_FILTERS[key as keyof FilterOptions].min || 
             range.max !== DEFAULT_FILTERS[key as keyof FilterOptions].max
    }
    return value !== DEFAULT_FILTERS[key as keyof FilterOptions]
  })

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <SearchInputWithSuggestions
              value={localFilters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, location, or description..."
              properties={properties}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={localFilters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="name">Sort by Name</option>
              <option value="squareFootage">Sort by Size</option>
            </select>
            <select
              value={localFilters.sortOrder}
              onChange={(e) => updateFilter('sortOrder', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          {totalResults} {totalResults === 1 ? 'property' : 'properties'} found
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (FLOW)
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={localFilters.priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange('min', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={localFilters.priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value) || 1000)}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Square Footage Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage Range
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min sq ft"
                    value={localFilters.squareFootageRange.min || ''}
                    onChange={(e) => handleSquareFootageRangeChange('min', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max sq ft"
                    value={localFilters.squareFootageRange.max || ''}
                    onChange={(e) => handleSquareFootageRangeChange('max', parseInt(e.target.value) || 10000)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Property Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={localFilters.propertyType}
                  onChange={(e) => updateFilter('propertyType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="condo">Condo</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City, state, or address..."
                  value={localFilters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="flex gap-4">
                {(['all', 'available', 'sold'] as const).map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value={option}
                      checked={localFilters.availability === option}
                      onChange={(e) => updateFilter('availability', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Hook for managing filter state
export function usePropertyFilters(initialFilters: Partial<FilterOptions> = {}) {
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const resetToDefaults = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  return {
    filters,
    updateFilters,
    clearFilters,
    resetToDefaults,
  }
}
