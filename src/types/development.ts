// Property Development Tracker Types
// Type definitions for property development tracking and management

export interface DevelopmentProject {
  id: string;
  propertyId: string;
  developerId: string;
  name: string;
  description: string;
  type: DevelopmentType;
  status: DevelopmentStatus;
  phase: DevelopmentPhase;
  location: DevelopmentLocation;
  scope: ProjectScope;
  timeline: ProjectTimeline;
  budget: ProjectBudget;
  team: ProjectTeam;
  milestones: Milestone[];
  tasks: Task[];
  documents: DevelopmentDocument[];
  permits: Permit[];
  inspections: Inspection[];
  contracts: Contract[];
  suppliers: Supplier[];
  risks: Risk[];
  issues: Issue[];
  communications: Communication[];
  progress: ProgressTracking;
  analytics: DevelopmentAnalytics;
  notifications: DevelopmentNotification[];
  createdAt: string;
  updatedAt: string;
}

export interface DevelopmentLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: Coordinates;
  lotSize: number;
  zoning: ZoningInfo;
  utilities: UtilityInfo;
  access: AccessInfo;
  environmental: EnvironmentalInfo;
}

export interface ZoningInfo {
  current: string;
  required: string;
  restrictions: string[];
  variances: Variance[];
  compliance: ComplianceStatus;
}

export interface Variance {
  id: string;
  type: string;
  description: string;
  status: VarianceStatus;
  requestedDate: string;
  approvedDate?: string;
  conditions: string[];
}

export interface UtilityInfo {
  water: UtilityStatus;
  sewer: UtilityStatus;
  electricity: UtilityStatus;
  gas: UtilityStatus;
  internet: UtilityStatus;
  cable: UtilityStatus;
  phone: UtilityStatus;
}

export interface UtilityStatus {
  available: boolean;
  capacity: string;
  connectionRequired: boolean;
  estimatedCost: number;
  timeline: string;
  provider: string;
  contact: ContactInfo;
}

export interface AccessInfo {
  roadAccess: boolean;
  roadType: string;
  easements: Easement[];
  restrictions: string[];
  improvements: string[];
}

export interface Easement {
  type: string;
  description: string;
  holder: string;
  restrictions: string[];
  expiresAt?: string;
}

export interface EnvironmentalInfo {
  soilType: string;
  drainage: string;
  floodZone: string;
  wetlands: boolean;
  endangeredSpecies: boolean;
  contamination: ContaminationInfo;
  assessments: EnvironmentalAssessment[];
}

export interface ContaminationInfo {
  present: boolean;
  type: string;
  severity: string;
  remediation: string;
  cost: number;
  timeline: string;
}

export interface EnvironmentalAssessment {
  type: string;
  date: string;
  results: string;
  recommendations: string[];
  cost: number;
}

export interface ProjectScope {
  totalArea: number;
  buildingArea: number;
  units: number;
  floors: number;
  parkingSpaces: number;
  amenities: string[];
  features: string[];
  specifications: Specification[];
  quality: QualityLevel;
  sustainability: SustainabilityInfo;
}

export interface Specification {
  category: string;
  item: string;
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier: string;
  status: SpecificationStatus;
}

export interface SustainabilityInfo {
  leedCertification: boolean;
  leedLevel: string;
  energyEfficiency: string;
  renewableEnergy: string[];
  waterConservation: string[];
  materials: string[];
  wasteReduction: string[];
}

export interface ProjectTimeline {
  startDate: string;
  endDate: string;
  phases: Phase[];
  dependencies: Dependency[];
  criticalPath: CriticalPathItem[];
  delays: Delay[];
  accelerations: Acceleration[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: PhaseStatus;
  progress: number;
  dependencies: string[];
  deliverables: string[];
  milestones: string[];
}

export interface Dependency {
  id: string;
  from: string;
  to: string;
  type: DependencyType;
  lag: number;
  description: string;
}

export interface CriticalPathItem {
  task: string;
  duration: number;
  startDate: string;
  endDate: string;
  float: number;
}

export interface Delay {
  id: string;
  task: string;
  reason: string;
  duration: number;
  impact: string;
  mitigation: string;
  date: string;
}

export interface Acceleration {
  id: string;
  task: string;
  method: string;
  savings: number;
  cost: number;
  date: string;
}

export interface ProjectBudget {
  totalBudget: number;
  contingency: number;
  phases: BudgetPhase[];
  categories: BudgetCategory[];
  actualCosts: ActualCost[];
  forecasts: Forecast[];
  variances: BudgetVariance[];
  approvals: BudgetApproval[];
}

export interface BudgetPhase {
  phase: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface BudgetCategory {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
  subcategories: BudgetSubcategory[];
}

export interface BudgetSubcategory {
  subcategory: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface ActualCost {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  vendor: string;
  invoice: string;
  approved: boolean;
}

export interface Forecast {
  id: string;
  date: string;
  category: string;
  amount: number;
  confidence: number;
  assumptions: string[];
}

export interface BudgetVariance {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
  reason: string;
  impact: string;
  action: string;
}

export interface BudgetApproval {
  id: string;
  amount: number;
  category: string;
  approver: string;
  date: string;
  conditions: string[];
}

export interface ProjectTeam {
  members: TeamMember[];
  roles: Role[];
  responsibilities: Responsibility[];
  communication: CommunicationPlan;
  meetings: Meeting[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  responsibilities: string[];
  startDate: string;
  endDate?: string;
  status: MemberStatus;
  skills: string[];
  certifications: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  reportingTo: string;
  level: RoleLevel;
}

export interface Responsibility {
  id: string;
  name: string;
  description: string;
  owner: string;
  stakeholders: string[];
  deliverables: string[];
  timeline: string;
  status: ResponsibilityStatus;
}

export interface CommunicationPlan {
  frequency: string;
  methods: string[];
  stakeholders: string[];
  escalation: EscalationMatrix;
  reporting: ReportingSchedule;
}

export interface EscalationMatrix {
  level: string;
  criteria: string;
  contacts: string[];
  timeline: string;
}

export interface ReportingSchedule {
  type: string;
  frequency: string;
  recipients: string[];
  format: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  duration: number;
  attendees: string[];
  agenda: string[];
  minutes: string;
  actionItems: ActionItem[];
  nextMeeting?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: ActionStatus;
  priority: Priority;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  phase: string;
  dueDate: string;
  completedDate?: string;
  status: MilestoneStatus;
  dependencies: string[];
  deliverables: string[];
  criteria: string[];
  progress: number;
  risks: string[];
  issues: string[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  phase: string;
  milestone: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  priority: Priority;
  effort: number;
  progress: number;
  dependencies: string[];
  subtasks: Subtask[];
  resources: Resource[];
  notes: string[];
}

export interface Subtask {
  id: string;
  name: string;
  description: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  progress: number;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  quantity: number;
  cost: number;
  availability: string;
  supplier: string;
}

export interface DevelopmentDocument {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  url: string;
  description: string;
  version: string;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  expiresAt?: string;
  tags: string[];
}

export interface Permit {
  id: string;
  type: PermitType;
  number: string;
  description: string;
  status: PermitStatus;
  applicationDate: string;
  issuedDate?: string;
  expiryDate?: string;
  cost: number;
  requirements: string[];
  conditions: string[];
  inspections: string[];
  documents: string[];
  contact: ContactInfo;
}

export interface Inspection {
  id: string;
  type: InspectionType;
  scheduledDate: string;
  completedDate?: string;
  inspector: string;
  status: InspectionStatus;
  results: InspectionResult[];
  findings: Finding[];
  recommendations: string[];
  nextInspection?: string;
  documents: string[];
}

export interface InspectionResult {
  category: string;
  status: string;
  notes: string;
  photos: string[];
}

export interface Finding {
  id: string;
  description: string;
  severity: FindingSeverity;
  category: string;
  location: string;
  correctiveAction: string;
  responsible: string;
  dueDate: string;
  status: FindingStatus;
  cost: number;
}

export interface Contract {
  id: string;
  type: ContractType;
  name: string;
  description: string;
  contractor: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  terms: ContractTerms;
  payments: Payment[];
  deliverables: Deliverable[];
  amendments: Amendment[];
  documents: string[];
}

export interface ContractTerms {
  scope: string;
  timeline: string;
  paymentTerms: string;
  warranties: string[];
  penalties: string[];
  termination: string;
  forceMajeure: string;
}

export interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  invoice: string;
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  deliveredDate?: string;
  status: DeliverableStatus;
  acceptance: AcceptanceCriteria;
}

export interface AcceptanceCriteria {
  criteria: string[];
  approved: boolean;
  approvedBy: string;
  approvedAt: string;
  notes: string;
}

export interface Amendment {
  id: string;
  description: string;
  changes: string[];
  value: number;
  date: string;
  approvedBy: string;
  documents: string[];
}

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  contact: ContactInfo;
  products: Product[];
  certifications: string[];
  rating: number;
  contracts: string[];
  performance: SupplierPerformance;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  specifications: string[];
  price: number;
  availability: string;
  leadTime: number;
  warranty: string;
}

export interface SupplierPerformance {
  onTimeDelivery: number;
  quality: number;
  communication: number;
  cost: number;
  overall: number;
  issues: string[];
  improvements: string[];
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  severity: RiskSeverity;
  status: RiskStatus;
  mitigation: Mitigation[];
  contingency: Contingency[];
  owner: string;
  lastReview: string;
  nextReview: string;
}

export interface Mitigation {
  id: string;
  description: string;
  cost: number;
  effectiveness: number;
  timeline: string;
  responsible: string;
  status: MitigationStatus;
}

export interface Contingency {
  id: string;
  description: string;
  cost: number;
  trigger: string;
  timeline: string;
  responsible: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  dueDate: string;
  resolvedAt?: string;
  resolution: string;
  impact: string;
  rootCause: string;
  prevention: string;
  documents: string[];
}

export interface Communication {
  id: string;
  type: CommunicationType;
  subject: string;
  message: string;
  from: string;
  to: string[];
  cc: string[];
  date: string;
  priority: Priority;
  status: CommunicationStatus;
  attachments: string[];
  followUp?: string;
}

export interface ProgressTracking {
  overallProgress: number;
  phaseProgress: PhaseProgress[];
  taskProgress: TaskProgress[];
  budgetProgress: BudgetProgress;
  scheduleProgress: ScheduleProgress;
  qualityProgress: QualityProgress;
  lastUpdated: string;
}

export interface PhaseProgress {
  phase: string;
  progress: number;
  completed: number;
  total: number;
  onTime: boolean;
  onBudget: boolean;
}

export interface TaskProgress {
  task: string;
  progress: number;
  completed: number;
  total: number;
  onTime: boolean;
  blocked: boolean;
}

export interface BudgetProgress {
  spent: number;
  budgeted: number;
  remaining: number;
  variance: number;
  percentage: number;
}

export interface ScheduleProgress {
  elapsed: number;
  planned: number;
  remaining: number;
  variance: number;
  percentage: number;
}

export interface QualityProgress {
  defects: number;
  rework: number;
  inspections: number;
  passed: number;
  failed: number;
  percentage: number;
}

export interface DevelopmentAnalytics {
  projectId: string;
  metrics: DevelopmentMetrics;
  trends: DevelopmentTrend[];
  benchmarks: Benchmark[];
  insights: Insight[];
  recommendations: Recommendation[];
  lastUpdated: string;
}

export interface DevelopmentMetrics {
  schedulePerformance: number;
  costPerformance: number;
  qualityPerformance: number;
  safetyPerformance: number;
  productivity: number;
  efficiency: number;
  customerSatisfaction: number;
  teamSatisfaction: number;
}

export interface DevelopmentTrend {
  metric: string;
  values: TrendValue[];
  direction: TrendDirection;
  significance: number;
}

export interface TrendValue {
  date: string;
  value: number;
  context: string;
}

export interface Benchmark {
  metric: string;
  value: number;
  industry: number;
  bestPractice: number;
  target: number;
  performance: number;
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: string;
  confidence: number;
  source: string;
  date: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  effort: number;
  impact: number;
  timeline: string;
  responsible: string;
  status: RecommendationStatus;
}

export interface DevelopmentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipient: string;
  priority: Priority;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface DevelopmentApiRequest {
  projectId?: string;
  developerId?: string;
  filters?: DevelopmentFilters;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface DevelopmentFilters {
  status: DevelopmentStatus[];
  type: DevelopmentType[];
  phase: DevelopmentPhase[];
  location: LocationFilter;
  budgetRange: PriceRange;
  dateRange: DateRange;
  team: string[];
  priority: Priority[];
}

export interface DevelopmentApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface DevelopmentApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

// Enums
export enum DevelopmentType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  MIXED_USE = 'mixed_use',
  INFRASTRUCTURE = 'infrastructure',
  RENOVATION = 'renovation',
  EXPANSION = 'expansion',
  DEMOLITION = 'demolition'
}

export enum DevelopmentStatus {
  PLANNING = 'planning',
  DESIGN = 'design',
  PERMITTING = 'permitting',
  PRE_CONSTRUCTION = 'pre_construction',
  CONSTRUCTION = 'construction',
  TESTING = 'testing',
  COMPLETION = 'completion',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum DevelopmentPhase {
  INITIATION = 'initiation',
  PLANNING = 'planning',
  DESIGN = 'design',
  PERMITTING = 'permitting',
  PRE_CONSTRUCTION = 'pre_construction',
  CONSTRUCTION = 'construction',
  TESTING = 'testing',
  COMPLETION = 'completion',
  CLOSE_OUT = 'close_out'
}

export enum VarianceStatus {
  REQUESTED = 'requested',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  WITHDRAWN = 'withdrawn'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review'
}

export enum QualityLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  LUXURY = 'luxury'
}

export enum SpecificationStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PROCURED = 'procured',
  INSTALLED = 'installed'
}

export enum PhaseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export enum DependencyType {
  FINISH_TO_START = 'finish_to_start',
  START_TO_START = 'start_to_start',
  FINISH_TO_FINISH = 'finish_to_finish',
  START_TO_FINISH = 'start_to_finish'
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  TERMINATED = 'terminated'
}

export enum RoleLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
  DIRECTOR = 'director'
}

export enum ResponsibilityStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum MeetingType {
  DAILY_STANDUP = 'daily_standup',
  WEEKLY_REVIEW = 'weekly_review',
  MONTHLY_REPORT = 'monthly_report',
  QUARTERLY_REVIEW = 'quarterly_review',
  AD_HOC = 'ad_hoc',
  EMERGENCY = 'emergency'
}

export enum ActionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  BLOCKED = 'blocked'
}

export enum ResourceType {
  MATERIAL = 'material',
  EQUIPMENT = 'equipment',
  LABOR = 'labor',
  SERVICE = 'service',
  SOFTWARE = 'software',
  OTHER = 'other'
}

export enum DocumentType {
  PLAN = 'plan',
  SPECIFICATION = 'specification',
  CONTRACT = 'contract',
  PERMIT = 'permit',
  INSPECTION = 'inspection',
  REPORT = 'report',
  CORRESPONDENCE = 'correspondence',
  PHOTO = 'photo',
  VIDEO = 'video',
  OTHER = 'other'
}

export enum DocumentCategory {
  DESIGN = 'design',
  CONSTRUCTION = 'construction',
  PERMITTING = 'permitting',
  INSPECTION = 'inspection',
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  SAFETY = 'safety',
  QUALITY = 'quality',
  OTHER = 'other'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUPERSEDED = 'superseded',
  ARCHIVED = 'archived'
}

export enum PermitType {
  BUILDING = 'building',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  MECHANICAL = 'mechanical',
  DEMOLITION = 'demolition',
  ENVIRONMENTAL = 'environmental',
  ZONING = 'zoning',
  OTHER = 'other'
}

export enum PermitStatus {
  NOT_REQUIRED = 'not_required',
  REQUIRED = 'required',
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export enum InspectionType {
  BUILDING = 'building',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  MECHANICAL = 'mechanical',
  FIRE = 'fire',
  ENVIRONMENTAL = 'environmental',
  SAFETY = 'safety',
  QUALITY = 'quality',
  FINAL = 'final'
}

export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum FindingSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export enum FindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ACCEPTED = 'accepted'
}

export enum ContractType {
  GENERAL_CONTRACTOR = 'general_contractor',
  SUBCONTRACTOR = 'subcontractor',
  SUPPLIER = 'supplier',
  CONSULTANT = 'consultant',
  DESIGN = 'design',
  ENGINEERING = 'engineering',
  OTHER = 'other'
}

export enum ContractStatus {
  DRAFT = 'draft',
  NEGOTIATING = 'negotiating',
  SIGNED = 'signed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
  EXPIRED = 'expired'
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  OVERDUE = 'overdue',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CHECK = 'check',
  WIRE_TRANSFER = 'wire_transfer',
  ACH = 'ach',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  OTHER = 'other'
}

export enum DeliverableStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  REVISED = 'revised'
}

export enum SupplierType {
  MATERIAL = 'material',
  EQUIPMENT = 'equipment',
  LABOR = 'labor',
  SERVICE = 'service',
  SOFTWARE = 'software',
  OTHER = 'other'
}

export enum RiskCategory {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  SCHEDULE = 'schedule',
  QUALITY = 'quality',
  SAFETY = 'safety',
  ENVIRONMENTAL = 'environmental',
  REGULATORY = 'regulatory',
  MARKET = 'market',
  OPERATIONAL = 'operational',
  OTHER = 'other'
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  ACCEPTED = 'accepted',
  TRANSFERRED = 'transferred',
  CLOSED = 'closed'
}

export enum MitigationStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum IssueCategory {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  SCHEDULE = 'schedule',
  QUALITY = 'quality',
  SAFETY = 'safety',
  ENVIRONMENTAL = 'environmental',
  REGULATORY = 'regulatory',
  COMMUNICATION = 'communication',
  RESOURCE = 'resource',
  OTHER = 'other'
}

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated'
}

export enum CommunicationType {
  EMAIL = 'email',
  PHONE = 'phone',
  MEETING = 'meeting',
  REPORT = 'report',
  NOTIFICATION = 'notification',
  ALERT = 'alert',
  OTHER = 'other'
}

export enum CommunicationStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  REPLIED = 'replied',
  FAILED = 'failed'
}

export enum InsightType {
  PERFORMANCE = 'performance',
  RISK = 'risk',
  OPPORTUNITY = 'opportunity',
  TREND = 'trend',
  PATTERN = 'pattern',
  ANOMALY = 'anomaly'
}

export enum RecommendationType {
  PROCESS = 'process',
  TECHNOLOGY = 'technology',
  RESOURCE = 'resource',
  SCHEDULE = 'schedule',
  BUDGET = 'budget',
  QUALITY = 'quality',
  SAFETY = 'safety',
  OTHER = 'other'
}

export enum RecommendationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IMPLEMENTED = 'implemented',
  CANCELLED = 'cancelled'
}

export enum NotificationType {
  MILESTONE = 'milestone',
  TASK = 'task',
  RISK = 'risk',
  ISSUE = 'issue',
  BUDGET = 'budget',
  SCHEDULE = 'schedule',
  QUALITY = 'quality',
  SAFETY = 'safety',
  SYSTEM = 'system'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export enum SortBy {
  NAME = 'name',
  STATUS = 'status',
  PHASE = 'phase',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  BUDGET = 'budget',
  PROGRESS = 'progress',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Additional interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  title: string;
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
