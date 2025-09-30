'use client';

import React, { useState } from 'react';
import { PropertyComparison, CreateComparisonRequest } from '@/types/comparison';
import { Button } from '../ui/Button';

interface CreateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateComparisonRequest) => void;
  existingComparisons: PropertyComparison[];
}

export function CreateComparisonModal({
  isOpen,
  onClose,
  onCreate,
  existingComparisons
}: CreateComparisonModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    propertyIds: [] as string[],
    isPublic: false,
    tags: [] as string[],
    notes: ''
  });
  const [newTag, setNewTag] = useState('');
  const [newPropertyId, setNewPropertyId] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!formData.name.trim()) {
      validationErrors.push('Comparison name is required');
    }
    
    if (formData.propertyIds.length < 2) {
      validationErrors.push('At least 2 properties are required');
    }
    
    if (formData.propertyIds.length > 10) {
      validationErrors.push('Maximum 10 properties allowed');
    }
    
    // Check for duplicate names
    const nameExists = existingComparisons.some(
      comp => comp.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (nameExists) {
      validationErrors.push('A comparison with this name already exists');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onCreate(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      propertyIds: [],
      isPublic: false,
      tags: [],
      notes: ''
    });
    setNewTag('');
    setNewPropertyId('');
    setErrors([]);
    onClose();
  };

  const addProperty = () => {
    if (newPropertyId.trim() && !formData.propertyIds.includes(newPropertyId.trim())) {
      setFormData(prev => ({
        ...prev,
        propertyIds: [...prev.propertyIds, newPropertyId.trim()]
      }));
      setNewPropertyId('');
    }
  };

  const removeProperty = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      propertyIds: prev.propertyIds.filter(id => id !== propertyId)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Comparison</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Comparison Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Comparison Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter comparison name"
                required
              />
            </div>

            {/* Properties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Properties * (2-10 required)
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newPropertyId}
                  onChange={(e) => setNewPropertyId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter property ID"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProperty())}
                />
                <Button
                  type="button"
                  onClick={addProperty}
                  disabled={!newPropertyId.trim() || formData.propertyIds.length >= 10}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </Button>
              </div>
              
              {formData.propertyIds.length > 0 && (
                <div className="space-y-2">
                  {formData.propertyIds.map((propertyId, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm text-gray-700">{propertyId}</span>
                      <button
                        type="button"
                        onClick={() => removeProperty(propertyId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this comparison"
              />
            </div>

            {/* Public/Private */}
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this comparison public (others can view it)
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Comparison
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
