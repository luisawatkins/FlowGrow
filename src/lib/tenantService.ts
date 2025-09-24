import {
  Tenant,
  Lease,
  RentPayment,
  MaintenanceRequest,
  Vendor,
  PropertyUnit,
  PropertyManager,
  TenantPortal,
  Announcement,
  PropertyManagementDashboard,
  Activity,
  Task,
  Alert,
  Inspection,
  PropertyManagementSettings
} from '@/types/propertyManagement';

// Mock data for development
const mockTenants: Tenant[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    dateOfBirth: '1985-03-15',
    ssn: '***-**-1234',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1-555-0102',
      relationship: 'Spouse'
    },
    employment: {
      company: 'Tech Corp',
      position: 'Software Engineer',
      monthlyIncome: 8000,
      startDate: '2020-01-15',
      supervisorName: 'Mike Johnson',
      supervisorPhone: '+1-555-0103'
    },
    references: [
      {
        id: '1',
        name: 'Sarah Wilson',
        relationship: 'Previous Landlord',
        phone: '+1-555-0104',
        email: 'sarah@email.com',
        yearsKnown: 2,
        rating: 5,
        comments: 'Excellent tenant, always paid on time',
        isVerified: true
      }
    ],
    creditScore: 750,
    backgroundCheck: {
      status: 'approved',
      date: '2023-01-15',
      notes: 'Clean background check'
    },
    moveInDate: '2023-02-01',
    status: 'active',
    leaseId: 'lease-1',
    notes: 'Responsible tenant, no issues',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-15'
  }
];

const mockLeases: Lease[] = [
  {
    id: 'lease-1',
    propertyId: 'prop-1',
    tenantId: '1',
    startDate: '2023-02-01',
    endDate: '2024-01-31',
    monthlyRent: 2500,
    securityDeposit: 2500,
    petDeposit: 500,
    lateFee: 50,
    gracePeriod: 5,
    leaseTerms: [
      {
        id: '1',
        type: 'rent',
        description: 'Monthly rent payment',
        amount: 2500,
        frequency: 'monthly',
        dueDate: '1st of each month',
        isRequired: true
      }
    ],
    utilities: [
      {
        id: '1',
        name: 'Electricity',
        type: 'electric',
        isIncluded: false,
        monthlyCost: 150,
        provider: 'Local Electric Co',
        accountNumber: 'ACC123456'
      },
      {
        id: '2',
        name: 'Water',
        type: 'water',
        isIncluded: true,
        monthlyCost: 0
      }
    ],
    parkingSpaces: 1,
    petPolicy: {
      allowed: true,
      types: ['dog', 'cat'],
      sizeLimit: 'Medium',
      weightLimit: 50,
      additionalDeposit: 500,
      monthlyFee: 25,
      restrictions: ['No aggressive breeds']
    },
    renewalOptions: [
      {
        id: '1',
        termLength: 12,
        newRent: 2600,
        effectiveDate: '2024-02-01',
        isAutomatic: false,
        noticeRequired: 60
      }
    ],
    status: 'active',
    signedDate: '2023-01-15',
    documents: [],
    notes: 'Standard lease agreement',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-15'
  }
];

const mockRentPayments: RentPayment[] = [
  {
    id: '1',
    tenantId: '1',
    propertyId: 'prop-1',
    leaseId: 'lease-1',
    amount: 2500,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    paymentMethod: 'bank_transfer',
    status: 'paid',
    notes: 'On-time payment',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    tenantId: '1',
    propertyId: 'prop-1',
    leaseId: 'lease-1',
    amount: 2500,
    dueDate: '2024-02-01',
    status: 'pending',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    tenantId: '1',
    title: 'Kitchen Sink Leak',
    description: 'The kitchen sink has a slow leak under the cabinet',
    category: 'plumbing',
    priority: 'medium',
    status: 'submitted',
    submittedDate: '2024-01-10',
    photos: [],
    tenantAccess: true,
    followUpRequired: false,
    notes: 'Tenant reported leak this morning',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Quick Fix Plumbing',
    contactPerson: 'Bob Johnson',
    email: 'bob@quickfixplumbing.com',
    phone: '+1-555-0200',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210'
    },
    specialties: ['plumbing', 'hvac'],
    licenseNumber: 'PL123456',
    insuranceInfo: {
      provider: 'Insurance Co',
      policyNumber: 'POL123456',
      expirationDate: '2024-12-31'
    },
    rating: 4.8,
    reviewCount: 45,
    hourlyRate: 85,
    isVerified: true,
    isActive: true,
    notes: 'Reliable and fast service',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  }
];

export class TenantService {
  // Tenant Management
  static async getTenants(propertyId?: string): Promise<Tenant[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (propertyId) {
      return mockTenants.filter(tenant => tenant.propertyId === propertyId);
    }
    return mockTenants;
  }

  static async getTenantById(id: string): Promise<Tenant | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTenants.find(tenant => tenant.id === id) || null;
  }

  static async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTenant: Tenant = {
      id: Date.now().toString(),
      propertyId: tenantData.propertyId || '',
      firstName: tenantData.firstName || '',
      lastName: tenantData.lastName || '',
      email: tenantData.email || '',
      phone: tenantData.phone || '',
      dateOfBirth: tenantData.dateOfBirth || '',
      ssn: tenantData.ssn || '',
      emergencyContact: tenantData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      employment: tenantData.employment || {
        company: '',
        position: '',
        monthlyIncome: 0,
        startDate: '',
        supervisorName: '',
        supervisorPhone: ''
      },
      references: tenantData.references || [],
      creditScore: tenantData.creditScore || 0,
      backgroundCheck: tenantData.backgroundCheck || {
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      },
      moveInDate: tenantData.moveInDate || '',
      status: 'prospective',
      notes: tenantData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTenants.push(newTenant);
    return newTenant;
  }

  static async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tenantIndex = mockTenants.findIndex(tenant => tenant.id === id);
    if (tenantIndex === -1) return null;
    
    mockTenants[tenantIndex] = { ...mockTenants[tenantIndex], ...updates };
    return mockTenants[tenantIndex];
  }

  // Lease Management
  static async getLeases(propertyId?: string): Promise<Lease[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (propertyId) {
      return mockLeases.filter(lease => lease.propertyId === propertyId);
    }
    return mockLeases;
  }

  static async getLeaseById(id: string): Promise<Lease | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLeases.find(lease => lease.id === id) || null;
  }

  static async createLease(leaseData: Partial<Lease>): Promise<Lease> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newLease: Lease = {
      id: Date.now().toString(),
      propertyId: leaseData.propertyId || '',
      tenantId: leaseData.tenantId || '',
      startDate: leaseData.startDate || '',
      endDate: leaseData.endDate || '',
      monthlyRent: leaseData.monthlyRent || 0,
      securityDeposit: leaseData.securityDeposit || 0,
      lateFee: leaseData.lateFee || 0,
      gracePeriod: leaseData.gracePeriod || 5,
      leaseTerms: leaseData.leaseTerms || [],
      utilities: leaseData.utilities || [],
      parkingSpaces: leaseData.parkingSpaces || 0,
      petPolicy: leaseData.petPolicy || {
        allowed: false,
        types: [],
        restrictions: []
      },
      renewalOptions: leaseData.renewalOptions || [],
      status: 'draft',
      documents: leaseData.documents || [],
      notes: leaseData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockLeases.push(newLease);
    return newLease;
  }

  // Rent Payment Management
  static async getRentPayments(tenantId?: string, propertyId?: string): Promise<RentPayment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredPayments = [...mockRentPayments];
    
    if (tenantId) {
      filteredPayments = filteredPayments.filter(payment => payment.tenantId === tenantId);
    }
    
    if (propertyId) {
      filteredPayments = filteredPayments.filter(payment => payment.propertyId === propertyId);
    }
    
    return filteredPayments;
  }

  static async createRentPayment(paymentData: Partial<RentPayment>): Promise<RentPayment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPayment: RentPayment = {
      id: Date.now().toString(),
      tenantId: paymentData.tenantId || '',
      propertyId: paymentData.propertyId || '',
      leaseId: paymentData.leaseId || '',
      amount: paymentData.amount || 0,
      dueDate: paymentData.dueDate || '',
      paymentMethod: paymentData.paymentMethod || 'check',
      status: 'pending',
      notes: paymentData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockRentPayments.push(newPayment);
    return newPayment;
  }

  static async updateRentPayment(id: string, updates: Partial<RentPayment>): Promise<RentPayment | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paymentIndex = mockRentPayments.findIndex(payment => payment.id === id);
    if (paymentIndex === -1) return null;
    
    mockRentPayments[paymentIndex] = { ...mockRentPayments[paymentIndex], ...updates };
    return mockRentPayments[paymentIndex];
  }

  // Maintenance Request Management
  static async getMaintenanceRequests(propertyId?: string, tenantId?: string): Promise<MaintenanceRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredRequests = [...mockMaintenanceRequests];
    
    if (propertyId) {
      filteredRequests = filteredRequests.filter(request => request.propertyId === propertyId);
    }
    
    if (tenantId) {
      filteredRequests = filteredRequests.filter(request => request.tenantId === tenantId);
    }
    
    return filteredRequests;
  }

  static async createMaintenanceRequest(requestData: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      propertyId: requestData.propertyId || '',
      tenantId: requestData.tenantId || '',
      title: requestData.title || '',
      description: requestData.description || '',
      category: requestData.category || 'other',
      priority: requestData.priority || 'medium',
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      photos: requestData.photos || [],
      tenantAccess: requestData.tenantAccess || true,
      followUpRequired: requestData.followUpRequired || false,
      notes: requestData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockMaintenanceRequests.push(newRequest);
    return newRequest;
  }

  static async updateMaintenanceRequest(id: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const requestIndex = mockMaintenanceRequests.findIndex(request => request.id === id);
    if (requestIndex === -1) return null;
    
    mockMaintenanceRequests[requestIndex] = { ...mockMaintenanceRequests[requestIndex], ...updates };
    return mockMaintenanceRequests[requestIndex];
  }

  // Vendor Management
  static async getVendors(): Promise<Vendor[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVendors;
  }

  static async getVendorById(id: string): Promise<Vendor | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVendors.find(vendor => vendor.id === id) || null;
  }

  // Tenant Portal
  static async getTenantPortal(tenantId: string): Promise<TenantPortal | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) return null;
    
    const rentPayments = await this.getRentPayments(tenantId);
    const maintenanceRequests = await this.getMaintenanceRequests(undefined, tenantId);
    
    return {
      tenantId,
      propertyId: tenant.propertyId,
      leaseId: tenant.leaseId || '',
      dashboard: {
        upcomingPayments: rentPayments.filter(payment => payment.status === 'pending'),
        recentMaintenanceRequests: maintenanceRequests.slice(0, 5),
        announcements: [],
        documents: []
      },
      features: {
        rentPayment: true,
        maintenanceRequests: true,
        documentAccess: true,
        announcements: true,
        leaseRenewal: true,
        moveOut: true
      },
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'en',
        timezone: 'America/Los_Angeles'
      }
    };
  }

  // Property Management Dashboard
  static async getPropertyManagementDashboard(propertyId: string): Promise<PropertyManagementDashboard> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const tenants = await this.getTenants(propertyId);
    const leases = await this.getLeases(propertyId);
    const rentPayments = await this.getRentPayments(undefined, propertyId);
    const maintenanceRequests = await this.getMaintenanceRequests(propertyId);
    
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    const totalRent = leases.reduce((sum, lease) => sum + lease.monthlyRent, 0);
    const collectedRent = rentPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      propertyId,
      overview: {
        totalUnits: 10,
        occupiedUnits: activeTenants,
        vacantUnits: 10 - activeTenants,
        occupancyRate: (activeTenants / 10) * 100,
        monthlyRent: totalRent,
        monthlyExpenses: 5000,
        netIncome: totalRent - 5000
      },
      tenants: {
        active: activeTenants,
        new: tenants.filter(t => t.status === 'prospective').length,
        departing: tenants.filter(t => t.status === 'inactive').length,
        overdue: rentPayments.filter(p => p.status === 'overdue').length
      },
      maintenance: {
        open: maintenanceRequests.filter(r => r.status === 'submitted').length,
        inProgress: maintenanceRequests.filter(r => r.status === 'in_progress').length,
        completed: maintenanceRequests.filter(r => r.status === 'completed').length,
        overdue: maintenanceRequests.filter(r => r.status === 'submitted' && 
          new Date(r.submittedDate) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
      },
      financials: {
        rentCollected: collectedRent,
        rentDue: totalRent - collectedRent,
        expenses: 5000,
        profit: collectedRent - 5000
      },
      recentActivity: [],
      upcomingTasks: [],
      alerts: []
    };
  }

  // Utility Functions
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static calculateDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static getMaintenanceStatusColor(status: string): string {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
