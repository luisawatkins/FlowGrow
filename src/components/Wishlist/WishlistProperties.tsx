'use client';

import React, { useState } from 'react';
import { WishlistProperty } from '@/types/wishlist';
import { OptimizedImage } from '../OptimizedImage';
import { Button } from '../ui/Button';

interface WishlistPropertiesProps {
  properties: WishlistProperty[];
  onRemoveProperty: (propertyId: string) => void;
  onCreateAlert: (property: WishlistProperty) => void;
  isLoading?: boolean;
}

export function WishlistProperties({ 
  properties, 
  onRemoveProperty, 
  onCreateAlert, 
  isLoading = false 
}: WishlistPropertiesProps) {
  const [sortBy, setSortBy] = useState<'price' | 'addedAt' | 'title'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'withAlerts' | 'withoutAlerts'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Filter and sort properties
  const filteredAndSortedProperties = React.useMemo(() => {
    let filtered = properties;

    // Apply filter
    switch (filterBy) {
      case 'withAlerts':
        filtered = properties.filter(prop => prop.priceAlerts.length > 0);
        break;
      case 'withoutAlerts':
        filtered = properties.filter(prop => prop.priceAlerts.length === 0);
        break;
      default:
        filtered = properties;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = a.property.price;
          bValue = b.property.price;
          break;
        case 'addedAt':
          aValue = new Date(a.addedAt).getTime();
          bValue = new Date(b.addedAt).getTime();
          break;
        case 'title':
          aValue = a.property.title.toLowerCase();
          bValue = b.property.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [properties, sortBy, sortOrder, filterBy]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No properties in wishlist</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add properties to your wishlist to start tracking them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Properties</option>
                <option value="withAlerts">With Price Alerts</option>
                <option value="withoutAlerts">Without Price Alerts</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="addedAt">Date Added</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-gray-400 hover:text-gray-600"
            >
              {sortOrder === 'asc' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProperties.map((wishlistProperty) => {
          const { property, addedAt, notes, tags, priceAlerts } = wishlistProperty;
          
          return (
            <div key={property.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <OptimizedImage
                  src={property.images[0] || '/images/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  width={400}
                  height={200}
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  {priceAlerts.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {priceAlerts.length} Alert{priceAlerts.length > 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={() => onRemoveProperty(property.id)}
                    className="p-1 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-600 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(property.financial.pricePerSqFt)}/sq ft
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {property.location.city}, {property.location.state}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <span>{property.details.bedrooms} bed</span>
                    <span>{property.details.bathrooms} bath</span>
                    <span>{formatNumber(property.details.livingArea)} sq ft</span>
                  </div>
                  <div className="text-xs">
                    Added {formatDate(addedAt)}
                  </div>
                </div>

                {/* Notes */}
                {notes && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{notes}</p>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onCreateAlert(wishlistProperty)}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a10 10 0 1 1 20 0v5z" />
                    </svg>
                    Price Alert
                  </Button>
                  
                  <Button
                    onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredAndSortedProperties.length === 0 && properties.length > 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more properties.
          </p>
        </div>
      )}
    </div>
  );
}
