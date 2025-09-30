'use client';

import React, { useState } from 'react';
import { WishlistProperty, PriceAlertType, PriceChangeType, NotificationFrequency } from '@/types/wishlist';
import { Button } from '../ui/Button';

interface CreatePriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlert: (alertData: any) => void;
  property?: WishlistProperty | null;
}

export function CreatePriceAlertModal({
  isOpen,
  onClose,
  onCreateAlert,
  property
}: CreatePriceAlertModalProps) {
  const [formData, setFormData] = useState({
    type: PriceAlertType.PRICE_DROP,
    targetPrice: property?.property.price || 0,
    percentageThreshold: 5,
    absoluteThreshold: 0,
    timeWindow: 24,
    email: true,
    push: true,
    sms: false,
    frequency: NotificationFrequency.IMMEDIATE,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (formData.targetPrice <= 0) {
      validationErrors.push('Target price must be greater than 0');
    }
    
    if (formData.percentageThreshold <= 0) {
      validationErrors.push('Percentage threshold must be greater than 0');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const alertData = {
      propertyId: property?.property.id,
      type: formData.type,
      targetPrice: formData.targetPrice,
      conditions: {
        priceChange: formData.type === PriceAlertType.PRICE_TARGET ? PriceChangeType.ABSOLUTE : PriceChangeType.PERCENTAGE,
        percentageThreshold: formData.percentageThreshold,
        absoluteThreshold: formData.absoluteThreshold,
        timeWindow: formData.timeWindow
      },
      notificationSettings: {
        email: formData.email,
        push: formData.push,
        sms: formData.sms,
        frequency: formData.frequency,
        quietHours: formData.quietHours
      }
    };
    
    onCreateAlert(alertData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: PriceAlertType.PRICE_DROP,
      targetPrice: property?.property.price || 0,
      percentageThreshold: 5,
      absoluteThreshold: 0,
      timeWindow: 24,
      email: true,
      push: true,
      sms: false,
      frequency: NotificationFrequency.IMMEDIATE,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    });
    setErrors([]);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create Price Alert</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {property && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="text-sm font-medium text-gray-900">{property.property.title}</div>
              <div className="text-sm text-gray-500">
                {property.property.location.city}, {property.property.location.state}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Current Price: {formatCurrency(property.property.price)}
              </div>
            </div>
          )}

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
            {/* Alert Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: PriceAlertType.PRICE_DROP, label: 'Price Drop', description: 'Notify when price decreases' },
                  { value: PriceAlertType.PRICE_INCREASE, label: 'Price Increase', description: 'Notify when price increases' },
                  { value: PriceAlertType.PRICE_TARGET, label: 'Target Price', description: 'Notify when price reaches target' },
                  { value: PriceAlertType.ANY_CHANGE, label: 'Any Change', description: 'Notify on any price change' }
                ].map(({ value, label, description }) => (
                  <label key={value} className="relative">
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={formData.type === value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PriceAlertType }))}
                      className="sr-only"
                    />
                    <div className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Price */}
            {formData.type === PriceAlertType.PRICE_TARGET && (
              <div>
                <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Price *
                </label>
                <input
                  id="targetPrice"
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter target price"
                  min="0"
                  step="1000"
                />
              </div>
            )}

            {/* Percentage Threshold */}
            {formData.type !== PriceAlertType.PRICE_TARGET && (
              <div>
                <label htmlFor="percentageThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage Threshold *
                </label>
                <input
                  id="percentageThreshold"
                  type="number"
                  value={formData.percentageThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentageThreshold: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter percentage threshold"
                  min="0.1"
                  max="100"
                  step="0.1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Alert will trigger when price changes by this percentage
                </p>
              </div>
            )}

            {/* Time Window */}
            <div>
              <label htmlFor="timeWindow" className="block text-sm font-medium text-gray-700 mb-1">
                Time Window (hours)
              </label>
              <input
                id="timeWindow"
                type="number"
                value={formData.timeWindow}
                onChange={(e) => setFormData(prev => ({ ...prev, timeWindow: parseInt(e.target.value) || 24 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter time window"
                min="1"
                max="168"
              />
              <p className="mt-1 text-xs text-gray-500">
                Only trigger alerts within this time window
              </p>
            </div>

            {/* Notification Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Methods
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.push}
                    onChange={(e) => setFormData(prev => ({ ...prev, push: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sms}
                    onChange={(e) => setFormData(prev => ({ ...prev, sms: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                </label>
              </div>
            </div>

            {/* Notification Frequency */}
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Notification Frequency
              </label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as NotificationFrequency }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={NotificationFrequency.IMMEDIATE}>Immediate</option>
                <option value={NotificationFrequency.DAILY}>Daily</option>
                <option value={NotificationFrequency.WEEKLY}>Weekly</option>
              </select>
            </div>

            {/* Quiet Hours */}
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.quietHours.enabled}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    quietHours: { ...prev.quietHours, enabled: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Enable quiet hours</span>
              </label>
              
              {formData.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="startTime" className="block text-xs text-gray-500 mb-1">
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      value={formData.quietHours.start}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-xs text-gray-500 mb-1">
                      End Time
                    </label>
                    <input
                      id="endTime"
                      type="time"
                      value={formData.quietHours.end}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
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
                Create Alert
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
