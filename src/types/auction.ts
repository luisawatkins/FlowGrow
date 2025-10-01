// Auction and Bidding System Types
// Type definitions for property auction and bidding functionality

export interface Auction {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reservePrice: number;
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  status: AuctionStatus;
  type: AuctionType;
  category: AuctionCategory;
  location: AuctionLocation;
  images: AuctionImage[];
  documents: AuctionDocument[];
  terms: AuctionTerms;
  fees: AuctionFees;
  participants: AuctionParticipant[];
  bids: Bid[];
  winner?: AuctionWinner;
  statistics: AuctionStatistics;
  notifications: AuctionNotification[];
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: string;
  status: BidStatus;
  type: BidType;
  isWinning: boolean;
  isReserveMet: boolean;
  bidder: Bidder;
  metadata: BidMetadata;
  createdAt: string;
}

export interface Bidder {
  id: string;
  userId: string;
  username: string;
  email: string;
  phone: string;
  profile: BidderProfile;
  verification: BidderVerification;
  preferences: BidderPreferences;
  statistics: BidderStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface BidderProfile {
  firstName: string;
  lastName: string;
  company?: string;
  address: Address;
  taxId?: string;
  licenseNumber?: string;
  references: Reference[];
  experience: Experience[];
  certifications: Certification[];
}

export interface BidderVerification {
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  documents: VerificationDocument[];
  checks: VerificationCheck[];
  lastVerified: string;
  expiresAt?: string;
}

export interface BidderPreferences {
  notificationSettings: NotificationSettings;
  biddingSettings: BiddingSettings;
  paymentSettings: PaymentSettings;
  communicationSettings: CommunicationSettings;
}

export interface BidderStatistics {
  totalBids: number;
  winningBids: number;
  totalSpent: number;
  averageBidAmount: number;
  successRate: number;
  favoriteCategories: string[];
  biddingHistory: BiddingHistory[];
  reputation: number;
  lastBidDate: string;
}

export interface BiddingHistory {
  auctionId: string;
  propertyTitle: string;
  bidAmount: number;
  bidDate: string;
  status: BidStatus;
  isWinning: boolean;
}

export interface AuctionParticipant {
  id: string;
  bidderId: string;
  auctionId: string;
  joinedAt: string;
  status: ParticipantStatus;
  permissions: ParticipantPermissions;
  activity: ParticipantActivity;
  notifications: ParticipantNotification[];
}

export interface ParticipantPermissions {
  canBid: boolean;
  canViewDetails: boolean;
  canDownloadDocuments: boolean;
  canContactSeller: boolean;
  canViewOtherBids: boolean;
  canViewBidderInfo: boolean;
}

export interface ParticipantActivity {
  lastLogin: string;
  totalBids: number;
  lastBidDate: string;
  documentsViewed: string[];
  questionsAsked: number;
  timeSpent: number;
}

export interface ParticipantNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuctionWinner {
  id: string;
  bidderId: string;
  bidId: string;
  winningBid: number;
  declaredAt: string;
  paymentStatus: PaymentStatus;
  contractStatus: ContractStatus;
  nextSteps: NextStep[];
  documents: WinnerDocument[];
}

export interface NextStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: StepStatus;
  isRequired: boolean;
  documents: string[];
  instructions: string[];
}

export interface WinnerDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  isRequired: boolean;
  isSigned: boolean;
  dueDate: string;
  status: DocumentStatus;
}

export interface AuctionStatistics {
  totalBids: number;
  uniqueBidders: number;
  highestBid: number;
  averageBid: number;
  bidFrequency: number;
  participationRate: number;
  views: number;
  shares: number;
  inquiries: number;
  lastBidTime: string;
  biddingTrends: BiddingTrend[];
}

export interface BiddingTrend {
  timestamp: string;
  bidCount: number;
  averageBid: number;
  uniqueBidders: number;
}

export interface AuctionNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  recipientType: RecipientType;
  isRead: boolean;
  priority: Priority;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AuctionLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  timezone: string;
  inspectionDates: InspectionDate[];
  viewingInstructions: string;
}

export interface InspectionDate {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: InspectionType;
  maxParticipants: number;
  registeredParticipants: string[];
  isFull: boolean;
  instructions: string;
}

export interface AuctionImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption: string;
  isPrimary: boolean;
  order: number;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  takenAt?: string;
  location?: string;
}

export interface AuctionDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  description: string;
  isRequired: boolean;
  isPublic: boolean;
  fileSize: number;
  uploadedAt: string;
  downloadedBy: string[];
}

export interface AuctionTerms {
  id: string;
  auctionId: string;
  terms: string;
  conditions: string[];
  exclusions: string[];
  warranties: string[];
  liabilities: string[];
  paymentTerms: PaymentTerms;
  closingTerms: ClosingTerms;
  defaultTerms: string[];
  customTerms: string[];
  lastUpdated: string;
}

export interface PaymentTerms {
  depositRequired: number;
  depositDueDate: string;
  paymentMethod: PaymentMethod[];
  financingAllowed: boolean;
  financingTerms: string;
  latePaymentPenalty: number;
  refundPolicy: string;
}

export interface ClosingTerms {
  closingDate: string;
  closingLocation: string;
  closingAgent: string;
  titleCompany: string;
  escrowInstructions: string;
  prorations: string[];
  adjustments: string[];
}

export interface AuctionFees {
  buyerPremium: number;
  sellerCommission: number;
  processingFee: number;
  documentFee: number;
  technologyFee: number;
  paymentProcessingFee: number;
  totalFees: number;
  feeBreakdown: FeeBreakdown[];
}

export interface FeeBreakdown {
  type: string;
  amount: number;
  percentage: number;
  description: string;
  isRequired: boolean;
}

export interface BidMetadata {
  ipAddress: string;
  userAgent: string;
  deviceType: DeviceType;
  location?: string;
  proxyUsed: boolean;
  automatedBid: boolean;
  bidSource: BidSource;
}

export interface AuctionSearch {
  query: string;
  filters: AuctionFilters;
  sortBy: SortBy;
  sortOrder: SortOrder;
  page: number;
  limit: number;
  results: Auction[];
  totalCount: number;
  facets: SearchFacets;
}

export interface AuctionFilters {
  status: AuctionStatus[];
  type: AuctionType[];
  category: AuctionCategory[];
  location: LocationFilter;
  priceRange: PriceRange;
  dateRange: DateRange;
  features: string[];
  propertyType: PropertyType[];
  condition: PropertyCondition[];
  size: SizeRange;
  amenities: string[];
}

export interface LocationFilter {
  city?: string;
  state?: string;
  zipCode?: string;
  radius?: number;
  coordinates?: Coordinates;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface SizeRange {
  minSqFt: number;
  maxSqFt: number;
  minAcres: number;
  maxAcres: number;
}

export interface SearchFacets {
  status: FacetCount[];
  type: FacetCount[];
  category: FacetCount[];
  location: FacetCount[];
  priceRange: FacetCount[];
  features: FacetCount[];
  propertyType: FacetCount[];
  condition: FacetCount[];
}

export interface FacetCount {
  value: string;
  count: number;
}

export interface AuctionAnalytics {
  auctionId: string;
  views: number;
  uniqueViews: number;
  shares: number;
  inquiries: number;
  bids: number;
  uniqueBidders: number;
  averageBidAmount: number;
  highestBid: number;
  biddingPatterns: BiddingPattern[];
  userEngagement: UserEngagement[];
  conversionMetrics: ConversionMetrics;
  performanceMetrics: PerformanceMetrics;
}

export interface BiddingPattern {
  timeOfDay: number;
  dayOfWeek: number;
  bidCount: number;
  averageAmount: number;
}

export interface UserEngagement {
  userId: string;
  sessionDuration: number;
  pagesViewed: number;
  bidsPlaced: number;
  documentsDownloaded: number;
  questionsAsked: number;
}

export interface ConversionMetrics {
  viewToBidRate: number;
  bidToWinRate: number;
  inquiryToBidRate: number;
  shareToViewRate: number;
}

export interface PerformanceMetrics {
  averageLoadTime: number;
  bounceRate: number;
  returnVisitorRate: number;
  mobileUsageRate: number;
}

export interface AuctionReport {
  id: string;
  auctionId: string;
  type: ReportType;
  title: string;
  description: string;
  data: any;
  charts: ChartData[];
  tables: TableData[];
  insights: string[];
  recommendations: string[];
  generatedAt: string;
  generatedBy: string;
}

export interface ChartData {
  type: ChartType;
  title: string;
  data: any;
  options: any;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: any[][];
  summary?: any;
}

export interface AuctionApiRequest {
  auctionId?: string;
  bidderId?: string;
  filters?: AuctionFilters;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface AuctionApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuctionApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

// Enums
export enum AuctionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum AuctionType {
  LIVE = 'live',
  ONLINE = 'online',
  SEALED_BID = 'sealed_bid',
  DUTCH = 'dutch',
  ENGLISH = 'english',
  RESERVE = 'reserve',
  ABSOLUTE = 'absolute'
}

export enum AuctionCategory {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  LAND = 'land',
  MULTI_FAMILY = 'multi_family',
  MIXED_USE = 'mixed_use',
  SPECIAL_USE = 'special_use'
}

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  OUTBID = 'outbid',
  WINNING = 'winning',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled'
}

export enum BidType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  PROXY = 'proxy',
  MAXIMUM = 'maximum',
  INCREMENTAL = 'incremental'
}

export enum ParticipantStatus {
  REGISTERED = 'registered',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum NotificationType {
  BID_PLACED = 'bid_placed',
  BID_OUTBID = 'bid_outbid',
  BID_WON = 'bid_won',
  BID_LOST = 'bid_lost',
  AUCTION_STARTING = 'auction_starting',
  AUCTION_ENDING = 'auction_ending',
  AUCTION_ENDED = 'auction_ended',
  RESERVE_MET = 'reserve_met',
  INSPECTION_REMINDER = 'inspection_reminder',
  PAYMENT_REMINDER = 'payment_reminder',
  DOCUMENT_AVAILABLE = 'document_available',
  SYSTEM_UPDATE = 'system_update'
}

export enum RecipientType {
  BIDDER = 'bidder',
  SELLER = 'seller',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  VERIFIED = 'verified'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum ContractStatus {
  PENDING = 'pending',
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  SIGNED = 'signed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum InspectionType {
  GENERAL = 'general',
  STRUCTURAL = 'structural',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  HVAC = 'hvac',
  ENVIRONMENTAL = 'environmental',
  SPECIALIZED = 'specialized'
}

export enum DocumentType {
  CONTRACT = 'contract',
  DISCLOSURE = 'disclosure',
  INSPECTION_REPORT = 'inspection_report',
  APPRAISAL = 'appraisal',
  TITLE_REPORT = 'title_report',
  SURVEY = 'survey',
  PERMIT = 'permit',
  CERTIFICATE = 'certificate',
  OTHER = 'other'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  WIRE_TRANSFER = 'wire_transfer',
  CREDIT_CARD = 'credit_card',
  FINANCING = 'financing',
  CRYPTOCURRENCY = 'cryptocurrency'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}

export enum BidSource {
  WEB = 'web',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  AUTOMATED = 'automated'
}

export enum SortBy {
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  CURRENT_BID = 'current_bid',
  RESERVE_PRICE = 'reserve_price',
  TITLE = 'title',
  CREATED_AT = 'created_at',
  BID_COUNT = 'bid_count',
  VIEWS = 'views'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export enum PropertyType {
  SINGLE_FAMILY = 'single_family',
  CONDOMINIUM = 'condominium',
  TOWNHOUSE = 'townhouse',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
  FOURPLEX = 'fourplex',
  APARTMENT = 'apartment',
  MOBILE_HOME = 'mobile_home',
  MANUFACTURED_HOME = 'manufactured_home',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  OFFICE = 'office',
  WAREHOUSE = 'warehouse',
  MIXED_USE = 'mixed_use',
  LAND = 'land',
  FARM = 'farm',
  RANCH = 'ranch'
}

export enum PropertyCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NEEDS_REPAIR = 'needs_repair',
  AS_IS = 'as_is'
}

export enum ReportType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  ANALYTICS = 'analytics',
  FINANCIAL = 'financial',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  SCATTER = 'scatter',
  AREA = 'area',
  DOUGHNUT = 'doughnut',
  RADAR = 'radar'
}

// Additional interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Reference {
  name: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Experience {
  type: string;
  description: string;
  years: number;
  properties: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
}

export interface VerificationDocument {
  type: string;
  name: string;
  url: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export interface VerificationCheck {
  type: string;
  status: string;
  result: string;
  checkedAt: string;
  expiresAt?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: string;
  types: NotificationType[];
}

export interface BiddingSettings {
  autoBid: boolean;
  maxBidAmount: number;
  bidIncrement: number;
  proxyBidding: boolean;
  bidAlerts: boolean;
}

export interface PaymentSettings {
  preferredMethod: PaymentMethod;
  autoPay: boolean;
  paymentReminders: boolean;
  financingPreApproved: boolean;
}

export interface CommunicationSettings {
  allowSellerContact: boolean;
  allowOtherBiddersContact: boolean;
  marketingEmails: boolean;
  systemNotifications: boolean;
}
