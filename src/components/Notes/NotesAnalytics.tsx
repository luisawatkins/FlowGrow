// Notes Analytics Component

'use client';

import React from 'react';
import { NotesAnalytics as NotesAnalyticsType, NoteType, NotePriority } from '@/types/notes';

interface NotesAnalyticsProps {
  analytics: NotesAnalyticsType | null;
  loading: boolean;
}

export const NotesAnalytics: React.FC<NotesAnalyticsProps> = ({
  analytics,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes Analytics</h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes Analytics</h3>
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const getTypeColor = (type: NoteType): string => {
    const colors = {
      [NoteType.GENERAL]: 'bg-gray-500',
      [NoteType.VIEWING]: 'bg-blue-500',
      [NoteType.FINANCIAL]: 'bg-green-500',
      [NoteType.MAINTENANCE]: 'bg-yellow-500',
      [NoteType.MARKET]: 'bg-purple-500',
      [NoteType.PERSONAL]: 'bg-pink-500'
    };
    return colors[type] || colors[NoteType.GENERAL];
  };

  const getPriorityColor = (priority: NotePriority): string => {
    const colors = {
      [NotePriority.LOW]: 'bg-gray-500',
      [NotePriority.MEDIUM]: 'bg-yellow-500',
      [NotePriority.HIGH]: 'bg-orange-500',
      [NotePriority.URGENT]: 'bg-red-500'
    };
    return colors[priority] || colors[NotePriority.MEDIUM];
  };

  const maxTypeCount = Math.max(...Object.values(analytics.notesByType));
  const maxPriorityCount = Math.max(...Object.values(analytics.notesByPriority));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notes Analytics</h3>

      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{analytics.totalNotes}</div>
            <div className="text-sm text-blue-700">Total Notes</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">
              {analytics.averageNotesPerProperty.toFixed(1)}
            </div>
            <div className="text-sm text-green-700">Avg per Property</div>
          </div>
        </div>

        {/* Notes by Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Notes by Type</h4>
          <div className="space-y-2">
            {Object.entries(analytics.notesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(type as NoteType)}`}></div>
                  <span className="text-sm text-gray-700 capitalize">{type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getTypeColor(type as NoteType)}`}
                      style={{ width: `${(count / maxTypeCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes by Priority */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Notes by Priority</h4>
          <div className="space-y-2">
            {Object.entries(analytics.notesByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority as NotePriority)}`}></div>
                  <span className="text-sm text-gray-700 capitalize">{priority}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getPriorityColor(priority as NotePriority)}`}
                      style={{ width: `${(count / maxPriorityCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Tags */}
        {analytics.mostUsedTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Most Used Tags</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.mostUsedTags.slice(0, 10).map(({ tag, count }) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  #{tag}
                  <span className="ml-1 text-xs text-gray-500">({count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity (Last 7 Days)</h4>
          <div className="space-y-2">
            {analytics.recentActivity.map(({ date, notesCreated, commentsCreated }) => (
              <div key={date} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-blue-600">{notesCreated} notes</span>
                  <span className="text-green-600">{commentsCreated} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
