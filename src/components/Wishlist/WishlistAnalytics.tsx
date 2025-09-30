'use client';

import React, { useState, useEffect } from 'react';
import { WishlistProperty, WishlistAnalytics } from '@/types/wishlist';

interface WishlistAnalyticsProps {
  wishlistId: string;
  properties: WishlistProperty[];
  isLoading?: boolean;
}

export function WishlistAnalytics({ 
  wishlistId, 
  properties, 
  isLoading = false 
}: WishlistAnalyticsProps) {
  const [analytics, setAnalytics] = useState<WishlistAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (properties.length > 0) {
      loadAnalytics();
    }
  }, [wishlistId, properties]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch(`/api/wishlist/${wishlistId}/analytics?userId=${userId}`);
      // const data = await response.json();
      
      // Mock analytics data for now
      const mockAnalytics: WishlistAnalytics = {
        wishlistId,
        totalProperties: properties.length,
        averagePrice: properties.reduce((sum, p) => sum + p.property.price, 0) / properties.length,
        priceRange: {
          min: Math.min(...properties.map(p => p.property.price)),
          max: Math.max(...properties.map(p => p.property.price))
        },
        locationDistribution: properties.reduce((acc, p) => {
          const city = p.property.location.city;
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {} as { [city: string]: number }),
        propertyTypeDistribution: properties.reduce((acc, p) => {
          const type = p.property.details.type;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as { [type: string]: number }),
        priceChangeHistory: [], // Would be populated from real data
        alertStatistics: {
          totalAlerts: properties.reduce((sum, p) => sum + p.priceAlerts.length, 0),
          activeAlerts: properties.reduce((sum, p) => sum + p.priceAlerts.filter(a => a.isActive).length, 0),
          triggeredAlerts: properties.reduce((sum, p) => sum + p.priceAlerts.filter(a => a.triggeredAt).length, 0),
          alertTypes: {},
          averageResponseTime: 2.5
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Analytics will be available once you have properties in your wishlist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</div>
              <div className="text-sm text-gray-500">Total Properties</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averagePrice)}</div>
              <div className="text-sm text-gray-500">Average Price</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a10 10 0 1 1 20 0v5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.alertStatistics.totalAlerts}</div>
              <div className="text-sm text-gray-500">Total Alerts</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.alertStatistics.triggeredAlerts}</div>
              <div className="text-sm text-gray-500">Triggered Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Lowest Price</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.priceRange.min)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Highest Price</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.priceRange.max)}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Price Distribution</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ 
                width: `${((analytics.averagePrice - analytics.priceRange.min) / (analytics.priceRange.max - analytics.priceRange.min)) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(analytics.priceRange.min)}</span>
            <span>Average: {formatCurrency(analytics.averagePrice)}</span>
            <span>{formatCurrency(analytics.priceRange.max)}</span>
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location Distribution</h3>
        <div className="space-y-3">
          {Object.entries(analytics.locationDistribution).map(([city, count]) => {
            const percentage = (count / analytics.totalProperties) * 100;
            return (
              <div key={city} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{city}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Type Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.propertyTypeDistribution).map(([type, count]) => {
            const percentage = (count / analytics.totalProperties) * 100;
            return (
              <div key={type} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500 capitalize">{type.replace('_', ' ')}</div>
                <div className="text-xs text-gray-400">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.alertStatistics.activeAlerts}</div>
            <div className="text-sm text-gray-500">Active Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.alertStatistics.triggeredAlerts}</div>
            <div className="text-sm text-gray-500">Triggered Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.alertStatistics.averageResponseTime}h</div>
            <div className="text-sm text-gray-500">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
