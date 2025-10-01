export interface FavoriteProperty {
  id: string;
  userId: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    propertyType: string;
  };
  addedAt: Date;
  notes?: string;
  tags: string[];
  isPublic: boolean;
}

export interface FavoriteList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  propertyCount: number;
  properties: FavoriteProperty[];
}

export interface CreateFavoriteRequest {
  propertyId: string;
  notes?: string;
  tags: string[];
  isPublic: boolean;
  listId?: string;
}

export interface UpdateFavoriteRequest {
  id: string;
  notes?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface CreateFavoriteListRequest {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateFavoriteListRequest {
  id: string;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface FavoriteStats {
  totalFavorites: number;
  favoritesByList: { [listId: string]: number };
  mostFavoritedProperties: { propertyId: string; count: number }[];
  recentFavorites: FavoriteProperty[];
}

export interface FavoriteFilter {
  listId?: string;
  tags?: string[];
  isPublic?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface FavoriteSearchResult {
  favorites: FavoriteProperty[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}