// Neighborhood Card Component
// Individual neighborhood card display

'use client';

import React from 'react';
import { Neighborhood } from '@/types/neighborhood';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  onClick: () => void;
  isSelected?: boolean;
  className?: string;
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({
  neighborhood,
  onClick,
  isSelected = false,
  className = ''
}) => {
  return (
    <div
      className={`neighborhood-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {neighborhood.imageUrl ? (
          <img
            src={neighborhood.imageUrl}
            alt={neighborhood.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
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
          </div>
        )}
        
        {/* Location Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {neighborhood.city}, {neighborhood.state}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {neighborhood.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {neighborhood.description}
        </p>

        {/* Location Info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{neighborhood.zipCode}</span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">Active</span>
            </div>
          </div>
          
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
};
