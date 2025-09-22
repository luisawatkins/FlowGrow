import {
  filterProperties,
  calculateSearchScore,
  highlightSearchTerms,
  classifyPropertyType,
  extractLocation,
  getFilterSummary,
  getEnhancedSearchSuggestions,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
  useSavedSearch,
} from '@/lib/searchUtils'
import { Property } from '@/types'
import { FilterOptions } from '@/components/FilterBar'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('searchUtils', () => {
  const mockProperties: Property[] = [
    {
      id: '1',
      name: 'Downtown Luxury Condo',
      description: 'Modern 2-bedroom condo with city views',
      address: '123 Main St, Downtown, NY 10001',
      squareFootage: 1200,
      price: '150.50',
      owner: '0x1234...5678',
      isListed: true,
      tokenId: '1',
      contractAddress: '0x1234...5678',
    },
    {
      id: '2',
      name: 'Suburban Family Home',
      description: 'Spacious 4-bedroom home with large backyard',
      address: '456 Oak Ave, Suburbia, CA 90210',
      squareFootage: 2500,
      price: '300.75',
      owner: '0x9876...5432',
      isListed: true,
      tokenId: '2',
      contractAddress: '0x1234...5678',
    },
    {
      id: '3',
      name: 'Beachfront Villa',
      description: 'Stunning oceanfront property with private beach access',
      address: '789 Ocean Dr, Seaside, FL 33101',
      squareFootage: 3500,
      price: '500.00',
      owner: '0xabcd...efgh',
      isListed: false,
      tokenId: '3',
      contractAddress: '0x1234...5678',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('classifyPropertyType', () => {
    it('classifies condo correctly', () => {
      const property = { ...mockProperties[0], name: 'Luxury Condo' }
      expect(classifyPropertyType(property)).toBe('condo')
    })

    it('classifies house correctly', () => {
      const property = { ...mockProperties[1], name: 'Family Home' }
      expect(classifyPropertyType(property)).toBe('house')
    })

    it('classifies villa correctly', () => {
      const property = { ...mockProperties[2], name: 'Beachfront Villa' }
      expect(classifyPropertyType(property)).toBe('villa')
    })

    it('defaults to house for unknown types', () => {
      const property = { ...mockProperties[0], name: 'Unknown Property' }
      expect(classifyPropertyType(property)).toBe('house')
    })
  })

  describe('extractLocation', () => {
    it('extracts city from address', () => {
      expect(extractLocation('123 Main St, Downtown, NY 10001')).toBe('Downtown, NY 10001')
    })

    it('returns full address if no comma found', () => {
      expect(extractLocation('123 Main St')).toBe('123 Main St')
    })
  })

  describe('highlightSearchTerms', () => {
    it('returns empty array for empty search term', () => {
      expect(highlightSearchTerms('test text', '')).toEqual([])
    })

    it('finds matching terms', () => {
      expect(highlightSearchTerms('Downtown Luxury Condo', 'downtown')).toEqual(['downtown'])
    })

    it('finds multiple matching terms', () => {
      expect(highlightSearchTerms('Downtown Luxury Condo', 'downtown luxury')).toEqual(['downtown', 'luxury'])
    })
  })

  describe('calculateSearchScore', () => {
    it('returns 1 for empty search term', () => {
      expect(calculateSearchScore(mockProperties[0], '')).toBe(1)
    })

    it('gives highest score for exact name match', () => {
      const score = calculateSearchScore(mockProperties[0], 'Downtown Luxury Condo')
      expect(score).toBeGreaterThan(100)
    })

    it('gives good score for partial name match', () => {
      const score = calculateSearchScore(mockProperties[0], 'downtown')
      expect(score).toBeGreaterThan(50)
    })

    it('gives lower score for description match', () => {
      const score = calculateSearchScore(mockProperties[0], 'modern')
      expect(score).toBeGreaterThan(30)
    })
  })

  describe('filterProperties', () => {
    const defaultFilters: FilterOptions = {
      searchTerm: '',
      priceRange: { min: 0, max: 1000 },
      squareFootageRange: { min: 0, max: 10000 },
      propertyType: 'all',
      location: '',
      sortBy: 'date',
      sortOrder: 'desc',
      availability: 'all',
    }

    it('returns all properties with default filters', () => {
      const results = filterProperties(mockProperties, defaultFilters)
      expect(results).toHaveLength(3)
    })

    it('filters by search term', () => {
      const filters = { ...defaultFilters, searchTerm: 'downtown' }
      const results = filterProperties(mockProperties, filters)
      expect(results).toHaveLength(1)
      expect(results[0].property.name).toBe('Downtown Luxury Condo')
    })

    it('filters by price range', () => {
      const filters = { ...defaultFilters, priceRange: { min: 200, max: 400 } }
      const results = filterProperties(mockProperties, filters)
      expect(results).toHaveLength(1)
      expect(results[0].property.name).toBe('Suburban Family Home')
    })

    it('filters by square footage range', () => {
      const filters = { ...defaultFilters, squareFootageRange: { min: 2000, max: 3000 } }
      const results = filterProperties(mockProperties, filters)
      expect(results).toHaveLength(1)
      expect(results[0].property.name).toBe('Suburban Family Home')
    })

    it('filters by property type', () => {
      const filters = { ...defaultFilters, propertyType: 'condo' }
      const results = filterProperties(mockProperties, filters)
      expect(results).toHaveLength(1)
      expect(results[0].property.name).toBe('Downtown Luxury Condo')
    })

    it('filters by availability', () => {
      const filters = { ...defaultFilters, availability: 'available' }
      const results = filterProperties(mockProperties, filters)
      expect(results).toHaveLength(2)
    })

    it('sorts by price ascending', () => {
      const filters = { ...defaultFilters, sortBy: 'price', sortOrder: 'asc' }
      const results = filterProperties(mockProperties, filters)
      expect(parseFloat(results[0].property.price)).toBeLessThan(parseFloat(results[1].property.price))
    })

    it('sorts by name descending', () => {
      const filters = { ...defaultFilters, sortBy: 'name', sortOrder: 'desc' }
      const results = filterProperties(mockProperties, filters)
      expect(results[0].property.name).toBe('Suburban Family Home')
    })
  })

  describe('getFilterSummary', () => {
    it('returns empty array for default filters', () => {
      const defaultFilters: FilterOptions = {
        searchTerm: '',
        priceRange: { min: 0, max: 1000 },
        squareFootageRange: { min: 0, max: 10000 },
        propertyType: 'all',
        location: '',
        sortBy: 'date',
        sortOrder: 'desc',
        availability: 'all',
      }
      expect(getFilterSummary(defaultFilters)).toEqual([])
    })

    it('includes search term in summary', () => {
      const filters: FilterOptions = {
        searchTerm: 'downtown',
        priceRange: { min: 0, max: 1000 },
        squareFootageRange: { min: 0, max: 10000 },
        propertyType: 'all',
        location: '',
        sortBy: 'date',
        sortOrder: 'desc',
        availability: 'all',
      }
      const summary = getFilterSummary(filters)
      expect(summary).toContain('Search: "downtown"')
    })

    it('includes price range in summary', () => {
      const filters: FilterOptions = {
        searchTerm: '',
        priceRange: { min: 100, max: 200 },
        squareFootageRange: { min: 0, max: 10000 },
        propertyType: 'all',
        location: '',
        sortBy: 'date',
        sortOrder: 'desc',
        availability: 'all',
      }
      const summary = getFilterSummary(filters)
      expect(summary).toContain('Price: 100-200 FLOW')
    })
  })

  describe('getEnhancedSearchSuggestions', () => {
    it('returns recent searches when no query', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([
        { id: '1', query: 'downtown', filters: {}, timestamp: Date.now(), resultCount: 1 }
      ]))
      
      const suggestions = getEnhancedSearchSuggestions(mockProperties, '')
      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].text).toBe('downtown')
      expect(suggestions[0].type).toBe('recent')
    })

    it('returns property suggestions for query', () => {
      const suggestions = getEnhancedSearchSuggestions(mockProperties, 'downtown')
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.some(s => s.text === 'Downtown Luxury Condo')).toBe(true)
    })
  })

  describe('search history management', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('[]')
    })

    it('saves search history', () => {
      const filters: FilterOptions = {
        searchTerm: 'test',
        priceRange: { min: 0, max: 1000 },
        squareFootageRange: { min: 0, max: 10000 },
        propertyType: 'all',
        location: '',
        sortBy: 'date',
        sortOrder: 'desc',
        availability: 'all',
      }

      saveSearchHistory('test', filters, 5)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('gets search history', () => {
      const mockHistory = [{ id: '1', query: 'test', filters: {}, timestamp: Date.now(), resultCount: 5 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory))

      const history = getSearchHistory()
      expect(history).toEqual(mockHistory)
    })

    it('clears search history', () => {
      clearSearchHistory()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('flowgrow_search_history')
    })
  })

  describe('saved searches management', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('[]')
    })

    it('saves a search', () => {
      const filters: FilterOptions = {
        searchTerm: 'test',
        priceRange: { min: 0, max: 1000 },
        squareFootageRange: { min: 0, max: 10000 },
        propertyType: 'all',
        location: '',
        sortBy: 'date',
        sortOrder: 'desc',
        availability: 'all',
      }

      const id = saveSearch('My Search', 'test', filters)
      expect(typeof id).toBe('string')
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('gets saved searches', () => {
      const mockSearches = [{ id: '1', name: 'Test Search', query: 'test', filters: {}, createdAt: Date.now(), lastUsed: Date.now(), useCount: 1 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSearches))

      const searches = getSavedSearches()
      expect(searches).toEqual(mockSearches)
    })

    it('deletes a saved search', () => {
      deleteSavedSearch('test-id')
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('updates saved search usage', () => {
      const mockSearches = [{ id: '1', name: 'Test Search', query: 'test', filters: {}, createdAt: Date.now(), lastUsed: Date.now(), useCount: 1 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSearches))

      useSavedSearch('1')
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })
})
