// Virtual Tour Types
// Comprehensive type definitions for virtual property tours

export interface VirtualTour {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  type: TourType;
  status: TourStatus;
  thumbnailUrl?: string;
  duration: number; // in seconds
  scenes: TourScene[];
  hotspots: TourHotspot[];
  settings: TourSettings;
  metadata: TourMetadata;
  isPublic: boolean;
  isEmbeddable: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TourScene {
  id: string;
  tourId: string;
  name: string;
  description?: string;
  type: SceneType;
  media: SceneMedia;
  position: ScenePosition;
  settings: SceneSettings;
  hotspots: string[]; // Hotspot IDs
  transitions: SceneTransition[];
  createdAt: string;
}

export interface SceneMedia {
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  duration?: number; // for videos
  format: string;
  size: number; // in bytes
  quality: MediaQuality;
  isSpherical: boolean; // for 360° content
  metadata?: MediaMetadata;
}

export interface ScenePosition {
  x: number;
  y: number;
  z: number;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
}

export interface SceneSettings {
  autoRotate: boolean;
  rotationSpeed: number;
  initialFov: number;
  minFov: number;
  maxFov: number;
  enableZoom: boolean;
  enablePan: boolean;
  enableFullscreen: boolean;
  showControls: boolean;
  showCompass: boolean;
  showLoadingSpinner: boolean;
  backgroundColor: string;
  loadingImage?: string;
}

export interface SceneTransition {
  id: string;
  fromSceneId: string;
  toSceneId: string;
  type: TransitionType;
  duration: number; // in milliseconds
  easing: EasingType;
  trigger: TransitionTrigger;
  hotspotId?: string;
  settings: TransitionSettings;
}

export interface TourHotspot {
  id: string;
  tourId: string;
  sceneId: string;
  type: HotspotType;
  position: HotspotPosition;
  content: HotspotContent;
  settings: HotspotSettings;
  isVisible: boolean;
  isInteractive: boolean;
  createdAt: string;
}

export interface HotspotPosition {
  yaw: number; // horizontal rotation in degrees
  pitch: number; // vertical rotation in degrees
  distance: number; // distance from center
}

export interface HotspotContent {
  title: string;
  description?: string;
  media?: {
    type: MediaType;
    url: string;
    thumbnailUrl?: string;
  };
  text?: string;
  link?: {
    url: string;
    target: '_blank' | '_self';
  };
  action?: HotspotAction;
}

export interface HotspotSettings {
  size: number;
  color: string;
  opacity: number;
  pulse: boolean;
  pulseColor: string;
  showOnHover: boolean;
  tooltip: boolean;
  tooltipPosition: TooltipPosition;
  animation: HotspotAnimation;
}

export interface TourSettings {
  autoplay: boolean;
  autoplayDelay: number; // in seconds
  loop: boolean;
  showProgress: boolean;
  showSceneList: boolean;
  showFullscreenButton: boolean;
  showShareButton: boolean;
  showInfoButton: boolean;
  keyboardNavigation: boolean;
  mouseNavigation: boolean;
  touchNavigation: boolean;
  vrMode: boolean;
  quality: TourQuality;
  loadingStrategy: LoadingStrategy;
  errorHandling: ErrorHandling;
}

export interface TourMetadata {
  author: string;
  tags: string[];
  category: string;
  language: string;
  version: string;
  createdWith: string;
  lastModified: string;
  fileSize: number;
  compressionRatio: number;
  technicalSpecs: TechnicalSpecs;
}

export interface TechnicalSpecs {
  resolution: string;
  frameRate?: number;
  bitrate?: number;
  codec?: string;
  format: string;
  compression: string;
  colorSpace: string;
  hdr: boolean;
  stereo: boolean;
}

export interface TourTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl: string;
  scenes: Partial<TourScene>[];
  settings: Partial<TourSettings>;
  isPremium: boolean;
  price?: number;
  downloads: number;
  rating: number;
  createdAt: string;
}

export interface TourAnalytics {
  id: string;
  tourId: string;
  views: number;
  uniqueViews: number;
  averageViewTime: number;
  completionRate: number;
  hotspots: HotspotAnalytics[];
  scenes: SceneAnalytics[];
  devices: DeviceAnalytics[];
  locations: LocationAnalytics[];
  timeRange: {
    start: string;
    end: string;
  };
  createdAt: string;
}

export interface HotspotAnalytics {
  hotspotId: string;
  clicks: number;
  hoverTime: number;
  conversionRate: number;
}

export interface SceneAnalytics {
  sceneId: string;
  views: number;
  averageViewTime: number;
  transitions: number;
}

export interface DeviceAnalytics {
  device: string;
  views: number;
  percentage: number;
}

export interface LocationAnalytics {
  country: string;
  views: number;
  percentage: number;
}

export interface TourComment {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  sceneId?: string;
  timestamp: number; // in seconds from tour start
  position?: HotspotPosition;
  isPublic: boolean;
  isModerated: boolean;
  likes: number;
  replies: TourComment[];
  createdAt: string;
}

export interface TourShare {
  id: string;
  tourId: string;
  platform: SharePlatform;
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  isActive: boolean;
  shareCount: number;
  createdAt: string;
}

// Enums
export enum TourType {
  PHOTO_360 = 'photo_360',
  VIDEO_360 = 'video_360',
  MATTERPORT = 'matterport',
  CUSTOM = 'custom',
  MIXED = 'mixed'
}

export enum TourStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  READY = 'ready',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  ERROR = 'error'
}

export enum SceneType {
  PANORAMA = 'panorama',
  VIDEO = 'video',
  IMAGE = 'image',
  MODEL = 'model',
  CUSTOM = 'custom'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  MODEL = 'model',
  TEXT = 'text'
}

export enum MediaQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra'
}

export enum TransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  ZOOM = 'zoom',
  CUBE = 'cube',
  FLIP = 'flip',
  NONE = 'none'
}

export enum EasingType {
  LINEAR = 'linear',
  EASE_IN = 'ease_in',
  EASE_OUT = 'ease_out',
  EASE_IN_OUT = 'ease_in_out',
  BOUNCE = 'bounce',
  ELASTIC = 'elastic'
}

export enum TransitionTrigger {
  CLICK = 'click',
  HOVER = 'hover',
  AUTO = 'auto',
  TIMER = 'timer',
  PROXIMITY = 'proximity'
}

export enum HotspotType {
  INFO = 'info',
  LINK = 'link',
  MEDIA = 'media',
  TEXT = 'text',
  ACTION = 'action',
  CUSTOM = 'custom'
}

export enum HotspotAction {
  NEXT_SCENE = 'next_scene',
  PREV_SCENE = 'prev_scene',
  GO_TO_SCENE = 'go_to_scene',
  OPEN_URL = 'open_url',
  SHOW_INFO = 'show_info',
  PLAY_MEDIA = 'play_media',
  CUSTOM = 'custom'
}

export enum TooltipPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export enum HotspotAnimation {
  NONE = 'none',
  PULSE = 'pulse',
  BOUNCE = 'bounce',
  ROTATE = 'rotate',
  FADE = 'fade',
  SCALE = 'scale'
}

export enum TourQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA = 'ultra',
  AUTO = 'auto'
}

export enum LoadingStrategy {
  EAGER = 'eager',
  LAZY = 'lazy',
  PROGRESSIVE = 'progressive',
  ON_DEMAND = 'on_demand'
}

export enum ErrorHandling {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  SKIP = 'skip',
  ABORT = 'abort'
}

export enum TemplateCategory {
  REAL_ESTATE = 'real_estate',
  ARCHITECTURE = 'architecture',
  INTERIOR = 'interior',
  COMMERCIAL = 'commercial',
  LANDSCAPE = 'landscape',
  EVENT = 'event',
  CUSTOM = 'custom'
}

export enum SharePlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  EMBED = 'embed',
  LINK = 'link',
  QR_CODE = 'qr_code'
}

// API Types
export interface CreateTourRequest {
  propertyId: string;
  title: string;
  description?: string;
  type: TourType;
  isPublic?: boolean;
  isEmbeddable?: boolean;
  templateId?: string;
}

export interface UpdateTourRequest {
  title?: string;
  description?: string;
  status?: TourStatus;
  isPublic?: boolean;
  isEmbeddable?: boolean;
  settings?: Partial<TourSettings>;
}

export interface AddSceneRequest {
  tourId: string;
  name: string;
  description?: string;
  type: SceneType;
  media: {
    type: MediaType;
    url: string;
    isSpherical: boolean;
  };
  position?: Partial<ScenePosition>;
  settings?: Partial<SceneSettings>;
}

export interface AddHotspotRequest {
  tourId: string;
  sceneId: string;
  type: HotspotType;
  position: HotspotPosition;
  content: HotspotContent;
  settings?: Partial<HotspotSettings>;
}

export interface TourSearchRequest {
  query?: string;
  propertyId?: string;
  type?: TourType;
  status?: TourStatus;
  isPublic?: boolean;
  tags?: string[];
  category?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'created' | 'updated' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TourSearchResponse {
  tours: VirtualTour[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Hook Types
export interface UseVirtualTourReturn {
  tour: VirtualTour | null;
  loading: boolean;
  error: string | null;
  createTour: (request: CreateTourRequest) => Promise<VirtualTour>;
  updateTour: (id: string, request: UpdateTourRequest) => Promise<VirtualTour>;
  deleteTour: (id: string) => Promise<void>;
  publishTour: (id: string) => Promise<VirtualTour>;
  clearError: () => void;
}

export interface UseTourScenesReturn {
  scenes: TourScene[];
  loading: boolean;
  error: string | null;
  addScene: (request: AddSceneRequest) => Promise<TourScene>;
  updateScene: (id: string, updates: Partial<TourScene>) => Promise<TourScene>;
  deleteScene: (id: string) => Promise<void>;
  reorderScenes: (sceneIds: string[]) => Promise<void>;
  clearError: () => void;
}

export interface UseTourHotspotsReturn {
  hotspots: TourHotspot[];
  loading: boolean;
  error: string | null;
  addHotspot: (request: AddHotspotRequest) => Promise<TourHotspot>;
  updateHotspot: (id: string, updates: Partial<TourHotspot>) => Promise<TourHotspot>;
  deleteHotspot: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface UseTourAnalyticsReturn {
  analytics: TourAnalytics | null;
  loading: boolean;
  error: string | null;
  getAnalytics: (tourId: string, timeRange?: { start: string; end: string }) => Promise<void>;
  clearError: () => void;
}

// Error Types
export interface VirtualTourError {
  code: string;
  message: string;
  details?: any;
}

export interface VirtualTourApiError extends VirtualTourError {
  status: number;
  timestamp: string;
}
