'use client';

import React, { useState, useEffect } from 'react';
import { PropertySocialData } from '@/types/social';
import { useSocialAnalytics } from '@/hooks/usePropertySocial';
import { LoadingSpinner } from '../LoadingSpinner';

interface PropertySocialStatsProps {
  propertyId: string;
  socialData: PropertySocialData;
  isLoading?: boolean;
}

export function PropertySocialStats({ 
  propertyId, 
  socialData, 
  isLoading: parentLoading = false 
}: PropertySocialStatsProps) {
  const { analytics, isLoading, error, loadAnalytics } = useSocialAnalytics(propertyId, 'week');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadAnalytics().catch(console.error);
  }, [loadAnalytics, selectedPeriod]);

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (isLoading || parentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading analytics
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
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
          Analytics will be available once there is enough social activity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Social Analytics</h2>
          <p className="text-sm text-gray-500">
            Insights and trends from social activity
          </p>
        </div>
        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Shares</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(analytics.totalShares)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reactions</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(analytics.totalReactions)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Comments</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(analytics.totalComments)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(analytics.totalViews)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formatPercentage(analytics.engagementRate)}</div>
            <div className="text-sm text-gray-500">Engagement Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatPercentage(analytics.shareRate)}</div>
            <div className="text-sm text-gray-500">Share Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatPercentage(analytics.reactionRate)}</div>
            <div className="text-sm text-gray-500">Reaction Rate</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{formatPercentage(analytics.commentRate)}</div>
            <div className="text-sm text-gray-500">Comment Rate</div>
          </div>
        </div>
      </div>

      {/* Top Reactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Reactions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.topReactions).map(([reactionType, count]) => (
            <div key={reactionType} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {reactionType === 'like' && '👍'}
                {reactionType === 'love' && '❤️'}
                {reactionType === 'wow' && '😮'}
                {reactionType === 'interested' && '👀'}
                {reactionType === 'bookmark' && '🔖'}
              </div>
              <div className="text-lg font-semibold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">{reactionType.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Commenters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Commenters</h3>
        <div className="space-y-3">
          {analytics.topCommenters.slice(0, 5).map((commenter, index) => (
            <div key={commenter.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{commenter.name}</p>
                  <p className="text-xs text-gray-500">User {commenter.userId}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">{commenter.count} comments</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Sharers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Sharers</h3>
        <div className="space-y-3">
          {analytics.topSharers.slice(0, 5).map((sharer, index) => (
            <div key={sharer.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sharer.name}</p>
                  <p className="text-xs text-gray-500">User {sharer.userId}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">{sharer.count} shares</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {analytics.activityTrend.map((dataPoint, index) => {
            const maxActivity = Math.max(
              ...analytics.activityTrend.map(d => d.shares + d.reactions + d.comments + d.views + d.follows)
            );
            const totalActivity = dataPoint.shares + dataPoint.reactions + dataPoint.comments + dataPoint.views + dataPoint.follows;
            const height = (totalActivity / maxActivity) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${new Date(dataPoint.date).toLocaleDateString()}: ${totalActivity} activities`}
                />
                <div className="mt-2 text-xs text-gray-500 transform -rotate-45 origin-left">
                  {new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demographic Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Age Groups</h3>
          <div className="space-y-2">
            {Object.entries(analytics.demographicData.ageGroups).map(([ageGroup, count]) => (
              <div key={ageGroup} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{ageGroup}</span>
                <span className="text-sm font-medium text-gray-900">{count}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Locations</h3>
          <div className="space-y-2">
            {Object.entries(analytics.demographicData.locations).map(([location, count]) => (
              <div key={location} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{location}</span>
                <span className="text-sm font-medium text-gray-900">{count}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Devices</h3>
          <div className="space-y-2">
            {Object.entries(analytics.demographicData.devices).map(([device, count]) => (
              <div key={device} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{device}</span>
                <span className="text-sm font-medium text-gray-900">{count}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      {analytics.insights.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Insights</h3>
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
