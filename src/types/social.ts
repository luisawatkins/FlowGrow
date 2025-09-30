// Property Sharing and Social Features Types
export interface PropertyShare {
  id: string;
  propertyId: string;
  sharedBy: string; // User ID
  sharedWith: string[]; // User IDs or email addresses
  shareType: ShareType;
  shareMethod: ShareMethod;
  message?: string;
  expiresAt?: Date;
  isPublic: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: ShareMetadata;
}

export interface ShareMetadata {
  viewCount: number;
  clickCount: number;
  shareCount: number;
  reactionCount: number;
  commentCount: number;
  lastViewedAt?: Date;
  lastClickedAt?: Date;
  lastSharedAt?: Date;
  lastReactedAt?: Date;
  lastCommentedAt?: Date;
}

export interface PropertyReaction {
  id: string;
  propertyId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyComment {
  id: string;
  propertyId: string;
  userId: string;
  parentId?: string; // For replies
  content: string;
  isPublic: boolean;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  reactions: CommentReaction[];
  replies: PropertyComment[];
  metadata: CommentMetadata;
}

export interface CommentReaction {
  id: string;
  commentId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: Date;
}

export interface CommentMetadata {
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  isPinned: boolean;
  isReported: boolean;
  reportReason?: string;
  moderationStatus: ModerationStatus;
}

export interface PropertyFollow {
  id: string;
  propertyId: string;
  userId: string;
  followType: FollowType;
  notifications: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  priceChanges: boolean;
  statusChanges: boolean;
  newComments: boolean;
  newReactions: boolean;
  newShares: boolean;
  marketUpdates: boolean;
  weeklyDigest: boolean;
}

export interface SocialActivity {
  id: string;
  propertyId: string;
  userId: string;
  activityType: SocialActivityType;
  targetUserId?: string; // For user-to-user activities
  content?: string;
  metadata: ActivityMetadata;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityMetadata {
  shareId?: string;
  commentId?: string;
  reactionId?: string;
  followId?: string;
  viewDuration?: number; // in seconds
  deviceType?: string;
  location?: string;
  referrer?: string;
}

export interface SocialProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks: SocialLinks;
  preferences: SocialPreferences;
  stats: SocialStats;
  isVerified: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface SocialPreferences {
  showActivity: boolean;
  showFavorites: boolean;
  showWishlists: boolean;
  allowDirectMessages: boolean;
  allowPropertyShares: boolean;
  allowComments: boolean;
  allowReactions: boolean;
  privacyLevel: PrivacyLevel;
}

export interface SocialStats {
  propertiesShared: number;
  propertiesFavorited: number;
  commentsPosted: number;
  reactionsGiven: number;
  followersCount: number;
  followingCount: number;
  totalViews: number;
  totalShares: number;
}

export interface PropertySocialData {
  propertyId: string;
  shares: PropertyShare[];
  reactions: PropertyReaction[];
  comments: PropertyComment[];
  follows: PropertyFollow[];
  activities: SocialActivity[];
  stats: PropertySocialStats;
  trending: TrendingData;
}

export interface PropertySocialStats {
  totalShares: number;
  totalReactions: number;
  totalComments: number;
  totalFollows: number;
  totalViews: number;
  engagementRate: number;
  shareRate: number;
  reactionRate: number;
  commentRate: number;
  topReactions: { [key: string]: number };
  topCommenters: { userId: string; count: number }[];
  topSharers: { userId: string; count: number }[];
  activityTrend: ActivityTrendData[];
}

export interface TrendingData {
  isTrending: boolean;
  trendScore: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPeriod: 'hour' | 'day' | 'week' | 'month';
  peakActivity?: Date;
  comparisonData: {
    previousPeriod: number;
    changePercentage: number;
  };
}

export interface ActivityTrendData {
  date: Date;
  shares: number;
  reactions: number;
  comments: number;
  views: number;
  follows: number;
}

// Enums
export enum ShareType {
  DIRECT = 'direct',
  PUBLIC = 'public',
  PRIVATE = 'private',
  TEMPORARY = 'temporary',
  EMBEDDED = 'embedded'
}

export enum ShareMethod {
  EMAIL = 'email',
  SMS = 'sms',
  SOCIAL_MEDIA = 'social_media',
  LINK = 'link',
  QR_CODE = 'qr_code',
  EMBED = 'embed',
  DIRECT_MESSAGE = 'direct_message'
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  WOW = 'wow',
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
  BOOKMARK = 'bookmark',
  SHARE = 'share'
}

export enum FollowType {
  PROPERTY = 'property',
  USER = 'user',
  AGENT = 'agent',
  BROKERAGE = 'brokerage'
}

export enum SocialActivityType {
  SHARED = 'shared',
  REACTED = 'reacted',
  COMMENTED = 'commented',
  FOLLOWED = 'followed',
  UNFOLLOWED = 'unfollowed',
  VIEWED = 'viewed',
  FAVORITED = 'favorited',
  UNFAVORITED = 'unfavorited',
  BOOKMARKED = 'bookmarked',
  UNBOOKMARKED = 'unbookmarked'
}

export enum ModerationStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  DELETED = 'deleted'
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
  CUSTOM = 'custom'
}

// API Request/Response Types
export interface CreateShareRequest {
  propertyId: string;
  shareType: ShareType;
  shareMethod: ShareMethod;
  sharedWith: string[];
  message?: string;
  expiresAt?: Date;
  isPublic?: boolean;
  allowComments?: boolean;
  allowReactions?: boolean;
}

export interface UpdateShareRequest {
  message?: string;
  expiresAt?: Date;
  isPublic?: boolean;
  allowComments?: boolean;
  allowReactions?: boolean;
}

export interface CreateReactionRequest {
  propertyId: string;
  reactionType: ReactionType;
}

export interface CreateCommentRequest {
  propertyId: string;
  content: string;
  parentId?: string;
  isPublic?: boolean;
}

export interface UpdateCommentRequest {
  content: string;
  isPublic?: boolean;
}

export interface CreateFollowRequest {
  propertyId: string;
  followType: FollowType;
  notifications?: Partial<NotificationSettings>;
}

export interface UpdateFollowRequest {
  notifications?: Partial<NotificationSettings>;
}

export interface CreateSocialProfileRequest {
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: Partial<SocialLinks>;
  preferences?: Partial<SocialPreferences>;
}

export interface UpdateSocialProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: Partial<SocialLinks>;
  preferences?: Partial<SocialPreferences>;
}

export interface ShareResponse {
  share: PropertyShare;
  success: boolean;
  message?: string;
}

export interface ReactionResponse {
  reaction: PropertyReaction;
  success: boolean;
  message?: string;
}

export interface CommentResponse {
  comment: PropertyComment;
  success: boolean;
  message?: string;
}

export interface FollowResponse {
  follow: PropertyFollow;
  success: boolean;
  message?: string;
}

export interface SocialProfileResponse {
  profile: SocialProfile;
  success: boolean;
  message?: string;
}

export interface PropertySocialDataResponse {
  data: PropertySocialData;
  success: boolean;
  message?: string;
}

// Hook Types
export interface UsePropertySocialOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  enableReactions?: boolean;
  enableComments?: boolean;
  enableShares?: boolean;
  enableFollows?: boolean;
}

export interface UsePropertySocialReturn {
  socialData: PropertySocialData | null;
  isLoading: boolean;
  error: string | null;
  createShare: (request: CreateShareRequest) => Promise<void>;
  updateShare: (id: string, request: UpdateShareRequest) => Promise<void>;
  deleteShare: (id: string) => Promise<void>;
  createReaction: (request: CreateReactionRequest) => Promise<void>;
  removeReaction: (propertyId: string, reactionType: ReactionType) => Promise<void>;
  createComment: (request: CreateCommentRequest) => Promise<void>;
  updateComment: (id: string, request: UpdateCommentRequest) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  createFollow: (request: CreateFollowRequest) => Promise<void>;
  updateFollow: (id: string, request: UpdateFollowRequest) => Promise<void>;
  deleteFollow: (id: string) => Promise<void>;
  loadSocialData: (propertyId: string) => Promise<void>;
  clearError: () => void;
}

export interface UseSocialProfileOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseSocialProfileReturn {
  profile: SocialProfile | null;
  isLoading: boolean;
  error: string | null;
  createProfile: (request: CreateSocialProfileRequest) => Promise<void>;
  updateProfile: (request: UpdateSocialProfileRequest) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  clearError: () => void;
}

// Search and Filter Types
export interface SocialSearchQuery {
  propertyId?: string;
  userId?: string;
  activityType?: SocialActivityType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  keywords?: string;
  isPublic?: boolean;
  moderationStatus?: ModerationStatus[];
}

export interface SocialSearchResponse {
  activities: SocialActivity[];
  total: number;
  page: number;
  limit: number;
  facets: {
    activityTypes: { [key: string]: number };
    users: { [key: string]: number };
    dateRanges: { [key: string]: number };
  };
}

// Analytics Types
export interface SocialAnalytics {
  propertyId: string;
  period: 'day' | 'week' | 'month' | 'year';
  totalShares: number;
  totalReactions: number;
  totalComments: number;
  totalViews: number;
  totalFollows: number;
  engagementRate: number;
  shareRate: number;
  reactionRate: number;
  commentRate: number;
  topReactions: { [key: string]: number };
  topCommenters: { userId: string; count: number; name: string }[];
  topSharers: { userId: string; count: number; name: string }[];
  activityTrend: ActivityTrendData[];
  demographicData: {
    ageGroups: { [key: string]: number };
    locations: { [key: string]: number };
    devices: { [key: string]: number };
  };
  insights: string[];
}

// Export/Import Types
export interface SocialExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeComments?: boolean;
  includeReactions?: boolean;
  includeShares?: boolean;
  includeActivities?: boolean;
}

// Error Types
export interface SocialError {
  code: string;
  message: string;
  details?: any;
}

// Real-time Types
export interface SocialEvent {
  type: 'share' | 'reaction' | 'comment' | 'follow' | 'activity';
  propertyId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'share' | 'reaction' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
}
