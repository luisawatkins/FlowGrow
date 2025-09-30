// Market Overview Component

'use client';

import React from 'react';
import { MarketAnalysisResponse, TrendDirection, ImpactLevel } from '@/types/market';

interface MarketOverviewProps {
  analysis: MarketAnalysisResponse | null;
  loading: boolean;
  error: any;
  onRefresh: () => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  analysis,
  loading,
  error,
  onRefresh
}) => {
  const getTrendDirectionColor = (direction: TrendDirection): string => {
    const colors = {
      [TrendDirection.RISING]: 'text-green-600',
      [TrendDirection.FALLING]: 'text-red-600',
      [TrendDirection.STABLE]: 'text-gray-600',
      [TrendDirection.VOLATILE]: 'text-yellow-600'
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

  const getImpactColor = (impact: ImpactLevel): string => {
    const colors = {
      [ImpactLevel.LOW]: 'bg-gray-100 text-gray-800',
      [ImpactLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [ImpactLevel.HIGH]: 'bg-orange-100 text-orange-800',
      [ImpactLevel.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[impact] || colors[ImpactLevel.MEDIUM];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, index) => (
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
            <h3 className="text-red-800 font-medium">Failed to load market analysis</h3>
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

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No market data available</h3>
        <p className="mt-1 text-sm text-gray-500">Select a location to view market analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Trends</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.trends.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Market Insights</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.insights.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Opportunities</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.opportunities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Comparisons</p>
              <p className="text-2xl font-semibold text-gray-900">{analysis.comparisons.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Trends */}
      {analysis.trends.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Market Trends</h3>
          <div className="space-y-4">
            {analysis.trends.slice(0, 3).map((trend) => (
              <div key={trend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{trend.trendType.replace('_', ' ')}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendDirectionColor(trend.direction)}`}>
                      {getTrendDirectionIcon(trend.direction)} {trend.direction}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(2)}% change
                    ({trend.changeAmount > 0 ? '+' : ''}${trend.changeAmount.toLocaleString()})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${trend.currentValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round(trend.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Insights */}
      {analysis.insights.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
          <div className="space-y-4">
            {analysis.insights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Recommendations:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {insight.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Opportunities */}
      {analysis.opportunities.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Opportunities</h3>
          <div className="space-y-4">
            {analysis.opportunities.slice(0, 2).map((opportunity) => (
              <div key={opportunity.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      +{opportunity.potentialReturn.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">{opportunity.riskLevel} risk</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Time: {opportunity.timeHorizon.replace('_', ' ')}</span>
                  <span>Confidence: {Math.round(opportunity.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
