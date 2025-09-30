// Comments Analytics Component

'use client';

import React from 'react';
import { CommentsAnalytics as CommentsAnalyticsType } from '@/types/notes';

interface CommentsAnalyticsProps {
  analytics: CommentsAnalyticsType | null;
  loading: boolean;
}

export const CommentsAnalytics: React.FC<CommentsAnalyticsProps> = ({
  analytics,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments Analytics</h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments Analytics</h3>
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const approvalRate = analytics.totalComments > 0 
    ? (analytics.approvedComments / analytics.totalComments) * 100 
    : 0;

  const engagementRate = analytics.totalComments > 0 
    ? (analytics.engagementMetrics.totalLikes + analytics.engagementMetrics.totalDislikes) / analytics.totalComments 
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Comments Analytics</h3>

      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{analytics.totalComments}</div>
            <div className="text-sm text-blue-700">Total Comments</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">
              {analytics.averageCommentsPerProperty.toFixed(1)}
            </div>
            <div className="text-sm text-green-700">Avg per Property</div>
          </div>
        </div>

        {/* Comment Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Comment Status</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{analytics.approvedComments}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{analytics.pendingComments}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{analytics.moderatedComments}</div>
              <div className="text-xs text-gray-600">Moderated</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Approval Rate</span>
              <span>{approvalRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Engagement</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {analytics.engagementMetrics.totalLikes}
              </div>
              <div className="text-xs text-gray-600">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {analytics.engagementMetrics.totalDislikes}
              </div>
              <div className="text-xs text-gray-600">Total Dislikes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {analytics.engagementMetrics.averageLikesPerComment.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avg Likes/Comment</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Engagement Rate</span>
              <span>{engagementRate.toFixed(1)} interactions/comment</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(engagementRate * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Top Commenters */}
        {analytics.topCommenters.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Top Commenters</h4>
            <div className="space-y-2">
              {analytics.topCommenters.slice(0, 5).map(({ userId, username, commentCount }) => (
                <div key={userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{username}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{commentCount} comments</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• {approvalRate.toFixed(1)}% of comments are approved</p>
            <p>• Average of {analytics.engagementMetrics.averageLikesPerComment.toFixed(1)} likes per comment</p>
            <p>• {analytics.topCommenters.length > 0 ? analytics.topCommenters[0].username : 'No'} is the most active commenter</p>
            <p>• {engagementRate.toFixed(1)} average interactions per comment</p>
          </div>
        </div>
      </div>
    </div>
  );
};
