'use client';

import React, { useState } from 'react';
import { PropertyTimeline, TimelineEvent } from '@/types/history';
import { Button } from '../ui/Button';

interface PropertyTimelineViewProps {
  timeline: PropertyTimeline;
  onUpdateEvent: (eventId: string, updates: any) => void;
  onDeleteEvent: (eventId: string) => void;
  isLoading?: boolean;
}

export function PropertyTimelineView({ 
  timeline, 
  onUpdateEvent, 
  onDeleteEvent, 
  isLoading = false 
}: PropertyTimelineViewProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEventIcon = (eventType: string) => {
    const iconMap: { [key: string]: string } = {
      'price_change': '💰',
      'price_increase': '📈',
      'price_decrease': '📉',
      'price_target_reached': '🎯',
      'status_change': '🔄',
      'listed': '🏠',
      'delisted': '❌',
      'relisted': '🔄',
      'sold': '✅',
      'rented': '🔑',
      'pending': '⏳',
      'withdrawn': '↩️',
      'market_update': '📊',
      'comparable_sold': '🏘️',
      'market_trend_change': '📈',
      'renovation': '🔨',
      'maintenance': '🔧',
      'inspection': '🔍',
      'appraisal': '📋',
      'photo_update': '📸',
      'description_update': '📝',
      'viewing_scheduled': '👀',
      'viewing_completed': '✅',
      'open_house': '🏠',
      'photo_added': '📷',
      'photo_removed': '🗑️',
      'video_added': '🎥',
      'virtual_tour_created': '🎬',
      'custom_event': '📌',
      'note_added': '📝',
      'comment_added': '💬',
      'shared': '📤',
      'favorited': '❤️'
    };
    return iconMap[eventType] || '📌';
  };

  const getEventColor = (importance: string) => {
    const colorMap: { [key: string]: string } = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colorMap[importance] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'price': 'bg-green-100 text-green-800',
      'status': 'bg-blue-100 text-blue-800',
      'market': 'bg-purple-100 text-purple-800',
      'property': 'bg-orange-100 text-orange-800',
      'viewing': 'bg-cyan-100 text-cyan-800',
      'media': 'bg-pink-100 text-pink-800',
      'social': 'bg-indigo-100 text-indigo-800',
      'custom': 'bg-gray-100 text-gray-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const renderEventData = (event: TimelineEvent) => {
    const { data } = event;

    if (data.price) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price Change:</span>
            <span className={`text-sm font-medium ${
              data.price.changePercentage > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.price.changePercentage > 0 ? '+' : ''}{data.price.changePercentage.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">From:</span>
            <span className="text-sm font-medium">{formatCurrency(data.price.oldPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">To:</span>
            <span className="text-sm font-medium">{formatCurrency(data.price.newPrice)}</span>
          </div>
        </div>
      );
    }

    if (data.status) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status Change:</span>
            <span className="text-sm font-medium">{data.status.newStatus}</span>
          </div>
          {data.status.reason && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Reason:</span> {data.status.reason}
            </div>
          )}
        </div>
      );
    }

    if (data.viewing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Viewer Type:</span>
            <span className="text-sm font-medium capitalize">{data.viewing.viewerType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="text-sm font-medium">{data.viewing.duration} minutes</span>
          </div>
          {data.viewing.feedback && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Feedback:</span> {data.viewing.feedback}
            </div>
          )}
          {data.viewing.rating && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < data.viewing.rating! ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (data.media) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Action:</span>
            <span className="text-sm font-medium capitalize">{data.media.action.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Media Type:</span>
            <span className="text-sm font-medium capitalize">{data.media.mediaType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Count:</span>
            <span className="text-sm font-medium">{data.media.mediaCount}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-600">
        <span className="font-medium">Event Type:</span> {event.type.replace('_', ' ')}
      </div>
    );
  };

  if (timeline.events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters to see more events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeline.summary.totalEvents}</div>
            <div className="text-sm text-gray-500">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{timeline.summary.visibleEvents}</div>
            <div className="text-sm text-gray-500">Visible Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Date(timeline.summary.dateRange.start).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">First Event</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {new Date(timeline.summary.dateRange.end).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500">Last Event</div>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-4">
        {timeline.events.map((event, index) => {
          const isExpanded = expandedEvents.has(event.id);
          
          return (
            <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                {/* Event Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {getEventIcon(event.type)}
                  </div>
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event.importance)}`}>
                        {event.importance}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                      <button
                        onClick={() => toggleEventExpansion(event.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">{event.description}</p>

                  {/* Event Data */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      {renderEventData(event)}
                    </div>
                  )}

                  {/* Event Metadata */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Source: {event.source.name}</span>
                      {event.metadata.verified && (
                        <span className="flex items-center">
                          <svg className="h-3 w-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                      <span>Confidence: {event.metadata.confidence}%</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {event.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {timeline.pagination.hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              // Load more events
              console.log('Load more events');
            }}
            variant="outline"
            disabled={isLoading}
          >
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}
