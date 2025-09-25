'use client'

import React, { useState } from 'react'
import { AgentSearchFilters, AgentSpecialty } from '../../types/agent'

interface AgentSearchProps {
  onSearch: (filters: AgentSearchFilters) => void
  onClear: () => void
}

export function AgentSearch({ onSearch, onClear }: AgentSearchProps) {
  const [filters, setFilters] = useState<AgentSearchFilters>({
    isVerified: true,
  })

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

  const specialties: AgentSpecialty[] = [
    'residential',
    'commercial',
    'luxury',
    'investment',
    'first_time_buyers',
    'relocation',
    'foreclosure',
    'new_construction',
    'condos',
    'townhouses',
    'single_family',
    'multi_family',
  ]

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
  ]

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleSpecialtyChange = (specialty: AgentSpecialty, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      specialties: checked
        ? [...(prev.specialties || []), specialty]
        : (prev.specialties || []).filter(s => s !== specialty),
    }))
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      languages: checked
        ? [...(prev.languages || []), language]
        : (prev.languages || []).filter(l => l !== language),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleClear = () => {
    setFilters({ isVerified: true })
    onClear()
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Filters */}
        <div className="border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">Basic Filters</h3>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSections.has('basic') ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.has('basic') && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Experience Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="50"
                    value={filters.experience?.min || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      experience: {
                        min: parseInt(e.target.value) || 0,
                        max: prev.experience?.max || 50,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="50"
                    value={filters.experience?.max || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      experience: {
                        min: prev.experience?.min || 0,
                        max: parseInt(e.target.value) || 50,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating?.min || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    rating: { min: parseFloat(e.target.value) || 0 },
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Commission Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Rate (%)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.commissionRate?.min || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      commissionRate: {
                        min: parseFloat(e.target.value) || 0,
                        max: prev.commissionRate?.max || 10,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.commissionRate?.max || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      commissionRate: {
                        min: prev.commissionRate?.min || 0,
                        max: parseFloat(e.target.value) || 10,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified"
                  checked={filters.isVerified || false}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    isVerified: e.target.checked,
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                  Verified Agents Only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Specialties */}
        <div className="border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('specialties')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSections.has('specialties') ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.has('specialties') && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {specialties.map((specialty) => (
                <label key={specialty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.specialties?.includes(specialty) || false}
                    onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900 capitalize">
                    {specialty.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('languages')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">Languages</h3>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSections.has('languages') ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.has('languages') && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {languages.map((language) => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.languages?.includes(language) || false}
                    onChange={(e) => handleLanguageChange(language, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">{language}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Service Areas */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('areas')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">Service Areas</h3>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedSections.has('areas') ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.has('areas') && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter city, state, or zip code"
                value={filters.serviceAreas?.[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  serviceAreas: e.target.value ? [e.target.value] : undefined,
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search Agents
          </button>
        </div>
      </form>
    </div>
  )
}