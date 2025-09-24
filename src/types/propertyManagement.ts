export interface Tenant {
  id: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string; // Encrypted
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  employment: {
    company: string;
    position: string;
    monthlyIncome: number;
    startDate: string;
    supervisorName: string;
    supervisorPhone: string;
  };
  references: TenantReference[];
  creditScore: number;
  backgroundCheck: {
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    notes?: string;
  };
  moveInDate: string;
  moveOutDate?: string;
  status: 'prospective' | 'active' | 'inactive' | 'evicted';
  leaseId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantReference {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  yearsKnown: number;
  rating: number;
  comments: string;
  isVerified: boolean;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  petDeposit?: number;
  lateFee: number;
  gracePeriod: number; // days
  leaseTerms: LeaseTerm[];
  utilities: Utility[];
  parkingSpaces: number;
  petPolicy: PetPolicy;
  renewalOptions: RenewalOption[];
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
  signedDate?: string;
  terminationDate?: string;
  terminationReason?: string;
  notes: string;
  documents: LeaseDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaseTerm {
  id: string;
  type: 'rent' | 'deposit' | 'fee' | 'utility' | 'maintenance' | 'other';
  description: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  dueDate?: string;
  isRequired: boolean;
}

export interface Utility {
  id: string;
  name: string;
  type: 'electric' | 'gas' | 'water' | 'sewer' | 'trash' | 'internet' | 'cable' | 'other';
  isIncluded: boolean;
  monthlyCost?: number;
  provider?: string;
  accountNumber?: string;
  notes?: string;
}

export interface PetPolicy {
  allowed: boolean;
  types: string[];
  sizeLimit?: string;
  weightLimit?: number;
  additionalDeposit?: number;
  monthlyFee?: number;
  restrictions: string[];
}

export interface RenewalOption {
  id: string;
  termLength: number; // months
  newRent: number;
  effectiveDate: string;
  isAutomatic: boolean;
  noticeRequired: number; // days
}

export interface LeaseDocument {
  id: string;
  name: string;
  type: 'lease' | 'addendum' | 'notice' | 'inspection' | 'other';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedDate: string;
  signedDate?: string;
  isRequired: boolean;
  status: 'draft' | 'pending' | 'signed' | 'expired';
}

export interface RentPayment {
  id: string;
  tenantId: string;
  propertyId: string;
  leaseId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  paymentMethod: 'check' | 'cash' | 'bank_transfer' | 'credit_card' | 'online';
  status: 'pending' | 'paid' | 'late' | 'partial' | 'overdue';
  lateFee?: number;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  unitId?: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  submittedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  assignedVendor?: string;
  estimatedCost?: number;
  actualCost?: number;
  photos: string[];
  tenantAccess: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialties: string[];
  licenseNumber?: string;
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
  };
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  isVerified: boolean;
  isActive: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  rent: number;
  deposit: number;
  status: 'available' | 'occupied' | 'maintenance' | 'renovation';
  tenantId?: string;
  leaseId?: string;
  moveInDate?: string;
  moveOutDate?: string;
  amenities: string[];
  photos: string[];
  floorPlan?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  properties: string[];
  permissions: PropertyManagerPermission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyManagerPermission {
  id: string;
  type: 'tenant_management' | 'maintenance' | 'financial' | 'reporting' | 'admin';
  level: 'read' | 'write' | 'admin';
  propertyIds: string[];
}

export interface TenantPortal {
  tenantId: string;
  propertyId: string;
  leaseId: string;
  dashboard: {
    upcomingPayments: RentPayment[];
    recentMaintenanceRequests: MaintenanceRequest[];
    announcements: Announcement[];
    documents: LeaseDocument[];
  };
  features: {
    rentPayment: boolean;
    maintenanceRequests: boolean;
    documentAccess: boolean;
    announcements: boolean;
    leaseRenewal: boolean;
    moveOut: boolean;
  };
  lastLogin: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
}

export interface Announcement {
  id: string;
  propertyId: string;
  title: string;
  message: string;
  type: 'general' | 'maintenance' | 'emergency' | 'policy' | 'event';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'tenants' | 'owners' | 'managers';
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyManagementDashboard {
  propertyId: string;
  overview: {
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    occupancyRate: number;
    monthlyRent: number;
    monthlyExpenses: number;
    netIncome: number;
  };
  tenants: {
    active: number;
    new: number;
    departing: number;
    overdue: number;
  };
  maintenance: {
    open: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  financials: {
    rentCollected: number;
    rentDue: number;
    expenses: number;
    profit: number;
  };
  recentActivity: Activity[];
  upcomingTasks: Task[];
  alerts: Alert[];
}

export interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'lease' | 'tenant' | 'property';
  description: string;
  propertyId: string;
  tenantId?: string;
  amount?: number;
  date: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'maintenance' | 'inspection' | 'lease' | 'payment' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  propertyId: string;
  tenantId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  type: 'payment_overdue' | 'maintenance_urgent' | 'lease_expiring' | 'inspection_due' | 'other';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  propertyId: string;
  tenantId?: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  type: 'move_in' | 'move_out' | 'routine' | 'damage' | 'safety' | 'other';
  scheduledDate: string;
  completedDate?: string;
  inspector: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  findings: InspectionFinding[];
  photos: string[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionFinding {
  id: string;
  category: 'cleanliness' | 'damage' | 'safety' | 'maintenance' | 'other';
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  cost?: number;
  isRepaired: boolean;
  repairDate?: string;
  photos: string[];
  notes: string;
}

export interface PropertyManagementSettings {
  propertyId: string;
  rentCollection: {
    gracePeriod: number;
    lateFee: number;
    lateFeeType: 'fixed' | 'percentage';
    autoReminders: boolean;
    reminderDays: number[];
  };
  maintenance: {
    autoAssignment: boolean;
    defaultVendor: string;
    approvalRequired: boolean;
    maxCostWithoutApproval: number;
  };
  communications: {
    defaultLanguage: string;
    autoNotifications: boolean;
    notificationTypes: string[];
  };
  reporting: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    includeCharts: boolean;
  };
}
