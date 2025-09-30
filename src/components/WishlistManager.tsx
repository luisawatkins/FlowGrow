'use client';

import React, { useState } from 'react';
import { Wishlist, CreateWishlistRequest } from '@/types/wishlist';
import { useWishlist } from '@/hooks/useWishlist';
import { WishlistList } from './Wishlist/WishlistList';
import { WishlistDetail } from './Wishlist/WishlistDetail';
import { CreateWishlistModal } from './Wishlist/CreateWishlistModal';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface WishlistManagerProps {
  userId: string;
  onWishlistChange?: (wishlist: Wishlist | null) => void;
}

export function WishlistManager({ 
  userId, 
  onWishlistChange 
}: WishlistManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
  
  const {
    wishlists,
    currentWishlist,
    isLoading,
    error,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    addProperty,
    removeProperty,
    loadWishlists,
    loadWishlist,
    clearError
  } = useWishlist(userId, {
    autoSync: true,
    enablePriceAlerts: true,
    maxProperties: 50,
    enableSharing: true
  });

  // Load selected wishlist
  React.useEffect(() => {
    if (selectedWishlistId) {
      loadWishlist(selectedWishlistId).catch(console.error);
    }
  }, [selectedWishlistId, loadWishlist]);

  // Notify parent of wishlist changes
  React.useEffect(() => {
    onWishlistChange?.(currentWishlist);
  }, [currentWishlist, onWishlistChange]);

  const handleCreateWishlist = async (data: CreateWishlistRequest) => {
    try {
      const newWishlist = await createWishlist(data);
      setSelectedWishlistId(newWishlist.id);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create wishlist:', error);
    }
  };

  const handleUpdateWishlist = async (updates: Partial<Wishlist>) => {
    if (!currentWishlist) return;
    
    try {
      await updateWishlist(currentWishlist.id, updates);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleDeleteWishlist = async () => {
    if (!currentWishlist) return;
    
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await deleteWishlist(currentWishlist.id);
        setSelectedWishlistId(null);
      } catch (error) {
        console.error('Failed to delete wishlist:', error);
      }
    }
  };

  const handleAddProperty = async (propertyId: string, notes?: string, tags?: string[]) => {
    if (!currentWishlist) return;
    
    try {
      await addProperty(currentWishlist.id, {
        propertyId,
        notes,
        tags
      });
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const handleRemoveProperty = async (propertyId: string) => {
    if (!currentWishlist) return;
    
    try {
      await removeProperty(currentWishlist.id, propertyId);
    } catch (error) {
      console.error('Failed to remove property:', error);
    }
  };

  const handleSelectWishlist = (wishlistId: string) => {
    setSelectedWishlistId(wishlistId);
  };

  const handleBackToList = () => {
    setSelectedWishlistId(null);
  };

  if (isLoading && !wishlists.length) {
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
              Error loading wishlists
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

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {!selectedWishlistId ? (
          // Wishlist List View
          <WishlistList
            wishlists={wishlists}
            onSelectWishlist={handleSelectWishlist}
            onCreateWishlist={() => setShowCreateModal(true)}
            isLoading={isLoading}
          />
        ) : (
          // Wishlist Detail View
          <WishlistDetail
            wishlist={currentWishlist}
            onUpdate={handleUpdateWishlist}
            onDelete={handleDeleteWishlist}
            onAddProperty={handleAddProperty}
            onRemoveProperty={handleRemoveProperty}
            onBackToList={handleBackToList}
            isLoading={isLoading}
          />
        )}

        {/* Create Wishlist Modal */}
        {showCreateModal && (
          <CreateWishlistModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateWishlist}
            existingWishlists={wishlists}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
