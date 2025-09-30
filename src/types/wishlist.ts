// Wishlist and Price Alerts Types
export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  properties: WishlistProperty[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  settings: WishlistSettings;
}

export interface WishlistProperty {
  id: string;
  propertyId: string;
  property: Property;
  addedAt: Date;
  notes?: string;
  tags: string[];
  priceAlerts: PriceAlert[];
  isActive: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: PropertyLocation;
  details: PropertyDetails;
  images: string[];
  features: string[];
  amenities: string[];
  specifications: PropertySpecifications;
  financial: PropertyFinancial;
  metadata: PropertyMetadata;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhood: string;
  schoolDistrict?: string;
}

export interface PropertyDetails {
  type: PropertyType;
  status: PropertyStatus;
  yearBuilt?: number;
  lotSize: number;
  livingArea: number;
  bedrooms: number;
  bathrooms: number;
  garageSpaces?: number;
  stories?: number;
  condition: PropertyCondition;
  style?: string;
}

export interface PropertySpecifications {
  heating: string;
  cooling: string;
  flooring: string[];
  roof: string;
  exterior: string;
  foundation: string;
  utilities: string[];
  appliances: string[];
  security: string[];
  accessibility: string[];
}

export interface PropertyFinancial {
  price: number;
  pricePerSqFt: number;
  taxes: number;
  hoaFees?: number;
  insurance: number;
  utilities: number;
  maintenance: number;
  totalMonthlyCost: number;
  appreciation: number;
  rentalIncome?: number;
  capRate?: number;
  roi?: number;
}

export interface PropertyMetadata {
  listingDate: Date;
  lastUpdated: Date;
  views: number;
  favorites: number;
  shares: number;
  agent: {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
  };
  source: string;
  mlsId?: string;
}

export interface PriceAlert {
  id: string;
  propertyId: string;
  userId: string;
  type: PriceAlertType;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  notificationSettings: NotificationSettings;
  conditions: PriceAlertConditions;
}

export interface PriceAlertConditions {
  priceChange: PriceChangeType;
  percentageThreshold?: number;
  absoluteThreshold?: number;
  timeWindow?: number; // in hours
  marketConditions?: MarketCondition[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: NotificationFrequency;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
}

export interface WishlistSettings {
  autoSync: boolean;
  shareWithAgents: boolean;
  allowPublicView: boolean;
  notificationSettings: NotificationSettings;
  priceTracking: {
    enabled: boolean;
    updateFrequency: number; // in hours
    priceChangeThreshold: number; // percentage
  };
}

// Enums
export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  MULTI_FAMILY = 'multi_family',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  MOBILE = 'mobile',
  OTHER = 'other'
}

export enum PropertyStatus {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
  OFF_MARKET = 'off_market'
}

export enum PropertyCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NEEDS_WORK = 'needs_work'
}

export enum PriceAlertType {
  PRICE_DROP = 'price_drop',
  PRICE_INCREASE = 'price_increase',
  PRICE_TARGET = 'price_target',
  MARKET_CHANGE = 'market_change',
  NEW_LISTING = 'new_listing',
  STATUS_CHANGE = 'status_change'
}

export enum PriceChangeType {
  PERCENTAGE = 'percentage',
  ABSOLUTE = 'absolute',
  ANY_CHANGE = 'any_change'
}

export enum MarketCondition {
  HOT_MARKET = 'hot_market',
  COLD_MARKET = 'cold_market',
  STABLE_MARKET = 'stable_market',
  VOLATILE_MARKET = 'volatile_market'
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom'
}

// API Types
export interface CreateWishlistRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  settings?: Partial<WishlistSettings>;
}

export interface UpdateWishlistRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
  settings?: Partial<WishlistSettings>;
}

export interface AddPropertyToWishlistRequest {
  propertyId: string;
  notes?: string;
  tags?: string[];
}

export interface RemovePropertyFromWishlistRequest {
  propertyId: string;
}

export interface CreatePriceAlertRequest {
  propertyId: string;
  type: PriceAlertType;
  targetPrice?: number;
  conditions: PriceAlertConditions;
  notificationSettings: NotificationSettings;
}

export interface UpdatePriceAlertRequest {
  type?: PriceAlertType;
  targetPrice?: number;
  conditions?: Partial<PriceAlertConditions>;
  notificationSettings?: Partial<NotificationSettings>;
  isActive?: boolean;
}

export interface WishlistListResponse {
  wishlists: Wishlist[];
  total: number;
  page: number;
  limit: number;
}

export interface WishlistResponse {
  wishlist: Wishlist;
  success: boolean;
  message?: string;
}

export interface PriceAlertListResponse {
  alerts: PriceAlert[];
  total: number;
  page: number;
  limit: number;
}

export interface PriceAlertResponse {
  alert: PriceAlert;
  success: boolean;
  message?: string;
}

// Error Types
export interface WishlistError {
  code: string;
  message: string;
  details?: any;
}

export interface PriceAlertError {
  code: string;
  message: string;
  details?: any;
}

// Hook Types
export interface UseWishlistOptions {
  autoSync?: boolean;
  enablePriceAlerts?: boolean;
  maxProperties?: number;
  enableSharing?: boolean;
}

export interface UseWishlistReturn {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
  error: WishlistError | null;
  createWishlist: (data: CreateWishlistRequest) => Promise<void>;
  updateWishlist: (id: string, updates: UpdateWishlistRequest) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  addProperty: (wishlistId: string, data: AddPropertyToWishlistRequest) => Promise<void>;
  removeProperty: (wishlistId: string, propertyId: string) => Promise<void>;
  loadWishlists: () => Promise<void>;
  loadWishlist: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface UsePriceAlertsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  enableNotifications?: boolean;
}

export interface UsePriceAlertsReturn {
  alerts: PriceAlert[];
  isLoading: boolean;
  error: PriceAlertError | null;
  createAlert: (data: CreatePriceAlertRequest) => Promise<void>;
  updateAlert: (id: string, updates: UpdatePriceAlertRequest) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  loadAlerts: () => Promise<void>;
  clearError: () => void;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  priority: NotificationPriority;
}

export enum NotificationType {
  PRICE_ALERT = 'price_alert',
  WISHLIST_UPDATE = 'wishlist_update',
  PROPERTY_STATUS_CHANGE = 'property_status_change',
  MARKET_UPDATE = 'market_update',
  SYSTEM_NOTIFICATION = 'system_notification'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface NotificationResponse {
  notification: Notification;
  success: boolean;
  message?: string;
}

// Analytics Types
export interface WishlistAnalytics {
  wishlistId: string;
  totalProperties: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  locationDistribution: {
    [city: string]: number;
  };
  propertyTypeDistribution: {
    [type: string]: number;
  };
  priceChangeHistory: PriceChangeHistory[];
  alertStatistics: AlertStatistics;
}

export interface PriceChangeHistory {
  date: Date;
  propertyId: string;
  oldPrice: number;
  newPrice: number;
  changePercentage: number;
  changeType: 'increase' | 'decrease';
}

export interface AlertStatistics {
  totalAlerts: number;
  activeAlerts: number;
  triggeredAlerts: number;
  alertTypes: {
    [type: string]: number;
  };
  averageResponseTime: number; // in hours
}
