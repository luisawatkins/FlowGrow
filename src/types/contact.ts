export interface ContactForm {
  id: string;
  propertyId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'text' | 'any';
  preferredViewingTime?: string;
  isPreApproved?: boolean;
  budget?: number;
  timeline?: string;
  additionalInfo?: string;
  attachments?: ContactAttachment[];
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
  response?: ContactResponse;
}

export interface ContactAttachment {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
}

export interface ContactResponse {
  id: string;
  contactId: string;
  responderId: string;
  responderName: string;
  responderEmail: string;
  message: string;
  attachments?: ContactAttachment[];
  createdAt: Date;
}

export enum ContactStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  SCHEDULED = 'scheduled',
  VIEWING_SCHEDULED = 'viewing_scheduled',
  FOLLOW_UP = 'follow_up',
  CLOSED = 'closed',
  SPAM = 'spam'
}

export interface ContactTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactAnalytics {
  totalInquiries: number;
  responseRate: number;
  averageResponseTime: number;
  inquiriesByStatus: Record<ContactStatus, number>;
  inquiriesByMonth: Array<{
    month: string;
    count: number;
  }>;
  topProperties: Array<{
    propertyId: string;
    propertyTitle: string;
    inquiryCount: number;
  }>;
}

export interface ContactFilters {
  status?: ContactStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  propertyId?: string;
  searchTerm?: string;
}

export interface ContactExport {
  format: 'csv' | 'excel' | 'pdf';
  filters?: ContactFilters;
  includeAttachments?: boolean;
}
