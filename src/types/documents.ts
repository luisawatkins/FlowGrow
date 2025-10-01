// Document Management Types
// Comprehensive type definitions for property document management

export interface PropertyDocument {
  id: string;
  propertyId: string;
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  file: DocumentFile;
  metadata: DocumentMetadata;
  permissions: DocumentPermissions;
  tags: string[];
  isPublic: boolean;
  isRequired: boolean;
  isExpired: boolean;
  expirationDate?: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  previousVersions: DocumentVersion[];
}

export interface DocumentFile {
  id: string;
  name: string;
  originalName: string;
  size: number; // in bytes
  mimeType: string;
  extension: string;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  checksum: string;
  isEncrypted: boolean;
  encryptionKey?: string;
  storageProvider: StorageProvider;
  storagePath: string;
  uploadedAt: string;
}

export interface DocumentMetadata {
  author?: string;
  createdDate?: string;
  modifiedDate?: string;
  subject?: string;
  keywords?: string[];
  language?: string;
  pageCount?: number;
  wordCount?: number;
  characterCount?: number;
  customFields: Record<string, any>;
  ocrText?: string;
  extractedData?: ExtractedData;
}

export interface ExtractedData {
  text: string;
  entities: ExtractedEntity[];
  tables: ExtractedTable[];
  images: ExtractedImage[];
  signatures: ExtractedSignature[];
  dates: ExtractedDate[];
  amounts: ExtractedAmount[];
  addresses: ExtractedAddress[];
}

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  confidence: number;
  position: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedTable {
  id: string;
  page: number;
  rows: number;
  columns: number;
  data: string[][];
  headers: string[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedImage {
  id: string;
  page: number;
  url: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedSignature {
  id: string;
  page: number;
  signer?: string;
  date?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedDate {
  value: string;
  formatted: string;
  confidence: number;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedAmount {
  value: number;
  currency: string;
  formatted: string;
  confidence: number;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ExtractedAddress {
  value: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  confidence: number;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DocumentPermissions {
  owner: string;
  viewers: string[];
  editors: string[];
  admins: string[];
  publicAccess: boolean;
  allowDownload: boolean;
  allowPrint: boolean;
  allowCopy: boolean;
  allowEdit: boolean;
  allowShare: boolean;
  watermark: boolean;
  expirationDate?: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  file: DocumentFile;
  changes: string;
  uploadedBy: string;
  uploadedAt: string;
  isCurrent: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  template: DocumentTemplateContent;
  fields: TemplateField[];
  isPublic: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplateContent {
  html: string;
  css: string;
  javascript?: string;
  variables: string[];
  sections: TemplateSection[];
}

export interface TemplateField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: string[];
  defaultValue?: any;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: SectionType;
  content: string;
  fields: string[];
  isRequired: boolean;
  order: number;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: string;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  order: number;
  assignee?: string;
  assigneeType: AssigneeType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isRequired: boolean;
  timeout?: number; // in hours
}

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  conditions: TriggerCondition[];
  isActive: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: LogicalOperator;
}

export interface WorkflowAction {
  type: ActionType;
  parameters: Record<string, any>;
  order: number;
}

export interface TriggerCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signerEmail: string;
  signatureType: SignatureType;
  signatureData: string;
  position: SignaturePosition;
  status: SignatureStatus;
  signedAt?: string;
  expiresAt?: string;
  ipAddress?: string;
  userAgent?: string;
  certificate?: DigitalCertificate;
}

export interface SignaturePosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DigitalCertificate {
  issuer: string;
  subject: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  fingerprint: string;
}

export interface DocumentAuditLog {
  id: string;
  documentId: string;
  action: AuditAction;
  userId: string;
  userName: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface DocumentSearchRequest {
  query?: string;
  propertyId?: string;
  type?: DocumentType;
  category?: DocumentCategory;
  status?: DocumentStatus;
  tags?: string[];
  uploadedBy?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  isPublic?: boolean;
  isRequired?: boolean;
  isExpired?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'uploadedAt' | 'size' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentSearchResponse {
  documents: PropertyDocument[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  facets: SearchFacets;
}

export interface SearchFacets {
  types: FacetCount[];
  categories: FacetCount[];
  statuses: FacetCount[];
  tags: FacetCount[];
  uploaders: FacetCount[];
}

export interface FacetCount {
  value: string;
  count: number;
}

// Enums
export enum DocumentType {
  CONTRACT = 'contract',
  DEED = 'deed',
  MORTGAGE = 'mortgage',
  INSURANCE = 'insurance',
  INSPECTION = 'inspection',
  APPRAISAL = 'appraisal',
  TAX_DOCUMENT = 'tax_document',
  PERMIT = 'permit',
  SURVEY = 'survey',
  TITLE_INSURANCE = 'title_insurance',
  CLOSING_DOCUMENT = 'closing_document',
  LEASE = 'lease',
  RENTAL_AGREEMENT = 'rental_agreement',
  MAINTENANCE_RECORD = 'maintenance_record',
  UTILITY_BILL = 'utility_bill',
  HOA_DOCUMENT = 'hoa_document',
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

export enum DocumentCategory {
  LEGAL = 'legal',
  FINANCIAL = 'financial',
  INSURANCE = 'insurance',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  TAX = 'tax',
  PERMIT = 'permit',
  MEDIA = 'media',
  CORRESPONDENCE = 'correspondence',
  OTHER = 'other'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum StorageProvider {
  LOCAL = 'local',
  AWS_S3 = 'aws_s3',
  GOOGLE_CLOUD = 'google_cloud',
  AZURE_BLOB = 'azure_blob',
  CLOUDFLARE_R2 = 'cloudflare_r2'
}

export enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  LOCATION = 'location',
  DATE = 'date',
  MONEY = 'money',
  PERCENTAGE = 'percentage',
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
  ADDRESS = 'address',
  PROPERTY_ID = 'property_id',
  CONTRACT_NUMBER = 'contract_number',
  OTHER = 'other'
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE = 'file',
  SIGNATURE = 'signature',
  RICH_TEXT = 'rich_text'
}

export enum SectionType {
  HEADER = 'header',
  PARAGRAPH = 'paragraph',
  TABLE = 'table',
  LIST = 'list',
  IMAGE = 'image',
  SIGNATURE = 'signature',
  CUSTOM = 'custom'
}

export enum WorkflowType {
  APPROVAL = 'approval',
  REVIEW = 'review',
  SIGNATURE = 'signature',
  NOTIFICATION = 'notification',
  AUTOMATION = 'automation'
}

export enum StepType {
  REVIEW = 'review',
  APPROVAL = 'approval',
  SIGNATURE = 'signature',
  NOTIFICATION = 'notification',
  CONDITION = 'condition',
  ACTION = 'action'
}

export enum AssigneeType {
  USER = 'user',
  ROLE = 'role',
  GROUP = 'group',
  EMAIL = 'email',
  SYSTEM = 'system'
}

export enum TriggerType {
  UPLOAD = 'upload',
  UPDATE = 'update',
  STATUS_CHANGE = 'status_change',
  EXPIRATION = 'expiration',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty'
}

export enum LogicalOperator {
  AND = 'and',
  OR = 'or'
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  CREATE_TASK = 'create_task',
  UPDATE_STATUS = 'update_status',
  ASSIGN_USER = 'assign_user',
  GENERATE_DOCUMENT = 'generate_document',
  ARCHIVE_DOCUMENT = 'archive_document',
  DELETE_DOCUMENT = 'delete_document',
  WEBHOOK = 'webhook'
}

export enum SignatureType {
  ELECTRONIC = 'electronic',
  DIGITAL = 'digital',
  WET_SIGNATURE = 'wet_signature',
  CLICK_TO_SIGN = 'click_to_sign',
  DRAW_SIGNATURE = 'draw_signature',
  UPLOAD_SIGNATURE = 'upload_signature'
}

export enum SignatureStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  VIEWED = 'viewed',
  DOWNLOADED = 'downloaded',
  SHARED = 'shared',
  SIGNED = 'signed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
  RESTORED = 'restored'
}

// API Types
export interface UploadDocumentRequest {
  propertyId: string;
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  tags?: string[];
  isPublic?: boolean;
  isRequired?: boolean;
  expirationDate?: string;
  permissions?: Partial<DocumentPermissions>;
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  type?: DocumentType;
  category?: DocumentCategory;
  tags?: string[];
  isPublic?: boolean;
  isRequired?: boolean;
  expirationDate?: string;
  permissions?: Partial<DocumentPermissions>;
}

export interface DocumentShareRequest {
  documentId: string;
  recipients: string[];
  permissions: {
    allowDownload: boolean;
    allowPrint: boolean;
    allowCopy: boolean;
    allowEdit: boolean;
  };
  expirationDate?: string;
  message?: string;
}

// Hook Types
export interface UseDocumentManagementReturn {
  documents: PropertyDocument[];
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File, request: UploadDocumentRequest) => Promise<PropertyDocument>;
  updateDocument: (id: string, request: UpdateDocumentRequest) => Promise<PropertyDocument>;
  deleteDocument: (id: string) => Promise<void>;
  searchDocuments: (request: DocumentSearchRequest) => Promise<DocumentSearchResponse>;
  getDocument: (id: string) => Promise<PropertyDocument | null>;
  clearError: () => void;
}

export interface UseDocumentTemplatesReturn {
  templates: DocumentTemplate[];
  loading: boolean;
  error: string | null;
  getTemplates: (category?: DocumentCategory) => Promise<void>;
  getTemplate: (id: string) => Promise<DocumentTemplate | null>;
  createTemplate: (template: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DocumentTemplate>;
  clearError: () => void;
}

export interface UseDocumentWorkflowsReturn {
  workflows: DocumentWorkflow[];
  loading: boolean;
  error: string | null;
  getWorkflows: () => Promise<void>;
  createWorkflow: (workflow: Omit<DocumentWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DocumentWorkflow>;
  updateWorkflow: (id: string, updates: Partial<DocumentWorkflow>) => Promise<DocumentWorkflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  clearError: () => void;
}

// Error Types
export interface DocumentError {
  code: string;
  message: string;
  details?: any;
}

export interface DocumentApiError extends DocumentError {
  status: number;
  timestamp: string;
}
