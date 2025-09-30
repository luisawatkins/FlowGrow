'use client';

import React, { useState } from 'react';
import { PropertyComparison, ComparisonProperty } from '@/types/comparison';
import { OptimizedImage } from '../OptimizedImage';
import { Button } from '../ui/Button';

interface ComparisonTableProps {
  comparison: PropertyComparison;
  onRemoveProperty: (propertyId: string) => void;
  isLoading?: boolean;
}

export function ComparisonTable({ 
  comparison, 
  onRemoveProperty, 
  isLoading = false 
}: ComparisonTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (propertyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedRows(newExpanded);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (comparison.properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No properties to compare</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add properties to start comparing them side by side.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparison.properties.map((comparisonProperty) => {
              const { property, metrics, score, rank } = comparisonProperty;
              const isExpanded = expandedRows.has(property.id);
              
              return (
                <React.Fragment key={property.id}>
                  <tr className="hover:bg-gray-50">
                    {/* Property Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <OptimizedImage
                            src={property.images[0] || '/images/placeholder-property.jpg'}
                            alt={property.title}
                            className="h-16 w-16 rounded-lg object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location.city}, {property.location.state}
                          </div>
                          <div className="text-xs text-gray-400">
                            {property.details.bedrooms} bed • {property.details.bathrooms} bath
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(property.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(property.financial.pricePerSqFt)}/sq ft
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getScoreColor(metrics.priceScore)}`}>
                        {metrics.priceScore}/100
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatNumber(property.details.livingArea)} sq ft
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.details.lotSize > 0 && `${formatNumber(property.details.lotSize)} sq ft lot`}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getScoreColor(metrics.sizeScore)}`}>
                        {metrics.sizeScore}/100
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.location.neighborhood}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.location.city}, {property.location.state}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getScoreColor(metrics.locationScore)}`}>
                        {metrics.locationScore}/100
                      </div>
                    </td>

                    {/* Features */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.features.length} features
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.amenities.length} amenities
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getScoreColor(metrics.featureScore)}`}>
                        {metrics.featureScore}/100
                      </div>
                    </td>

                    {/* Overall Score */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {score}/100
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getScoreColor(score)}`}>
                        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'}
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getRankBadge(rank)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRowExpansion(property.id)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={isLoading}
                        >
                          {isExpanded ? 'Less' : 'More'}
                        </button>
                        <button
                          onClick={() => onRemoveProperty(property.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Property Details */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Property Details</h4>
                            <dl className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <dt>Type:</dt>
                                <dd className="font-medium">{property.details.type}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Year Built:</dt>
                                <dd className="font-medium">{property.details.yearBuilt || 'N/A'}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Condition:</dt>
                                <dd className="font-medium">{property.details.condition}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Stories:</dt>
                                <dd className="font-medium">{property.details.stories || 'N/A'}</dd>
                              </div>
                            </dl>
                          </div>

                          {/* Financial Details */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Financial</h4>
                            <dl className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <dt>Taxes:</dt>
                                <dd className="font-medium">{formatCurrency(property.financial.taxes)}/mo</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Insurance:</dt>
                                <dd className="font-medium">{formatCurrency(property.financial.insurance)}/mo</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Total Monthly:</dt>
                                <dd className="font-medium">{formatCurrency(property.financial.totalMonthlyCost)}</dd>
                              </div>
                              {property.financial.rentalIncome && (
                                <div className="flex justify-between">
                                  <dt>Rental Income:</dt>
                                  <dd className="font-medium">{formatCurrency(property.financial.rentalIncome)}/mo</dd>
                                </div>
                              )}
                            </dl>
                          </div>

                          {/* Features List */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Key Features:</div>
                                <div className="flex flex-wrap gap-1">
                                  {property.features.slice(0, 4).map((feature, index) => (
                                    <span
                                      key={index}
                                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-500 mb-1">Amenities:</div>
                                <div className="flex flex-wrap gap-1">
                                  {property.amenities.slice(0, 3).map((amenity, index) => (
                                    <span
                                      key={index}
                                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
