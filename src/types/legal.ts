// Legal Document Generator Types
// Type definitions for property legal document generation

export interface LegalDocument {
  id: string;
  propertyId: string;
  type: DocumentType;
  title: string;
  description: string;
  status: DocumentStatus;
  template: DocumentTemplate;
  content: DocumentContent;
  parties: Party[];
  terms: DocumentTerms;
  clauses: Clause[];
  signatures: Signature[];
  attachments: Attachment[];
  metadata: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  jurisdiction: string;
  version: string;
  description: string;
  content: string;
  variables: TemplateVariable[];
  sections: DocumentSection[];
  requirements: Requirement[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentContent {
  html: string;
  text: string;
  pdf: string;
  sections: ContentSection[];
  variables: ContentVariable[];
  formatting: DocumentFormatting;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  variables: string[];
  clauses: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  variables: ContentVariable[];
}

export interface ContentVariable {
  name: string;
  value: string;
  type: VariableType;
  required: boolean;
  validation: ValidationRule[];
}

export interface DocumentFormatting {
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: Margins;
  headers: HeaderFooter;
  footers: HeaderFooter;
  pageNumbers: boolean;
  watermark: string;
}

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface HeaderFooter {
  content: string;
  fontSize: number;
  alignment: string;
}

export interface Party {
  id: string;
  type: PartyType;
  name: string;
  role: string;
  contact: ContactInfo;
  address: Address;
  identification: Identification;
  representation: Representation;
  capacity: Capacity;
  authority: Authority;
}

export interface ContactInfo {
  email: string;
  phone: string;
  fax?: string;
  website?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Identification {
  type: string;
  number: string;
  issuer: string;
  expiryDate?: string;
}

export interface Representation {
  isRepresented: boolean;
  representative?: Party;
  powerOfAttorney?: string;
  limitations?: string[];
}

export interface Capacity {
  isMinor: boolean;
  isIncompetent: boolean;
  isBankrupt: boolean;
  isInsolvent: boolean;
  guardianship?: string;
  conservatorship?: string;
}

export interface Authority {
  hasAuthority: boolean;
  source: string;
  limitations?: string[];
  conditions?: string[];
}

export interface DocumentTerms {
  effectiveDate: string;
  expiryDate?: string;
  termination: TerminationClause;
  renewal: RenewalClause;
  modification: ModificationClause;
  assignment: AssignmentClause;
  governingLaw: string;
  jurisdiction: string;
  disputeResolution: DisputeResolution;
  forceMajeure: ForceMajeureClause;
  confidentiality: ConfidentialityClause;
  indemnification: IndemnificationClause;
  limitation: LimitationClause;
  warranties: WarrantyClause;
  representations: RepresentationClause;
  covenants: CovenantClause;
  conditions: ConditionClause;
  remedies: RemedyClause;
  penalties: PenaltyClause;
  notices: NoticeClause;
  severability: SeverabilityClause;
  entireAgreement: EntireAgreementClause;
  interpretation: InterpretationClause;
  definitions: DefinitionClause;
  schedules: ScheduleClause;
  exhibits: ExhibitClause;
  other: OtherClause[];
}

export interface TerminationClause {
  events: string[];
  notice: string;
  consequences: string[];
  survival: string[];
}

export interface RenewalClause {
  automatic: boolean;
  notice: string;
  conditions: string[];
  terms: string[];
}

export interface ModificationClause {
  allowed: boolean;
  requirements: string[];
  limitations: string[];
  consequences: string[];
}

export interface AssignmentClause {
  allowed: boolean;
  restrictions: string[];
  requirements: string[];
  consequences: string[];
}

export interface DisputeResolution {
  method: string;
  venue: string;
  language: string;
  costs: string;
  enforcement: string;
}

export interface ForceMajeureClause {
  events: string[];
  consequences: string[];
  notice: string;
  mitigation: string[];
}

export interface ConfidentialityClause {
  scope: string;
  duration: string;
  exceptions: string[];
  remedies: string[];
}

export interface IndemnificationClause {
  scope: string;
  limitations: string[];
  procedures: string[];
  insurance: string[];
}

export interface LimitationClause {
  liability: string;
  damages: string;
  time: string;
  other: string[];
}

export interface WarrantyClause {
  scope: string;
  duration: string;
  limitations: string[];
  remedies: string[];
}

export interface RepresentationClause {
  scope: string;
  accuracy: string;
  updates: string;
  consequences: string[];
}

export interface CovenantClause {
  affirmative: string[];
  negative: string[];
  financial: string[];
  operational: string[];
}

export interface ConditionClause {
  precedent: string[];
  subsequent: string[];
  performance: string[];
  other: string[];
}

export interface RemedyClause {
  specific: string[];
  monetary: string[];
  injunctive: string[];
  other: string[];
}

export interface PenaltyClause {
  late: string;
  breach: string;
  other: string[];
}

export interface NoticeClause {
  method: string;
  address: string;
  language: string;
  timing: string;
}

export interface SeverabilityClause {
  effect: string;
  replacement: string;
  remainder: string;
}

export interface EntireAgreementClause {
  scope: string;
  integration: string;
  parol: string;
}

export interface InterpretationClause {
  rules: string[];
  definitions: string[];
  headings: string;
  gender: string;
}

export interface DefinitionClause {
  terms: Definition[];
  crossReferences: string[];
  updates: string;
}

export interface Definition {
  term: string;
  definition: string;
  context: string;
  examples: string[];
}

export interface ScheduleClause {
  schedules: Schedule[];
  incorporation: string;
  updates: string;
}

export interface Schedule {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ExhibitClause {
  exhibits: Exhibit[];
  incorporation: string;
  updates: string;
}

export interface Exhibit {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface OtherClause {
  title: string;
  content: string;
  order: number;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
  type: ClauseType;
  order: number;
  required: boolean;
  variables: string[];
  conditions: string[];
  consequences: string[];
}

export interface Signature {
  id: string;
  partyId: string;
  type: SignatureType;
  method: SignatureMethod;
  status: SignatureStatus;
  signedAt?: string;
  location?: string;
  witness?: string;
  notary?: string;
  certificate?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  description: string;
  isRequired: boolean;
  isPublic: boolean;
}

export interface DocumentMetadata {
  version: string;
  language: string;
  jurisdiction: string;
  governingLaw: string;
  lastModified: string;
  modifiedBy: string;
  changeLog: ChangeLogEntry[];
  approvals: Approval[];
  reviews: Review[];
  comments: Comment[];
  tags: string[];
  categories: string[];
  keywords: string[];
  summary: string;
  abstract: string;
  tableOfContents: TableOfContentsEntry[];
  crossReferences: CrossReference[];
  relatedDocuments: RelatedDocument[];
  precedents: Precedent[];
  citations: Citation[];
  footnotes: Footnote[];
  endnotes: Endnote[];
  bibliography: BibliographyEntry[];
  index: IndexEntry[];
  glossary: GlossaryEntry[];
  appendices: Appendix[];
  supplements: Supplement[];
}

export interface ChangeLogEntry {
  date: string;
  user: string;
  changes: string[];
  reason: string;
  version: string;
}

export interface Approval {
  id: string;
  approver: string;
  role: string;
  status: ApprovalStatus;
  date: string;
  comments: string;
  conditions: string[];
}

export interface Review {
  id: string;
  reviewer: string;
  role: string;
  status: ReviewStatus;
  date: string;
  comments: string;
  suggestions: string[];
  rating: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  replies: Comment[];
}

export interface TableOfContentsEntry {
  title: string;
  page: number;
  level: number;
  children: TableOfContentsEntry[];
}

export interface CrossReference {
  from: string;
  to: string;
  type: string;
  description: string;
}

export interface RelatedDocument {
  id: string;
  title: string;
  type: string;
  relationship: string;
  url: string;
}

export interface Precedent {
  id: string;
  title: string;
  court: string;
  date: string;
  citation: string;
  relevance: string;
  url: string;
}

export interface Citation {
  id: string;
  type: string;
  source: string;
  date: string;
  page: string;
  url: string;
  relevance: string;
}

export interface Footnote {
  id: string;
  number: number;
  content: string;
  page: number;
}

export interface Endnote {
  id: string;
  number: number;
  content: string;
  section: string;
}

export interface BibliographyEntry {
  id: string;
  type: string;
  title: string;
  author: string;
  date: string;
  publisher: string;
  url: string;
}

export interface IndexEntry {
  term: string;
  page: number;
  subentries: IndexEntry[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  context: string;
  examples: string[];
}

export interface Appendix {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Supplement {
  id: string;
  title: string;
  content: string;
  date: string;
  version: string;
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  description: string;
  required: boolean;
  defaultValue?: string;
  validation: ValidationRule[];
  options?: string[];
}

export interface ValidationRule {
  type: ValidationType;
  value: any;
  message: string;
}

export interface Requirement {
  id: string;
  description: string;
  type: RequirementType;
  mandatory: boolean;
  alternatives: string[];
  documentation: string[];
}

export interface LegalApiRequest {
  documentId?: string;
  propertyId?: string;
  type?: DocumentType;
  filters?: LegalFilters;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface LegalFilters {
  type: DocumentType[];
  status: DocumentStatus[];
  category: DocumentCategory[];
  jurisdiction: string[];
  dateRange: DateRange;
  parties: string[];
  tags: string[];
}

export interface DateRange {
  start: string;
  end: string;
}

export interface LegalApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface LegalApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
}

// Enums
export enum DocumentType {
  LEASE = 'lease',
  PURCHASE_AGREEMENT = 'purchase_agreement',
  SALES_CONTRACT = 'sales_contract',
  RENTAL_AGREEMENT = 'rental_agreement',
  PROPERTY_MANAGEMENT = 'property_management',
  PROPERTY_SALE = 'property_sale',
  PROPERTY_PURCHASE = 'property_purchase',
  PROPERTY_TRANSFER = 'property_transfer',
  PROPERTY_INHERITANCE = 'property_inheritance',
  PROPERTY_GIFT = 'property_gift',
  PROPERTY_DONATION = 'property_donation',
  PROPERTY_EXCHANGE = 'property_exchange',
  PROPERTY_PARTITION = 'property_partition',
  PROPERTY_DIVISION = 'property_division',
  PROPERTY_MERGER = 'property_merger',
  PROPERTY_CONSOLIDATION = 'property_consolidation',
  PROPERTY_SUBDIVISION = 'property_subdivision',
  PROPERTY_DEVELOPMENT = 'property_development',
  PROPERTY_CONSTRUCTION = 'property_construction',
  PROPERTY_RENOVATION = 'property_renovation',
  PROPERTY_MAINTENANCE = 'property_maintenance',
  PROPERTY_INSURANCE = 'property_insurance',
  PROPERTY_TAX = 'property_tax',
  PROPERTY_ASSESSMENT = 'property_assessment',
  PROPERTY_APPRAISAL = 'property_appraisal',
  PROPERTY_INSPECTION = 'property_inspection',
  PROPERTY_SURVEY = 'property_survey',
  PROPERTY_TITLE = 'property_title',
  PROPERTY_DEED = 'property_deed',
  PROPERTY_MORTGAGE = 'property_mortgage',
  PROPERTY_LIEN = 'property_lien',
  PROPERTY_EASEMENT = 'property_easement',
  PROPERTY_RESTRICTION = 'property_restriction',
  PROPERTY_COVENANT = 'property_covenant',
  PROPERTY_CONDITION = 'property_condition',
  PROPERTY_WARRANTY = 'property_warranty',
  PROPERTY_GUARANTEE = 'property_guarantee',
  PROPERTY_INDEMNITY = 'property_indemnity',
  PROPERTY_RELEASE = 'property_release',
  PROPERTY_WAIVER = 'property_waiver',
  PROPERTY_DISCLAIMER = 'property_disclaimer',
  PROPERTY_NOTICE = 'property_notice',
  PROPERTY_DEMAND = 'property_demand',
  PROPERTY_CLAIM = 'property_claim',
  PROPERTY_COMPLAINT = 'property_complaint',
  PROPERTY_PETITION = 'property_petition',
  PROPERTY_APPLICATION = 'property_application',
  PROPERTY_PERMIT = 'property_permit',
  PROPERTY_LICENSE = 'property_license',
  PROPERTY_CERTIFICATE = 'property_certificate',
  PROPERTY_AUTHORIZATION = 'property_authorization',
  PROPERTY_CONSENT = 'property_consent',
  PROPERTY_APPROVAL = 'property_approval',
  PROPERTY_AGREEMENT = 'property_agreement',
  PROPERTY_CONTRACT = 'property_contract',
  PROPERTY_TERMS = 'property_terms',
  PROPERTY_CONDITIONS = 'property_conditions',
  PROPERTY_PROVISIONS = 'property_provisions',
  PROPERTY_CLAUSES = 'property_clauses',
  PROPERTY_SECTIONS = 'property_sections',
  PROPERTY_PARAGRAPHS = 'property_paragraphs',
  PROPERTY_ARTICLES = 'property_articles',
  PROPERTY_SCHEDULES = 'property_schedules',
  PROPERTY_EXHIBITS = 'property_exhibits',
  PROPERTY_APPENDICES = 'property_appendices',
  PROPERTY_ATTACHMENTS = 'property_attachments',
  PROPERTY_ANNEXES = 'property_annexes',
  PROPERTY_SUPPLEMENTS = 'property_supplements',
  PROPERTY_ADDENDA = 'property_addenda',
  PROPERTY_AMENDMENTS = 'property_amendments',
  PROPERTY_MODIFICATIONS = 'property_modifications',
  PROPERTY_VARIATIONS = 'property_variations',
  PROPERTY_CHANGES = 'property_changes',
  PROPERTY_UPDATES = 'property_updates',
  PROPERTY_REVISIONS = 'property_revisions',
  PROPERTY_CORRECTIONS = 'property_corrections',
  PROPERTY_ERATA = 'property_erata',
  PROPERTY_SUPPLEMENTS = 'property_supplements',
  OTHER = 'other'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  SIGNED = 'signed',
  EXECUTED = 'executed',
  FILED = 'filed',
  RECORDED = 'recorded',
  REGISTERED = 'registered',
  PUBLISHED = 'published',
  DISTRIBUTED = 'distributed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUPERSEDED = 'superseded',
  WITHDRAWN = 'withdrawn',
  REJECTED = 'rejected',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ERROR = 'error'
}

export enum DocumentCategory {
  CONTRACT = 'contract',
  AGREEMENT = 'agreement',
  LEASE = 'lease',
  DEED = 'deed',
  MORTGAGE = 'mortgage',
  LIEN = 'lien',
  EASEMENT = 'easement',
  RESTRICTION = 'restriction',
  COVENANT = 'covenant',
  CONDITION = 'condition',
  WARRANTY = 'warranty',
  GUARANTEE = 'guarantee',
  INDEMNITY = 'indemnity',
  RELEASE = 'release',
  WAIVER = 'waiver',
  DISCLAIMER = 'disclaimer',
  NOTICE = 'notice',
  DEMAND = 'demand',
  CLAIM = 'claim',
  COMPLAINT = 'complaint',
  PETITION = 'petition',
  APPLICATION = 'application',
  PERMIT = 'permit',
  LICENSE = 'license',
  CERTIFICATE = 'certificate',
  AUTHORIZATION = 'authorization',
  CONSENT = 'consent',
  APPROVAL = 'approval',
  TERMS = 'terms',
  CONDITIONS = 'conditions',
  PROVISIONS = 'provisions',
  CLAUSES = 'clauses',
  SECTIONS = 'sections',
  PARAGRAPHS = 'paragraphs',
  ARTICLES = 'articles',
  SCHEDULES = 'schedules',
  EXHIBITS = 'exhibits',
  APPENDICES = 'appendices',
  ATTACHMENTS = 'attachments',
  ANNEXES = 'annexes',
  SUPPLEMENTS = 'supplements',
  ADDENDA = 'addenda',
  AMENDMENTS = 'amendments',
  MODIFICATIONS = 'modifications',
  VARIATIONS = 'variations',
  CHANGES = 'changes',
  UPDATES = 'updates',
  REVISIONS = 'revisions',
  CORRECTIONS = 'corrections',
  ERATA = 'erata',
  OTHER = 'other'
}

export enum PartyType {
  INDIVIDUAL = 'individual',
  CORPORATION = 'corporation',
  PARTNERSHIP = 'partnership',
  LLC = 'llc',
  TRUST = 'trust',
  ESTATE = 'estate',
  GOVERNMENT = 'government',
  NON_PROFIT = 'non_profit',
  OTHER = 'other'
}

export enum VariableType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  ADDRESS = 'address',
  NAME = 'name',
  SIGNATURE = 'signature',
  FILE = 'file',
  IMAGE = 'image',
  OTHER = 'other'
}

export enum ValidationType {
  REQUIRED = 'required',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  PATTERN = 'pattern',
  MIN_VALUE = 'min_value',
  MAX_VALUE = 'max_value',
  RANGE = 'range',
  FORMAT = 'format',
  UNIQUE = 'unique',
  CUSTOM = 'custom'
}

export enum RequirementType {
  LEGAL = 'legal',
  REGULATORY = 'regulatory',
  COMPLIANCE = 'compliance',
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  TAX = 'tax',
  INSURANCE = 'insurance',
  ENVIRONMENTAL = 'environmental',
  SAFETY = 'safety',
  SECURITY = 'security',
  PRIVACY = 'privacy',
  DATA_PROTECTION = 'data_protection',
  ACCESSIBILITY = 'accessibility',
  SUSTAINABILITY = 'sustainability',
  OTHER = 'other'
}

export enum ClauseType {
  TERM = 'term',
  CONDITION = 'condition',
  PROVISION = 'provision',
  WARRANTY = 'warranty',
  GUARANTEE = 'guarantee',
  INDEMNITY = 'indemnity',
  RELEASE = 'release',
  WAIVER = 'waiver',
  DISCLAIMER = 'disclaimer',
  NOTICE = 'notice',
  DEMAND = 'demand',
  CLAIM = 'claim',
  REMEDY = 'remedy',
  PENALTY = 'penalty',
  FORFEITURE = 'forfeiture',
  TERMINATION = 'termination',
  RENEWAL = 'renewal',
  MODIFICATION = 'modification',
  ASSIGNMENT = 'assignment',
  DELEGATION = 'delegation',
  SUBCONTRACTING = 'subcontracting',
  FORCE_MAJEURE = 'force_majeure',
  CONFIDENTIALITY = 'confidentiality',
  NON_DISCLOSURE = 'non_disclosure',
  NON_COMPETE = 'non_compete',
  NON_SOLICITATION = 'non_solicitation',
  EXCLUSIVITY = 'exclusivity',
  NON_EXCLUSIVITY = 'non_exclusivity',
  GOVERNING_LAW = 'governing_law',
  JURISDICTION = 'jurisdiction',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  ARBITRATION = 'arbitration',
  MEDIATION = 'mediation',
  LITIGATION = 'litigation',
  SEVERABILITY = 'severability',
  ENTIRE_AGREEMENT = 'entire_agreement',
  INTERPRETATION = 'interpretation',
  DEFINITIONS = 'definitions',
  SCHEDULES = 'schedules',
  EXHIBITS = 'exhibits',
  APPENDICES = 'appendices',
  ATTACHMENTS = 'attachments',
  ANNEXES = 'annexes',
  SUPPLEMENTS = 'supplements',
  ADDENDA = 'addenda',
  AMENDMENTS = 'amendments',
  MODIFICATIONS = 'modifications',
  VARIATIONS = 'variations',
  CHANGES = 'changes',
  UPDATES = 'updates',
  REVISIONS = 'revisions',
  CORRECTIONS = 'corrections',
  ERATA = 'erata',
  OTHER = 'other'
}

export enum SignatureType {
  WET_SIGNATURE = 'wet_signature',
  ELECTRONIC_SIGNATURE = 'electronic_signature',
  DIGITAL_SIGNATURE = 'digital_signature',
  BIOMETRIC_SIGNATURE = 'biometric_signature',
  VOICE_SIGNATURE = 'voice_signature',
  VIDEO_SIGNATURE = 'video_signature',
  OTHER = 'other'
}

export enum SignatureMethod {
  PEN_AND_PAPER = 'pen_and_paper',
  ELECTRONIC_PAD = 'electronic_pad',
  MOBILE_APP = 'mobile_app',
  WEB_BASED = 'web_based',
  EMAIL = 'email',
  SMS = 'sms',
  VOICE = 'voice',
  VIDEO = 'video',
  BIOMETRIC = 'biometric',
  OTHER = 'other'
}

export enum SignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  ERROR = 'error'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CONDITIONAL = 'conditional',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  ERROR = 'error'
}

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  ERROR = 'error'
}

export enum SortBy {
  TITLE = 'title',
  TYPE = 'type',
  STATUS = 'status',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  EFFECTIVE_DATE = 'effective_date',
  EXPIRY_DATE = 'expiry_date',
  PARTY = 'party',
  JURISDICTION = 'jurisdiction'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// Additional interfaces
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
