'use client';

import React, { useState } from 'react';
import { PropertyComparison, CreateComparisonRequest } from '@/types/comparison';
import { useComparison } from '@/hooks/useComparison';
import { ComparisonTable } from './Comparison/ComparisonTable';
import { ComparisonChart } from './Comparison/ComparisonChart';
import { ComparisonMetrics } from './Comparison/ComparisonMetrics';
import { ComparisonHeader } from './Comparison/ComparisonHeader';
import { ComparisonActions } from './Comparison/ComparisonActions';
import { CreateComparisonModal } from './Comparison/CreateComparisonModal';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface PropertyComparisonProps {
  userId: string;
  initialComparisonId?: string;
  onComparisonChange?: (comparison: PropertyComparison | null) => void;
}

export function PropertyComparison({ 
  userId, 
  initialComparisonId,
  onComparisonChange 
}: PropertyComparisonProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'chart' | 'metrics'>('table');
  
  const {
    comparison,
    comparisons,
    isLoading,
    error,
    addProperty,
    removeProperty,
    updateComparison,
    deleteComparison,
    createComparison,
    loadComparison,
    loadComparisons,
    exportComparison,
    shareComparison,
    clearError
  } = useComparison(userId, {
    autoSave: true,
    maxProperties: 10,
    enableSharing: true,
    enableExport: true
  });

  // Load initial comparison if provided
  React.useEffect(() => {
    if (initialComparisonId && !comparison) {
      loadComparison(initialComparisonId).catch(console.error);
    }
  }, [initialComparisonId, comparison, loadComparison]);

  // Notify parent of comparison changes
  React.useEffect(() => {
    onComparisonChange?.(comparison);
  }, [comparison, onComparisonChange]);

  const handleCreateComparison = async (data: CreateComparisonRequest) => {
    try {
      await createComparison(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create comparison:', error);
    }
  };

  const handleUpdateComparison = async (updates: Partial<PropertyComparison>) => {
    try {
      await updateComparison(updates);
    } catch (error) {
      console.error('Failed to update comparison:', error);
    }
  };

  const handleDeleteComparison = async () => {
    if (!comparison) return;
    
    if (window.confirm('Are you sure you want to delete this comparison?')) {
      try {
        await deleteComparison(comparison.id);
      } catch (error) {
        console.error('Failed to delete comparison:', error);
      }
    }
  };

  const handleAddProperty = async (propertyId: string, notes?: string) => {
    try {
      await addProperty(propertyId, notes);
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const handleRemoveProperty = async (propertyId: string) => {
    try {
      await removeProperty(propertyId);
    } catch (error) {
      console.error('Failed to remove property:', error);
    }
  };

  const handleExportComparison = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    try {
      await exportComparison(format as any);
    } catch (error) {
      console.error('Failed to export comparison:', error);
    }
  };

  const handleShareComparison = async () => {
    if (!comparison) return;
    
    try {
      const shareUrl = await shareComparison(comparison.id);
      // Show success message or copy to clipboard notification
      console.log('Comparison shared:', shareUrl);
    } catch (error) {
      console.error('Failed to share comparison:', error);
    }
  };

  if (isLoading && !comparison) {
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
              Error loading comparison
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

  if (!comparison) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No comparison selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a new comparison or select an existing one to get started.
        </p>
        <div className="mt-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Comparison
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <ComparisonHeader
          comparison={comparison}
          onUpdate={handleUpdateComparison}
          onDelete={handleDeleteComparison}
          isLoading={isLoading}
        />

        {/* Actions */}
        <ComparisonActions
          comparison={comparison}
          onExport={handleExportComparison}
          onShare={handleShareComparison}
          onAddProperty={handleAddProperty}
          isLoading={isLoading}
        />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'table', name: 'Table View', icon: '📊' },
              { id: 'chart', name: 'Charts', icon: '📈' },
              { id: 'metrics', name: 'Metrics', icon: '📋' }
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
          {activeTab === 'table' && (
            <ComparisonTable
              comparison={comparison}
              onRemoveProperty={handleRemoveProperty}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'chart' && (
            <ComparisonChart
              comparison={comparison}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'metrics' && (
            <ComparisonMetrics
              comparison={comparison}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Create Comparison Modal */}
        {showCreateModal && (
          <CreateComparisonModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateComparison}
            existingComparisons={comparisons}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}