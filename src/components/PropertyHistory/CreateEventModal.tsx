'use client';

import React, { useState } from 'react';
import { CreateHistoryEventRequest, HistoryEventType, EventSource } from '@/types/history';
import { Button } from '../ui/Button';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: CreateHistoryEventRequest) => void;
  propertyId: string;
}

export function CreateEventModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  propertyId 
}: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    type: HistoryEventType.CUSTOM_EVENT,
    title: '',
    description: '',
    isPublic: true,
    tags: [] as string[],
    // Event-specific data
    priceData: {
      oldPrice: 0,
      newPrice: 0
    },
    statusData: {
      oldStatus: '',
      newStatus: '',
      reason: ''
    },
    viewingData: {
      viewerType: 'buyer',
      duration: 30,
      feedback: '',
      rating: 0
    },
    mediaData: {
      action: 'photo_added',
      mediaCount: 1,
      mediaType: 'photo'
    },
    customData: {
      category: '',
      details: ''
    }
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const eventTypes = [
    { value: HistoryEventType.PRICE_CHANGE, label: 'Price Change', category: 'price' },
    { value: HistoryEventType.PRICE_INCREASE, label: 'Price Increase', category: 'price' },
    { value: HistoryEventType.PRICE_DECREASE, label: 'Price Decrease', category: 'price' },
    { value: HistoryEventType.STATUS_CHANGE, label: 'Status Change', category: 'status' },
    { value: HistoryEventType.LISTED, label: 'Listed', category: 'status' },
    { value: HistoryEventType.DELISTED, label: 'Delisted', category: 'status' },
    { value: HistoryEventType.SOLD, label: 'Sold', category: 'status' },
    { value: HistoryEventType.RENTED, label: 'Rented', category: 'status' },
    { value: HistoryEventType.VIEWING_COMPLETED, label: 'Viewing Completed', category: 'viewing' },
    { value: HistoryEventType.OPEN_HOUSE, label: 'Open House', category: 'viewing' },
    { value: HistoryEventType.PHOTO_ADDED, label: 'Photo Added', category: 'media' },
    { value: HistoryEventType.VIDEO_ADDED, label: 'Video Added', category: 'media' },
    { value: HistoryEventType.RENOVATION, label: 'Renovation', category: 'property' },
    { value: HistoryEventType.MAINTENANCE, label: 'Maintenance', category: 'property' },
    { value: HistoryEventType.INSPECTION, label: 'Inspection', category: 'property' },
    { value: HistoryEventType.CUSTOM_EVENT, label: 'Custom Event', category: 'custom' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!formData.title.trim()) {
      validationErrors.push('Event title is required');
    }
    
    if (!formData.description.trim()) {
      validationErrors.push('Event description is required');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Build event data based on type
    let eventData: any = {};
    
    switch (formData.type) {
      case HistoryEventType.PRICE_CHANGE:
      case HistoryEventType.PRICE_INCREASE:
      case HistoryEventType.PRICE_DECREASE:
        if (formData.priceData.oldPrice <= 0 || formData.priceData.newPrice <= 0) {
          validationErrors.push('Price values must be greater than 0');
        }
        if (validationErrors.length === 0) {
          const changeAmount = formData.priceData.newPrice - formData.priceData.oldPrice;
          const changePercentage = (changeAmount / formData.priceData.oldPrice) * 100;
          eventData = {
            price: {
              oldPrice: formData.priceData.oldPrice,
              newPrice: formData.priceData.newPrice,
              changePercentage,
              changeAmount,
              currency: 'USD'
            }
          };
        }
        break;
        
      case HistoryEventType.STATUS_CHANGE:
        if (!formData.statusData.newStatus.trim()) {
          validationErrors.push('New status is required');
        }
        if (validationErrors.length === 0) {
          eventData = {
            status: {
              oldStatus: formData.statusData.oldStatus,
              newStatus: formData.statusData.newStatus,
              reason: formData.statusData.reason
            }
          };
        }
        break;
        
      case HistoryEventType.VIEWING_COMPLETED:
        if (formData.viewingData.duration <= 0) {
          validationErrors.push('Viewing duration must be greater than 0');
        }
        if (validationErrors.length === 0) {
          eventData = {
            viewing: {
              viewerId: 'user-123', // Mock user ID
              viewerType: formData.viewingData.viewerType,
              duration: formData.viewingData.duration,
              feedback: formData.viewingData.feedback,
              rating: formData.viewingData.rating
            }
          };
        }
        break;
        
      case HistoryEventType.PHOTO_ADDED:
      case HistoryEventType.VIDEO_ADDED:
        if (formData.mediaData.mediaCount <= 0) {
          validationErrors.push('Media count must be greater than 0');
        }
        if (validationErrors.length === 0) {
          eventData = {
            media: {
              action: formData.mediaData.action,
              mediaCount: formData.mediaData.mediaCount,
              mediaType: formData.mediaData.mediaType
            }
          };
        }
        break;
        
      case HistoryEventType.CUSTOM_EVENT:
        if (!formData.customData.category.trim()) {
          validationErrors.push('Custom event category is required');
        }
        if (validationErrors.length === 0) {
          eventData = {
            custom: {
              category: formData.customData.category,
              details: formData.customData.details
            }
          };
        }
        break;
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const createRequest: CreateHistoryEventRequest = {
      propertyId,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      data: eventData,
      source: {
        type: 'user',
        id: 'user-123',
        name: 'Current User',
        verified: true
      },
      isPublic: formData.isPublic,
      tags: formData.tags
    };

    onCreate(createRequest);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: HistoryEventType.CUSTOM_EVENT,
      title: '',
      description: '',
      isPublic: true,
      tags: [],
      priceData: { oldPrice: 0, newPrice: 0 },
      statusData: { oldStatus: '', newStatus: '', reason: '' },
      viewingData: { viewerType: 'buyer', duration: 30, feedback: '', rating: 0 },
      mediaData: { action: 'photo_added', mediaCount: 1, mediaType: 'photo' },
      customData: { category: '', details: '' }
    });
    setNewTag('');
    setErrors([]);
    onClose();
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

  const renderEventTypeFields = () => {
    switch (formData.type) {
      case HistoryEventType.PRICE_CHANGE:
      case HistoryEventType.PRICE_INCREASE:
      case HistoryEventType.PRICE_DECREASE:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Old Price ($)
                </label>
                <input
                  type="number"
                  value={formData.priceData.oldPrice}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    priceData: { ...prev.priceData, oldPrice: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Price ($)
                </label>
                <input
                  type="number"
                  value={formData.priceData.newPrice}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    priceData: { ...prev.priceData, newPrice: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
        );

      case HistoryEventType.STATUS_CHANGE:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Old Status
                </label>
                <input
                  type="text"
                  value={formData.statusData.oldStatus}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    statusData: { ...prev.statusData, oldStatus: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Previous status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status *
                </label>
                <input
                  type="text"
                  value={formData.statusData.newStatus}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    statusData: { ...prev.statusData, newStatus: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New status"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                value={formData.statusData.reason}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  statusData: { ...prev.statusData, reason: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reason for status change"
              />
            </div>
          </div>
        );

      case HistoryEventType.VIEWING_COMPLETED:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Viewer Type
                </label>
                <select
                  value={formData.viewingData.viewerType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    viewingData: { ...prev.viewingData, viewerType: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="buyer">Buyer</option>
                  <option value="agent">Agent</option>
                  <option value="inspector">Inspector</option>
                  <option value="appraiser">Appraiser</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.viewingData.duration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    viewingData: { ...prev.viewingData, duration: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                value={formData.viewingData.feedback}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  viewingData: { ...prev.viewingData, feedback: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Viewing feedback"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                value={formData.viewingData.rating}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  viewingData: { ...prev.viewingData, rating: parseInt(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="5"
              />
            </div>
          </div>
        );

      case HistoryEventType.PHOTO_ADDED:
      case HistoryEventType.VIDEO_ADDED:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Count *
                </label>
                <input
                  type="number"
                  value={formData.mediaData.mediaCount}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    mediaData: { ...prev.mediaData, mediaCount: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type
                </label>
                <select
                  value={formData.mediaData.mediaType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    mediaData: { ...prev.mediaData, mediaType: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="virtual_tour">Virtual Tour</option>
                </select>
              </div>
            </div>
          </div>
        );

      case HistoryEventType.CUSTOM_EVENT:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                value={formData.customData.category}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customData: { ...prev.customData, category: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event category"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                value={formData.customData.details}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customData: { ...prev.customData, details: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional details"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create History Event</h3>
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
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as HistoryEventType }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Event description"
                  required
                />
              </div>
            </div>

            {/* Event Type Specific Fields */}
            {renderEventTypeFields()}

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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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

            {/* Visibility */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this event public
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
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
