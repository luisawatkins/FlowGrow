// Market Analysis Filters Component

'use client';

import React from 'react';
import { 
  MarketAnalysisRequest, 
  PropertyType, 
  MarketType 
} from '@/types/market';

interface MarketFiltersProps {
  filters: MarketAnalysisRequest;
  onFilterChange: (filters: Partial<MarketAnalysisRequest>) => void;
}

export const MarketFilters: React.FC<MarketFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const handleLocationChange = (location: string) => {
    onFilterChange({ location });
  };

  const handlePropertyTypeChange = (propertyType: PropertyType) => {
    onFilterChange({ propertyType });
  };

  const handleMarketTypeChange = (marketType: MarketType) => {
    onFilterChange({ marketType });
  };

  const handleIncludeForecastChange = (includeForecast: boolean) => {
    onFilterChange({ includeForecast });
  };

  const handleIncludeInsightsChange = (includeInsights: boolean) => {
    onFilterChange({ includeInsights });
  };

  const handleIncludeComparisonsChange = (includeComparisons: boolean) => {
    onFilterChange({ includeComparisons });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Market Analysis Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="Enter city, state"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="propertyType"
            value={filters.propertyType || ''}
            onChange={(e) => handlePropertyTypeChange(e.target.value as PropertyType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={PropertyType.SINGLE_FAMILY}>Single Family</option>
            <option value={PropertyType.CONDO}>Condo</option>
            <option value={PropertyType.TOWNHOUSE}>Townhouse</option>
            <option value={PropertyType.MULTI_FAMILY}>Multi Family</option>
            <option value={PropertyType.APARTMENT}>Apartment</option>
            <option value={PropertyType.OFFICE}>Office</option>
            <option value={PropertyType.RETAIL}>Retail</option>
            <option value={PropertyType.WAREHOUSE}>Warehouse</option>
            <option value={PropertyType.HOTEL}>Hotel</option>
            <option value={PropertyType.LAND}>Land</option>
          </select>
        </div>

        {/* Market Type */}
        <div>
          <label htmlFor="marketType" className="block text-sm font-medium text-gray-700 mb-1">
            Market Type
          </label>
          <select
            id="marketType"
            value={filters.marketType || ''}
            onChange={(e) => handleMarketTypeChange(e.target.value as MarketType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={MarketType.RESIDENTIAL}>Residential</option>
            <option value={MarketType.COMMERCIAL}>Commercial</option>
            <option value={MarketType.INDUSTRIAL}>Industrial</option>
            <option value={MarketType.LAND}>Land</option>
            <option value={MarketType.MIXED_USE}>Mixed Use</option>
          </select>
        </div>
      </div>

      {/* Options */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includeForecast || false}
              onChange={(e) => handleIncludeForecastChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Include Forecast</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includeInsights || false}
              onChange={(e) => handleIncludeInsightsChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Include Insights</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.includeComparisons || false}
              onChange={(e) => handleIncludeComparisonsChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Include Comparisons</span>
          </label>
        </div>
      </div>
    </div>
  );
};
