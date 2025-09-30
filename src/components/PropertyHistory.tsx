'use client';

import React, { useState } from 'react';
import { PropertyHistory, PropertyTimeline } from '@/types/history';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { PropertyTimelineView } from './PropertyHistory/PropertyTimelineView';
import { PropertyHistoryAnalytics } from './PropertyHistory/PropertyHistoryAnalytics';
import { CreateEventModal } from './PropertyHistory/CreateEventModal';
import { HistoryFilters } from './PropertyHistory/HistoryFilters';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface PropertyHistoryProps {
  propertyId: string;
  onHistoryChange?: (history: PropertyHistory | null) => void;
}

export function PropertyHistory({ 
  propertyId, 
  onHistoryChange 
}: PropertyHistoryProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics'>('timeline');
  
  const {
    history,
    timeline,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    loadHistory,
    loadTimeline,
    applyFilters,
    clearError
  } = usePropertyHistory(propertyId, {
    autoRefresh: true,
    refreshInterval: 5,
    enableFilters: true,
    enablePagination: true
  });

  // Notify parent of history changes
  React.useEffect(() => {
    onHistoryChange?.(history);
  }, [history, onHistoryChange]);

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEvent({
        ...eventData,
        propertyId
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create history event:', error);
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: any) => {
    try {
      await updateEvent(eventId, updates);
    } catch (error) {
      console.error('Failed to update history event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete history event:', error);
    }
  };

  const handleApplyFilters = async (filters: any) => {
    try {
      await applyFilters(filters);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  };

  if (isLoading && !history && !timeline) {
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
              Error loading property history
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={clearError}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!history && !timeline) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No history available</h3>
        <p className="mt-1 text-sm text-gray-500">
          This property doesn't have any history events yet.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add First Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property History</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track all events and changes for this property
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {timeline && (
          <HistoryFilters
            filters={timeline.filters}
            onApplyFilters={handleApplyFilters}
            isLoading={isLoading}
          />
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'timeline', name: 'Timeline', icon: '📅' },
              { id: 'analytics', name: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === 'timeline' && timeline && (
            <PropertyTimelineView
              timeline={timeline}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'analytics' && (
            <PropertyHistoryAnalytics
              propertyId={propertyId}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <CreateEventModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateEvent}
            propertyId={propertyId}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
