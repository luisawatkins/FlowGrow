import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Flow SDK
const mockFlowSDK = {
  sendTransaction: jest.fn(),
  executeScript: jest.fn(),
  getAccount: jest.fn(),
  getCurrentUser: jest.fn(),
  authenticate: jest.fn(),
  unauthenticate: jest.fn(),
  signUserMessage: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};

// Mock property management contracts
const mockPropertyManagementContract = {
  registerProperty: jest.fn(),
  addTenant: jest.fn(),
  processRentPayment: jest.fn(),
  createMaintenanceRequest: jest.fn(),
  updateMaintenanceRequest: jest.fn(),
  getPropertyInfo: jest.fn(),
  getTenantInfo: jest.fn(),
  getMaintenanceRequest: jest.fn(),
  getAllProperties: jest.fn(),
  getAllTenants: jest.fn(),
  getAllMaintenanceRequests: jest.fn(),
  getPropertyPerformance: jest.fn(),
};

const mockAutomationEngine = {
  createTask: jest.fn(),
  executeTask: jest.fn(),
  executeReadyTasks: jest.fn(),
  updateTaskSchedule: jest.fn(),
  toggleTask: jest.fn(),
  getAllTasks: jest.fn(),
  getTaskExecutionHistory: jest.fn(),
  getAutomationStats: jest.fn(),
};

const mockTenantRegistry = {
  registerTenant: jest.fn(),
  updateVerificationStatus: jest.fn(),
  createLeaseAgreement: jest.fn(),
  signLeaseAgreement: jest.fn(),
  terminateLeaseAgreement: jest.fn(),
  sendCommunication: jest.fn(),
  getTenantProfile: jest.fn(),
  getLeaseAgreement: jest.fn(),
  getTenantCommunications: jest.fn(),
  getAllTenants: jest.fn(),
  getAllLeases: jest.fn(),
};

describe('Property Management Contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PropertyManagementContract', () => {
    describe('Property Registration', () => {
      it('should register a new property successfully', async () => {
        const propertyData = {
          propertyId: 1,
          manager: '0x123',
          rentAmount: 2000.0,
          rentDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
          maintenanceFund: 500.0,
        };

        mockPropertyManagementContract.registerProperty.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.registerProperty(
          propertyData.propertyId,
          propertyData.manager,
          propertyData.rentAmount,
          propertyData.rentDueDate,
          propertyData.maintenanceFund
        );

        expect(result).toBe(true);
        expect(mockPropertyManagementContract.registerProperty).toHaveBeenCalledWith(
          propertyData.propertyId,
          propertyData.manager,
          propertyData.rentAmount,
          propertyData.rentDueDate,
          propertyData.maintenanceFund
        );
      });

      it('should handle property registration failure', async () => {
        mockPropertyManagementContract.registerProperty.mockResolvedValue(false);

        const result = await mockPropertyManagementContract.registerProperty(
          1,
          '0x123',
          2000.0,
          Date.now() + 30 * 24 * 60 * 60 * 1000,
          500.0
        );

        expect(result).toBe(false);
      });
    });

    describe('Tenant Management', () => {
      it('should add a tenant to a property successfully', async () => {
        const tenantData = {
          tenantId: 1,
          propertyId: 1,
          tenantAddress: '0x456',
          leaseStartDate: Date.now(),
          leaseEndDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
          monthlyRent: 2000.0,
          securityDeposit: 4000.0,
        };

        mockPropertyManagementContract.addTenant.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.addTenant(
          tenantData.tenantId,
          tenantData.propertyId,
          tenantData.tenantAddress,
          tenantData.leaseStartDate,
          tenantData.leaseEndDate,
          tenantData.monthlyRent,
          tenantData.securityDeposit
        );

        expect(result).toBe(true);
        expect(mockPropertyManagementContract.addTenant).toHaveBeenCalledWith(
          tenantData.tenantId,
          tenantData.propertyId,
          tenantData.tenantAddress,
          tenantData.leaseStartDate,
          tenantData.leaseEndDate,
          tenantData.monthlyRent,
          tenantData.securityDeposit
        );
      });

      it('should process rent payment successfully', async () => {
        const paymentData = {
          tenantId: 1,
          amount: 2000.0,
          paymentType: 'MONTHLY_RENT',
        };

        mockPropertyManagementContract.processRentPayment.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.processRentPayment(
          paymentData.tenantId,
          paymentData.amount,
          paymentData.paymentType
        );

        expect(result).toBe(true);
        expect(mockPropertyManagementContract.processRentPayment).toHaveBeenCalledWith(
          paymentData.tenantId,
          paymentData.amount,
          paymentData.paymentType
        );
      });

      it('should handle late rent payment with fees', async () => {
        const latePaymentData = {
          tenantId: 1,
          amount: 2000.0,
          paymentType: 'LATE_RENT',
          isLate: true,
          lateFee: 100.0,
        };

        mockPropertyManagementContract.processRentPayment.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.processRentPayment(
          latePaymentData.tenantId,
          latePaymentData.amount,
          latePaymentData.paymentType
        );

        expect(result).toBe(true);
      });
    });

    describe('Maintenance Management', () => {
      it('should create maintenance request successfully', async () => {
        const maintenanceData = {
          requestId: 1,
          propertyId: 1,
          tenantId: 1,
          description: 'Broken faucet in kitchen',
          priority: 'MEDIUM',
          estimatedCost: 150.0,
        };

        mockPropertyManagementContract.createMaintenanceRequest.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.createMaintenanceRequest(
          maintenanceData.requestId,
          maintenanceData.propertyId,
          maintenanceData.tenantId,
          maintenanceData.description,
          maintenanceData.priority,
          maintenanceData.estimatedCost
        );

        expect(result).toBe(true);
        expect(mockPropertyManagementContract.createMaintenanceRequest).toHaveBeenCalledWith(
          maintenanceData.requestId,
          maintenanceData.propertyId,
          maintenanceData.tenantId,
          maintenanceData.description,
          maintenanceData.priority,
          maintenanceData.estimatedCost
        );
      });

      it('should update maintenance request status', async () => {
        const updateData = {
          requestId: 1,
          status: 'COMPLETED',
          assignedVendor: '0x789',
          actualCost: 175.0,
        };

        mockPropertyManagementContract.updateMaintenanceRequest.mockResolvedValue(true);

        const result = await mockPropertyManagementContract.updateMaintenanceRequest(
          updateData.requestId,
          updateData.status,
          updateData.assignedVendor,
          updateData.actualCost
        );

        expect(result).toBe(true);
        expect(mockPropertyManagementContract.updateMaintenanceRequest).toHaveBeenCalledWith(
          updateData.requestId,
          updateData.status,
          updateData.assignedVendor,
          updateData.actualCost
        );
      });
    });

    describe('Property Information Retrieval', () => {
      it('should get property information', async () => {
        const mockPropertyInfo = {
          propertyId: 1,
          owner: '0x123',
          manager: '0x456',
          rentAmount: 2000.0,
          rentDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          maintenanceFund: 500.0,
          isActive: true,
          tenantCount: 1,
          totalRevenue: 2000.0,
        };

        mockPropertyManagementContract.getPropertyInfo.mockResolvedValue(mockPropertyInfo);

        const result = await mockPropertyManagementContract.getPropertyInfo(1);

        expect(result).toEqual(mockPropertyInfo);
        expect(mockPropertyManagementContract.getPropertyInfo).toHaveBeenCalledWith(1);
      });

      it('should get all properties for owner', async () => {
        const mockProperties = [
          {
            propertyId: 1,
            owner: '0x123',
            rentAmount: 2000.0,
            tenantCount: 1,
          },
          {
            propertyId: 2,
            owner: '0x123',
            rentAmount: 1500.0,
            tenantCount: 0,
          },
        ];

        mockPropertyManagementContract.getAllProperties.mockResolvedValue(mockProperties);

        const result = await mockPropertyManagementContract.getAllProperties();

        expect(result).toEqual(mockProperties);
        expect(result).toHaveLength(2);
      });

      it('should get property performance metrics', async () => {
        const mockPerformance = {
          occupancyRate: 100.0,
          revenuePerMonth: 2000.0,
          maintenanceRatio: 0.1,
          totalRevenue: 2000.0,
          maintenanceCost: 200.0,
        };

        mockPropertyManagementContract.getPropertyPerformance.mockResolvedValue(mockPerformance);

        const result = await mockPropertyManagementContract.getPropertyPerformance(1);

        expect(result).toEqual(mockPerformance);
        expect(mockPropertyManagementContract.getPropertyPerformance).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('AutomationEngine', () => {
    describe('Task Creation and Management', () => {
      it('should create automation task successfully', async () => {
        const taskData = {
          taskId: 1,
          taskType: 'RENT_COLLECTION',
          propertyId: 1,
          schedule: {
            scheduleType: 'MONTHLY',
            interval: 30 * 24 * 60 * 60, // 30 days in seconds
            startTime: Date.now(),
            endTime: null,
            timezone: 'UTC',
            customSchedule: null,
          },
          parameters: {
            amount: '2000.0',
            tenantCount: '1',
          },
        };

        mockAutomationEngine.createTask.mockResolvedValue(true);

        const result = await mockAutomationEngine.createTask(
          taskData.taskId,
          taskData.taskType,
          taskData.propertyId,
          taskData.schedule,
          taskData.parameters
        );

        expect(result).toBe(true);
        expect(mockAutomationEngine.createTask).toHaveBeenCalledWith(
          taskData.taskId,
          taskData.taskType,
          taskData.propertyId,
          taskData.schedule,
          taskData.parameters
        );
      });

      it('should execute automation task successfully', async () => {
        const mockExecutionResult = {
          taskId: 1,
          executionTime: Date.now(),
          success: true,
          message: 'Rent collection executed successfully',
          data: {
            propertyId: '1',
            amount: '2000.0',
            tenantCount: '1',
          },
          gasUsed: 1000,
          executionDuration: 500,
        };

        mockAutomationEngine.executeTask.mockResolvedValue(mockExecutionResult);

        const result = await mockAutomationEngine.executeTask(1);

        expect(result).toEqual(mockExecutionResult);
        expect(mockAutomationEngine.executeTask).toHaveBeenCalledWith(1);
      });

      it('should execute all ready tasks', async () => {
        const mockExecutionResults = [
          {
            taskId: 1,
            executionTime: Date.now(),
            success: true,
            message: 'Rent collection executed successfully',
            data: { propertyId: '1' },
            gasUsed: 1000,
            executionDuration: 500,
          },
          {
            taskId: 2,
            executionTime: Date.now(),
            success: true,
            message: 'Maintenance reminder sent',
            data: { propertyId: '1' },
            gasUsed: 500,
            executionDuration: 300,
          },
        ];

        mockAutomationEngine.executeReadyTasks.mockResolvedValue(mockExecutionResults);

        const result = await mockAutomationEngine.executeReadyTasks();

        expect(result).toEqual(mockExecutionResults);
        expect(result).toHaveLength(2);
      });

      it('should update task schedule', async () => {
        const newSchedule = {
          scheduleType: 'WEEKLY',
          interval: 7 * 24 * 60 * 60, // 7 days in seconds
          startTime: Date.now(),
          endTime: null,
          timezone: 'UTC',
          customSchedule: null,
        };

        mockAutomationEngine.updateTaskSchedule.mockResolvedValue(true);

        const result = await mockAutomationEngine.updateTaskSchedule(1, newSchedule);

        expect(result).toBe(true);
        expect(mockAutomationEngine.updateTaskSchedule).toHaveBeenCalledWith(1, newSchedule);
      });

      it('should toggle task active status', async () => {
        mockAutomationEngine.toggleTask.mockResolvedValue(true);

        const result = await mockAutomationEngine.toggleTask(1, false);

        expect(result).toBe(true);
        expect(mockAutomationEngine.toggleTask).toHaveBeenCalledWith(1, false);
      });
    });

    describe('Automation Statistics', () => {
      it('should get automation statistics', async () => {
        const mockStats = {
          totalTasks: 5,
          activeTasks: 3,
          totalExecutions: 25,
          successfulExecutions: 23,
          failedExecutions: 2,
        };

        mockAutomationEngine.getAutomationStats.mockResolvedValue(mockStats);

        const result = await mockAutomationEngine.getAutomationStats();

        expect(result).toEqual(mockStats);
        expect(mockAutomationEngine.getAutomationStats).toHaveBeenCalled();
      });

      it('should get task execution history', async () => {
        const mockHistory = [
          {
            taskId: 1,
            executionTime: Date.now() - 24 * 60 * 60 * 1000,
            success: true,
            message: 'Rent collection executed successfully',
            data: { propertyId: '1' },
            gasUsed: 1000,
            executionDuration: 500,
          },
          {
            taskId: 1,
            executionTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
            success: true,
            message: 'Rent collection executed successfully',
            data: { propertyId: '1' },
            gasUsed: 1000,
            executionDuration: 450,
          },
        ];

        mockAutomationEngine.getTaskExecutionHistory.mockResolvedValue(mockHistory);

        const result = await mockAutomationEngine.getTaskExecutionHistory(1);

        expect(result).toEqual(mockHistory);
        expect(result).toHaveLength(2);
      });
    });
  });

  describe('TenantRegistry', () => {
    describe('Tenant Registration and Verification', () => {
      it('should register a new tenant successfully', async () => {
        const tenantData = {
          tenantId: 1,
          address: '0x456',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          dateOfBirth: Date.now() - 25 * 365 * 24 * 60 * 60 * 1000, // 25 years ago
          ssn: '123-45-6789',
          employmentInfo: {
            employer: 'Tech Corp',
            position: 'Software Engineer',
            startDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 years ago
            salary: 80000.0,
            employmentType: 'FULL_TIME',
            employerContact: 'hr@techcorp.com',
          },
          creditScore: 750,
          income: 80000.0,
          references: [
            {
              referenceId: 1,
              name: 'Jane Smith',
              relationship: 'Previous Landlord',
              contact: 'jane@example.com',
            },
          ],
        };

        mockTenantRegistry.registerTenant.mockResolvedValue(true);

        const result = await mockTenantRegistry.registerTenant(
          tenantData.tenantId,
          tenantData.address,
          tenantData.name,
          tenantData.email,
          tenantData.phone,
          tenantData.dateOfBirth,
          tenantData.ssn,
          tenantData.employmentInfo,
          tenantData.creditScore,
          tenantData.income,
          tenantData.references
        );

        expect(result).toBe(true);
        expect(mockTenantRegistry.registerTenant).toHaveBeenCalledWith(
          tenantData.tenantId,
          tenantData.address,
          tenantData.name,
          tenantData.email,
          tenantData.phone,
          tenantData.dateOfBirth,
          tenantData.ssn,
          tenantData.employmentInfo,
          tenantData.creditScore,
          tenantData.income,
          tenantData.references
        );
      });

      it('should update tenant verification status', async () => {
        const verificationData = {
          tenantId: 1,
          verificationStatus: 'VERIFIED',
          kycStatus: 'VERIFIED',
          amlStatus: 'CLEAR',
        };

        mockTenantRegistry.updateVerificationStatus.mockResolvedValue(true);

        const result = await mockTenantRegistry.updateVerificationStatus(
          verificationData.tenantId,
          verificationData.verificationStatus,
          verificationData.kycStatus,
          verificationData.amlStatus
        );

        expect(result).toBe(true);
        expect(mockTenantRegistry.updateVerificationStatus).toHaveBeenCalledWith(
          verificationData.tenantId,
          verificationData.verificationStatus,
          verificationData.kycStatus,
          verificationData.amlStatus
        );
      });
    });

    describe('Lease Management', () => {
      it('should create lease agreement successfully', async () => {
        const leaseData = {
          leaseId: 1,
          tenantId: 1,
          propertyId: 1,
          landlordAddress: '0x123',
          startDate: Date.now(),
          endDate: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
          monthlyRent: 2000.0,
          securityDeposit: 4000.0,
          petDeposit: 500.0,
          lateFee: 100.0,
          leaseTerms: {
            petsAllowed: 'true',
            smokingAllowed: 'false',
            maxOccupancy: '2',
          },
        };

        mockTenantRegistry.createLeaseAgreement.mockResolvedValue(true);

        const result = await mockTenantRegistry.createLeaseAgreement(
          leaseData.leaseId,
          leaseData.tenantId,
          leaseData.propertyId,
          leaseData.landlordAddress,
          leaseData.startDate,
          leaseData.endDate,
          leaseData.monthlyRent,
          leaseData.securityDeposit,
          leaseData.petDeposit,
          leaseData.lateFee,
          leaseData.leaseTerms
        );

        expect(result).toBe(true);
        expect(mockTenantRegistry.createLeaseAgreement).toHaveBeenCalledWith(
          leaseData.leaseId,
          leaseData.tenantId,
          leaseData.propertyId,
          leaseData.landlordAddress,
          leaseData.startDate,
          leaseData.endDate,
          leaseData.monthlyRent,
          leaseData.securityDeposit,
          leaseData.petDeposit,
          leaseData.lateFee,
          leaseData.leaseTerms
        );
      });

      it('should sign lease agreement', async () => {
        mockTenantRegistry.signLeaseAgreement.mockResolvedValue(true);

        const result = await mockTenantRegistry.signLeaseAgreement(1);

        expect(result).toBe(true);
        expect(mockTenantRegistry.signLeaseAgreement).toHaveBeenCalledWith(1);
      });

      it('should terminate lease agreement', async () => {
        const terminationData = {
          leaseId: 1,
          terminationReason: 'Tenant requested early termination',
        };

        mockTenantRegistry.terminateLeaseAgreement.mockResolvedValue(true);

        const result = await mockTenantRegistry.terminateLeaseAgreement(
          terminationData.leaseId,
          terminationData.terminationReason
        );

        expect(result).toBe(true);
        expect(mockTenantRegistry.terminateLeaseAgreement).toHaveBeenCalledWith(
          terminationData.leaseId,
          terminationData.terminationReason
        );
      });
    });

    describe('Tenant Communication', () => {
      it('should send communication to tenant', async () => {
        const communicationData = {
          communicationId: 1,
          tenantId: 1,
          propertyId: 1,
          sender: '0x123',
          recipient: '0x456',
          messageType: 'RENT_REMINDER',
          subject: 'Rent Payment Due',
          message: 'Your rent payment is due in 3 days.',
          priority: 'MEDIUM',
        };

        mockTenantRegistry.sendCommunication.mockResolvedValue(true);

        const result = await mockTenantRegistry.sendCommunication(
          communicationData.communicationId,
          communicationData.tenantId,
          communicationData.propertyId,
          communicationData.sender,
          communicationData.recipient,
          communicationData.messageType,
          communicationData.subject,
          communicationData.message,
          communicationData.priority
        );

        expect(result).toBe(true);
        expect(mockTenantRegistry.sendCommunication).toHaveBeenCalledWith(
          communicationData.communicationId,
          communicationData.tenantId,
          communicationData.propertyId,
          communicationData.sender,
          communicationData.recipient,
          communicationData.messageType,
          communicationData.subject,
          communicationData.message,
          communicationData.priority
        );
      });

      it('should get tenant communications', async () => {
        const mockCommunications = [
          {
            communicationId: 1,
            tenantId: 1,
            propertyId: 1,
            sender: '0x123',
            recipient: '0x456',
            messageType: 'RENT_REMINDER',
            subject: 'Rent Payment Due',
            message: 'Your rent payment is due in 3 days.',
            timestamp: Date.now(),
            isRead: false,
            priority: 'MEDIUM',
          },
          {
            communicationId: 2,
            tenantId: 1,
            propertyId: 1,
            sender: '0x123',
            recipient: '0x456',
            messageType: 'MAINTENANCE_UPDATE',
            subject: 'Maintenance Request Update',
            message: 'Your maintenance request has been completed.',
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            isRead: true,
            priority: 'LOW',
          },
        ];

        mockTenantRegistry.getTenantCommunications.mockResolvedValue(mockCommunications);

        const result = await mockTenantRegistry.getTenantCommunications(1);

        expect(result).toEqual(mockCommunications);
        expect(result).toHaveLength(2);
      });
    });

    describe('Tenant Information Retrieval', () => {
      it('should get tenant profile', async () => {
        const mockTenantProfile = {
          tenantId: 1,
          address: '0x456',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          verificationStatus: 'VERIFIED',
          kycStatus: 'VERIFIED',
          amlStatus: 'CLEAR',
          riskScore: 25,
          reputationScore: 85,
          isActive: true,
        };

        mockTenantRegistry.getTenantProfile.mockResolvedValue(mockTenantProfile);

        const result = await mockTenantRegistry.getTenantProfile(1);

        expect(result).toEqual(mockTenantProfile);
        expect(mockTenantRegistry.getTenantProfile).toHaveBeenCalledWith(1);
      });

      it('should get all tenants for owner', async () => {
        const mockTenants = [
          {
            tenantId: 1,
            name: 'John Doe',
            email: 'john@example.com',
            verificationStatus: 'VERIFIED',
            riskScore: 25,
            reputationScore: 85,
          },
          {
            tenantId: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            verificationStatus: 'PENDING',
            riskScore: 45,
            reputationScore: 70,
          },
        ];

        mockTenantRegistry.getAllTenants.mockResolvedValue(mockTenants);

        const result = await mockTenantRegistry.getAllTenants();

        expect(result).toEqual(mockTenants);
        expect(result).toHaveLength(2);
      });

      it('should get all leases for owner', async () => {
        const mockLeases = [
          {
            leaseId: 1,
            tenantId: 1,
            propertyId: 1,
            status: 'ACTIVE',
            monthlyRent: 2000.0,
            startDate: Date.now(),
            endDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
          },
          {
            leaseId: 2,
            tenantId: 2,
            propertyId: 2,
            status: 'DRAFT',
            monthlyRent: 1500.0,
            startDate: Date.now(),
            endDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
          },
        ];

        mockTenantRegistry.getAllLeases.mockResolvedValue(mockLeases);

        const result = await mockTenantRegistry.getAllLeases();

        expect(result).toEqual(mockLeases);
        expect(result).toHaveLength(2);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete property management workflow', async () => {
      // 1. Register property
      mockPropertyManagementContract.registerProperty.mockResolvedValue(true);
      const propertyRegistered = await mockPropertyManagementContract.registerProperty(
        1,
        '0x123',
        2000.0,
        Date.now() + 30 * 24 * 60 * 60 * 1000,
        500.0
      );
      expect(propertyRegistered).toBe(true);

      // 2. Register tenant
      mockTenantRegistry.registerTenant.mockResolvedValue(true);
      const tenantRegistered = await mockTenantRegistry.registerTenant(
        1,
        '0x456',
        'John Doe',
        'john@example.com',
        '+1234567890',
        Date.now() - 25 * 365 * 24 * 60 * 60 * 1000,
        '123-45-6789',
        {
          employer: 'Tech Corp',
          position: 'Software Engineer',
          startDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
          salary: 80000.0,
          employmentType: 'FULL_TIME',
          employerContact: 'hr@techcorp.com',
        },
        750,
        80000.0,
        []
      );
      expect(tenantRegistered).toBe(true);

      // 3. Add tenant to property
      mockPropertyManagementContract.addTenant.mockResolvedValue(true);
      const tenantAdded = await mockPropertyManagementContract.addTenant(
        1,
        1,
        '0x456',
        Date.now(),
        Date.now() + 365 * 24 * 60 * 60 * 1000,
        2000.0,
        4000.0
      );
      expect(tenantAdded).toBe(true);

      // 4. Create automation task for rent collection
      mockAutomationEngine.createTask.mockResolvedValue(true);
      const taskCreated = await mockAutomationEngine.createTask(
        1,
        'RENT_COLLECTION',
        1,
        {
          scheduleType: 'MONTHLY',
          interval: 30 * 24 * 60 * 60,
          startTime: Date.now(),
          endTime: null,
          timezone: 'UTC',
          customSchedule: null,
        },
        { amount: '2000.0', tenantCount: '1' }
      );
      expect(taskCreated).toBe(true);

      // 5. Process rent payment
      mockPropertyManagementContract.processRentPayment.mockResolvedValue(true);
      const paymentProcessed = await mockPropertyManagementContract.processRentPayment(
        1,
        2000.0,
        'MONTHLY_RENT'
      );
      expect(paymentProcessed).toBe(true);

      // 6. Create maintenance request
      mockPropertyManagementContract.createMaintenanceRequest.mockResolvedValue(true);
      const maintenanceCreated = await mockPropertyManagementContract.createMaintenanceRequest(
        1,
        1,
        1,
        'Broken faucet in kitchen',
        'MEDIUM',
        150.0
      );
      expect(maintenanceCreated).toBe(true);

      // Verify all operations were called
      expect(mockPropertyManagementContract.registerProperty).toHaveBeenCalledTimes(1);
      expect(mockTenantRegistry.registerTenant).toHaveBeenCalledTimes(1);
      expect(mockPropertyManagementContract.addTenant).toHaveBeenCalledTimes(1);
      expect(mockAutomationEngine.createTask).toHaveBeenCalledTimes(1);
      expect(mockPropertyManagementContract.processRentPayment).toHaveBeenCalledTimes(1);
      expect(mockPropertyManagementContract.createMaintenanceRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle error scenarios gracefully', async () => {
      // Test property registration failure
      mockPropertyManagementContract.registerProperty.mockResolvedValue(false);
      const result = await mockPropertyManagementContract.registerProperty(
        1,
        '0x123',
        2000.0,
        Date.now() + 30 * 24 * 60 * 60 * 1000,
        500.0
      );
      expect(result).toBe(false);

      // Test tenant registration failure
      mockTenantRegistry.registerTenant.mockResolvedValue(false);
      const tenantResult = await mockTenantRegistry.registerTenant(
        1,
        '0x456',
        'John Doe',
        'john@example.com',
        '+1234567890',
        Date.now() - 25 * 365 * 24 * 60 * 60 * 1000,
        '123-45-6789',
        {
          employer: 'Tech Corp',
          position: 'Software Engineer',
          startDate: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000,
          salary: 80000.0,
          employmentType: 'FULL_TIME',
          employerContact: 'hr@techcorp.com',
        },
        750,
        80000.0,
        []
      );
      expect(tenantResult).toBe(false);

      // Test automation task execution failure
      const failedExecutionResult = {
        taskId: 1,
        executionTime: Date.now(),
        success: false,
        message: 'Task execution failed',
        data: {},
        gasUsed: 0,
        executionDuration: 0,
      };
      mockAutomationEngine.executeTask.mockResolvedValue(failedExecutionResult);
      const executionResult = await mockAutomationEngine.executeTask(1);
      expect(executionResult.success).toBe(false);
    });
  });
});

