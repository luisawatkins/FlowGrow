// Neighborhood Explorer Component
// Main component for neighborhood exploration and analysis

'use client';

import React, { useState, useEffect } from 'react';
import { useNeighborhood } from '@/hooks/useNeighborhood';
import { useNeighborhoodAmenities } from '@/hooks/useNeighborhoodAmenities';
import { useNeighborhoodAnalysis } from '@/hooks/useNeighborhoodAnalysis';
import {
  Neighborhood,
  NeighborhoodSearchRequest,
  NeighborhoodDetailsRequest,
  AmenityType,
  AmenityCategory
} from '@/types/neighborhood';
import { NeighborhoodSearch } from './Neighborhood/NeighborhoodSearch';
import { NeighborhoodList } from './Neighborhood/NeighborhoodList';
import { NeighborhoodDetail } from './Neighborhood/NeighborhoodDetail';
import { NeighborhoodMap } from './Neighborhood/NeighborhoodMap';
import { NeighborhoodFilters } from './Neighborhood/NeighborhoodFilters';

interface NeighborhoodExplorerProps {
  initialQuery?: string;
  initialFilters?: any;
  onNeighborhoodSelect?: (neighborhood: Neighborhood) => void;
  showMap?: boolean;
  showFilters?: boolean;
  className?: string;
}

export const NeighborhoodExplorer: React.FC<NeighborhoodExplorerProps> = ({
  initialQuery = '',
  initialFilters = {},
  onNeighborhoodSelect,
  showMap = true,
  showFilters = true,
  className = ''
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { neighborhoods, loading, error, searchNeighborhoods, getNeighborhoodDetails } = useNeighborhood();
  const { amenities, searchAmenities } = useNeighborhoodAmenities();
  const { analysis, getAnalysis } = useNeighborhoodAnalysis();

  // Initial search
  useEffect(() => {
    if (initialQuery || Object.keys(initialFilters).length > 0) {
      handleSearch(initialQuery, initialFilters);
    }
  }, [initialQuery, initialFilters]);

  const handleSearch = async (query: string, searchFilters: any = {}) => {
    const request: NeighborhoodSearchRequest = {
      query: query || undefined,
      filters: searchFilters,
      limit: 20,
      sortBy: 'relevance'
    };

    try {
      await searchNeighborhoods(request);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleNeighborhoodSelect = async (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    setViewMode('detail');
    
    if (onNeighborhoodSelect) {
      onNeighborhoodSelect(neighborhood);
    }

    // Load additional data for the selected neighborhood
    try {
      const detailsRequest: NeighborhoodDetailsRequest = {
        neighborhoodId: neighborhood.id,
        includeAmenities: true,
        includeDemographics: true,
        includeSchools: true,
        includeCrime: true,
        includeTransportation: true,
        includeAnalysis: true
      };

      await getNeighborhoodDetails(detailsRequest);
      await getAnalysis(neighborhood.id);
    } catch (err) {
      console.error('Failed to load neighborhood details:', err);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedNeighborhood(null);
  };

  const handleViewModeChange = (mode: 'list' | 'map' | 'detail') => {
    setViewMode(mode);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    handleSearch(searchQuery, newFilters);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    handleSearch(query, filters);
  };

  if (error) {
    return (
      <div className={`neighborhood-explorer ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`neighborhood-explorer ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Neighborhood Explorer</h1>
        <p className="text-gray-600">
          Discover neighborhoods, explore amenities, and analyze local data
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <NeighborhoodSearch
          query={searchQuery}
          onQueryChange={handleSearchQueryChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {showFilters && (
          <NeighborhoodFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => handleViewModeChange('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List View
          </button>
          {showMap && (
            <button
              onClick={() => handleViewModeChange('map')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Map View
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === 'list' && (
          <NeighborhoodList
            neighborhoods={neighborhoods}
            loading={loading}
            onNeighborhoodSelect={handleNeighborhoodSelect}
            selectedNeighborhood={selectedNeighborhood}
          />
        )}

        {viewMode === 'map' && showMap && (
          <NeighborhoodMap
            neighborhoods={neighborhoods}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodSelect={handleNeighborhoodSelect}
            loading={loading}
          />
        )}

        {viewMode === 'detail' && selectedNeighborhood && (
          <NeighborhoodDetail
            neighborhood={selectedNeighborhood}
            amenities={amenities}
            analysis={analysis}
            onBack={handleBackToList}
            loading={loading}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading neighborhoods...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
