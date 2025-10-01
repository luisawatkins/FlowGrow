import React from 'react';
import { FavoriteProperty } from '../../types/favorites';

interface FavoritesListProps {
  favorites: FavoriteProperty[];
  onEditFavorite: (favorite: FavoriteProperty) => void;
  onRemoveFavorite: (favoriteId: string) => void;
  loading?: boolean;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onEditFavorite,
  onRemoveFavorite,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start adding properties to your favorites to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {favorite.property.imageUrl && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={favorite.property.imageUrl}
                alt={favorite.property.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {favorite.property.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                favorite.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {favorite.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{favorite.property.address}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-blue-600">
                ${favorite.property.price.toLocaleString()}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                {favorite.property.bedrooms && (
                  <span className="mr-3">{favorite.property.bedrooms} bed</span>
                )}
                {favorite.property.bathrooms && (
                  <span className="mr-3">{favorite.property.bathrooms} bath</span>
                )}
                {favorite.property.squareFeet && (
                  <span>{favorite.property.squareFeet.toLocaleString()} sq ft</span>
                )}
              </div>
            </div>
            
            {favorite.notes && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{favorite.notes}</p>
            )}
            
            {favorite.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {favorite.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Added {favorite.addedAt.toLocaleDateString()}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditFavorite(favorite)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemoveFavorite(favorite.id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};