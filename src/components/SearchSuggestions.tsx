'use client'

import { useState, useEffect, useRef } from 'react'
import { Property } from '@/types'
import { getEnhancedSearchSuggestions, SearchSuggestion } from '@/lib/searchUtils'

interface SearchSuggestionsProps {
  query: string
  properties: Property[]
  onSuggestionClick: (suggestion: string) => void
  onClose: () => void
  isVisible: boolean
  className?: string
}

export function SearchSuggestions({
  query,
  properties,
  onSuggestionClick,
  onClose,
  isVisible,
  className = ''
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newSuggestions = getEnhancedSearchSuggestions(properties, query)
    setSuggestions(newSuggestions)
    setSelectedIndex(-1)
  }, [query, properties])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSuggestionClick(suggestions[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, suggestions, selectedIndex, onSuggestionClick, onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible || suggestions.length === 0) {
    return null
  }

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const category = suggestion.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(suggestion)
    return groups
  }, {} as Record<string, SearchSuggestion[]>)

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'property': return '🏠'
      case 'location': return '📍'
      case 'type': return '🏘️'
      case 'recent': return '🕒'
      case 'saved': return '⭐'
      default: return '🔍'
    }
  }

  return (
    <div
      ref={containerRef}
      className={`absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${className}`}
    >
      <div className="p-2">
        {query.trim() && (
          <div className="text-xs text-gray-500 mb-2 px-2">
            Suggestions for "{query}"
          </div>
        )}
        {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
          <div key={category} className="mb-2">
            <div className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-50 rounded">
              {category}
            </div>
            {categorySuggestions.map((suggestion, index) => {
              const globalIndex = suggestions.indexOf(suggestion)
              return (
                <button
                  key={`${category}-${index}`}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className={`w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
                    globalIndex === selectedIndex ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{getSuggestionIcon(suggestion.type)}</span>
                    <span className="truncate">{suggestion.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// Enhanced search input with suggestions and debouncing
interface SearchInputWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  properties: Property[]
  className?: string
  debounceMs?: number
}

export function SearchInputWithSuggestions({
  value,
  onChange,
  onSearch,
  placeholder = "Search properties...",
  properties,
  className = '',
  debounceMs = 300
}: SearchInputWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
    
    // Trigger search immediately when suggestion is clicked
    if (onSearch) {
      onSearch(suggestion)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(true)
    setIsSearching(true)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    if (onSearch) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(newValue)
        setIsSearching(false)
      }, debounceMs)
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => setShowSuggestions(false), 150)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault()
      onSearch(value)
      setShowSuggestions(false)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      <SearchSuggestions
        query={value}
        properties={properties}
        onSuggestionClick={handleSuggestionClick}
        onClose={() => setShowSuggestions(false)}
        isVisible={showSuggestions}
      />
    </div>
  )
}
