import React, { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';

interface FavoriteButtonProps {
  propertyId: string;
  userId: string;
  className?: string;
  showText?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  userId,
  className = '',
  showText = true,
  onToggle
}) => {
  const { isPropertyFavorited, addToFavorites, removeFromFavorites, loading } = useFavorites(userId);
  const [isFavorited, setIsFavorited] = useState(isPropertyFavorited(propertyId));

  const handleToggle = async () => {
    try {
      if (isFavorited) {
        // Find the favorite ID to remove
        const favorites = await FavoritesService.getUserFavorites(userId);
        const favorite = favorites.find(fav => fav.propertyId === propertyId);
        if (favorite) {
          await removeFromFavorites(favorite.id);
          setIsFavorited(false);
          onToggle?.(false);
        }
      } else {
        await addToFavorites({
          propertyId,
          notes: '',
          tags: [],
          isPublic: true
        });
        setIsFavorited(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
        isFavorited
          ? 'text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-500'
          : 'text-gray-600 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500'
      } ${className}`}
    >
      <svg
        className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-current' : ''}`}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showText && (isFavorited ? 'Remove from Favorites' : 'Add to Favorites')}
    </button>
  );
};