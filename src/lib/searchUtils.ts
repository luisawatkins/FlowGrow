import { Property } from '@/types'
import { FilterOptions } from '@/components/FilterBar'

// Search history management
export interface SearchHistoryItem {
  id: string
  query: string
  filters: FilterOptions
  timestamp: number
  resultCount: number
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: FilterOptions
  createdAt: number
  lastUsed: number
  useCount: number
}

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

// Search history management
const SEARCH_HISTORY_KEY = 'flowgrow_search_history'
const SAVED_SEARCHES_KEY = 'flowgrow_saved_searches'
const MAX_HISTORY_ITEMS = 20

export function saveSearchHistory(query: string, filters: FilterOptions, resultCount: number): void {
  if (!query.trim()) return

  const history = getSearchHistory()
  const newItem: SearchHistoryItem = {
    id: Date.now().toString(),
    query,
    filters: { ...filters },
    timestamp: Date.now(),
    resultCount
  }

  // Remove duplicate if exists
  const filteredHistory = history.filter(item => 
    item.query !== query || JSON.stringify(item.filters) !== JSON.stringify(filters)
  )

  // Add new item and limit to max items
  const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.warn('Failed to save search history:', error)
  }
}

export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn('Failed to load search history:', error)
    return []
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch (error) {
    console.warn('Failed to clear search history:', error)
  }
}

export function saveSearch(name: string, query: string, filters: FilterOptions): string {
  const savedSearches = getSavedSearches()
  const newSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    query,
    filters: { ...filters },
    createdAt: Date.now(),
    lastUsed: Date.now(),
    useCount: 1
  }

  const updatedSearches = [...savedSearches, newSearch]
  
  try {
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches))
    return newSearch.id
  } catch (error) {
    console.warn('Failed to save search:', error)
    throw error
  }
}

export function getSavedSearches(): SavedSearch[] {
  try {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn('Failed to load saved searches:', error)
    return []
  }
}

export function updateSavedSearch(id: string, updates: Partial<SavedSearch>): void {
  const savedSearches = getSavedSearches()
  const updatedSearches = savedSearches.map(search => 
    search.id === id ? { ...search, ...updates } : search
  )
  
  try {
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches))
  } catch (error) {
    console.warn('Failed to update saved search:', error)
  }
}

export function deleteSavedSearch(id: string): void {
  const savedSearches = getSavedSearches()
  const updatedSearches = savedSearches.filter(search => search.id !== id)
  
  try {
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches))
  } catch (error) {
    console.warn('Failed to delete saved search:', error)
  }
}

export function useSavedSearch(id: string): void {
  updateSavedSearch(id, {
    lastUsed: Date.now(),
    useCount: (getSavedSearches().find(s => s.id === id)?.useCount || 0) + 1
  })
}

// Enhanced search suggestions with categories
export interface SearchSuggestion {
  text: string
  type: 'property' | 'location' | 'type' | 'recent' | 'saved'
  category?: string
}

export function getEnhancedSearchSuggestions(
  properties: Property[], 
  query: string,
  includeHistory: boolean = true,
  includeSaved: boolean = true
): SearchSuggestion[] {
  if (!query.trim() || query.length < 2) {
    // Return recent searches and saved searches when no query
    const suggestions: SearchSuggestion[] = []
    
    if (includeHistory) {
      const recentSearches = getSearchHistory().slice(0, 3)
      suggestions.push(...recentSearches.map(item => ({
        text: item.query,
        type: 'recent' as const,
        category: 'Recent Searches'
      })))
    }
    
    if (includeSaved) {
      const savedSearches = getSavedSearches().slice(0, 3)
      suggestions.push(...savedSearches.map(search => ({
        text: search.name,
        type: 'saved' as const,
        category: 'Saved Searches'
      })))
    }
    
    return suggestions
  }

  const suggestions: SearchSuggestion[] = []
  const queryLower = query.toLowerCase()

  // Property name suggestions
  properties.forEach(property => {
    if (property.name.toLowerCase().includes(queryLower)) {
      suggestions.push({
        text: property.name,
        type: 'property',
        category: 'Properties'
      })
    }
  })

  // Location suggestions
  const locations = new Set<string>()
  properties.forEach(property => {
    const location = extractLocation(property.address)
    if (location.toLowerCase().includes(queryLower)) {
      locations.add(location)
    }
  })
  suggestions.push(...Array.from(locations).map(location => ({
    text: location,
    type: 'location',
    category: 'Locations'
  })))

  // Property type suggestions
  const types = new Set<string>()
  properties.forEach(property => {
    const propertyType = classifyPropertyType(property)
    if (propertyType.includes(queryLower)) {
      types.add(propertyType)
    }
  })
  suggestions.push(...Array.from(types).map(type => ({
    text: type,
    type: 'type',
    category: 'Property Types'
  })))

  // Recent searches that match
  if (includeHistory) {
    const recentSearches = getSearchHistory()
    recentSearches.forEach(item => {
      if (item.query.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: item.query,
          type: 'recent',
          category: 'Recent Searches'
        })
      }
    })
  }

  // Saved searches that match
  if (includeSaved) {
    const savedSearches = getSavedSearches()
    savedSearches.forEach(search => {
      if (search.name.toLowerCase().includes(queryLower) || 
          search.query.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: search.name,
          type: 'saved',
          category: 'Saved Searches'
        })
      }
    })
  }

  // Remove duplicates and limit results
  const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
    index === self.findIndex(s => s.text === suggestion.text)
  )

  return uniqueSuggestions.slice(0, 8)
}

// Legacy function for backward compatibility
export function getSearchSuggestions(properties: Property[], query: string): string[] {
  return getEnhancedSearchSuggestions(properties, query).map(s => s.text)
}
