// Neighborhood Analytics Component
// Analytics and insights for the neighborhood

'use client';

import React from 'react';
import { Neighborhood, NeighborhoodAnalysis } from '@/types/neighborhood';

interface NeighborhoodAnalyticsProps {
  neighborhood: Neighborhood;
  analysis: NeighborhoodAnalysis | null;
  loading?: boolean;
  className?: string;
}

export const NeighborhoodAnalytics: React.FC<NeighborhoodAnalyticsProps> = ({
  neighborhood,
  analysis,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`neighborhood-analytics ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`neighborhood-analytics ${className}`}>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Analytics data is not available for this neighborhood yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`neighborhood-analytics ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analytics & Insights
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis of {neighborhood.name}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900">{analysis.overallScore.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">🏆</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ranking</p>
              <p className="text-2xl font-bold text-gray-900">#{analysis.comparisonToSimilar.ranking}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Price Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{analysis.marketTrends.priceGrowth.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Population Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{analysis.marketTrends.populationGrowth.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-4">
            {Object.entries(analysis.categoryScores).map(([category, score]) => {
              const percentage = (score / 10) * 100;
              const color = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-500">{score.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Development Activity</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Activity Level</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.marketTrends.developmentActivity.toFixed(1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(analysis.marketTrends.developmentActivity / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {analysis.marketTrends.developmentActivity >= 7 ? 'High development activity' : 
               analysis.marketTrends.developmentActivity >= 4 ? 'Moderate development activity' : 
               'Low development activity'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Gentrification Risk</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Risk Level</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.marketTrends.gentrificationRisk.toFixed(1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(analysis.marketTrends.gentrificationRisk / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {analysis.marketTrends.gentrificationRisk >= 7 ? 'High gentrification risk' : 
               analysis.marketTrends.gentrificationRisk >= 4 ? 'Moderate gentrification risk' : 
               'Low gentrification risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison to Similar Neighborhoods</h3>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Average Score of Similar Areas</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis.comparisonToSimilar.averageScore.toFixed(1)}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Your Ranking</p>
              <p className="text-2xl font-bold text-blue-600">
                #{analysis.comparisonToSimilar.ranking}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Compared to {analysis.comparisonToSimilar.neighborhoodIds.length} similar neighborhoods
            </span>
            <span className={`text-sm font-medium ${
              analysis.overallScore > analysis.comparisonToSimilar.averageScore 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {analysis.overallScore > analysis.comparisonToSimilar.averageScore 
                ? 'Above average' 
                : 'Below average'}
            </span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Last analyzed: {new Date(analysis.lastAnalyzed).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
