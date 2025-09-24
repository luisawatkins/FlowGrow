'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Share2,
  Eye,
  Star
} from 'lucide-react';

interface MobilePropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    rating?: number;
    isFavorite?: boolean;
    isOffline?: boolean;
  };
  onFavorite?: (propertyId: string) => void;
  onShare?: (propertyId: string) => void;
  onView?: (propertyId: string) => void;
  className?: string;
}

const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  property,
  onFavorite,
  onShare,
  onView,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(property.isFavorite || false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(property.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(property.id);
  };

  const handleView = () => {
    onView?.(property.id);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
        transition-all duration-200 hover:shadow-md active:scale-98
        ${className}
      `}
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageError && property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">🏠</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
        
        {/* Offline Indicator */}
        {property.isOffline && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Offline
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleFavorite}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200 backdrop-blur-sm
              ${isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
              }
            `}
          >
            <Heart 
              size={16} 
              className={isFavorited ? 'fill-current' : ''}
            />
          </button>
          
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/80 text-gray-600 hover:bg-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <Share2 size={16} />
          </button>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1 pr-2">
            {property.title}
          </h3>
          {property.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star size={12} className="text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-yellow-700">
                {property.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600 truncate">
            {property.location}
          </span>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square size={14} />
              <span>{property.area} sq ft</span>
            </div>
          )}
        </div>
        
        {/* View Button */}
        <button
          onClick={handleView}
          className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800"
        >
          <div className="flex items-center justify-center gap-2">
            <Eye size={16} />
            View Details
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobilePropertyCard;
