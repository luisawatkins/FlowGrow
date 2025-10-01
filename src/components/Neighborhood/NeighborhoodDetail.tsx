// Neighborhood Detail Component
// Detailed view of a neighborhood with comprehensive information

'use client';

import React, { useState } from 'react';
import { Neighborhood, NeighborhoodAmenity, NeighborhoodAnalysis } from '@/types/neighborhood';
import { NeighborhoodOverview } from './NeighborhoodOverview';
import { NeighborhoodAmenities } from './NeighborhoodAmenities';
import { NeighborhoodAnalytics } from './NeighborhoodAnalytics';
import { NeighborhoodMap } from './NeighborhoodMap';

interface NeighborhoodDetailProps {
  neighborhood: Neighborhood;
  amenities: NeighborhoodAmenity[];
  analysis: NeighborhoodAnalysis | null;
  onBack: () => void;
  loading?: boolean;
  className?: string;
}

export const NeighborhoodDetail: React.FC<NeighborhoodDetailProps> = ({
  neighborhood,
  amenities,
  analysis,
  onBack,
  loading = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'analytics' | 'map'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'amenities', label: 'Amenities', icon: '🏪' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'map', label: 'Map', icon: '🗺️' }
  ];

  return (
    <div className={`neighborhood-detail ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to neighborhoods
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {neighborhood.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{neighborhood.city}, {neighborhood.state} {neighborhood.zipCode}</span>
            </div>
            <p className="text-gray-700 max-w-3xl">
              {neighborhood.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save to Favorites
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Image */}
      {neighborhood.imageUrl && (
        <div className="mb-6">
          <img
            src={neighborhood.imageUrl}
            alt={neighborhood.name}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <NeighborhoodOverview
            neighborhood={neighborhood}
            analysis={analysis}
            loading={loading}
          />
        )}

        {activeTab === 'amenities' && (
          <NeighborhoodAmenities
            neighborhood={neighborhood}
            amenities={amenities}
            loading={loading}
          />
        )}

        {activeTab === 'analytics' && (
          <NeighborhoodAnalytics
            neighborhood={neighborhood}
            analysis={analysis}
            loading={loading}
          />
        )}

        {activeTab === 'map' && (
          <NeighborhoodMap
            neighborhoods={[neighborhood]}
            selectedNeighborhood={neighborhood}
            onNeighborhoodSelect={() => {}}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
