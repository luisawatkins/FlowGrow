// Property History and Timeline Types
export interface PropertyHistory {
  id: string;
  propertyId: string;
  events: HistoryEvent[];
  createdAt: Date;
  updatedAt: Date;
  totalEvents: number;
  lastEventDate: Date;
}

export interface HistoryEvent {
  id: string;
  propertyId: string;
  type: HistoryEventType;
  title: string;
  description: string;
  timestamp: Date;
  data: HistoryEventData;
  source: EventSource;
  metadata: EventMetadata;
  isPublic: boolean;
  tags: string[];
}

export interface HistoryEventData {
  // Price-related events
  price?: {
    oldPrice: number;
    newPrice: number;
    changePercentage: number;
    changeAmount: number;
    currency: string;
  };
  
  // Status-related events
  status?: {
    oldStatus: PropertyStatus;
    newStatus: PropertyStatus;
    reason?: string;
  };
  
  // Listing-related events
  listing?: {
    action: 'listed' | 'delisted' | 'relisted';
    listingDate?: Date;
    delistingDate?: Date;
    daysOnMarket?: number;
  };
  
  // Ownership-related events
  ownership?: {
    action: 'sold' | 'rented' | 'transferred';
    buyerId?: string;
    sellerId?: string;
    transactionAmount?: number;
    transactionDate?: Date;
  };
  
  // Market-related events
  market?: {
    marketTrend: 'up' | 'down' | 'stable';
    averagePriceChange: number;
    comparableProperties: number;
    marketActivity: 'high' | 'medium' | 'low';
  };
  
  // Property-related events
  property?: {
    action: 'renovated' | 'maintained' | 'inspected' | 'appraised';
    details: string;
    cost?: number;
    contractor?: string;
    completionDate?: Date;
  };
  
  // Viewing-related events
  viewing?: {
    viewerId: string;
    viewerType: 'buyer' | 'agent' | 'inspector' | 'appraiser';
    duration: number; // in minutes
    feedback?: string;
    rating?: number;
  };
  
  // Media-related events
  media?: {
    action: 'photo_added' | 'photo_removed' | 'video_added' | 'virtual_tour_created';
    mediaCount: number;
    mediaType: 'photo' | 'video' | 'virtual_tour';
    mediaUrl?: string;
  };
  
  // Custom events
  custom?: {
    category: string;
    details: any;
  };
}

export interface EventSource {
  type: 'system' | 'user' | 'agent' | 'mls' | 'api' | 'import';
  id: string;
  name: string;
  verified: boolean;
}

export interface EventMetadata {
  confidence: number; // 0-100
  verified: boolean;
  sourceUrl?: string;
  externalId?: string;
  importDate?: Date;
  lastVerified?: Date;
}

export interface PropertyTimeline {
  propertyId: string;
  events: TimelineEvent[];
  summary: TimelineSummary;
  filters: TimelineFilters;
  pagination: TimelinePagination;
}

export interface TimelineEvent extends HistoryEvent {
  displayOrder: number;
  isVisible: boolean;
  category: EventCategory;
  importance: EventImportance;
  relatedEvents?: string[]; // IDs of related events
}

export interface TimelineSummary {
  totalEvents: number;
  visibleEvents: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  eventTypes: {
    [key: string]: number;
  };
  keyMilestones: TimelineEvent[];
  recentActivity: TimelineEvent[];
}

export interface TimelineFilters {
  eventTypes: HistoryEventType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sources: EventSource['type'][];
  importance: EventImportance[];
  tags: string[];
  isPublic?: boolean;
}

export interface TimelinePagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Enums
export enum HistoryEventType {
  // Price events
  PRICE_CHANGE = 'price_change',
  PRICE_INCREASE = 'price_increase',
  PRICE_DECREASE = 'price_decrease',
  PRICE_TARGET_REACHED = 'price_target_reached',
  
  // Status events
  STATUS_CHANGE = 'status_change',
  LISTED = 'listed',
  DELISTED = 'delisted',
  RELISTED = 'relisted',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
  WITHDRAWN = 'withdrawn',
  
  // Market events
  MARKET_UPDATE = 'market_update',
  COMPARABLE_SOLD = 'comparable_sold',
  MARKET_TREND_CHANGE = 'market_trend_change',
  
  // Property events
  RENOVATION = 'renovation',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  APPRAISAL = 'appraisal',
  PHOTO_UPDATE = 'photo_update',
  DESCRIPTION_UPDATE = 'description_update',
  
  // Viewing events
  VIEWING_SCHEDULED = 'viewing_scheduled',
  VIEWING_COMPLETED = 'viewing_completed',
  OPEN_HOUSE = 'open_house',
  
  // Media events
  PHOTO_ADDED = 'photo_added',
  PHOTO_REMOVED = 'photo_removed',
  VIDEO_ADDED = 'video_added',
  VIRTUAL_TOUR_CREATED = 'virtual_tour_created',
  
  // Custom events
  CUSTOM_EVENT = 'custom_event',
  NOTE_ADDED = 'note_added',
  COMMENT_ADDED = 'comment_added',
  SHARED = 'shared',
  FAVORITED = 'favorited'
}

export enum PropertyStatus {
  FOR_SALE = 'for_sale',
  FOR_RENT = 'for_rent',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending',
  WITHDRAWN = 'withdrawn',
  OFF_MARKET = 'off_market',
  COMING_SOON = 'coming_soon'
}

export enum EventCategory {
  PRICE = 'price',
  STATUS = 'status',
  MARKET = 'market',
  PROPERTY = 'property',
  VIEWING = 'viewing',
  MEDIA = 'media',
  SOCIAL = 'social',
  CUSTOM = 'custom'
}

export enum EventImportance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// API Types
export interface CreateHistoryEventRequest {
  propertyId: string;
  type: HistoryEventType;
  title: string;
  description: string;
  data: HistoryEventData;
  source: EventSource;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateHistoryEventRequest {
  title?: string;
  description?: string;
  data?: Partial<HistoryEventData>;
  isPublic?: boolean;
  tags?: string[];
}

export interface GetTimelineRequest {
  propertyId: string;
  filters?: Partial<TimelineFilters>;
  page?: number;
  limit?: number;
}

export interface HistoryEventListResponse {
  events: HistoryEvent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TimelineResponse {
  timeline: PropertyTimeline;
  success: boolean;
  message?: string;
}

export interface HistoryEventResponse {
  event: HistoryEvent;
  success: boolean;
  message?: string;
}

// Error Types
export interface HistoryError {
  code: string;
  message: string;
  details?: any;
}

// Hook Types
export interface UsePropertyHistoryOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  enableFilters?: boolean;
  enablePagination?: boolean;
}

export interface UsePropertyHistoryReturn {
  history: PropertyHistory | null;
  timeline: PropertyTimeline | null;
  isLoading: boolean;
  error: HistoryError | null;
  createEvent: (data: CreateHistoryEventRequest) => Promise<void>;
  updateEvent: (id: string, updates: UpdateHistoryEventRequest) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loadHistory: (propertyId: string) => Promise<void>;
  loadTimeline: (request: GetTimelineRequest) => Promise<void>;
  applyFilters: (filters: Partial<TimelineFilters>) => Promise<void>;
  clearError: () => void;
}

// Analytics Types
export interface HistoryAnalytics {
  propertyId: string;
  totalEvents: number;
  eventTypeDistribution: {
    [key: string]: number;
  };
  activityTrend: {
    date: Date;
    eventCount: number;
  }[];
  keyMetrics: {
    daysOnMarket: number;
    priceChanges: number;
    viewings: number;
    statusChanges: number;
  };
  marketComparison: {
    averageDaysOnMarket: number;
    averagePriceChanges: number;
    marketActivity: 'high' | 'medium' | 'low';
  };
  timelineInsights: string[];
}

// Export/Import Types
export interface TimelineExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  eventTypes?: HistoryEventType[];
  includeMetadata?: boolean;
}

export interface TimelineImportOptions {
  source: 'csv' | 'json' | 'mls';
  mapping: {
    [key: string]: string;
  };
  validation: {
    strict: boolean;
    skipInvalid: boolean;
  };
}

// Search and Filter Types
export interface HistorySearchQuery {
  propertyId?: string;
  eventTypes?: HistoryEventType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sources?: EventSource['type'][];
  tags?: string[];
  keywords?: string;
  importance?: EventImportance[];
}

export interface HistorySearchResponse {
  events: HistoryEvent[];
  total: number;
  page: number;
  limit: number;
  facets: {
    eventTypes: { [key: string]: number };
    sources: { [key: string]: number };
    dateRanges: { [key: string]: number };
  };
}
