// Neighborhood Amenities Component
// Display amenities and services in the neighborhood

'use client';

import React, { useState } from 'react';
import { Neighborhood, NeighborhoodAmenity, AmenityType, AmenityCategory } from '@/types/neighborhood';

interface NeighborhoodAmenitiesProps {
  neighborhood: Neighborhood;
  amenities: NeighborhoodAmenity[];
  loading?: boolean;
  className?: string;
}

export const NeighborhoodAmenities: React.FC<NeighborhoodAmenitiesProps> = ({
  neighborhood,
  amenities,
  loading = false,
  className = ''
}) => {
  const [selectedType, setSelectedType] = useState<AmenityType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AmenityCategory | 'all'>('all');

  const amenityTypes = [
    { value: 'all', label: 'All Types' },
    { value: AmenityType.RESTAURANT, label: 'Restaurants' },
    { value: AmenityType.SHOPPING, label: 'Shopping' },
    { value: AmenityType.ENTERTAINMENT, label: 'Entertainment' },
    { value: AmenityType.HEALTHCARE, label: 'Healthcare' },
    { value: AmenityType.FITNESS, label: 'Fitness' },
    { value: AmenityType.EDUCATION, label: 'Education' },
    { value: AmenityType.PARKS, label: 'Parks' },
    { value: AmenityType.GROCERY, label: 'Grocery' },
    { value: AmenityType.PHARMACY, label: 'Pharmacy' }
  ];

  const amenityCategories = [
    { value: 'all', label: 'All Categories' },
    { value: AmenityCategory.ESSENTIAL, label: 'Essential' },
    { value: AmenityCategory.CONVENIENCE, label: 'Convenience' },
    { value: AmenityCategory.LUXURY, label: 'Luxury' },
    { value: AmenityCategory.ENTERTAINMENT, label: 'Entertainment' },
    { value: AmenityCategory.HEALTH, label: 'Health' },
    { value: AmenityCategory.RECREATION, label: 'Recreation' }
  ];

  const filteredAmenities = amenities.filter(amenity => {
    if (selectedType !== 'all' && amenity.type !== selectedType) return false;
    if (selectedCategory !== 'all' && amenity.category !== selectedCategory) return false;
    return true;
  });

  const getAmenityIcon = (type: AmenityType) => {
    const icons: Record<AmenityType, string> = {
      [AmenityType.RESTAURANT]: '🍽️',
      [AmenityType.SHOPPING]: '🛍️',
      [AmenityType.ENTERTAINMENT]: '🎭',
      [AmenityType.HEALTHCARE]: '🏥',
      [AmenityType.FITNESS]: '💪',
      [AmenityType.EDUCATION]: '🎓',
      [AmenityType.TRANSPORTATION]: '🚌',
      [AmenityType.FINANCIAL]: '🏦',
      [AmenityType.GOVERNMENT]: '🏛️',
      [AmenityType.RELIGIOUS]: '⛪',
      [AmenityType.PARKS]: '🌳',
      [AmenityType.RECREATION]: '⚽',
      [AmenityType.NIGHTLIFE]: '🍻',
      [AmenityType.GROCERY]: '🛒',
      [AmenityType.PHARMACY]: '💊',
      [AmenityType.OTHER]: '📍'
    };
    return icons[type] || '📍';
  };

  const getPriceLevelColor = (priceLevel?: string) => {
    switch (priceLevel) {
      case 'free': return 'text-green-600 bg-green-100';
      case 'budget': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'expensive': return 'text-orange-600 bg-orange-100';
      case 'very_expensive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`neighborhood-amenities ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`neighborhood-amenities ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Amenities & Services
        </h2>
        <p className="text-gray-600">
          Discover what's available in {neighborhood.name}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AmenityType | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {amenityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AmenityCategory | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {amenityCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredAmenities.length} of {amenities.length} amenities
        </p>
      </div>

      {/* Amenities Grid */}
      {filteredAmenities.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No amenities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAmenities.map((amenity) => (
            <div key={amenity.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-32 bg-gray-200 rounded-t-lg overflow-hidden">
                {amenity.images.length > 0 ? (
                  <img
                    src={amenity.images[0]}
                    alt={amenity.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">{getAmenityIcon(amenity.type)}</span>
                  </div>
                )}
                
                {/* Distance Badge */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                    {amenity.distance}m
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {amenity.name}
                  </h3>
                  {amenity.isVerified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {amenity.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {amenity.rating && (
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {amenity.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {amenity.priceLevel && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriceLevelColor(amenity.priceLevel)}`}>
                      {amenity.priceLevel.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Features */}
                {amenity.features.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {amenity.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {feature}
                        </span>
                      ))}
                      {amenity.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{amenity.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Address */}
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                  {amenity.address}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                    Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
