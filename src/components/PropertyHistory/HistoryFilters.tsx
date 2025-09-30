'use client';

import React, { useState } from 'react';
import { TimelineFilters, HistoryEventType, EventImportance } from '@/types/history';
import { Button } from '../ui/Button';

interface HistoryFiltersProps {
  filters: TimelineFilters;
  onApplyFilters: (filters: Partial<TimelineFilters>) => void;
  isLoading?: boolean;
}

export function HistoryFilters({ 
  filters, 
  onApplyFilters, 
  isLoading = false 
}: HistoryFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TimelineFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const eventTypes = [
    { value: HistoryEventType.PRICE_CHANGE, label: 'Price Change' },
    { value: HistoryEventType.PRICE_INCREASE, label: 'Price Increase' },
    { value: HistoryEventType.PRICE_DECREASE, label: 'Price Decrease' },
    { value: HistoryEventType.STATUS_CHANGE, label: 'Status Change' },
    { value: HistoryEventType.LISTED, label: 'Listed' },
    { value: HistoryEventType.DELISTED, label: 'Delisted' },
    { value: HistoryEventType.SOLD, label: 'Sold' },
    { value: HistoryEventType.RENTED, label: 'Rented' },
    { value: HistoryEventType.VIEWING_COMPLETED, label: 'Viewing Completed' },
    { value: HistoryEventType.OPEN_HOUSE, label: 'Open House' },
    { value: HistoryEventType.PHOTO_ADDED, label: 'Photo Added' },
    { value: HistoryEventType.VIDEO_ADDED, label: 'Video Added' },
    { value: HistoryEventType.RENOVATION, label: 'Renovation' },
    { value: HistoryEventType.MAINTENANCE, label: 'Maintenance' },
    { value: HistoryEventType.INSPECTION, label: 'Inspection' },
    { value: HistoryEventType.CUSTOM_EVENT, label: 'Custom Event' }
  ];

  const importanceLevels = [
    { value: EventImportance.LOW, label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: EventImportance.MEDIUM, label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: EventImportance.HIGH, label: 'High', color: 'bg-yellow-100 text-yellow-800' },
    { value: EventImportance.CRITICAL, label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const sources = [
    { value: 'system', label: 'System' },
    { value: 'user', label: 'User' },
    { value: 'agent', label: 'Agent' },
    { value: 'mls', label: 'MLS' },
    { value: 'api', label: 'API' },
    { value: 'import', label: 'Import' }
  ];

  const handleEventTypeChange = (eventType: HistoryEventType, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      eventTypes: checked 
        ? [...prev.eventTypes, eventType]
        : prev.eventTypes.filter(type => type !== eventType)
    }));
  };

  const handleImportanceChange = (importance: EventImportance, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      importance: checked 
        ? [...prev.importance, importance]
        : prev.importance.filter(imp => imp !== importance)
    }));
  };

  const handleSourceChange = (source: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      sources: checked 
        ? [...prev.sources, source as any]
        : prev.sources.filter(s => s !== source)
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: new Date(value)
      }
    }));
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: TimelineFilters = {
      eventTypes: [],
      sources: [],
      importance: [],
      tags: [],
      isPublic: undefined
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters(filters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.eventTypes.length > 0) count++;
    if (localFilters.sources.length > 0) count++;
    if (localFilters.importance.length > 0) count++;
    if (localFilters.tags.length > 0) count++;
    if (localFilters.dateRange) count++;
    if (localFilters.isPublic !== undefined) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getActiveFiltersCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
          {getActiveFiltersCount() > 0 && (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Event Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {eventTypes.map((eventType) => (
                <label key={eventType.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.eventTypes.includes(eventType.value)}
                    onChange={(e) => handleEventTypeChange(eventType.value, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{eventType.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Importance Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importance
            </label>
            <div className="flex flex-wrap gap-2">
              {importanceLevels.map((level) => (
                <label key={level.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.importance.includes(level.value)}
                    onChange={(e) => handleImportanceChange(level.value, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${level.color}`}>
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sources
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sources.map((source) => (
                <label key={source.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.sources.includes(source.value as any)}
                    onChange={(e) => handleSourceChange(source.value, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.start ? localFilters.dateRange.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.end ? localFilters.dateRange.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={localFilters.isPublic === undefined}
                  onChange={() => setLocalFilters(prev => ({ ...prev, isPublic: undefined }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={localFilters.isPublic === true}
                  onChange={() => setLocalFilters(prev => ({ ...prev, isPublic: true }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Public Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={localFilters.isPublic === false}
                  onChange={() => setLocalFilters(prev => ({ ...prev, isPublic: false }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Private Only</span>
              </label>
            </div>
          </div>

          {/* Common Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Common Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {['price', 'status', 'viewing', 'media', 'maintenance', 'inspection', 'market', 'custom'].map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters.tags.includes(tag)}
                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
