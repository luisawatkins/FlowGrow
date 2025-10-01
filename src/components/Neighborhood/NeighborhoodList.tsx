// Neighborhood List Component
// Display list of neighborhoods with search results

'use client';

import React from 'react';
import { Neighborhood } from '@/types/neighborhood';
import { NeighborhoodCard } from './NeighborhoodCard';

interface NeighborhoodListProps {
  neighborhoods: Neighborhood[];
  loading?: boolean;
  onNeighborhoodSelect: (neighborhood: Neighborhood) => void;
  selectedNeighborhood?: Neighborhood | null;
  className?: string;
}

export const NeighborhoodList: React.FC<NeighborhoodListProps> = ({
  neighborhoods,
  loading = false,
  onNeighborhoodSelect,
  selectedNeighborhood,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`neighborhood-list ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (neighborhoods.length === 0) {
    return (
      <div className={`neighborhood-list ${className}`}>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No neighborhoods found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`neighborhood-list ${className}`}>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Found {neighborhoods.length} neighborhood{neighborhoods.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map((neighborhood) => (
          <NeighborhoodCard
            key={neighborhood.id}
            neighborhood={neighborhood}
            onClick={() => onNeighborhoodSelect(neighborhood)}
            isSelected={selectedNeighborhood?.id === neighborhood.id}
          />
        ))}
      </div>
    </div>
  );
};
