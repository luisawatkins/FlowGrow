export interface PropertyFavorite {
  id: string;
  propertyId: string;
  userId: string;
  addedAt: string;
  notes?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  properties: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface FavoriteFilter {
  userId?: string;
  propertyId?: string;
  tags?: string[];
  priority?: string;
  isActive?: boolean;
}

export interface WishlistFilter {
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
  name?: string;
}

export interface FavoritesAnalytics {
  totalFavorites: number;
  favoritesByProperty: Array<{ propertyId: string; count: number }>;
  mostFavoritedProperties: Array<{ propertyId: string; count: number }>;
  userEngagement: Array<{ date: string; favorites: number }>;
  popularTags: Array<{ tag: string; count: number }>;
}

export interface WishlistShare {
  id: string;
  wishlistId: string;
  shareToken: string;
  expiresAt: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
}