'use client'

import { useState, useEffect, useRef } from 'react'
import { Property } from '@/types'
import { getSearchSuggestions } from '@/lib/searchUtils'

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
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      const newSuggestions = getSearchSuggestions(properties, query)
      setSuggestions(newSuggestions)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
    }
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

  return (
    <div
      ref={containerRef}
      className={`absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto ${className}`}
    >
      <div className="p-2">
        <div className="text-xs text-gray-500 mb-2 px-2">
          Suggestions for "{query}"
        </div>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className={`w-full text-left px-2 py-2 rounded hover:bg-gray-100 transition-colors ${
              index === selectedIndex ? 'bg-blue-100 text-blue-800' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">🔍</span>
              <span className="truncate">{suggestion}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Enhanced search input with suggestions
interface SearchInputWithSuggestionsProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  properties: Property[]
  className?: string
}

export function SearchInputWithSuggestions({
  value,
  onChange,
  placeholder = "Search properties...",
  properties,
  className = ''
}: SearchInputWithSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setShowSuggestions(true)
  }

  const handleInputFocus = () => {
    if (value.length >= 2) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => setShowSuggestions(false), 150)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
