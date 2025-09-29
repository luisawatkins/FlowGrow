import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PropertyManagement,
  TenantInfo,
  MaintenanceRequest,
  AutomationTask,
  AutomationResult,
  TenantProfile,
  LeaseAgreement,
  TenantCommunication,
  PropertyPerformance,
  AutomationStats,
  PropertyAnalytics,
  TenantAnalytics,
  AutomationAnalytics,
  PropertyManagementDashboard,
  PropertyManagementNotification,
  PropertyManagementError,
  MaintenancePriority,
  MaintenanceStatus,
  AutomationTaskType,
  ScheduleType,
  VerificationStatus,
  KYCStatus,
  AMLStatus,
  LeaseStatus,
  CommunicationType,
  CommunicationPriority,
  EmploymentType
} from '@/types/propertyManagement';
import { propertyManagementService } from '@/lib/propertyManagementService';

interface UsePropertyManagementReturn {
  // State
  properties: PropertyManagement[];
  tenants: TenantInfo[];
  maintenanceRequests: MaintenanceRequest[];
  automationTasks: AutomationTask[];
  tenantProfiles: TenantProfile[];
  leaseAgreements: LeaseAgreement[];
  communications: TenantCommunication[];
  dashboard: PropertyManagementDashboard | null;
  analytics: {
    property: PropertyAnalytics | null;
    tenant: TenantAnalytics | null;
    automation: AutomationAnalytics | null;
  };
  notifications: PropertyManagementNotification[];
  
  // Loading states
  loading: {
    properties: boolean;
    tenants: boolean;
    maintenance: boolean;
    automation: boolean;
    dashboard: boolean;
    analytics: boolean;
  };
  
  // Error states
  errors: {
    properties: string | null;
    tenants: string | null;
    maintenance: string | null;
    automation: string | null;
    dashboard: string | null;
    analytics: string | null;
  };
  
  // Property management actions
  registerProperty: (propertyData: {
    propertyId: number;
    manager?: string;
    rentAmount: number;
    rentDueDate: number;
    maintenanceFund: number;
  }) => Promise<boolean>;
  
  getPropertyInfo: (propertyId: number) => Promise<PropertyManagement | null>;
  
  getPropertyPerformance: (propertyId: number) => Promise<PropertyPerformance | null>;
  
  // Tenant management actions
  addTenant: (tenantData: {
    tenantId: number;
    propertyId: number;
    tenantAddress: string;
    leaseStartDate: number;
    leaseEndDate: number;
    monthlyRent: number;
    securityDeposit: number;
  }) => Promise<boolean>;
  
  getTenantInfo: (tenantId: number) => Promise<TenantInfo | null>;
  
  processRentPayment: (paymentData: {
    tenantId: number;
    amount: number;
    paymentType: string;
  }) => Promise<boolean>;
  
  registerTenant: (tenantData: {
    tenantId: number;
    address: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: number;
    ssn: string;
    employmentInfo: {
      employer: string;
      position: string;
      startDate: number;
      salary: number;
      employmentType: EmploymentType;
      employerContact: string;
    };
    creditScore: number;
    income: number;
    references: Array<{
      referenceId: number;
      name: string;
      relationship: string;
      contact: string;
    }>;
  }) => Promise<boolean>;
  
  // Maintenance management actions
  createMaintenanceRequest: (requestData: {
    requestId: number;
    propertyId: number;
    tenantId?: number;
    description: string;
    priority: MaintenancePriority;
    estimatedCost: number;
  }) => Promise<boolean>;
  
  updateMaintenanceRequest: (updateData: {
    requestId: number;
    status: MaintenanceStatus;
    assignedVendor?: string;
    actualCost?: number;
  }) => Promise<boolean>;
  
  getMaintenanceRequest: (requestId: number) => Promise<MaintenanceRequest | null>;
  
  // Automation management actions
  createAutomationTask: (taskData: {
    taskId: number;
    taskType: AutomationTaskType;
    propertyId: number;
    schedule: {
      scheduleType: ScheduleType;
      interval: number;
      startTime: number;
      endTime?: number;
      timezone: string;
      customSchedule?: Record<string, string>;
    };
    parameters: Record<string, string>;
  }) => Promise<boolean>;
  
  executeTask: (taskId: number) => Promise<AutomationResult | null>;
  
  toggleTask: (taskId: number, isActive: boolean) => Promise<boolean>;
  
  // Lease management actions
  createLeaseAgreement: (leaseData: {
    leaseId: number;
    tenantId: number;
    propertyId: number;
    landlordAddress: string;
    startDate: number;
    endDate: number;
    monthlyRent: number;
    securityDeposit: number;
    petDeposit: number;
    lateFee: number;
    leaseTerms: Record<string, string>;
  }) => Promise<boolean>;
  
  signLeaseAgreement: (leaseId: number) => Promise<boolean>;
  
  terminateLeaseAgreement: (leaseId: number, terminationReason: string) => Promise<boolean>;
  
  // Communication actions
  sendCommunication: (communicationData: {
    communicationId: number;
    tenantId: number;
    propertyId: number;
    sender: string;
    recipient: string;
    messageType: CommunicationType;
    subject: string;
    message: string;
    priority: CommunicationPriority;
  }) => Promise<boolean>;
  
  markCommunicationAsRead: (tenantId: number, communicationId: number) => Promise<boolean>;
  
  // Data refresh actions
  refreshProperties: () => Promise<void>;
  refreshTenants: () => Promise<void>;
  refreshMaintenance: () => Promise<void>;
  refreshAutomation: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Utility actions
  clearErrors: () => void;
  addNotification: (notification: Omit<PropertyManagementNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (notificationId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

export const usePropertyManagement = (): UsePropertyManagementReturn => {
  // State
  const [properties, setProperties] = useState<PropertyManagement[]>([]);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([]);
  const [tenantProfiles, setTenantProfiles] = useState<TenantProfile[]>([]);
  const [leaseAgreements, setLeaseAgreements] = useState<LeaseAgreement[]>([]);
  const [communications, setCommunications] = useState<TenantCommunication[]>([]);
  const [dashboard, setDashboard] = useState<PropertyManagementDashboard | null>(null);
  const [analytics, setAnalytics] = useState<{
    property: PropertyAnalytics | null;
    tenant: TenantAnalytics | null;
    automation: AutomationAnalytics | null;
  }>({
    property: null,
    tenant: null,
    automation: null
  });
  const [notifications, setNotifications] = useState<PropertyManagementNotification[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    properties: false,
    tenants: false,
    maintenance: false,
    automation: false,
    dashboard: false,
    analytics: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    properties: null as string | null,
    tenants: null as string | null,
    maintenance: null as string | null,
    automation: null as string | null,
    dashboard: null as string | null,
    analytics: null as string | null
  });
  
  // Refs for cleanup
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to handle API responses
  const handleApiResponse = <T>(
    response: { success: boolean; data?: T; error?: string },
    setData: (data: T) => void,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void
  ): T | null => {
    setLoading(false);
    
    if (response.success && response.data) {
      setData(response.data);
      setError(null);
      return response.data;
    } else {
      setError(response.error || 'An error occurred');
      return null;
    }
  };
  
  // Property management actions
  const registerProperty = useCallback(async (propertyData: {
    propertyId: number;
    manager?: string;
    rentAmount: number;
    rentDueDate: number;
    maintenanceFund: number;
  }): Promise<boolean> => {
    setLoading(prev => ({ ...prev, properties: true }));
    
    const response = await propertyManagementService.registerProperty(propertyData);
    const result = handleApiResponse(
      response,
      (data) => setProperties(prev => [...prev, data]),
      (error) => setErrors(prev => ({ ...prev, properties: error })),
      (loading) => setLoading(prev => ({ ...prev, properties: loading }))
    );
    
    if (result) {
      addNotification({
        type: 'PROPERTY_REGISTERED',
        title: 'Property Registered',
        message: `Property ${propertyData.propertyId} has been successfully registered`,
        propertyId: propertyData.propertyId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return !!result;
  }, []);
  
  const getPropertyInfo = useCallback(async (propertyId: number): Promise<PropertyManagement | null> => {
    setLoading(prev => ({ ...prev, properties: true }));
    
    const response = await propertyManagementService.getPropertyInfo(propertyId);
    return handleApiResponse(
      response,
      () => {}, // Don't update state for single property fetch
      (error) => setErrors(prev => ({ ...prev, properties: error })),
      (loading) => setLoading(prev => ({ ...prev, properties: loading }))
    );
  }, []);
  
  const getPropertyPerformance = useCallback(async (propertyId: number): Promise<PropertyPerformance | null> => {
    const response = await propertyManagementService.getPropertyPerformance(propertyId);
    return response.success ? response.data || null : null;
  }, []);
  
  // Tenant management actions
  const addTenant = useCallback(async (tenantData: {
    tenantId: number;
    propertyId: number;
    tenantAddress: string;
    leaseStartDate: number;
    leaseEndDate: number;
    monthlyRent: number;
    securityDeposit: number;
  }): Promise<boolean> => {
    setLoading(prev => ({ ...prev, tenants: true }));
    
    const response = await propertyManagementService.addTenant(tenantData);
    const result = handleApiResponse(
      response,
      (data) => setTenants(prev => [...prev, data]),
      (error) => setErrors(prev => ({ ...prev, tenants: error })),
      (loading) => setLoading(prev => ({ ...prev, tenants: loading }))
    );
    
    if (result) {
      addNotification({
        type: 'TENANT_ADDED',
        title: 'Tenant Added',
        message: `Tenant ${tenantData.tenantId} has been added to property ${tenantData.propertyId}`,
        propertyId: tenantData.propertyId,
        tenantId: tenantData.tenantId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return !!result;
  }, []);
  
  const getTenantInfo = useCallback(async (tenantId: number): Promise<TenantInfo | null> => {
    setLoading(prev => ({ ...prev, tenants: true }));
    
    const response = await propertyManagementService.getTenantInfo(tenantId);
    return handleApiResponse(
      response,
      () => {}, // Don't update state for single tenant fetch
      (error) => setErrors(prev => ({ ...prev, tenants: error })),
      (loading) => setLoading(prev => ({ ...prev, tenants: loading }))
    );
  }, []);
  
  const processRentPayment = useCallback(async (paymentData: {
    tenantId: number;
    amount: number;
    paymentType: string;
  }): Promise<boolean> => {
    const response = await propertyManagementService.processRentPayment(paymentData);
    
    if (response.success) {
      addNotification({
        type: 'RENT_PAYMENT_PROCESSED',
        title: 'Rent Payment Processed',
        message: `Rent payment of $${paymentData.amount} has been processed for tenant ${paymentData.tenantId}`,
        tenantId: paymentData.tenantId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
      
      // Refresh tenants data
      await refreshTenants();
    }
    
    return response.success;
  }, []);
  
  const registerTenant = useCallback(async (tenantData: {
    tenantId: number;
    address: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: number;
    ssn: string;
    employmentInfo: {
      employer: string;
      position: string;
      startDate: number;
      salary: number;
      employmentType: EmploymentType;
      employerContact: string;
    };
    creditScore: number;
    income: number;
    references: Array<{
      referenceId: number;
      name: string;
      relationship: string;
      contact: string;
    }>;
  }): Promise<boolean> => {
    setLoading(prev => ({ ...prev, tenants: true }));
    
    const response = await propertyManagementService.registerTenant(tenantData);
    const result = handleApiResponse(
      response,
      (data) => setTenantProfiles(prev => [...prev, data]),
      (error) => setErrors(prev => ({ ...prev, tenants: error })),
      (loading) => setLoading(prev => ({ ...prev, tenants: loading }))
    );
    
    if (result) {
      addNotification({
        type: 'TENANT_REGISTERED',
        title: 'Tenant Registered',
        message: `Tenant ${tenantData.name} has been successfully registered`,
        tenantId: tenantData.tenantId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return !!result;
  }, []);
  
  // Maintenance management actions
  const createMaintenanceRequest = useCallback(async (requestData: {
    requestId: number;
    propertyId: number;
    tenantId?: number;
    description: string;
    priority: MaintenancePriority;
    estimatedCost: number;
  }): Promise<boolean> => {
    setLoading(prev => ({ ...prev, maintenance: true }));
    
    const response = await propertyManagementService.createMaintenanceRequest(requestData);
    const result = handleApiResponse(
      response,
      (data) => setMaintenanceRequests(prev => [...prev, data]),
      (error) => setErrors(prev => ({ ...prev, maintenance: error })),
      (loading) => setLoading(prev => ({ ...prev, maintenance: loading }))
    );
    
    if (result) {
      addNotification({
        type: 'MAINTENANCE_REQUEST_CREATED',
        title: 'Maintenance Request Created',
        message: `Maintenance request ${requestData.requestId} has been created for property ${requestData.propertyId}`,
        propertyId: requestData.propertyId,
        tenantId: requestData.tenantId,
        priority: CommunicationPriority.HIGH,
        isRead: false
      });
    }
    
    return !!result;
  }, []);
  
  const updateMaintenanceRequest = useCallback(async (updateData: {
    requestId: number;
    status: MaintenanceStatus;
    assignedVendor?: string;
    actualCost?: number;
  }): Promise<boolean> => {
    const response = await propertyManagementService.updateMaintenanceRequest(updateData);
    
    if (response.success) {
      setMaintenanceRequests(prev => 
        prev.map(request => 
          request.requestId === updateData.requestId 
            ? { ...request, status: updateData.status, assignedVendor: updateData.assignedVendor, actualCost: updateData.actualCost }
            : request
        )
      );
      
      addNotification({
        type: 'MAINTENANCE_REQUEST_UPDATED',
        title: 'Maintenance Request Updated',
        message: `Maintenance request ${updateData.requestId} has been updated to ${updateData.status}`,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return response.success;
  }, []);
  
  const getMaintenanceRequest = useCallback(async (requestId: number): Promise<MaintenanceRequest | null> => {
    const response = await propertyManagementService.getMaintenanceRequest(requestId);
    return response.success ? response.data || null : null;
  }, []);
  
  // Automation management actions
  const createAutomationTask = useCallback(async (taskData: {
    taskId: number;
    taskType: AutomationTaskType;
    propertyId: number;
    schedule: {
      scheduleType: ScheduleType;
      interval: number;
      startTime: number;
      endTime?: number;
      timezone: string;
      customSchedule?: Record<string, string>;
    };
    parameters: Record<string, string>;
  }): Promise<boolean> => {
    setLoading(prev => ({ ...prev, automation: true }));
    
    const response = await propertyManagementService.createAutomationTask(taskData);
    const result = handleApiResponse(
      response,
      (data) => setAutomationTasks(prev => [...prev, data]),
      (error) => setErrors(prev => ({ ...prev, automation: error })),
      (loading) => setLoading(prev => ({ ...prev, automation: loading }))
    );
    
    if (result) {
      addNotification({
        type: 'AUTOMATION_TASK_CREATED',
        title: 'Automation Task Created',
        message: `Automation task ${taskData.taskId} has been created for property ${taskData.propertyId}`,
        propertyId: taskData.propertyId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return !!result;
  }, []);
  
  const executeTask = useCallback(async (taskId: number): Promise<AutomationResult | null> => {
    const response = await propertyManagementService.executeTask(taskId);
    return response.success ? response.data || null : null;
  }, []);
  
  const toggleTask = useCallback(async (taskId: number, isActive: boolean): Promise<boolean> => {
    setAutomationTasks(prev => 
      prev.map(task => 
        task.taskId === taskId ? { ...task, isActive } : task
      )
    );
    
    addNotification({
      type: 'AUTOMATION_TASK_TOGGLED',
      title: 'Automation Task Updated',
      message: `Automation task ${taskId} has been ${isActive ? 'enabled' : 'disabled'}`,
      priority: CommunicationPriority.LOW,
      isRead: false
    });
    
    return true;
  }, []);
  
  // Lease management actions
  const createLeaseAgreement = useCallback(async (leaseData: {
    leaseId: number;
    tenantId: number;
    propertyId: number;
    landlordAddress: string;
    startDate: number;
    endDate: number;
    monthlyRent: number;
    securityDeposit: number;
    petDeposit: number;
    lateFee: number;
    leaseTerms: Record<string, string>;
  }): Promise<boolean> => {
    const response = await propertyManagementService.createLeaseAgreement(leaseData);
    
    if (response.success && response.data) {
      setLeaseAgreements(prev => [...prev, response.data!]);
      
      addNotification({
        type: 'LEASE_AGREEMENT_CREATED',
        title: 'Lease Agreement Created',
        message: `Lease agreement ${leaseData.leaseId} has been created for tenant ${leaseData.tenantId}`,
        propertyId: leaseData.propertyId,
        tenantId: leaseData.tenantId,
        priority: CommunicationPriority.MEDIUM,
        isRead: false
      });
    }
    
    return response.success;
  }, []);
  
  const signLeaseAgreement = useCallback(async (leaseId: number): Promise<boolean> => {
    setLeaseAgreements(prev => 
      prev.map(lease => 
        lease.leaseId === leaseId 
          ? { ...lease, status: LeaseStatus.ACTIVE, signedAt: Date.now() }
          : lease
      )
    );
    
    addNotification({
      type: 'LEASE_AGREEMENT_SIGNED',
      title: 'Lease Agreement Signed',
      message: `Lease agreement ${leaseId} has been signed`,
      priority: CommunicationPriority.MEDIUM,
      isRead: false
    });
    
    return true;
  }, []);
  
  const terminateLeaseAgreement = useCallback(async (leaseId: number, terminationReason: string): Promise<boolean> => {
    setLeaseAgreements(prev => 
      prev.map(lease => 
        lease.leaseId === leaseId 
          ? { ...lease, status: LeaseStatus.TERMINATED, terminatedAt: Date.now(), terminationReason }
          : lease
      )
    );
    
    addNotification({
      type: 'LEASE_AGREEMENT_TERMINATED',
      title: 'Lease Agreement Terminated',
      message: `Lease agreement ${leaseId} has been terminated: ${terminationReason}`,
      priority: CommunicationPriority.HIGH,
      isRead: false
    });
    
    return true;
  }, []);
  
  // Communication actions
  const sendCommunication = useCallback(async (communicationData: {
    communicationId: number;
    tenantId: number;
    propertyId: number;
    sender: string;
    recipient: string;
    messageType: CommunicationType;
    subject: string;
    message: string;
    priority: CommunicationPriority;
  }): Promise<boolean> => {
    const communication: TenantCommunication = {
      communicationId: communicationData.communicationId,
      tenantId: communicationData.tenantId,
      propertyId: communicationData.propertyId,
      sender: communicationData.sender,
      recipient: communicationData.recipient,
      messageType: communicationData.messageType,
      subject: communicationData.subject,
      message: communicationData.message,
      timestamp: Date.now(),
      isRead: false,
      priority: communicationData.priority
    };
    
    setCommunications(prev => [...prev, communication]);
    
    addNotification({
      type: 'COMMUNICATION_SENT',
      title: 'Communication Sent',
      message: `Communication sent to tenant ${communicationData.tenantId}`,
      propertyId: communicationData.propertyId,
      tenantId: communicationData.tenantId,
      priority: CommunicationPriority.LOW,
      isRead: false
    });
    
    return true;
  }, []);
  
  const markCommunicationAsRead = useCallback(async (tenantId: number, communicationId: number): Promise<boolean> => {
    setCommunications(prev => 
      prev.map(comm => 
        comm.tenantId === tenantId && comm.communicationId === communicationId
          ? { ...comm, isRead: true }
          : comm
      )
    );
    
    return true;
  }, []);
  
  // Data refresh actions
  const refreshProperties = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, properties: true }));
    
    const response = await propertyManagementService.getAllProperties();
    handleApiResponse(
      response,
      setProperties,
      (error) => setErrors(prev => ({ ...prev, properties: error })),
      (loading) => setLoading(prev => ({ ...prev, properties: loading }))
    );
  }, []);
  
  const refreshTenants = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, tenants: true }));
    
    const response = await propertyManagementService.getAllTenants();
    handleApiResponse(
      response,
      setTenants,
      (error) => setErrors(prev => ({ ...prev, tenants: error })),
      (loading) => setLoading(prev => ({ ...prev, tenants: loading }))
    );
  }, []);
  
  const refreshMaintenance = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, maintenance: true }));
    
    const response = await propertyManagementService.getAllMaintenanceRequests();
    handleApiResponse(
      response,
      setMaintenanceRequests,
      (error) => setErrors(prev => ({ ...prev, maintenance: error })),
      (loading) => setLoading(prev => ({ ...prev, maintenance: loading }))
    );
  }, []);
  
  const refreshAutomation = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, automation: true }));
    
    const response = await propertyManagementService.getAllAutomationTasks();
    handleApiResponse(
      response,
      setAutomationTasks,
      (error) => setErrors(prev => ({ ...prev, automation: error })),
      (loading) => setLoading(prev => ({ ...prev, automation: loading }))
    );
  }, []);
  
  const refreshDashboard = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    
    const response = await propertyManagementService.getDashboard();
    handleApiResponse(
      response,
      setDashboard,
      (error) => setErrors(prev => ({ ...prev, dashboard: error })),
      (loading) => setLoading(prev => ({ ...prev, dashboard: loading }))
    );
  }, []);
  
  const refreshAnalytics = useCallback(async (): Promise<void> => {
    setLoading(prev => ({ ...prev, analytics: true }));
    
    const [propertyRes, tenantRes, automationRes] = await Promise.all([
      propertyManagementService.getPropertyAnalytics(),
      propertyManagementService.getTenantAnalytics(),
      propertyManagementService.getAutomationAnalytics()
    ]);
    
    setAnalytics({
      property: propertyRes.success ? propertyRes.data || null : null,
      tenant: tenantRes.success ? tenantRes.data || null : null,
      automation: automationRes.success ? automationRes.data || null : null
    });
    
    setLoading(prev => ({ ...prev, analytics: false }));
  }, []);
  
  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([
      refreshProperties(),
      refreshTenants(),
      refreshMaintenance(),
      refreshAutomation(),
      refreshDashboard(),
      refreshAnalytics()
    ]);
  }, [refreshProperties, refreshTenants, refreshMaintenance, refreshAutomation, refreshDashboard, refreshAnalytics]);
  
  // Utility actions
  const clearErrors = useCallback((): void => {
    setErrors({
      properties: null,
      tenants: null,
      maintenance: null,
      automation: null,
      dashboard: null,
      analytics: null
    });
  }, []);
  
  const addNotification = useCallback((notification: Omit<PropertyManagementNotification, 'id' | 'timestamp'>): void => {
    const newNotification: PropertyManagementNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);
  
  const removeNotification = useCallback((notificationId: string): void => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);
  
  const markNotificationAsRead = useCallback((notificationId: string): void => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  }, []);
  
  // Initialize data on mount
  useEffect(() => {
    refreshAll();
    
    // Set up auto-refresh every 5 minutes
    refreshIntervalRef.current = setInterval(refreshAll, 5 * 60 * 1000);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshAll]);
  
  return {
    // State
    properties,
    tenants,
    maintenanceRequests,
    automationTasks,
    tenantProfiles,
    leaseAgreements,
    communications,
    dashboard,
    analytics,
    notifications,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Property management actions
    registerProperty,
    getPropertyInfo,
    getPropertyPerformance,
    
    // Tenant management actions
    addTenant,
    getTenantInfo,
    processRentPayment,
    registerTenant,
    
    // Maintenance management actions
    createMaintenanceRequest,
    updateMaintenanceRequest,
    getMaintenanceRequest,
    
    // Automation management actions
    createAutomationTask,
    executeTask,
    toggleTask,
    
    // Lease management actions
    createLeaseAgreement,
    signLeaseAgreement,
    terminateLeaseAgreement,
    
    // Communication actions
    sendCommunication,
    markCommunicationAsRead,
    
    // Data refresh actions
    refreshProperties,
    refreshTenants,
    refreshMaintenance,
    refreshAutomation,
    refreshDashboard,
    refreshAnalytics,
    refreshAll,
    
    // Utility actions
    clearErrors,
    addNotification,
    removeNotification,
    markNotificationAsRead
  };
};

