// Community Forums Types
// Type definitions for property community forums functionality

export interface Forum {
  id: string;
  name: string;
  description: string;
  category: ForumCategory;
  type: ForumType;
  visibility: ForumVisibility;
  access: ForumAccess;
  settings: ForumSettings;
  stats: ForumStats;
  moderators: string[];
  members: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumSettings {
  allowAnonymous: boolean;
  requireApproval: boolean;
  allowImages: boolean;
  allowVideos: boolean;
  allowLinks: boolean;
  maxPostLength: number;
  maxImageSize: number;
  maxVideoSize: number;
  moderationLevel: ModerationLevel;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  contentSettings: ContentSettings;
}

export interface ForumStats {
  totalPosts: number;
  totalThreads: number;
  totalMembers: number;
  totalViews: number;
  activeMembers: number;
  lastActivity: string;
  growthRate: number;
  engagementRate: number;
  topContributors: ForumContributor[];
}

export interface ForumContributor {
  userId: string;
  username: string;
  avatar?: string;
  postCount: number;
  reputation: number;
  joinDate: string;
  lastActive: string;
  badges: ForumBadge[];
  isModerator: boolean;
  isAdmin: boolean;
}

export interface ForumBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  category: BadgeCategory;
}

export interface Discussion {
  id: string;
  forumId: string;
  title: string;
  content: string;
  author: ForumUser;
  type: DiscussionType;
  status: DiscussionStatus;
  priority: DiscussionPriority;
  tags: string[];
  attachments: ForumAttachment[];
  reactions: ForumReaction[];
  views: number;
  replies: number;
  lastReply?: ForumReply;
  isPinned: boolean;
  isLocked: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

export interface ForumUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: SocialLink[];
  preferences: UserPreferences;
  stats: UserStats;
  reputation: number;
  badges: ForumBadge[];
  isVerified: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  joinDate: string;
  lastActive: string;
}

export interface ForumReply {
  id: string;
  discussionId: string;
  content: string;
  author: ForumUser;
  parentId?: string;
  status: ReplyStatus;
  reactions: ForumReaction[];
  attachments: ForumAttachment[];
  isSolution: boolean;
  isPinned: boolean;
  isEdited: boolean;
  editHistory: EditHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumReaction {
  id: string;
  type: ReactionType;
  userId: string;
  username: string;
  createdAt: string;
}

export interface ForumAttachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: number;
  url: string;
  thumbnail?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  isPublic: boolean;
  downloadCount: number;
}

export interface EditHistory {
  id: string;
  content: string;
  editedBy: string;
  editedAt: string;
  reason?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  username?: string;
  isVerified: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  display: DisplayPreferences;
  language: string;
  timezone: string;
  theme: Theme;
}

export interface UserStats {
  totalPosts: number;
  totalReplies: number;
  totalViews: number;
  totalReactions: number;
  reputation: number;
  joinDate: string;
  lastActive: string;
  streak: number;
  level: number;
  experience: number;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: NotificationFrequency;
  types: NotificationType[];
  quietHours: QuietHours;
}

export interface PrivacyPreferences {
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showLocation: boolean;
  showJoinDate: boolean;
  showLastActive: boolean;
  allowDirectMessages: boolean;
  allowFriendRequests: boolean;
}

export interface DisplayPreferences {
  postsPerPage: number;
  threadsPerPage: number;
  sortOrder: SortOrder;
  showAvatars: boolean;
  showSignatures: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  days: string[];
}

export interface ForumModeration {
  id: string;
  forumId: string;
  moderatorId: string;
  action: ModerationAction;
  targetType: ModerationTargetType;
  targetId: string;
  reason: string;
  details?: string;
  duration?: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ForumReport {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  evidence: ReportEvidence[];
  status: ReportStatus;
  priority: ReportPriority;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ReportEvidence {
  type: EvidenceType;
  content: string;
  url?: string;
  description?: string;
  timestamp: string;
}

export interface ForumAnalytics {
  forumId: string;
  period: AnalyticsPeriod;
  metrics: ForumMetrics;
  trends: ForumTrends;
  insights: ForumInsights;
  recommendations: ForumRecommendations;
  timestamp: string;
}

export interface ForumMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalPosts: number;
  totalReplies: number;
  totalViews: number;
  engagementRate: number;
  retentionRate: number;
  growthRate: number;
  topContent: TopContent[];
  topUsers: TopUser[];
}

export interface ForumTrends {
  userGrowth: TrendData[];
  postGrowth: TrendData[];
  engagementTrend: TrendData[];
  activityTrend: TrendData[];
  sentimentTrend: TrendData[];
}

export interface ForumInsights {
  peakActivity: string[];
  popularTopics: string[];
  userBehavior: UserBehaviorInsights;
  contentPerformance: ContentPerformanceInsights;
  communityHealth: CommunityHealthInsights;
}

export interface ForumRecommendations {
  content: ContentRecommendation[];
  users: UserRecommendation[];
  moderation: ModerationRecommendation[];
  features: FeatureRecommendation[];
}

export interface TrendData {
  date: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface TopContent {
  id: string;
  title: string;
  type: ContentType;
  views: number;
  replies: number;
  reactions: number;
  score: number;
}

export interface TopUser {
  id: string;
  username: string;
  posts: number;
  replies: number;
  reputation: number;
  activity: number;
}

export interface UserBehaviorInsights {
  averageSessionDuration: number;
  bounceRate: number;
  returnRate: number;
  engagementScore: number;
  preferredContentTypes: string[];
  activeHours: string[];
  deviceUsage: DeviceUsage[];
}

export interface ContentPerformanceInsights {
  averagePostLength: number;
  averageReplyLength: number;
  mostEngagingContent: string[];
  leastEngagingContent: string[];
  contentGaps: string[];
  trendingTopics: string[];
}

export interface CommunityHealthInsights {
  toxicityLevel: number;
  moderationEfficiency: number;
  userSatisfaction: number;
  conflictResolution: number;
  communityGrowth: number;
  engagementQuality: number;
}

export interface ContentRecommendation {
  type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  timeline: string;
}

export interface UserRecommendation {
  userId: string;
  username: string;
  type: UserRecommendationType;
  reason: string;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  timeline: string;
}

export interface ModerationRecommendation {
  type: ModerationRecommendationType;
  description: string;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  timeline: string;
  target?: string;
}

export interface FeatureRecommendation {
  feature: string;
  description: string;
  priority: Priority;
  impact: Impact;
  effort: Effort;
  timeline: string;
  userRequest: number;
}

export interface DeviceUsage {
  device: string;
  percentage: number;
  trend: TrendDirection;
}

export interface ForumSearch {
  query: string;
  filters: ForumSearchFilters;
  results: ForumSearchResult[];
  suggestions: ForumSearchSuggestion[];
  metadata: ForumSearchMetadata;
}

export interface ForumSearchFilters {
  forumId?: string;
  category?: string;
  author?: string;
  dateRange?: DateRange;
  tags?: string[];
  type?: DiscussionType[];
  status?: DiscussionStatus[];
  sortBy?: ForumSortBy;
  sortOrder?: SortOrder;
}

export interface ForumSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  content: string;
  author: string;
  forum: string;
  category: string;
  tags: string[];
  score: number;
  relevance: number;
  highlights: SearchHighlight[];
  metadata: SearchResultMetadata;
}

export interface ForumSearchSuggestion {
  text: string;
  type: SuggestionType;
  confidence: number;
  category: string;
  metadata: SuggestionMetadata;
}

export interface ForumSearchMetadata {
  query: string;
  totalResults: number;
  processingTime: number;
  filters: ForumSearchFilters;
  timestamp: string;
}

export interface SearchHighlight {
  field: string;
  value: string;
  snippet: string;
  score: number;
}

export interface SearchResultMetadata {
  id: string;
  type: SearchResultType;
  score: number;
  relevance: number;
  highlights: SearchHighlight[];
  timestamp: string;
}

export interface SuggestionMetadata {
  originalQuery: string;
  improvements: string[];
  confidence: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ForumApiRequest {
  query?: string;
  filters?: ForumSearchFilters;
  options?: ForumApiOptions;
  userId?: string;
  sessionId?: string;
}

export interface ForumApiOptions {
  maxResults?: number;
  includeMetadata?: boolean;
  includeHighlights?: boolean;
  includeSuggestions?: boolean;
  language?: string;
  region?: string;
  timezone?: string;
  debug?: boolean;
}

export interface ForumApiResponse {
  success: boolean;
  data?: any;
  error?: ForumApiError;
  pagination?: Pagination;
}

export interface ForumApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Enums
export enum ForumType {
  GENERAL = 'general',
  PROPERTY = 'property',
  NEIGHBORHOOD = 'neighborhood',
  INVESTMENT = 'investment',
  RENTAL = 'rental',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  DEVELOPMENT = 'development',
  MARKET = 'market',
  NEWS = 'news',
  EVENTS = 'events',
  SUPPORT = 'support',
  FEEDBACK = 'feedback'
}

export enum ForumVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted',
  HIDDEN = 'hidden'
}

export enum ForumAccess {
  OPEN = 'open',
  INVITE_ONLY = 'invite_only',
  APPROVAL_REQUIRED = 'approval_required',
  MEMBERS_ONLY = 'members_only'
}

export enum ModerationLevel {
  NONE = 'none',
  LIGHT = 'light',
  MODERATE = 'moderate',
  STRICT = 'strict',
  AUTOMATED = 'automated'
}

export enum DiscussionType {
  QUESTION = 'question',
  DISCUSSION = 'discussion',
  ANNOUNCEMENT = 'announcement',
  POLL = 'poll',
  EVENT = 'event',
  NEWS = 'news',
  REVIEW = 'review',
  TIP = 'tip',
  WARNING = 'warning',
  CELEBRATION = 'celebration'
}

export enum DiscussionStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
  HIDDEN = 'hidden',
  DELETED = 'deleted'
}

export enum DiscussionPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum ReplyStatus {
  ACTIVE = 'active',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
  MODERATED = 'moderated'
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
  HEART = 'heart',
  FIRE = 'fire',
  CLAP = 'clap',
  PARTY = 'party'
}

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  SNAPCHAT = 'snapchat',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp'
}

export enum BadgeCategory {
  ACHIEVEMENT = 'achievement',
  CONTRIBUTION = 'contribution',
  MODERATION = 'moderation',
  SPECIAL = 'special',
  EVENT = 'event',
  MILESTONE = 'milestone'
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  MEMBERS = 'members',
  PRIVATE = 'private'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

export enum NotificationFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never'
}

export enum NotificationType {
  MENTION = 'mention',
  REPLY = 'reply',
  REACTION = 'reaction',
  FOLLOW = 'follow',
  MESSAGE = 'message',
  MODERATION = 'moderation',
  SYSTEM = 'system'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum ModerationAction {
  WARN = 'warn',
  MUTE = 'mute',
  BAN = 'ban',
  DELETE = 'delete',
  HIDE = 'hide',
  LOCK = 'lock',
  ARCHIVE = 'archive',
  APPROVE = 'approve',
  REJECT = 'reject'
}

export enum ModerationTargetType {
  USER = 'user',
  POST = 'post',
  REPLY = 'reply',
  FORUM = 'forum',
  DISCUSSION = 'discussion'
}

export enum ReportTargetType {
  USER = 'user',
  POST = 'post',
  REPLY = 'reply',
  FORUM = 'forum',
  DISCUSSION = 'discussion',
  MESSAGE = 'message'
}

export enum ReportReason {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  COPYRIGHT_VIOLATION = 'copyright_violation',
  PRIVACY_VIOLATION = 'privacy_violation',
  MISINFORMATION = 'misinformation',
  OTHER = 'other'
}

export enum ReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
  ESCALATED = 'escalated'
}

export enum ReportPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum EvidenceType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
  SCREENSHOT = 'screenshot',
  OTHER = 'other'
}

export enum AnalyticsPeriod {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum ContentType {
  POST = 'post',
  REPLY = 'reply',
  DISCUSSION = 'discussion',
  FORUM = 'forum',
  USER = 'user'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export enum RecommendationType {
  CONTENT = 'content',
  FEATURE = 'feature',
  MODERATION = 'moderation',
  ENGAGEMENT = 'engagement',
  GROWTH = 'growth'
}

export enum UserRecommendationType {
  MODERATOR = 'moderator',
  CONTRIBUTOR = 'contributor',
  MENTOR = 'mentor',
  EXPERT = 'expert',
  AMBASSADOR = 'ambassador'
}

export enum ModerationRecommendationType {
  ACTION = 'action',
  POLICY = 'policy',
  TOOL = 'tool',
  TRAINING = 'training',
  AUTOMATION = 'automation'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum Impact {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

export enum Effort {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  EXTREME = 'extreme'
}

export enum SearchResultType {
  DISCUSSION = 'discussion',
  REPLY = 'reply',
  USER = 'user',
  FORUM = 'forum',
  ATTACHMENT = 'attachment'
}

export enum SuggestionType {
  QUERY = 'query',
  FILTER = 'filter',
  TAG = 'tag',
  USER = 'user',
  FORUM = 'forum',
  CATEGORY = 'category'
}

export enum ForumSortBy {
  RELEVANCE = 'relevance',
  DATE = 'date',
  POPULARITY = 'popularity',
  ACTIVITY = 'activity',
  REPLIES = 'replies',
  VIEWS = 'views',
  REACTIONS = 'reactions'
}

// Hook interfaces
export interface UseForumReturn {
  forums: Forum[];
  loading: boolean;
  error: ForumApiError | null;
  createForum: (forum: Omit<Forum, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Forum>;
  updateForum: (id: string, updates: Partial<Forum>) => Promise<Forum>;
  deleteForum: (id: string) => Promise<void>;
  joinForum: (id: string) => Promise<void>;
  leaveForum: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseForumDiscussionsReturn {
  discussions: Discussion[];
  loading: boolean;
  error: ForumApiError | null;
  createDiscussion: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Discussion>;
  updateDiscussion: (id: string, updates: Partial<Discussion>) => Promise<Discussion>;
  deleteDiscussion: (id: string) => Promise<void>;
  pinDiscussion: (id: string) => Promise<void>;
  unpinDiscussion: (id: string) => Promise<void>;
  lockDiscussion: (id: string) => Promise<void>;
  unlockDiscussion: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseForumRepliesReturn {
  replies: ForumReply[];
  loading: boolean;
  error: ForumApiError | null;
  createReply: (reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ForumReply>;
  updateReply: (id: string, updates: Partial<ForumReply>) => Promise<ForumReply>;
  deleteReply: (id: string) => Promise<void>;
  markAsSolution: (id: string) => Promise<void>;
  unmarkAsSolution: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseForumModerationReturn {
  moderation: ForumModeration[];
  reports: ForumReport[];
  loading: boolean;
  error: ForumApiError | null;
  moderateUser: (userId: string, action: ModerationAction, reason: string) => Promise<void>;
  moderateContent: (contentId: string, action: ModerationAction, reason: string) => Promise<void>;
  reportContent: (report: Omit<ForumReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ForumReport>;
  resolveReport: (id: string, resolution: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseForumAnalyticsReturn {
  analytics: ForumAnalytics[];
  loading: boolean;
  error: ForumApiError | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export interface UseForumSearchReturn {
  search: (query: string, filters?: ForumSearchFilters) => Promise<ForumSearch>;
  results: ForumSearchResult[];
  suggestions: ForumSearchSuggestion[];
  loading: boolean;
  error: ForumApiError | null;
  clearResults: () => void;
  clearError: () => void;
}
