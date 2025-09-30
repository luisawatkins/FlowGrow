'use client';

import React, { useState } from 'react';
import { PropertyComparison, ExportFormat } from '@/types/comparison';
import { Button } from '../ui/Button';

interface ComparisonActionsProps {
  comparison: PropertyComparison;
  onExport: (format: ExportFormat) => void;
  onShare: () => void;
  onAddProperty: (propertyId: string, notes?: string) => void;
  isLoading?: boolean;
}

export function ComparisonActions({ 
  comparison, 
  onExport, 
  onShare, 
  onAddProperty, 
  isLoading = false 
}: ComparisonActionsProps) {
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [propertyNotes, setPropertyNotes] = useState('');

  const handleAddProperty = () => {
    if (propertyId.trim()) {
      onAddProperty(propertyId.trim(), propertyNotes.trim() || undefined);
      setPropertyId('');
      setPropertyNotes('');
      setShowAddPropertyModal(false);
    }
  };

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    setShowExportModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Left side - Quick Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              {comparison.properties.length} properties
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              Price range: {formatCurrency(
                Math.min(...comparison.properties.map(p => p.property.price))
              )} - {formatCurrency(
                Math.max(...comparison.properties.map(p => p.property.price))
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">
              Size range: {formatNumber(
                Math.min(...comparison.properties.map(p => p.property.details.livingArea))
              )} - {formatNumber(
                Math.max(...comparison.properties.map(p => p.property.details.livingArea))
              )} sq ft
            </span>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowAddPropertyModal(true)}
            disabled={isLoading || comparison.properties.length >= 10}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Property
          </Button>
          
          <Button
            onClick={() => setShowExportModal(true)}
            disabled={isLoading}
            variant="outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
          
          <Button
            onClick={onShare}
            disabled={isLoading}
            variant="outline"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </Button>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Property to Comparison</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="property-id" className="block text-sm font-medium text-gray-700 mb-1">
                    Property ID
                  </label>
                  <input
                    id="property-id"
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter property ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="property-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="property-notes"
                    value={propertyNotes}
                    onChange={(e) => setPropertyNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this property"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  onClick={() => setShowAddPropertyModal(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProperty}
                  disabled={isLoading || !propertyId.trim()}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Add Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Comparison</h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Choose a format to export your comparison data.
              </p>
              
              <div className="space-y-3">
                {[
                  { format: ExportFormat.PDF, label: 'PDF Document', icon: '📄', description: 'Formatted document for printing' },
                  { format: ExportFormat.EXCEL, label: 'Excel Spreadsheet', icon: '📊', description: 'Spreadsheet for data analysis' },
                  { format: ExportFormat.CSV, label: 'CSV File', icon: '📋', description: 'Comma-separated values' },
                  { format: ExportFormat.JSON, label: 'JSON Data', icon: '🔧', description: 'Raw data format' }
                ].map(({ format, label, icon, description }) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowExportModal(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
