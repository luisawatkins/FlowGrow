// Market Insights Component

'use client';

import React, { useState } from 'react';
import { MarketInsight, InsightType, ImpactLevel } from '@/types/market';

interface MarketInsightsProps {
  insights: MarketInsight[];
  loading: boolean;
  error: any;
  onRefresh: () => void;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({
  insights,
  loading,
  error,
  onRefresh
}) => {
  const [selectedInsight, setSelectedInsight] = useState<MarketInsight | null>(null);
  const [filterType, setFilterType] = useState<InsightType | 'all'>('all');
  const [filterImpact, setFilterImpact] = useState<ImpactLevel | 'all'>('all');

  const getInsightTypeColor = (type: InsightType): string => {
    const colors = {
      [InsightType.MARKET_HOT]: 'bg-red-100 text-red-800',
      [InsightType.MARKET_COOL]: 'bg-blue-100 text-blue-800',
      [InsightType.PRICE_OPPORTUNITY]: 'bg-green-100 text-green-800',
      [InsightType.INVESTMENT_OPPORTUNITY]: 'bg-purple-100 text-purple-800',
      [InsightType.RISK_WARNING]: 'bg-orange-100 text-orange-800',
      [InsightType.TREND_CHANGE]: 'bg-yellow-100 text-yellow-800',
      [InsightType.SEASONAL_PATTERN]: 'bg-indigo-100 text-indigo-800',
      [InsightType.COMPETITIVE_ANALYSIS]: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || colors[InsightType.INVESTMENT_OPPORTUNITY];
  };

  const getImpactColor = (impact: ImpactLevel): string => {
    const colors = {
      [ImpactLevel.LOW]: 'bg-gray-100 text-gray-800',
      [ImpactLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [ImpactLevel.HIGH]: 'bg-orange-100 text-orange-800',
      [ImpactLevel.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[impact] || colors[ImpactLevel.MEDIUM];
  };

  const formatInsightType = (type: InsightType): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const filteredInsights = insights.filter(insight => {
    if (filterType !== 'all' && insight.insightType !== filterType) return false;
    if (filterImpact !== 'all' && insight.impact !== filterImpact) return false;
    return true;
  });

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
            <h3 className="text-red-800 font-medium">Failed to load market insights</h3>
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

  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No insights available</h3>
        <p className="mt-1 text-sm text-gray-500">Market insights will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as InsightType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value={InsightType.MARKET_HOT}>Market Hot</option>
              <option value={InsightType.MARKET_COOL}>Market Cool</option>
              <option value={InsightType.PRICE_OPPORTUNITY}>Price Opportunity</option>
              <option value={InsightType.INVESTMENT_OPPORTUNITY}>Investment Opportunity</option>
              <option value={InsightType.RISK_WARNING}>Risk Warning</option>
              <option value={InsightType.TREND_CHANGE}>Trend Change</option>
              <option value={InsightType.SEASONAL_PATTERN}>Seasonal Pattern</option>
              <option value={InsightType.COMPETITIVE_ANALYSIS}>Competitive Analysis</option>
            </select>
          </div>
          <div>
            <label htmlFor="impactFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Impact
            </label>
            <select
              id="impactFilter"
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value as ImpactLevel | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Impact Levels</option>
              <option value={ImpactLevel.LOW}>Low</option>
              <option value={ImpactLevel.MEDIUM}>Medium</option>
              <option value={ImpactLevel.HIGH}>High</option>
              <option value={ImpactLevel.CRITICAL}>Critical</option>
            </select>
          </div>
          <div className="ml-auto">
            <p className="text-sm text-gray-600">
              Showing {filteredInsights.length} of {insights.length} insights
            </p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInsightTypeColor(insight.insightType)}`}>
                    {formatInsightType(insight.insightType)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{insight.location}</span>
                  <span>•</span>
                  <span>{formatDate(insight.date)}</span>
                  <span>•</span>
                  <span>{Math.round(insight.confidence * 100)}% confidence</span>
                </div>
                <p className="text-gray-700 mb-4">{insight.description}</p>
              </div>
              <button
                onClick={() => setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedInsight?.id === insight.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {/* Tags */}
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {insight.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Insight Details */}
            {selectedInsight?.id === insight.id && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recommendations */}
                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {insight.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <p className="text-sm text-blue-800">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Insight Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Source:</span>
                        <span className="text-sm font-medium text-gray-900">{insight.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Impact Level:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(insight.date)}</span>
                      </div>
                      {insight.relatedTrends.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">Related Trends:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {insight.relatedTrends.map((trendId, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {trendId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
