// Neighborhood Map Component
// Map view for neighborhoods

'use client';

import React from 'react';
import { Neighborhood } from '@/types/neighborhood';

interface NeighborhoodMapProps {
  neighborhoods: Neighborhood[];
  selectedNeighborhood?: Neighborhood | null;
  onNeighborhoodSelect: (neighborhood: Neighborhood) => void;
  loading?: boolean;
  className?: string;
}

export const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({
  neighborhoods,
  selectedNeighborhood,
  onNeighborhoodSelect,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`neighborhood-map ${className}`}>
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`neighborhood-map ${className}`}>
      {/* Map Placeholder */}
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
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
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Interactive Map</h3>
          <p className="mt-1 text-sm text-gray-500">
            Map integration would be implemented here with a service like Google Maps or Mapbox
          </p>
        </div>
      </div>

      {/* Map Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Neighborhoods ({neighborhoods.length})</span>
          </div>
          {selectedNeighborhood && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Satellite
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Terrain
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Street
          </button>
        </div>
      </div>

      {/* Neighborhood List for Map View */}
      {neighborhoods.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhoods on Map</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedNeighborhood?.id === neighborhood.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onNeighborhoodSelect(neighborhood)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{neighborhood.name}</h4>
                    <p className="text-sm text-gray-600">
                      {neighborhood.city}, {neighborhood.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {neighborhood.coordinates.latitude.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {neighborhood.coordinates.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
