// Enhanced favorites types for property favorites management
export interface FavoriteProperty {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  addedAt: string;
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'archived' | 'removed';
  lastViewedAt?: string;
  viewCount?: number;
  priceAlerts?: PriceAlert[];
  customFields?: Record<string, any>;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  location: string;
  description?: string;
  amenities?: string[];
  yearBuilt?: number;
  lotSize?: number;
  parkingSpaces?: number;
  petFriendly?: boolean;
  furnished?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasGarage?: boolean;
  hasFireplace?: boolean;
  hasSecurity?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images?: string[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo?: string;
  };
  listingDate?: string;
  lastPriceChange?: string;
  priceHistory?: PriceHistoryEntry[];
}

export interface PriceAlert {
  id: string;
  propertyId: string;
  userId: string;
  type: 'price_drop' | 'price_increase' | 'target_price' | 'any_change';
  targetPrice?: number;
  threshold?: number;
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  notificationMethods: ('email' | 'push' | 'sms')[];
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours?: {
    start: string;
    end: string;
  };
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  change: number;
  changePercent: number;
  source: string;
}

export interface FavoritesList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  propertyIds: string[];
  tags?: string[];
  color?: string;
  icon?: string;
}

export interface FavoritesAnalytics {
  totalFavorites: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: Record<string, number>;
  locations: Record<string, number>;
  averageDaysInFavorites: number;
  mostViewedProperty: string;
  recentlyAdded: FavoriteProperty[];
  priceChanges: {
    increased: number;
    decreased: number;
    unchanged: number;
  };
  tags: Record<string, number>;
  monthlyTrends: {
    month: string;
    added: number;
    removed: number;
  }[];
}

export interface FavoritesFilter {
  searchTerm?: string;
  propertyType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  tags?: string[];
  priority?: string;
  status?: string;
  addedDateRange?: {
    start: string;
    end: string;
  };
  hasNotes?: boolean;
  hasPriceAlerts?: boolean;
  sortBy?: 'added_date' | 'price' | 'property_type' | 'location' | 'last_viewed' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface FavoritesExport {
  format: 'json' | 'csv' | 'pdf';
  data: FavoriteProperty[];
  metadata: {
    exportedAt: string;
    totalCount: number;
    userId: string;
  };
}

export interface FavoritesImport {
  format: 'json' | 'csv';
  data: any[];
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    importedCount: number;
    skippedCount: number;
  };
}

// API types
export interface FavoritesRequest {
  propertyId: string;
  notes?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  customFields?: Record<string, any>;
}

export interface FavoritesResponse {
  favorites: FavoriteProperty[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface FavoritesError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Hook types
export interface UseFavoritesReturn {
  favorites: FavoriteProperty[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  filters: FavoritesFilter;
  analytics: FavoritesAnalytics | null;
  
  // Actions
  addFavorite: (propertyId: string, notes?: string, tags?: string[], priority?: string) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
  updateFavorite: (favoriteId: string, updates: Partial<FavoriteProperty>) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<boolean>;
  isFavorited: (propertyId: string) => boolean;
  getFavorite: (propertyId: string) => FavoriteProperty | null;
  
  // Filtering and sorting
  setFilters: (filters: FavoritesFilter) => void;
  clearFilters: () => void;
  searchFavorites: (searchTerm: string) => void;
  sortFavorites: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  
  // Lists management
  createList: (name: string, description?: string, isPublic?: boolean) => Promise<string>;
  addToList: (listId: string, propertyId: string) => Promise<void>;
  removeFromList: (listId: string, propertyId: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  
  // Analytics
  getAnalytics: () => Promise<FavoritesAnalytics>;
  exportFavorites: (format: 'json' | 'csv' | 'pdf') => Promise<FavoritesExport>;
  importFavorites: (data: FavoritesImport) => Promise<void>;
  
  // Price alerts
  createPriceAlert: (propertyId: string, alert: Omit<PriceAlert, 'id' | 'propertyId' | 'userId'>) => Promise<void>;
  updatePriceAlert: (alertId: string, updates: Partial<PriceAlert>) => Promise<void>;
  deletePriceAlert: (alertId: string) => Promise<void>;
  
  // Bulk operations
  bulkAdd: (propertyIds: string[]) => Promise<void>;
  bulkRemove: (favoriteIds: string[]) => Promise<void>;
  bulkUpdate: (favoriteIds: string[], updates: Partial<FavoriteProperty>) => Promise<void>;
  
  // Refresh
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

// Component props
export interface FavoritesManagerProps {
  userId?: string;
  onViewProperty?: (propertyId: string) => void;
  onEditFavorite?: (favorite: FavoriteProperty) => void;
  onDeleteFavorite?: (favoriteId: string) => void;
  onShareList?: (listId: string) => void;
  className?: string;
  showAnalytics?: boolean;
  showFilters?: boolean;
  showLists?: boolean;
  showExport?: boolean;
  maxItems?: number;
}

export interface FavoritesListProps {
  favorites: FavoriteProperty[];
  isLoading?: boolean;
  onViewProperty?: (propertyId: string) => void;
  onEditFavorite?: (favorite: FavoriteProperty) => void;
  onDeleteFavorite?: (favoriteId: string) => void;
  onToggleFavorite?: (propertyId: string) => void;
  className?: string;
  showNotes?: boolean;
  showTags?: boolean;
  showPriority?: boolean;
  showPriceAlerts?: boolean;
  layout?: 'grid' | 'list';
  maxItems?: number;
}

export interface FavoriteCardProps {
  favorite: FavoriteProperty;
  onViewProperty?: (propertyId: string) => void;
  onEditFavorite?: (favorite: FavoriteProperty) => void;
  onDeleteFavorite?: (favoriteId: string) => void;
  onToggleFavorite?: (propertyId: string) => void;
  className?: string;
  showNotes?: boolean;
  showTags?: boolean;
  showPriority?: boolean;
  showPriceAlerts?: boolean;
  showPriceHistory?: boolean;
  compact?: boolean;
}

export interface FavoritesFiltersProps {
  filters: FavoritesFilter;
  onFiltersChange: (filters: FavoritesFilter) => void;
  onClearFilters: () => void;
  className?: string;
  showAdvanced?: boolean;
}

export interface FavoritesAnalyticsProps {
  analytics: FavoritesAnalytics;
  onFilterClick?: (filter: string, value: any) => void;
  className?: string;
  showCharts?: boolean;
  showTrends?: boolean;
}

export interface FavoritesExportProps {
  onExport: (format: 'json' | 'csv' | 'pdf') => void;
  onImport: (file: File) => void;
  className?: string;
  supportedFormats?: string[];
}

// Utility types
export type FavoriteStatus = 'active' | 'archived' | 'removed';
export type FavoritePriority = 'low' | 'medium' | 'high';
export type FavoritesSortBy = 'added_date' | 'price' | 'property_type' | 'location' | 'last_viewed' | 'priority';
export type FavoritesSortOrder = 'asc' | 'desc';
export type FavoritesLayout = 'grid' | 'list';
export type FavoritesExportFormat = 'json' | 'csv' | 'pdf';
