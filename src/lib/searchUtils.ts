import { Property } from '@/types'
import { FilterOptions } from '@/components/FilterBar'

export interface SearchResult {
  property: Property
  score: number
  highlights: {
    name?: string[]
    description?: string[]
    address?: string[]
  }
}

// Property type classification based on name and description
export function classifyPropertyType(property: Property): string {
  const text = `${property.name} ${property.description}`.toLowerCase()
  
  if (text.includes('condo') || text.includes('condominium')) return 'condo'
  if (text.includes('house') || text.includes('home') || text.includes('residence')) return 'house'
  if (text.includes('villa') || text.includes('mansion') || text.includes('estate')) return 'villa'
  if (text.includes('apartment') || text.includes('apt') || text.includes('unit')) return 'apartment'
  
  return 'house' // default
}

// Extract location from address
export function extractLocation(address: string): string {
  // Simple extraction - in a real app, you might use a geocoding service
  const parts = address.split(',').map(part => part.trim())
  if (parts.length >= 2) {
    return parts[1] // Usually city, state
  }
  return address
}

// Highlight search terms in text
export function highlightSearchTerms(text: string, searchTerm: string): string[] {
  if (!searchTerm.trim()) return []
  
  const terms = searchTerm.toLowerCase().split(/\s+/).filter(term => term.length > 0)
  const highlights: string[] = []
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    if (regex.test(text)) {
      highlights.push(term)
    }
  })
  
  return highlights
}

// Calculate search score based on relevance
export function calculateSearchScore(property: Property, searchTerm: string): number {
  if (!searchTerm.trim()) return 1
  
  const searchLower = searchTerm.toLowerCase()
  const nameLower = property.name.toLowerCase()
  const descLower = property.description.toLowerCase()
  const addrLower = property.address.toLowerCase()
  
  let score = 0
  
  // Exact name match gets highest score
  if (nameLower === searchLower) score += 100
  
  // Name contains search term
  if (nameLower.includes(searchLower)) score += 50
  
  // Description contains search term
  if (descLower.includes(searchLower)) score += 30
  
  // Address contains search term
  if (addrLower.includes(searchLower)) score += 20
  
  // Partial word matches
  const searchWords = searchLower.split(/\s+/)
  searchWords.forEach(word => {
    if (word.length > 2) {
      if (nameLower.includes(word)) score += 10
      if (descLower.includes(word)) score += 5
      if (addrLower.includes(word)) score += 3
    }
  })
  
  return Math.max(score, 0)
}

// Filter properties based on filter options
export function filterProperties(properties: Property[], filters: FilterOptions): SearchResult[] {
  return properties
    .map(property => {
      const score = calculateSearchScore(property, filters.searchTerm)
      const highlights = {
        name: highlightSearchTerms(property.name, filters.searchTerm),
        description: highlightSearchTerms(property.description, filters.searchTerm),
        address: highlightSearchTerms(property.address, filters.searchTerm),
      }
      
      return { property, score, highlights }
    })
    .filter(({ property }) => {
      // Search term filter
      if (filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesSearch = 
          property.name.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }
      
      // Price range filter
      const price = parseFloat(property.price)
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }
      
      // Square footage filter
      if (property.squareFootage < filters.squareFootageRange.min || 
          property.squareFootage > filters.squareFootageRange.max) {
        return false
      }
      
      // Property type filter
      if (filters.propertyType !== 'all') {
        const propertyType = classifyPropertyType(property)
        if (propertyType !== filters.propertyType) {
          return false
        }
      }
      
      // Location filter
      if (filters.location.trim()) {
        const location = extractLocation(property.address)
        if (!location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false
        }
      }
      
      // Availability filter
      if (filters.availability === 'available' && !property.isListed) {
        return false
      }
      if (filters.availability === 'sold' && property.isListed) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Sort by score first (relevance), then by the specified sort criteria
      if (a.score !== b.score) {
        return b.score - a.score
      }
      
      switch (filters.sortBy) {
        case 'price':
          const priceA = parseFloat(a.property.price)
          const priceB = parseFloat(b.property.price)
          return filters.sortOrder === 'asc' ? priceA - priceB : priceB - priceA
          
        case 'name':
          const nameComparison = a.property.name.localeCompare(b.property.name)
          return filters.sortOrder === 'asc' ? nameComparison : -nameComparison
          
        case 'squareFootage':
          const sizeComparison = a.property.squareFootage - b.property.squareFootage
          return filters.sortOrder === 'asc' ? sizeComparison : -sizeComparison
          
        case 'date':
        default:
          const dateA = new Date(a.property.createdAt || 0).getTime()
          const dateB = new Date(b.property.createdAt || 0).getTime()
          return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      }
    })
}

// Get filter summary for display
export function getFilterSummary(filters: FilterOptions): string[] {
  const summary: string[] = []
  
  if (filters.searchTerm) {
    summary.push(`Search: "${filters.searchTerm}"`)
  }
  
  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    summary.push(`Price: ${filters.priceRange.min}-${filters.priceRange.max} FLOW`)
  }
  
  if (filters.squareFootageRange.min > 0 || filters.squareFootageRange.max < 10000) {
    summary.push(`Size: ${filters.squareFootageRange.min}-${filters.squareFootageRange.max} sq ft`)
  }
  
  if (filters.propertyType !== 'all') {
    summary.push(`Type: ${filters.propertyType}`)
  }
  
  if (filters.location) {
    summary.push(`Location: ${filters.location}`)
  }
  
  if (filters.availability !== 'all') {
    summary.push(`Status: ${filters.availability}`)
  }
  
  return summary
}

// Search suggestions based on property data
export function getSearchSuggestions(properties: Property[], query: string): string[] {
  if (!query.trim() || query.length < 2) return []
  
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()
  
  properties.forEach(property => {
    // Add property names that match
    if (property.name.toLowerCase().includes(queryLower)) {
      suggestions.add(property.name)
    }
    
    // Add locations that match
    const location = extractLocation(property.address)
    if (location.toLowerCase().includes(queryLower)) {
      suggestions.add(location)
    }
    
    // Add property types that match
    const propertyType = classifyPropertyType(property)
    if (propertyType.includes(queryLower)) {
      suggestions.add(propertyType)
    }
  })
  
  return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
}
