// Rental Management Types
// Type definitions for property rental management functionality

export interface RentalProperty {
  id: string;
  propertyId: string;
  ownerId: string;
  title: string;
  description: string;
  type: PropertyType;
  status: RentalStatus;
  location: RentalLocation;
  details: PropertyDetails;
  amenities: Amenity[];
  pricing: RentalPricing;
  availability: Availability;
  images: RentalImage[];
  documents: RentalDocument[];
  rules: RentalRules;
  policies: RentalPolicies;
  statistics: RentalStatistics;
  reviews: RentalReview[];
  inquiries: RentalInquiry[];
  applications: RentalApplication[];
  leases: Lease[];
  maintenance: MaintenanceRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface RentalLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  neighborhood: string;
  schoolDistrict: string;
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  nearbyAmenities: NearbyAmenity[];
}

export interface PropertyDetails {
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  parking: ParkingInfo;
  heating: string;
  cooling: string;
  flooring: string[];
  appliances: string[];
  utilities: UtilityInfo;
  petPolicy: PetPolicy;
  smokingPolicy: SmokingPolicy;
  furnished: boolean;
  furnishedDetails?: FurnishedDetails;
}

export interface ParkingInfo {
  type: ParkingType;
  spaces: number;
  covered: boolean;
  assigned: boolean;
  cost: number;
  restrictions: string[];
}

export interface UtilityInfo {
  included: string[];
  notIncluded: string[];
  averageCost: number;
  setupRequired: string[];
}

export interface PetPolicy {
  allowed: boolean;
  types: PetType[];
  restrictions: string[];
  deposits: PetDeposit[];
  monthlyFees: number;
  weightLimit?: number;
  breedRestrictions: string[];
}

export interface PetDeposit {
  type: PetType;
  amount: number;
  refundable: boolean;
  description: string;
}

export interface SmokingPolicy {
  allowed: boolean;
  restrictions: string[];
  designatedAreas: string[];
  penalties: string[];
}

export interface FurnishedDetails {
  level: FurnishingLevel;
  items: FurnishedItem[];
  additionalCost: number;
  replacementPolicy: string;
}

export interface FurnishedItem {
  category: string;
  items: string[];
  condition: ItemCondition;
  value: number;
}

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  description: string;
  icon: string;
  isIncluded: boolean;
  additionalCost: number;
  restrictions: string[];
}

export interface NearbyAmenity {
  name: string;
  type: AmenityType;
  distance: number;
  rating: number;
  address: string;
  phone?: string;
  website?: string;
}

export interface RentalPricing {
  baseRent: number;
  currency: string;
  paymentFrequency: PaymentFrequency;
  deposit: number;
  applicationFee: number;
  petFee: number;
  utilities: UtilityPricing;
  additionalFees: AdditionalFee[];
  discounts: RentalDiscount[];
  seasonalPricing: SeasonalPricing[];
  leaseTerms: LeaseTerm[];
}

export interface UtilityPricing {
  included: string[];
  estimated: { [utility: string]: number };
  setup: { [utility: string]: number };
}

export interface AdditionalFee {
  name: string;
  amount: number;
  frequency: FeeFrequency;
  description: string;
  isRequired: boolean;
  isRefundable: boolean;
}

export interface RentalDiscount {
  name: string;
  type: DiscountType;
  amount: number;
  percentage: number;
  conditions: string[];
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface SeasonalPricing {
  season: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  reason: string;
}

export interface LeaseTerm {
  duration: number;
  unit: TimeUnit;
  discount: number;
  isPopular: boolean;
  description: string;
}

export interface Availability {
  isAvailable: boolean;
  availableFrom: string;
  availableTo?: string;
  minimumLease: number;
  maximumLease: number;
  noticePeriod: number;
  showings: Showing[];
  blackoutDates: BlackoutDate[];
  restrictions: string[];
}

export interface Showing {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ShowingType;
  maxAttendees: number;
  registeredAttendees: string[];
  isFull: boolean;
  instructions: string;
  contact: ContactInfo;
}

export interface BlackoutDate {
  startDate: string;
  endDate: string;
  reason: string;
  isRecurring: boolean;
}

export interface RentalImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption: string;
  category: ImageCategory;
  isPrimary: boolean;
  order: number;
  metadata: ImageMetadata;
}

export interface RentalDocument {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  description: string;
  isRequired: boolean;
  isPublic: boolean;
  fileSize: number;
  uploadedAt: string;
  expiresAt?: string;
  downloadedBy: string[];
}

export interface RentalRules {
  id: string;
  propertyId: string;
  generalRules: string[];
  noiseRules: string[];
  guestRules: string[];
  parkingRules: string[];
  maintenanceRules: string[];
  safetyRules: string[];
  communityRules: string[];
  penalties: RulePenalty[];
  lastUpdated: string;
}

export interface RulePenalty {
  violation: string;
  firstOffense: string;
  secondOffense: string;
  thirdOffense: string;
  severeOffense: string;
}

export interface RentalPolicies {
  id: string;
  propertyId: string;
  cancellationPolicy: CancellationPolicy;
  refundPolicy: RefundPolicy;
  damagePolicy: DamagePolicy;
  insurancePolicy: InsurancePolicy;
  backgroundCheckPolicy: BackgroundCheckPolicy;
  creditCheckPolicy: CreditCheckPolicy;
  incomePolicy: IncomePolicy;
  lastUpdated: string;
}

export interface CancellationPolicy {
  allowed: boolean;
  noticeRequired: number;
  penalties: string[];
  refundPercentage: number;
  exceptions: string[];
}

export interface RefundPolicy {
  depositRefundable: boolean;
  conditions: string[];
  processingTime: number;
  fees: number;
  exceptions: string[];
}

export interface DamagePolicy {
  normalWearAndTear: string[];
  tenantResponsibility: string[];
  landlordResponsibility: string[];
  reportingRequirements: string[];
  repairProcess: string[];
}

export interface InsurancePolicy {
  required: boolean;
  minimumCoverage: number;
  types: InsuranceType[];
  proofRequired: boolean;
  renewalRequired: boolean;
}

export interface BackgroundCheckPolicy {
  required: boolean;
  checks: BackgroundCheckType[];
  criteria: string[];
  fees: number;
  processingTime: number;
}

export interface CreditCheckPolicy {
  required: boolean;
  minimumScore: number;
  criteria: string[];
  fees: number;
  processingTime: number;
}

export interface IncomePolicy {
  required: boolean;
  minimumIncome: number;
  incomeMultiplier: number;
  proofRequired: string[];
  verificationProcess: string[];
}

export interface RentalStatistics {
  totalViews: number;
  uniqueViews: number;
  inquiries: number;
  applications: number;
  leases: number;
  averageRating: number;
  totalReviews: number;
  occupancyRate: number;
  averageRent: number;
  revenue: number;
  expenses: number;
  profit: number;
  maintenanceCosts: number;
  vacancyDays: number;
  averageLeaseLength: number;
  renewalRate: number;
  lastUpdated: string;
}

export interface RentalReview {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  title: string;
  comment: string;
  categories: ReviewCategory[];
  isVerified: boolean;
  isAnonymous: boolean;
  response?: ReviewResponse;
  helpful: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCategory {
  category: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  ownerId: string;
  comment: string;
  createdAt: string;
}

export interface RentalInquiry {
  id: string;
  propertyId: string;
  inquirerId: string;
  subject: string;
  message: string;
  contactInfo: ContactInfo;
  preferredContactMethod: ContactMethod;
  moveInDate: string;
  leaseLength: number;
  status: InquiryStatus;
  response?: InquiryResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
}

export interface InquiryResponse {
  id: string;
  ownerId: string;
  message: string;
  attachments: string[];
  createdAt: string;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  applicantId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  references: Reference[];
  documents: ApplicationDocument[];
  backgroundCheck: BackgroundCheckResult;
  creditCheck: CreditCheckResult;
  incomeVerification: IncomeVerification;
  notes: string[];
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: Address;
  previousAddresses: Address[];
  emergencyContact: EmergencyContact;
  dependents: number;
  pets: PetInfo[];
}

export interface EmploymentInfo {
  employer: string;
  position: string;
  startDate: string;
  salary: number;
  employmentType: EmploymentType;
  supervisor: string;
  supervisorPhone: string;
  previousEmployer?: string;
  previousPosition?: string;
  previousSalary?: number;
}

export interface PetInfo {
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  vaccinated: boolean;
  spayedNeutered: boolean;
  description: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: Address;
}

export interface ApplicationDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface BackgroundCheckResult {
  status: CheckStatus;
  results: CheckResult[];
  completedAt: string;
  reportUrl?: string;
}

export interface CheckResult {
  type: BackgroundCheckType;
  status: string;
  details: string;
  date: string;
}

export interface CreditCheckResult {
  status: CheckStatus;
  score: number;
  reportUrl?: string;
  completedAt: string;
  factors: CreditFactor[];
}

export interface CreditFactor {
  factor: string;
  impact: string;
  description: string;
}

export interface IncomeVerification {
  status: CheckStatus;
  verifiedIncome: number;
  documents: string[];
  completedAt: string;
  notes: string[];
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
  status: LeaseStatus;
  terms: LeaseTerms;
  payments: LeasePayment[];
  renewals: LeaseRenewal[];
  violations: LeaseViolation[];
  documents: LeaseDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaseTerms {
  duration: number;
  unit: TimeUnit;
  rent: number;
  deposit: number;
  utilities: string[];
  pets: PetPolicy;
  smoking: SmokingPolicy;
  guests: GuestPolicy;
  maintenance: MaintenancePolicy;
  termination: TerminationPolicy;
  specialTerms: string[];
}

export interface GuestPolicy {
  allowed: boolean;
  maxGuests: number;
  maxNights: number;
  registrationRequired: boolean;
  additionalFees: number;
}

export interface MaintenancePolicy {
  tenantResponsibility: string[];
  landlordResponsibility: string[];
  emergencyContacts: string[];
  reportingProcess: string[];
  responseTime: number;
}

export interface TerminationPolicy {
  noticeRequired: number;
  penalties: string[];
  conditions: string[];
  refundPolicy: string;
}

export interface LeasePayment {
  id: string;
  leaseId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  lateFee: number;
  notes: string;
}

export interface LeaseRenewal {
  id: string;
  leaseId: string;
  newStartDate: string;
  newEndDate: string;
  newRent: number;
  status: RenewalStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  reason?: string;
}

export interface LeaseViolation {
  id: string;
  leaseId: string;
  type: ViolationType;
  description: string;
  severity: ViolationSeverity;
  reportedAt: string;
  reportedBy: string;
  status: ViolationStatus;
  resolution?: string;
  resolvedAt?: string;
  penalties: string[];
}

export interface LeaseDocument {
  id: string;
  leaseId: string;
  type: DocumentType;
  name: string;
  url: string;
  isSigned: boolean;
  signedAt?: string;
  signedBy: string[];
  expiresAt?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId?: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  location: string;
  images: string[];
  status: MaintenanceStatus;
  assignedTo?: string;
  estimatedCost: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RentalApiRequest {
  propertyId?: string;
  ownerId?: string;
  filters?: RentalFilters;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface RentalFilters {
  status: RentalStatus[];
  type: PropertyType[];
  location: LocationFilter;
  priceRange: PriceRange;
  bedrooms: number[];
  bathrooms: number[];
  amenities: string[];
  petFriendly: boolean;
  furnished: boolean;
  availableFrom: string;
  availableTo: string;
}

export interface RentalApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface RentalApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

// Enums
export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  CONDOMINIUM = 'condominium',
  TOWNHOUSE = 'townhouse',
  STUDIO = 'studio',
  LOFT = 'loft',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
  FOURPLEX = 'fourplex',
  MOBILE_HOME = 'mobile_home',
  MANUFACTURED_HOME = 'manufactured_home',
  ROOM = 'room',
  SHARED = 'shared'
}

export enum RentalStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
  PENDING = 'pending',
  DRAFT = 'draft'
}

export enum ParkingType {
  NONE = 'none',
  STREET = 'street',
  DRIVEWAY = 'driveway',
  GARAGE = 'garage',
  CARPORT = 'carport',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned'
}

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  FISH = 'fish',
  REPTILE = 'reptile',
  SMALL_MAMMAL = 'small_mammal',
  OTHER = 'other'
}

export enum FurnishingLevel {
  UNFURNISHED = 'unfurnished',
  PARTIALLY_FURNISHED = 'partially_furnished',
  FULLY_FURNISHED = 'fully_furnished'
}

export enum ItemCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum AmenityCategory {
  BASIC = 'basic',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  LAUNDRY = 'laundry',
  OUTDOOR = 'outdoor',
  SECURITY = 'security',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  FITNESS = 'fitness',
  BUSINESS = 'business'
}

export enum AmenityType {
  RESTAURANT = 'restaurant',
  GROCERY = 'grocery',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  FITNESS = 'fitness',
  MEDICAL = 'medical',
  EDUCATION = 'education',
  TRANSPORTATION = 'transportation',
  PARK = 'park',
  BANK = 'bank'
}

export enum PaymentFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum FeeFrequency {
  ONE_TIME = 'one_time',
  MONTHLY = 'monthly',
  ANNUAL = 'annual'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_MONTHS = 'free_months'
}

export enum TimeUnit {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  YEARS = 'years'
}

export enum ShowingType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  VIRTUAL = 'virtual',
  SELF_GUIDED = 'self_guided'
}

export enum ImageCategory {
  EXTERIOR = 'exterior',
  INTERIOR = 'interior',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  BEDROOM = 'bedroom',
  LIVING_ROOM = 'living_room',
  AMENITIES = 'amenities',
  NEIGHBORHOOD = 'neighborhood'
}

export enum DocumentType {
  LEASE = 'lease',
  APPLICATION = 'application',
  BACKGROUND_CHECK = 'background_check',
  CREDIT_REPORT = 'credit_report',
  INCOME_VERIFICATION = 'income_verification',
  IDENTIFICATION = 'identification',
  INSURANCE = 'insurance',
  PET_DOCUMENTATION = 'pet_documentation',
  OTHER = 'other'
}

export enum InsuranceType {
  RENTERS = 'renters',
  LIABILITY = 'liability',
  PROPERTY = 'property'
}

export enum BackgroundCheckType {
  CRIMINAL = 'criminal',
  EVICTION = 'eviction',
  SEX_OFFENDER = 'sex_offender',
  TERRORIST = 'terrorist',
  EMPLOYMENT = 'employment',
  EDUCATION = 'education'
}

export enum ContactMethod {
  EMAIL = 'email',
  PHONE = 'phone',
  TEXT = 'text',
  ANY = 'any'
}

export enum InquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  SCHEDULED = 'scheduled',
  APPLIED = 'applied',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CLOSED = 'closed'
}

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  SELF_EMPLOYED = 'self_employed',
  UNEMPLOYED = 'unemployed',
  RETIRED = 'retired',
  STUDENT = 'student'
}

export enum CheckStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum LeaseStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  RENEWED = 'renewed'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  ONLINE = 'online',
  AUTOMATIC = 'automatic'
}

export enum RenewalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum ViolationType {
  NOISE = 'noise',
  PET = 'pet',
  GUEST = 'guest',
  PARKING = 'parking',
  MAINTENANCE = 'maintenance',
  SAFETY = 'safety',
  PAYMENT = 'payment',
  OTHER = 'other'
}

export enum ViolationSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe'
}

export enum ViolationStatus {
  REPORTED = 'reported',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
  DISMISSED = 'dismissed'
}

export enum MaintenanceType {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  APPLIANCE = 'appliance',
  STRUCTURAL = 'structural',
  CLEANING = 'cleaning',
  PEST = 'pest',
  LANDSCAPING = 'landscaping',
  SECURITY = 'security',
  OTHER = 'other'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency'
}

export enum MaintenanceStatus {
  SUBMITTED = 'submitted',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum SortBy {
  PRICE = 'price',
  BEDROOMS = 'bedrooms',
  BATHROOMS = 'bathrooms',
  SQUARE_FOOTAGE = 'square_footage',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  RATING = 'rating',
  AVAILABILITY = 'availability'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
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

export interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  takenAt?: string;
  location?: string;
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
