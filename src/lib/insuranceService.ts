import {
  InsurancePolicy,
  InsuranceClaim,
  RiskAssessment,
  InsuranceProvider,
  InsuranceQuote,
  InsuranceEvent,
  InsuranceMetrics,
  InsuranceConfig,
  InsuranceFilter,
  RiskFactor,
  MitigationStrategy,
  CoverageDetails,
  InsuranceType,
  PolicyStatus,
  ClaimType,
  ClaimStatus,
  RiskLevel,
  RiskCategory,
  RiskImpact,
  RiskSeverity,
  Priority,
  FactorStatus,
  StrategyStatus,
  AssessmentStatus,
  DocumentType,
  DocumentStatus,
  ProviderStatus,
  QuoteStatus,
  InsuranceEventType,
  EventSeverity
} from '@/types/insurance';

// Mock data
const mockProviders: InsuranceProvider[] = [
  {
    providerID: 'provider_1',
    name: 'SecureHome Insurance',
    contactInfo: {
      email: 'contact@securehome.com',
      phone: '+1-800-SECURE-1',
      address: '123 Insurance Ave, New York, NY 10001',
      website: 'https://securehome.com',
      emergencyContact: '+1-800-EMERGENCY'
    },
    rating: 4.5,
    specialties: ['Homeowners', 'Rental', 'Commercial'],
    coverageTypes: [InsuranceType.HOMEOWNERS, InsuranceType.RENTAL, InsuranceType.COMMERCIAL],
    claimsProcess: 'Online submission with 24/7 support',
    averageProcessingTime: 7,
    customerSatisfaction: 92,
    financialStrength: 'A+',
    status: ProviderStatus.ACTIVE
  },
  {
    providerID: 'provider_2',
    name: 'PropertyGuard Insurance',
    contactInfo: {
      email: 'info@propertyguard.com',
      phone: '+1-800-GUARD-1',
      address: '456 Protection St, Los Angeles, CA 90210',
      website: 'https://propertyguard.com',
      emergencyContact: '+1-800-HELP-NOW'
    },
    rating: 4.3,
    specialties: ['Liability', 'Umbrella', 'Flood'],
    coverageTypes: [InsuranceType.LIABILITY, InsuranceType.UMBRELLA, InsuranceType.FLOOD],
    claimsProcess: 'Mobile app with instant claim processing',
    averageProcessingTime: 5,
    customerSatisfaction: 88,
    financialStrength: 'A',
    status: ProviderStatus.ACTIVE
  }
];

const mockPolicies: InsurancePolicy[] = [
  {
    policyID: 'policy_1',
    propertyID: 1,
    policyType: InsuranceType.HOMEOWNERS,
    coverageAmount: 500000,
    premium: 1200,
    deductible: 1000,
    startDate: Date.now() - 86400000 * 30, // 30 days ago
    endDate: Date.now() + 86400000 * 335, // 335 days from now
    status: PolicyStatus.ACTIVE,
    provider: 'SecureHome Insurance',
    policyNumber: 'SH-2024-001',
    coverageDetails: {
      propertyDamage: true,
      liability: true,
      naturalDisasters: true,
      theft: true,
      vandalism: true,
      fire: true,
      flood: false,
      earthquake: false,
      windstorm: true,
      hail: true,
      coverageLimits: {
        propertyDamage: 500000,
        liability: 100000,
        personalProperty: 250000
      },
      exclusions: ['Flood damage', 'Earthquake damage'],
      additionalCoverage: ['Identity theft protection', 'Home office coverage']
    },
    claims: [],
    riskFactors: [],
    lastUpdated: Date.now()
  }
];

const mockClaims: InsuranceClaim[] = [
  {
    claimID: 'claim_1',
    policyID: 'policy_1',
    propertyID: 1,
    claimType: ClaimType.PROPERTY_DAMAGE,
    description: 'Water damage from burst pipe in kitchen',
    amount: 5000,
    status: ClaimStatus.UNDER_REVIEW,
    submittedDate: Date.now() - 86400000 * 3, // 3 days ago
    documents: [
      {
        documentID: 'doc_1',
        name: 'damage_photos.jpg',
        type: DocumentType.PHOTO,
        url: '/uploads/damage_photos.jpg',
        uploadedDate: Date.now() - 86400000 * 2,
        size: 2048000,
        status: DocumentStatus.APPROVED
      }
    ],
    adjuster: 'John Smith',
    notes: ['Initial assessment completed', 'Waiting for contractor estimate'],
    lastUpdated: Date.now() - 86400000
  }
];

const mockRiskAssessments: RiskAssessment[] = [
  {
    assessmentID: 'assessment_1',
    propertyID: 1,
    assessmentDate: Date.now() - 86400000 * 7, // 7 days ago
    riskLevel: RiskLevel.MEDIUM,
    riskScore: 65,
    riskFactors: [
      {
        factorID: 'risk_1',
        category: RiskCategory.STRUCTURAL,
        name: 'Aging HVAC System',
        description: 'HVAC system is 15 years old and may need replacement',
        impact: RiskImpact.MEDIUM,
        probability: 40,
        severity: RiskSeverity.MODERATE,
        mitigation: 'Schedule annual maintenance and consider replacement',
        cost: 5000,
        priority: Priority.MEDIUM,
        status: FactorStatus.IDENTIFIED
      },
      {
        factorID: 'risk_2',
        category: RiskCategory.NATURAL,
        name: 'Flood Risk',
        description: 'Property located in moderate flood risk zone',
        impact: RiskImpact.HIGH,
        probability: 20,
        severity: RiskSeverity.MAJOR,
        mitigation: 'Install flood barriers and consider flood insurance',
        cost: 2000,
        priority: Priority.HIGH,
        status: FactorStatus.ASSESSED
      }
    ],
    mitigationStrategies: [
      {
        strategyID: 'strategy_1',
        name: 'HVAC Maintenance Program',
        description: 'Implement annual maintenance schedule for HVAC system',
        cost: 500,
        effectiveness: 80,
        implementationTime: 1,
        maintenanceRequired: true,
        status: StrategyStatus.PLANNED,
        riskFactors: ['risk_1']
      },
      {
        strategyID: 'strategy_2',
        name: 'Flood Protection',
        description: 'Install flood barriers and drainage improvements',
        cost: 2000,
        effectiveness: 70,
        implementationTime: 7,
        maintenanceRequired: true,
        status: StrategyStatus.IN_PROGRESS,
        riskFactors: ['risk_2']
      }
    ],
    recommendations: [
      'Schedule HVAC maintenance within 30 days',
      'Consider upgrading to flood insurance',
      'Install smoke detectors in all rooms',
      'Review and update emergency contact information'
    ],
    nextAssessmentDate: Date.now() + 86400000 * 30, // 30 days from now
    assessor: 'Jane Doe',
    status: AssessmentStatus.COMPLETED
  }
];

export class InsuranceService {
  private static instance: InsuranceService;
  private eventListeners: Array<(event: InsuranceEvent) => void> = [];
  private config: InsuranceConfig = {
    autoRenewal: true,
    claimNotificationThreshold: 1000,
    riskAssessmentFrequency: 30,
    policyExpiryWarning: 30,
    defaultProviders: ['provider_1', 'provider_2'],
    riskThresholds: {
      low: 30,
      medium: 60,
      high: 80
    },
    features: {
      autoQuotes: true,
      riskMonitoring: true,
      claimAutomation: true,
      policyManagement: true
    }
  };

  private constructor() {}

  public static getInstance(): InsuranceService {
    if (!InsuranceService.instance) {
      InsuranceService.instance = new InsuranceService();
    }
    return InsuranceService.instance;
  }

  // Policy Management
  async createPolicy(policy: Partial<InsurancePolicy>): Promise<string> {
    try {
      const policyID = `policy_${Date.now()}`;
      const newPolicy: InsurancePolicy = {
        policyID,
        propertyID: policy.propertyID || 0,
        policyType: policy.policyType || InsuranceType.HOMEOWNERS,
        coverageAmount: policy.coverageAmount || 0,
        premium: policy.premium || 0,
        deductible: policy.deductible || 0,
        startDate: policy.startDate || Date.now(),
        endDate: policy.endDate || Date.now() + 365 * 86400000,
        status: PolicyStatus.ACTIVE,
        provider: policy.provider || 'Unknown Provider',
        policyNumber: `POL-${Date.now()}`,
        coverageDetails: policy.coverageDetails || {
          propertyDamage: true,
          liability: true,
          naturalDisasters: false,
          theft: true,
          vandalism: true,
          fire: true,
          flood: false,
          earthquake: false,
          windstorm: true,
          hail: true,
          coverageLimits: {},
          exclusions: [],
          additionalCoverage: []
        },
        claims: [],
        riskFactors: [],
        lastUpdated: Date.now()
      };

      mockPolicies.push(newPolicy);
      return policyID;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw new Error('Failed to create policy');
    }
  }

  async updatePolicy(policyID: string, updates: Partial<InsurancePolicy>): Promise<boolean> {
    try {
      const policyIndex = mockPolicies.findIndex(p => p.policyID === policyID);
      if (policyIndex === -1) {
        throw new Error('Policy not found');
      }

      mockPolicies[policyIndex] = {
        ...mockPolicies[policyIndex],
        ...updates,
        lastUpdated: Date.now()
      };

      return true;
    } catch (error) {
      console.error('Error updating policy:', error);
      throw new Error('Failed to update policy');
    }
  }

  async cancelPolicy(policyID: string): Promise<boolean> {
    try {
      const policyIndex = mockPolicies.findIndex(p => p.policyID === policyID);
      if (policyIndex === -1) {
        throw new Error('Policy not found');
      }

      mockPolicies[policyIndex].status = PolicyStatus.CANCELLED;
      mockPolicies[policyIndex].lastUpdated = Date.now();

      return true;
    } catch (error) {
      console.error('Error cancelling policy:', error);
      throw new Error('Failed to cancel policy');
    }
  }

  async renewPolicy(policyID: string): Promise<boolean> {
    try {
      const policyIndex = mockPolicies.findIndex(p => p.policyID === policyID);
      if (policyIndex === -1) {
        throw new Error('Policy not found');
      }

      const policy = mockPolicies[policyIndex];
      policy.endDate = policy.endDate + 365 * 86400000; // Extend by 1 year
      policy.lastUpdated = Date.now();

      return true;
    } catch (error) {
      console.error('Error renewing policy:', error);
      throw new Error('Failed to renew policy');
    }
  }

  async getPolicy(policyID: string): Promise<InsurancePolicy> {
    try {
      const policy = mockPolicies.find(p => p.policyID === policyID);
      if (!policy) {
        throw new Error('Policy not found');
      }
      return policy;
    } catch (error) {
      console.error('Error getting policy:', error);
      throw new Error('Failed to get policy');
    }
  }

  async getPolicies(filters?: InsuranceFilter): Promise<InsurancePolicy[]> {
    try {
      let filteredPolicies = [...mockPolicies];

      if (filters) {
        if (filters.policyTypes && filters.policyTypes.length > 0) {
          filteredPolicies = filteredPolicies.filter(p => 
            filters.policyTypes!.includes(p.policyType)
          );
        }

        if (filters.status && filters.status.length > 0) {
          filteredPolicies = filteredPolicies.filter(p => 
            filters.status!.includes(p.status)
          );
        }

        if (filters.dateRange) {
          filteredPolicies = filteredPolicies.filter(p => 
            p.startDate >= filters.dateRange!.start && 
            p.endDate <= filters.dateRange!.end
          );
        }
      }

      return filteredPolicies;
    } catch (error) {
      console.error('Error getting policies:', error);
      throw new Error('Failed to get policies');
    }
  }

  // Claims Management
  async submitClaim(claim: Partial<InsuranceClaim>): Promise<string> {
    try {
      const claimID = `claim_${Date.now()}`;
      const newClaim: InsuranceClaim = {
        claimID,
        policyID: claim.policyID || '',
        propertyID: claim.propertyID || 0,
        claimType: claim.claimType || ClaimType.PROPERTY_DAMAGE,
        description: claim.description || '',
        amount: claim.amount || 0,
        status: ClaimStatus.SUBMITTED,
        submittedDate: Date.now(),
        documents: claim.documents || [],
        notes: claim.notes || [],
        lastUpdated: Date.now()
      };

      mockClaims.push(newClaim);

      // Update policy with new claim
      const policyIndex = mockPolicies.findIndex(p => p.policyID === newClaim.policyID);
      if (policyIndex !== -1) {
        mockPolicies[policyIndex].claims.push(newClaim);
        mockPolicies[policyIndex].lastUpdated = Date.now();
      }

      return claimID;
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw new Error('Failed to submit claim');
    }
  }

  async updateClaim(claimID: string, updates: Partial<InsuranceClaim>): Promise<boolean> {
    try {
      const claimIndex = mockClaims.findIndex(c => c.claimID === claimID);
      if (claimIndex === -1) {
        throw new Error('Claim not found');
      }

      mockClaims[claimIndex] = {
        ...mockClaims[claimIndex],
        ...updates,
        lastUpdated: Date.now()
      };

      return true;
    } catch (error) {
      console.error('Error updating claim:', error);
      throw new Error('Failed to update claim');
    }
  }

  async getClaim(claimID: string): Promise<InsuranceClaim> {
    try {
      const claim = mockClaims.find(c => c.claimID === claimID);
      if (!claim) {
        throw new Error('Claim not found');
      }
      return claim;
    } catch (error) {
      console.error('Error getting claim:', error);
      throw new Error('Failed to get claim');
    }
  }

  async getClaims(filters?: InsuranceFilter): Promise<InsuranceClaim[]> {
    try {
      let filteredClaims = [...mockClaims];

      if (filters) {
        if (filters.dateRange) {
          filteredClaims = filteredClaims.filter(c => 
            c.submittedDate >= filters.dateRange!.start && 
            c.submittedDate <= filters.dateRange!.end
          );
        }
      }

      return filteredClaims;
    } catch (error) {
      console.error('Error getting claims:', error);
      throw new Error('Failed to get claims');
    }
  }

  async uploadClaimDocument(claimID: string, document: File): Promise<string> {
    try {
      const documentID = `doc_${Date.now()}`;
      const newDocument = {
        documentID,
        name: document.name,
        type: DocumentType.OTHER,
        url: `/uploads/${document.name}`,
        uploadedDate: Date.now(),
        size: document.size,
        status: DocumentStatus.UPLOADED
      };

      const claimIndex = mockClaims.findIndex(c => c.claimID === claimID);
      if (claimIndex !== -1) {
        mockClaims[claimIndex].documents.push(newDocument);
        mockClaims[claimIndex].lastUpdated = Date.now();
      }

      return documentID;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  // Risk Assessment
  async assessRisk(propertyID: number): Promise<RiskAssessment> {
    try {
      const assessmentID = `assessment_${Date.now()}`;
      const riskScore = Math.floor(Math.random() * 100);
      const riskLevel = riskScore < 30 ? RiskLevel.LOW : 
                       riskScore < 60 ? RiskLevel.MEDIUM : 
                       riskScore < 80 ? RiskLevel.HIGH : RiskLevel.CRITICAL;

      const assessment: RiskAssessment = {
        assessmentID,
        propertyID,
        assessmentDate: Date.now(),
        riskLevel,
        riskScore,
        riskFactors: [
          {
            factorID: `risk_${Date.now()}_1`,
            category: RiskCategory.STRUCTURAL,
            name: 'Property Age',
            description: 'Property age affects maintenance requirements',
            impact: RiskImpact.MEDIUM,
            probability: 60,
            severity: RiskSeverity.MODERATE,
            mitigation: 'Regular maintenance and inspections',
            cost: 1000,
            priority: Priority.MEDIUM,
            status: FactorStatus.IDENTIFIED
          }
        ],
        mitigationStrategies: [
          {
            strategyID: `strategy_${Date.now()}_1`,
            name: 'Regular Maintenance',
            description: 'Implement regular maintenance schedule',
            cost: 500,
            effectiveness: 75,
            implementationTime: 1,
            maintenanceRequired: true,
            status: StrategyStatus.PLANNED,
            riskFactors: [`risk_${Date.now()}_1`]
          }
        ],
        recommendations: [
          'Schedule regular property inspections',
          'Maintain emergency fund for repairs',
          'Consider additional insurance coverage'
        ],
        nextAssessmentDate: Date.now() + 30 * 86400000, // 30 days
        assessor: 'System Assessment',
        status: AssessmentStatus.COMPLETED
      };

      mockRiskAssessments.push(assessment);
      return assessment;
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw new Error('Failed to assess risk');
    }
  }

  async updateRiskAssessment(assessmentID: string, updates: Partial<RiskAssessment>): Promise<boolean> {
    try {
      const assessmentIndex = mockRiskAssessments.findIndex(a => a.assessmentID === assessmentID);
      if (assessmentIndex === -1) {
        throw new Error('Assessment not found');
      }

      mockRiskAssessments[assessmentIndex] = {
        ...mockRiskAssessments[assessmentIndex],
        ...updates
      };

      return true;
    } catch (error) {
      console.error('Error updating risk assessment:', error);
      throw new Error('Failed to update risk assessment');
    }
  }

  async getRiskAssessment(propertyID: number): Promise<RiskAssessment> {
    try {
      const assessment = mockRiskAssessments.find(a => a.propertyID === propertyID);
      if (!assessment) {
        throw new Error('Risk assessment not found');
      }
      return assessment;
    } catch (error) {
      console.error('Error getting risk assessment:', error);
      throw new Error('Failed to get risk assessment');
    }
  }

  async getRiskAssessments(filters?: InsuranceFilter): Promise<RiskAssessment[]> {
    try {
      return [...mockRiskAssessments];
    } catch (error) {
      console.error('Error getting risk assessments:', error);
      throw new Error('Failed to get risk assessments');
    }
  }

  // Provider Management
  async getProviders(): Promise<InsuranceProvider[]> {
    try {
      return [...mockProviders];
    } catch (error) {
      console.error('Error getting providers:', error);
      throw new Error('Failed to get providers');
    }
  }

  async getProvider(providerID: string): Promise<InsuranceProvider> {
    try {
      const provider = mockProviders.find(p => p.providerID === providerID);
      if (!provider) {
        throw new Error('Provider not found');
      }
      return provider;
    } catch (error) {
      console.error('Error getting provider:', error);
      throw new Error('Failed to get provider');
    }
  }

  async compareProviders(providerIDs: string[]): Promise<InsuranceProvider[]> {
    try {
      return mockProviders.filter(p => providerIDs.includes(p.providerID));
    } catch (error) {
      console.error('Error comparing providers:', error);
      throw new Error('Failed to compare providers');
    }
  }

  // Quote Management
  async generateQuote(propertyID: number, policyType: InsuranceType): Promise<InsuranceQuote[]> {
    try {
      const quotes: InsuranceQuote[] = mockProviders.map(provider => ({
        quoteID: `quote_${Date.now()}_${provider.providerID}`,
        propertyID,
        providerID: provider.providerID,
        policyType,
        coverageAmount: 500000,
        premium: Math.floor(Math.random() * 2000) + 500,
        deductible: Math.floor(Math.random() * 2000) + 500,
        coverageDetails: {
          propertyDamage: true,
          liability: true,
          naturalDisasters: policyType === InsuranceType.HOMEOWNERS,
          theft: true,
          vandalism: true,
          fire: true,
          flood: policyType === InsuranceType.FLOOD,
          earthquake: policyType === InsuranceType.EARTHQUAKE,
          windstorm: true,
          hail: true,
          coverageLimits: {
            propertyDamage: 500000,
            liability: 100000
          },
          exclusions: [],
          additionalCoverage: []
        },
        validUntil: Date.now() + 30 * 86400000, // 30 days
        terms: [
          'Coverage subject to policy terms and conditions',
          'Premium may vary based on final underwriting',
          'Claims subject to deductible and coverage limits'
        ],
        exclusions: [
          'Intentional damage',
          'Wear and tear',
          'Acts of war'
        ],
        status: QuoteStatus.PENDING,
        generatedDate: Date.now()
      }));

      return quotes;
    } catch (error) {
      console.error('Error generating quotes:', error);
      throw new Error('Failed to generate quotes');
    }
  }

  async acceptQuote(quoteID: string): Promise<boolean> {
    try {
      // In a real implementation, this would create a policy from the quote
      return true;
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw new Error('Failed to accept quote');
    }
  }

  async getQuotes(propertyID: number): Promise<InsuranceQuote[]> {
    try {
      // Return empty array for now
      return [];
    } catch (error) {
      console.error('Error getting quotes:', error);
      throw new Error('Failed to get quotes');
    }
  }

  // Event Management
  subscribeToEvents(callback: (event: InsuranceEvent) => void): void {
    this.eventListeners.push(callback);
  }

  private emitEvent(event: InsuranceEvent): void {
    this.eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  async acknowledgeEvent(eventID: string): Promise<boolean> {
    try {
      // Simulate event acknowledgment
      return true;
    } catch (error) {
      console.error('Error acknowledging event:', error);
      throw new Error('Failed to acknowledge event');
    }
  }

  async getEvents(filters?: InsuranceFilter): Promise<InsuranceEvent[]> {
    try {
      const mockEvents: InsuranceEvent[] = [
        {
          eventID: 'event_1',
          type: InsuranceEventType.POLICY_EXPIRY,
          propertyID: 1,
          policyID: 'policy_1',
          severity: EventSeverity.WARNING,
          message: 'Policy expires in 30 days',
          data: { expiryDate: Date.now() + 30 * 86400000 },
          timestamp: Date.now() - 3600000,
          acknowledged: false,
          actionRequired: true
        }
      ];

      return mockEvents;
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error('Failed to get events');
    }
  }

  // Configuration
  async updateConfig(configUpdate: Partial<InsuranceConfig>): Promise<boolean> {
    try {
      this.config = { ...this.config, ...configUpdate };
      return true;
    } catch (error) {
      console.error('Error updating config:', error);
      throw new Error('Failed to update config');
    }
  }

  async getConfig(): Promise<InsuranceConfig> {
    try {
      return { ...this.config };
    } catch (error) {
      console.error('Error getting config:', error);
      throw new Error('Failed to get config');
    }
  }

  // Metrics and Reporting
  async getMetrics(): Promise<InsuranceMetrics> {
    try {
      const totalClaims = mockClaims.length;
      const openClaims = mockClaims.filter(c => 
        c.status === ClaimStatus.SUBMITTED || c.status === ClaimStatus.UNDER_REVIEW
      ).length;

      const metrics: InsuranceMetrics = {
        totalPolicies: mockPolicies.length,
        activePolicies: mockPolicies.filter(p => p.status === PolicyStatus.ACTIVE).length,
        totalCoverage: mockPolicies.reduce((sum, p) => sum + p.coverageAmount, 0),
        totalPremiums: mockPolicies.reduce((sum, p) => sum + p.premium, 0),
        totalClaims: totalClaims,
        openClaims: openClaims,
        averageClaimAmount: totalClaims > 0 ? 
          mockClaims.reduce((sum, c) => sum + c.amount, 0) / totalClaims : 0,
        averageProcessingTime: 7, // Mock value
        riskScore: mockRiskAssessments.length > 0 ? 
          mockRiskAssessments.reduce((sum, r) => sum + r.riskScore, 0) / mockRiskAssessments.length : 0,
        lastUpdated: Date.now()
      };

      return metrics;
    } catch (error) {
      console.error('Error getting metrics:', error);
      throw new Error('Failed to get metrics');
    }
  }

  async generateReport(type: string, filters: InsuranceFilter): Promise<any> {
    try {
      const report = {
        type,
        generatedAt: Date.now(),
        data: {
          policies: await this.getPolicies(filters),
          claims: await this.getClaims(filters),
          riskAssessments: await this.getRiskAssessments(filters)
        }
      };

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }
}

// Export singleton instance
export const insuranceService = InsuranceService.getInstance();
