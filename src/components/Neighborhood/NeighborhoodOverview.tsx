// Neighborhood Overview Component
// Overview tab with key statistics and information

'use client';

import React from 'react';
import { Neighborhood, NeighborhoodAnalysis } from '@/types/neighborhood';

interface NeighborhoodOverviewProps {
  neighborhood: Neighborhood;
  analysis: NeighborhoodAnalysis | null;
  loading?: boolean;
  className?: string;
}

export const NeighborhoodOverview: React.FC<NeighborhoodOverviewProps> = ({
  neighborhood,
  analysis,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`neighborhood-overview ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`neighborhood-overview ${className}`}>
      {/* Overall Score */}
      {analysis && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Overall Score</h2>
              <div className={`px-3 py-1 rounded-full text-lg font-bold ${scoreColor(analysis.overallScore)}`}>
                {analysis.overallScore.toFixed(1)}/10
              </div>
            </div>
            <p className="text-gray-600">
              Based on safety, amenities, schools, transportation, and other key factors.
            </p>
          </div>
        </div>
      )}

      {/* Category Scores */}
      {analysis && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.categoryScores).map(([category, score]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${scoreColor(score)}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths and Weaknesses */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Strengths
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis && analysis.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">💡</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Market Trends */}
      {analysis && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Price Growth</h3>
              <p className="text-2xl font-bold text-green-600">
                +{analysis.marketTrends.priceGrowth.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Annual</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Population Growth</h3>
              <p className="text-2xl font-bold text-blue-600">
                +{analysis.marketTrends.populationGrowth.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Annual</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Development Activity</h3>
              <p className="text-2xl font-bold text-purple-600">
                {analysis.marketTrends.developmentActivity.toFixed(1)}/10
              </p>
              <p className="text-xs text-gray-500">Scale</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Gentrification Risk</h3>
              <p className="text-2xl font-bold text-orange-600">
                {analysis.marketTrends.gentrificationRisk.toFixed(1)}/10
              </p>
              <p className="text-xs text-gray-500">Scale</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Neighborhood Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
            <p className="text-gray-900">
              {neighborhood.city}, {neighborhood.state} {neighborhood.zipCode}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Coordinates: {neighborhood.coordinates.latitude.toFixed(4)}, {neighborhood.coordinates.longitude.toFixed(4)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Boundaries</h3>
            <p className="text-gray-900 capitalize">
              {neighborhood.boundaries.type} boundary
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {neighborhood.boundaries.coordinates.length} coordinate points
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
