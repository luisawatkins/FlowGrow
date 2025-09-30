// Market Trends Component

'use client';

import React, { useState } from 'react';
import { MarketTrend, TrendDirection, TimePeriod } from '@/types/market';

interface MarketTrendsProps {
  trends: MarketTrend[];
  loading: boolean;
  error: any;
  onRefresh: () => void;
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({
  trends,
  loading,
  error,
  onRefresh
}) => {
  const [selectedTrend, setSelectedTrend] = useState<MarketTrend | null>(null);

  const getTrendDirectionColor = (direction: TrendDirection): string => {
    const colors = {
      [TrendDirection.RISING]: 'text-green-600 bg-green-100',
      [TrendDirection.FALLING]: 'text-red-600 bg-red-100',
      [TrendDirection.STABLE]: 'text-gray-600 bg-gray-100',
      [TrendDirection.VOLATILE]: 'text-yellow-600 bg-yellow-100'
    };
    return colors[direction] || colors[TrendDirection.STABLE];
  };

  const getTrendDirectionIcon = (direction: TrendDirection): string => {
    const icons = {
      [TrendDirection.RISING]: '↗',
      [TrendDirection.FALLING]: '↘',
      [TrendDirection.STABLE]: '→',
      [TrendDirection.VOLATILE]: '↕'
    };
    return icons[direction] || icons[TrendDirection.STABLE];
  };

  const formatTrendType = (trendType: string): string => {
    return trendType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPeriod = (period: TimePeriod): string => {
    return period.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-medium">Failed to load market trends</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No trends available</h3>
        <p className="mt-1 text-sm text-gray-500">Market trend data will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trends List */}
      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatTrendType(trend.trendType)}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendDirectionColor(trend.direction)}`}>
                    {getTrendDirectionIcon(trend.direction)} {trend.direction}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{trend.location}</span>
                  <span>•</span>
                  <span>{formatPeriod(trend.period)}</span>
                  <span>•</span>
                  <span>{formatDate(trend.startDate)} - {formatDate(trend.endDate)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrend(selectedTrend?.id === trend.id ? null : trend)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedTrend?.id === trend.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {/* Trend Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${trend.currentValue.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Change</p>
                <p className={`text-xl font-semibold ${trend.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-xl font-semibold text-gray-900">
                  {Math.round(trend.confidence * 100)}%
                </p>
              </div>
            </div>

            {/* Trend Details */}
            {selectedTrend?.id === trend.id && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Data Points */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Data Points</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {trend.dataPoints.map((point, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ${point.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600">{formatDate(point.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{point.source}</p>
                            <p className="text-xs text-gray-500">
                              {Math.round(point.confidence * 100)}% confidence
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Forecast */}
                  {trend.forecast && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Forecast</h4>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Predicted Value</span>
                          <span className="text-lg font-semibold text-blue-900">
                            ${trend.forecast.predictedValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-blue-700">Confidence</span>
                          <span className="text-sm text-blue-700">
                            {Math.round(trend.forecast.confidence * 100)}%
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-blue-600 mb-1">Range</p>
                          <p className="text-sm text-blue-700">
                            ${trend.forecast.lowerBound.toLocaleString()} - ${trend.forecast.upperBound.toLocaleString()}
                          </p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-blue-600 mb-1">Methodology</p>
                          <p className="text-sm text-blue-700">{trend.forecast.methodology}</p>
                        </div>
                        {trend.forecast.assumptions.length > 0 && (
                          <div>
                            <p className="text-xs text-blue-600 mb-1">Assumptions</p>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {trend.forecast.assumptions.map((assumption, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-1">•</span>
                                  <span>{assumption}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
