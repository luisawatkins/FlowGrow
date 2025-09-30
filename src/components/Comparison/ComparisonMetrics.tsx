'use client';

import React, { useState } from 'react';
import { PropertyComparison, ComparisonProperty } from '@/types/comparison';

interface ComparisonMetricsProps {
  comparison: PropertyComparison;
  isLoading?: boolean;
}

export function ComparisonMetrics({ 
  comparison, 
  isLoading = false 
}: ComparisonMetricsProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(
    comparison.properties[0]?.property.id || null
  );

  const selectedComparisonProperty = comparison.properties.find(
    p => p.property.id === selectedProperty
  );

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

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (comparison.properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No metrics to display</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add properties to see detailed metrics and analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Property for Detailed Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {comparison.properties.map((property) => (
            <button
              key={property.property.id}
              onClick={() => setSelectedProperty(property.property.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedProperty === property.property.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm text-gray-900 truncate">
                {property.property.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {property.property.location.city}, {property.property.location.state}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(property.property.price)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(property.score)}`}>
                  {property.score}/100
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedComparisonProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Overall Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.score}/100
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Rank</span>
                <span className="text-sm font-medium text-gray-900">
                  #{selectedComparisonProperty.rank} of {comparison.properties.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Performance</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(selectedComparisonProperty.score)}`}>
                  {getScoreLabel(selectedComparisonProperty.score)}
                </span>
              </div>
            </div>
          </div>

          {/* Price Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">List Price</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(selectedComparisonProperty.property.price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Price per Sq Ft</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(selectedComparisonProperty.property.financial.pricePerSqFt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Price Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.priceScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.priceScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Value Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.valueScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.valueScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Location Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.locationScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.locationScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Neighborhood Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.neighborhoodScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.neighborhoodScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Accessibility Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.accessibilityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.accessibilityScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Size Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.sizeScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.sizeScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Condition Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.conditionScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.conditionScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Feature Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.featureScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.featureScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Investment Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.investmentScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.investmentScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Cash Flow Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.cashFlowScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.cashFlowScore}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Appreciation Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${selectedComparisonProperty.metrics.appreciationScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedComparisonProperty.metrics.appreciationScore}/100
                  </span>
                </div>
              </div>

              {selectedComparisonProperty.property.financial.roi && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">ROI</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPercentage(selectedComparisonProperty.property.financial.roi)}
                  </span>
                </div>
              )}

              {selectedComparisonProperty.property.financial.capRate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Cap Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPercentage(selectedComparisonProperty.property.financial.capRate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comparison Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Price vs Average</span>
                <span className={`text-sm font-medium ${
                  selectedComparisonProperty.metrics.priceComparison.percentageDifference > 0 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {selectedComparisonProperty.metrics.priceComparison.percentageDifference > 0 ? '+' : ''}
                  {selectedComparisonProperty.metrics.priceComparison.percentageDifference.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Size vs Average</span>
                <span className={`text-sm font-medium ${
                  selectedComparisonProperty.metrics.sizeComparison.percentageDifference > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedComparisonProperty.metrics.sizeComparison.percentageDifference > 0 ? '+' : ''}
                  {selectedComparisonProperty.metrics.sizeComparison.percentageDifference.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Location vs Average</span>
                <span className={`text-sm font-medium ${
                  selectedComparisonProperty.metrics.locationComparison.percentageDifference > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedComparisonProperty.metrics.locationComparison.percentageDifference > 0 ? '+' : ''}
                  {selectedComparisonProperty.metrics.locationComparison.percentageDifference.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Features vs Average</span>
                <span className={`text-sm font-medium ${
                  selectedComparisonProperty.metrics.featureComparison.percentageDifference > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedComparisonProperty.metrics.featureComparison.percentageDifference > 0 ? '+' : ''}
                  {selectedComparisonProperty.metrics.featureComparison.percentageDifference.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
