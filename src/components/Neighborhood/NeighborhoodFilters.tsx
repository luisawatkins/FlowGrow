// Neighborhood Filters Component
// Advanced filtering for neighborhood search

'use client';

import React, { useState } from 'react';
import { NeighborhoodSearchFilters, PropertyType } from '@/types/neighborhood';

interface NeighborhoodFiltersProps {
  filters: NeighborhoodSearchFilters;
  onFiltersChange: (filters: NeighborhoodSearchFilters) => void;
  loading?: boolean;
  className?: string;
}

export const NeighborhoodFilters: React.FC<NeighborhoodFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof NeighborhoodSearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={`neighborhood-filters ${className}`}>
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg
            className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.keys(filters).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                placeholder="Enter city name"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                placeholder="Enter state"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={filters.zipCode || ''}
                onChange={(e) => handleFilterChange('zipCode', e.target.value || undefined)}
                placeholder="Enter ZIP code"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Population Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Population
              </label>
              <input
                type="number"
                value={filters.minPopulation || ''}
                onChange={(e) => handleFilterChange('minPopulation', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Minimum population"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Population
              </label>
              <input
                type="number"
                value={filters.maxPopulation || ''}
                onChange={(e) => handleFilterChange('maxPopulation', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Maximum population"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Income Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Median Income
              </label>
              <input
                type="number"
                value={filters.minMedianIncome || ''}
                onChange={(e) => handleFilterChange('minMedianIncome', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Minimum income"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Median Income
              </label>
              <input
                type="number"
                value={filters.maxMedianIncome || ''}
                onChange={(e) => handleFilterChange('maxMedianIncome', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Maximum income"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Walkability Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Walkability Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.minWalkabilityScore || ''}
                onChange={(e) => handleFilterChange('minWalkabilityScore', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0-100"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Walkability Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.maxWalkabilityScore || ''}
                onChange={(e) => handleFilterChange('maxWalkabilityScore', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0-100"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Safety Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Safety Score
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.minSafetyScore || ''}
                onChange={(e) => handleFilterChange('minSafetyScore', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0-10"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Safety Score
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.maxSafetyScore || ''}
                onChange={(e) => handleFilterChange('maxSafetyScore', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0-10"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Commute Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Commute Time (minutes)
              </label>
              <input
                type="number"
                value={filters.maxCommuteTime || ''}
                onChange={(e) => handleFilterChange('maxCommuteTime', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Maximum commute time"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={filters.priceRange?.min || ''}
                onChange={(e) => handleFilterChange('priceRange', {
                  ...filters.priceRange,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                })}
                placeholder="Min price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <input
                type="number"
                value={filters.priceRange?.max || ''}
                onChange={(e) => handleFilterChange('priceRange', {
                  ...filters.priceRange,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                })}
                placeholder="Max price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Property Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Types
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(PropertyType).map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.propertyTypes?.includes(type) || false}
                    onChange={(e) => {
                      const currentTypes = filters.propertyTypes || [];
                      const newTypes = e.target.checked
                        ? [...currentTypes, type]
                        : currentTypes.filter(t => t !== type);
                      handleFilterChange('propertyTypes', newTypes.length > 0 ? newTypes : undefined);
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
