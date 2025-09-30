'use client';

import React, { useState } from 'react';
import { Wishlist, WishlistProperty } from '@/types/wishlist';
import { Button } from '../ui/Button';
import { WishlistHeader } from './WishlistHeader';
import { WishlistProperties } from './WishlistProperties';
import { WishlistAnalytics } from './WishlistAnalytics';
import { AddPropertyModal } from './AddPropertyModal';
import { CreatePriceAlertModal } from './CreatePriceAlertModal';

interface WishlistDetailProps {
  wishlist: Wishlist | null;
  onUpdate: (updates: Partial<Wishlist>) => void;
  onDelete: () => void;
  onAddProperty: (propertyId: string, notes?: string, tags?: string[]) => void;
  onRemoveProperty: (propertyId: string) => void;
  onBackToList: () => void;
  isLoading?: boolean;
}

export function WishlistDetail({ 
  wishlist, 
  onUpdate, 
  onDelete, 
  onAddProperty, 
  onRemoveProperty, 
  onBackToList, 
  isLoading = false 
}: WishlistDetailProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'analytics'>('properties');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<WishlistProperty | null>(null);

  if (!wishlist) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Wishlist not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The wishlist you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <Button
            onClick={onBackToList}
            variant="outline"
          >
            Back to Wishlists
          </Button>
        </div>
      </div>
    );
  }

  const handleAddProperty = async (propertyId: string, notes?: string, tags?: string[]) => {
    try {
      await onAddProperty(propertyId, notes, tags);
      setShowAddPropertyModal(false);
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const handleCreateAlert = async (alertData: any) => {
    try {
      // This would be handled by the price alerts system
      console.log('Creating price alert:', alertData);
      setShowCreateAlertModal(false);
    } catch (error) {
      console.error('Failed to create price alert:', error);
    }
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
    <div className="space-y-6">
      {/* Header */}
      <WishlistHeader
        wishlist={wishlist}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onBackToList={onBackToList}
        isLoading={isLoading}
      />

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{wishlist.properties.length}</div>
            <div className="text-sm text-gray-500">Properties</div>
          </div>
          
          {wishlist.properties.length > 0 && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    wishlist.properties.reduce((sum, prop) => sum + prop.property.price, 0) / wishlist.properties.length
                  )}
                </div>
                <div className="text-sm text-gray-500">Average Price</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    Math.min(...wishlist.properties.map(p => p.property.price))
                  )}
                </div>
                <div className="text-sm text-gray-500">Lowest Price</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    Math.max(...wishlist.properties.map(p => p.property.price))
                  )}
                </div>
                <div className="text-sm text-gray-500">Highest Price</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowAddPropertyModal(true)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Property
          </Button>
          
          <Button
            onClick={() => setShowCreateAlertModal(true)}
            variant="outline"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a10 10 0 1 1 20 0v5z" />
            </svg>
            Create Price Alert
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'properties'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'properties' && (
          <WishlistProperties
            properties={wishlist.properties}
            onRemoveProperty={onRemoveProperty}
            onCreateAlert={(property) => {
              setSelectedProperty(property);
              setShowCreateAlertModal(true);
            }}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'analytics' && (
          <WishlistAnalytics
            wishlistId={wishlist.id}
            properties={wishlist.properties}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modals */}
      {showAddPropertyModal && (
        <AddPropertyModal
          isOpen={showAddPropertyModal}
          onClose={() => setShowAddPropertyModal(false)}
          onAddProperty={handleAddProperty}
          existingPropertyIds={wishlist.properties.map(p => p.propertyId)}
        />
      )}

      {showCreateAlertModal && (
        <CreatePriceAlertModal
          isOpen={showCreateAlertModal}
          onClose={() => setShowCreateAlertModal(false)}
          onCreateAlert={handleCreateAlert}
          property={selectedProperty}
        />
      )}
    </div>
  );
}
