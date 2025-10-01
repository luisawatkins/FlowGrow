// Property Development Tracker Service
// Business logic for property development tracking and management

import {
  DevelopmentProject,
  DevelopmentLocation,
  ZoningInfo,
  Variance,
  UtilityInfo,
  UtilityStatus,
  AccessInfo,
  Easement,
  EnvironmentalInfo,
  ContaminationInfo,
  EnvironmentalAssessment,
  ProjectScope,
  Specification,
  SustainabilityInfo,
  ProjectTimeline,
  Phase,
  Dependency,
  CriticalPathItem,
  Delay,
  Acceleration,
  ProjectBudget,
  BudgetPhase,
  BudgetCategory,
  BudgetSubcategory,
  ActualCost,
  Forecast,
  BudgetVariance,
  BudgetApproval,
  ProjectTeam,
  TeamMember,
  Role,
  Responsibility,
  CommunicationPlan,
  EscalationMatrix,
  ReportingSchedule,
  Meeting,
  ActionItem,
  Milestone,
  Task,
  Subtask,
  Resource,
  DevelopmentDocument,
  Permit,
  Inspection,
  InspectionResult,
  Finding,
  Contract,
  ContractTerms,
  Payment,
  Deliverable,
  AcceptanceCriteria,
  Amendment,
  Supplier,
  Product,
  SupplierPerformance,
  Risk,
  Mitigation,
  Contingency,
  Issue,
  Communication,
  ProgressTracking,
  PhaseProgress,
  TaskProgress,
  BudgetProgress,
  ScheduleProgress,
  QualityProgress,
  DevelopmentAnalytics,
  DevelopmentMetrics,
  DevelopmentTrend,
  TrendValue,
  Benchmark,
  Insight,
  Recommendation,
  DevelopmentNotification,
  DevelopmentApiRequest,
  DevelopmentFilters,
  LocationFilter,
  PriceRange,
  DateRange,
  DevelopmentApiResponse,
  Pagination,
  DevelopmentApiError,
  DevelopmentType,
  DevelopmentStatus,
  DevelopmentPhase,
  VarianceStatus,
  ComplianceStatus,
  QualityLevel,
  SpecificationStatus,
  PhaseStatus,
  DependencyType,
  MemberStatus,
  RoleLevel,
  ResponsibilityStatus,
  MeetingType,
  ActionStatus,
  Priority,
  MilestoneStatus,
  TaskStatus,
  ResourceType,
  DocumentType,
  DocumentCategory,
  DocumentStatus,
  PermitType,
  PermitStatus,
  InspectionType,
  InspectionStatus,
  FindingSeverity,
  FindingStatus,
  ContractType,
  ContractStatus,
  PaymentStatus,
  PaymentMethod,
  DeliverableStatus,
  SupplierType,
  RiskCategory,
  RiskSeverity,
  RiskStatus,
  MitigationStatus,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  CommunicationType,
  CommunicationStatus,
  InsightType,
  RecommendationType,
  RecommendationStatus,
  NotificationType,
  TrendDirection,
  SortBy,
  SortOrder,
  Coordinates,
  ContactInfo
} from '@/types/development';

// Mock data for development and testing
const mockDevelopmentProjects: DevelopmentProject[] = [
  {
    id: 'dev1',
    propertyId: 'prop1',
    developerId: 'developer1',
    name: 'Downtown Residential Complex',
    description: 'Modern 50-unit residential complex with amenities',
    type: DevelopmentType.RESIDENTIAL,
    status: DevelopmentStatus.CONSTRUCTION,
    phase: DevelopmentPhase.CONSTRUCTION,
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      lotSize: 2.5,
      zoning: {
        current: 'R-3',
        required: 'R-4',
        restrictions: ['Height limit 65 feet', 'Setback requirements'],
        variances: [
          {
            id: 'var1',
            type: 'Height Variance',
            description: 'Request to exceed height limit by 10 feet',
            status: VarianceStatus.APPROVED,
            requestedDate: '2024-01-15',
            approvedDate: '2024-02-01',
            conditions: ['Additional parking required', 'Shadow study completed']
          }
        ],
        compliance: ComplianceStatus.COMPLIANT
      },
      utilities: {
        water: {
          available: true,
          capacity: 'Sufficient',
          connectionRequired: true,
          estimatedCost: 15000,
          timeline: '2 weeks',
          provider: 'SF Water',
          contact: {
            name: 'John Smith',
            email: 'john@sfwater.com',
            phone: '(555) 123-4567',
            address: '456 Water St',
            company: 'SF Water',
            title: 'Project Manager'
          }
        },
        sewer: {
          available: true,
          capacity: 'Sufficient',
          connectionRequired: true,
          estimatedCost: 12000,
          timeline: '2 weeks',
          provider: 'SF Sewer',
          contact: {
            name: 'Jane Doe',
            email: 'jane@sfsewer.com',
            phone: '(555) 987-6543',
            address: '789 Sewer Ave',
            company: 'SF Sewer',
            title: 'Project Manager'
          }
        },
        electricity: {
          available: true,
          capacity: 'Sufficient',
          connectionRequired: true,
          estimatedCost: 25000,
          timeline: '3 weeks',
          provider: 'PG&E',
          contact: {
            name: 'Bob Johnson',
            email: 'bob@pge.com',
            phone: '(555) 456-7890',
            address: '321 Power St',
            company: 'PG&E',
            title: 'Project Manager'
          }
        },
        gas: {
          available: true,
          capacity: 'Sufficient',
          connectionRequired: true,
          estimatedCost: 8000,
          timeline: '1 week',
          provider: 'PG&E',
          contact: {
            name: 'Bob Johnson',
            email: 'bob@pge.com',
            phone: '(555) 456-7890',
            address: '321 Power St',
            company: 'PG&E',
            title: 'Project Manager'
          }
        },
        internet: {
          available: true,
          capacity: 'High Speed',
          connectionRequired: true,
          estimatedCost: 5000,
          timeline: '1 week',
          provider: 'Comcast',
          contact: {
            name: 'Alice Brown',
            email: 'alice@comcast.com',
            phone: '(555) 789-0123',
            address: '654 Internet Blvd',
            company: 'Comcast',
            title: 'Project Manager'
          }
        },
        cable: {
          available: true,
          capacity: 'Standard',
          connectionRequired: true,
          estimatedCost: 3000,
          timeline: '1 week',
          provider: 'Comcast',
          contact: {
            name: 'Alice Brown',
            email: 'alice@comcast.com',
            phone: '(555) 789-0123',
            address: '654 Internet Blvd',
            company: 'Comcast',
            title: 'Project Manager'
          }
        },
        phone: {
          available: true,
          capacity: 'Standard',
          connectionRequired: true,
          estimatedCost: 2000,
          timeline: '1 week',
          provider: 'AT&T',
          contact: {
            name: 'Charlie Wilson',
            email: 'charlie@att.com',
            phone: '(555) 321-0987',
            address: '987 Phone St',
            company: 'AT&T',
            title: 'Project Manager'
          }
        }
      },
      access: {
        roadAccess: true,
        roadType: 'Public Street',
        easements: [
          {
            type: 'Utility Easement',
            description: 'Underground utility access',
            holder: 'City of San Francisco',
            restrictions: ['No permanent structures'],
            expiresAt: undefined
          }
        ],
        restrictions: ['No heavy construction during rush hour'],
        improvements: ['New sidewalk installation', 'Street lighting upgrade']
      },
      environmental: {
        soilType: 'Clay',
        drainage: 'Good',
        floodZone: 'X',
        wetlands: false,
        endangeredSpecies: false,
        contamination: {
          present: false,
          type: '',
          severity: '',
          remediation: '',
          cost: 0,
          timeline: ''
        },
        assessments: [
          {
            type: 'Phase I ESA',
            date: '2024-01-10',
            results: 'No recognized environmental conditions',
            recommendations: ['Continue with development'],
            cost: 5000
          }
        ]
      }
    },
    scope: {
      totalArea: 100000,
      buildingArea: 80000,
      units: 50,
      floors: 6,
      parkingSpaces: 75,
      amenities: ['Fitness Center', 'Rooftop Deck', 'Community Room'],
      features: ['Energy Efficient', 'Smart Home Ready', 'Pet Friendly'],
      specifications: [
        {
          category: 'Structural',
          item: 'Concrete Foundation',
          description: 'Reinforced concrete foundation',
          quantity: 1,
          unit: 'each',
          cost: 150000,
          supplier: 'ABC Concrete',
          status: SpecificationStatus.APPROVED
        }
      ],
      quality: QualityLevel.PREMIUM,
      sustainability: {
        leedCertification: true,
        leedLevel: 'Gold',
        energyEfficiency: 'High',
        renewableEnergy: ['Solar Panels'],
        waterConservation: ['Low-flow fixtures', 'Rainwater harvesting'],
        materials: ['Recycled materials', 'Local sourcing'],
        wasteReduction: ['Construction waste recycling', 'Prefabrication']
      }
    },
    timeline: {
      startDate: '2024-01-01',
      endDate: '2025-06-30',
      phases: [
        {
          id: 'phase1',
          name: 'Design',
          description: 'Architectural and engineering design',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          duration: 90,
          status: PhaseStatus.COMPLETED,
          progress: 100,
          dependencies: [],
          deliverables: ['Architectural plans', 'Engineering drawings'],
          milestones: ['Design approval']
        },
        {
          id: 'phase2',
          name: 'Permitting',
          description: 'Obtain all necessary permits',
          startDate: '2024-02-01',
          endDate: '2024-05-31',
          duration: 120,
          status: PhaseStatus.COMPLETED,
          progress: 100,
          dependencies: ['phase1'],
          deliverables: ['Building permit', 'Environmental permits'],
          milestones: ['Permit approval']
        },
        {
          id: 'phase3',
          name: 'Construction',
          description: 'Physical construction of the building',
          startDate: '2024-06-01',
          endDate: '2025-04-30',
          duration: 330,
          status: PhaseStatus.IN_PROGRESS,
          progress: 45,
          dependencies: ['phase2'],
          deliverables: ['Completed building', 'Utilities connected'],
          milestones: ['Foundation complete', 'Framing complete', 'Final inspection']
        }
      ],
      dependencies: [
        {
          id: 'dep1',
          from: 'phase1',
          to: 'phase2',
          type: DependencyType.FINISH_TO_START,
          lag: 0,
          description: 'Design must be complete before permitting'
        }
      ],
      criticalPath: [
        {
          task: 'Foundation',
          duration: 30,
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          float: 0
        }
      ],
      delays: [],
      accelerations: []
    },
    budget: {
      totalBudget: 15000000,
      contingency: 1500000,
      phases: [
        {
          phase: 'Design',
          budgeted: 500000,
          actual: 480000,
          variance: -20000,
          percentage: 96
        },
        {
          phase: 'Permitting',
          budgeted: 200000,
          actual: 180000,
          variance: -20000,
          percentage: 90
        },
        {
          phase: 'Construction',
          budgeted: 14000000,
          actual: 6300000,
          variance: 0,
          percentage: 45
        }
      ],
      categories: [
        {
          category: 'Construction',
          budgeted: 10000000,
          actual: 4500000,
          variance: 0,
          percentage: 45,
          subcategories: [
            {
              subcategory: 'Materials',
              budgeted: 6000000,
              actual: 2700000,
              variance: 0,
              percentage: 45
            }
          ]
        }
      ],
      actualCosts: [
        {
          id: 'cost1',
          date: '2024-06-15',
          category: 'Construction',
          subcategory: 'Materials',
          description: 'Concrete delivery',
          amount: 50000,
          vendor: 'ABC Concrete',
          invoice: 'INV-001',
          approved: true
        }
      ],
      forecasts: [
        {
          id: 'forecast1',
          date: '2024-07-01',
          category: 'Construction',
          amount: 500000,
          confidence: 85,
          assumptions: ['No major delays', 'Material costs stable']
        }
      ],
      variances: [],
      approvals: [
        {
          id: 'approval1',
          amount: 15000000,
          category: 'Total Budget',
          approver: 'John Smith',
          date: '2024-01-01',
          conditions: ['Monthly reporting required', 'Change orders need approval']
        }
      ]
    },
    team: {
      members: [
        {
          id: 'member1',
          name: 'John Smith',
          role: 'Project Manager',
          company: 'ABC Development',
          email: 'john@abcdev.com',
          phone: '(555) 123-4567',
          responsibilities: ['Overall project coordination', 'Budget management'],
          startDate: '2024-01-01',
          status: MemberStatus.ACTIVE,
          skills: ['Project Management', 'Construction'],
          certifications: ['PMP', 'LEED AP']
        }
      ],
      roles: [
        {
          id: 'role1',
          name: 'Project Manager',
          description: 'Overall project coordination and management',
          responsibilities: ['Budget management', 'Schedule coordination', 'Team leadership'],
          requirements: ['PMP certification', '5+ years experience'],
          reportingTo: 'Director of Development',
          level: RoleLevel.MANAGER
        }
      ],
      responsibilities: [
        {
          id: 'resp1',
          name: 'Budget Management',
          description: 'Monitor and control project budget',
          owner: 'John Smith',
          stakeholders: ['Finance Team', 'Executive Team'],
          deliverables: ['Monthly budget reports', 'Cost forecasts'],
          timeline: 'Ongoing',
          status: ResponsibilityStatus.IN_PROGRESS
        }
      ],
      communication: {
        frequency: 'Weekly',
        methods: ['Email', 'Phone', 'Video Conference'],
        stakeholders: ['Team Members', 'Clients', 'Vendors'],
        escalation: {
          level: 'Critical Issues',
          criteria: 'Budget overrun > 10%',
          contacts: ['Director of Development', 'CEO'],
          timeline: 'Immediate'
        },
        reporting: {
          type: 'Status Report',
          frequency: 'Weekly',
          recipients: ['Executive Team', 'Clients'],
          format: 'PDF Report'
        }
      },
      meetings: [
        {
          id: 'meeting1',
          title: 'Weekly Project Review',
          type: MeetingType.WEEKLY_REVIEW,
          date: '2024-01-15',
          duration: 60,
          attendees: ['John Smith', 'Jane Doe', 'Bob Johnson'],
          agenda: ['Budget review', 'Schedule update', 'Risk assessment'],
          minutes: 'Discussed current progress and upcoming milestones',
          actionItems: [
            {
              id: 'action1',
              description: 'Update budget forecast',
              owner: 'John Smith',
              dueDate: '2024-01-22',
              status: ActionStatus.PENDING,
              priority: Priority.MEDIUM
            }
          ]
        }
      ]
    },
    milestones: [
      {
        id: 'milestone1',
        name: 'Foundation Complete',
        description: 'Concrete foundation poured and cured',
        phase: 'Construction',
        dueDate: '2024-06-30',
        status: MilestoneStatus.COMPLETED,
        dependencies: ['Permit approval'],
        deliverables: ['Foundation inspection report'],
        criteria: ['Concrete strength test passed', 'Inspection approved'],
        progress: 100,
        risks: [],
        issues: []
      }
    ],
    tasks: [
      {
        id: 'task1',
        name: 'Excavation',
        description: 'Excavate foundation area',
        phase: 'Construction',
        milestone: 'Foundation Complete',
        assignee: 'Bob Johnson',
        startDate: '2024-06-01',
        dueDate: '2024-06-10',
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        effort: 8,
        progress: 100,
        dependencies: ['Permit approval'],
        subtasks: [],
        resources: [],
        notes: ['Completed on schedule']
      }
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Architectural Plans',
        type: DocumentType.PLAN,
        category: DocumentCategory.DESIGN,
        url: '/documents/dev1/architectural_plans.pdf',
        description: 'Complete architectural drawings',
        version: '1.0',
        status: DocumentStatus.APPROVED,
        uploadedBy: 'Jane Doe',
        uploadedAt: '2024-01-15T10:00:00Z',
        approvedBy: 'John Smith',
        approvedAt: '2024-01-20T14:00:00Z',
        tags: ['design', 'architecture', 'approved']
      }
    ],
    permits: [
      {
        id: 'permit1',
        type: PermitType.BUILDING,
        number: 'BP-2024-001',
        description: 'Building permit for residential complex',
        status: PermitStatus.APPROVED,
        applicationDate: '2024-02-01',
        issuedDate: '2024-04-15',
        cost: 25000,
        requirements: ['Architectural plans', 'Engineering calculations'],
        conditions: ['Construction must start within 6 months'],
        inspections: ['Foundation', 'Framing', 'Final'],
        documents: ['doc1'],
        contact: {
          name: 'Mike Wilson',
          email: 'mike@sfbuilding.com',
          phone: '(555) 111-2222',
          address: '123 Building Dept',
          company: 'SF Building Department',
          title: 'Plan Checker'
        }
      }
    ],
    inspections: [
      {
        id: 'inspection1',
        type: InspectionType.BUILDING,
        scheduledDate: '2024-06-30',
        completedDate: '2024-06-30',
        inspector: 'Mike Wilson',
        status: InspectionStatus.COMPLETED,
        results: [
          {
            category: 'Foundation',
            status: 'Passed',
            notes: 'Foundation meets all requirements',
            photos: ['/photos/inspection1/foundation1.jpg']
          }
        ],
        findings: [],
        recommendations: ['Continue with next phase'],
        documents: ['inspection_report_1.pdf']
      }
    ],
    contracts: [
      {
        id: 'contract1',
        type: ContractType.GENERAL_CONTRACTOR,
        name: 'General Construction Contract',
        description: 'Main construction contract',
        contractor: 'XYZ Construction',
        value: 10000000,
        startDate: '2024-06-01',
        endDate: '2025-04-30',
        status: ContractStatus.ACTIVE,
        terms: {
          scope: 'Complete construction of residential complex',
          timeline: '11 months',
          paymentTerms: 'Monthly progress payments',
          warranties: ['1 year warranty on workmanship'],
          penalties: ['$1000 per day delay'],
          termination: '30 days notice required',
          forceMajeure: 'Acts of God, strikes, material shortages'
        },
        payments: [
          {
            id: 'payment1',
            amount: 500000,
            dueDate: '2024-07-01',
            status: PaymentStatus.PENDING,
            method: PaymentMethod.WIRE_TRANSFER,
            reference: 'PAY-001',
            invoice: 'INV-001'
          }
        ],
        deliverables: [
          {
            id: 'deliverable1',
            name: 'Foundation Complete',
            description: 'Concrete foundation poured and cured',
            dueDate: '2024-06-30',
            status: DeliverableStatus.COMPLETED,
            acceptance: {
              criteria: ['Concrete strength test passed', 'Inspection approved'],
              approved: true,
              approvedBy: 'John Smith',
              approvedAt: '2024-06-30T16:00:00Z',
              notes: 'Foundation meets all specifications'
            }
          }
        ],
        amendments: [],
        documents: ['contract1.pdf']
      }
    ],
    suppliers: [
      {
        id: 'supplier1',
        name: 'ABC Concrete',
        type: SupplierType.MATERIAL,
        contact: {
          name: 'Tom Brown',
          email: 'tom@abcconcrete.com',
          phone: '(555) 333-4444',
          address: '456 Concrete St',
          company: 'ABC Concrete',
          title: 'Sales Manager'
        },
        products: [
          {
            id: 'product1',
            name: 'Ready Mix Concrete',
            description: 'High strength concrete mix',
            category: 'Construction Materials',
            specifications: ['4000 PSI', 'Slump 4-6 inches'],
            price: 150,
            availability: 'Available',
            leadTime: 1,
            warranty: '1 year'
          }
        ],
        certifications: ['ISO 9001', 'ASTM Certified'],
        rating: 4.5,
        contracts: ['contract1'],
        performance: {
          onTimeDelivery: 95,
          quality: 90,
          communication: 85,
          cost: 80,
          overall: 87.5,
          issues: ['Occasional delivery delays'],
          improvements: ['Better communication on delivery times']
        }
      }
    ],
    risks: [
      {
        id: 'risk1',
        name: 'Material Price Increase',
        description: 'Risk of construction material price increases',
        category: RiskCategory.FINANCIAL,
        probability: 60,
        impact: 70,
        severity: RiskSeverity.HIGH,
        status: RiskStatus.IDENTIFIED,
        mitigation: [
          {
            id: 'mit1',
            description: 'Lock in material prices with suppliers',
            cost: 0,
            effectiveness: 80,
            timeline: '2 weeks',
            responsible: 'John Smith',
            status: MitigationStatus.COMPLETED
          }
        ],
        contingency: [
          {
            id: 'cont1',
            description: 'Use alternative materials if needed',
            cost: 100000,
            trigger: 'Price increase > 10%',
            timeline: '1 week',
            responsible: 'John Smith'
          }
        ],
        owner: 'John Smith',
        lastReview: '2024-01-15',
        nextReview: '2024-02-15'
      }
    ],
    issues: [
      {
        id: 'issue1',
        title: 'Permit Delay',
        description: 'Building permit took longer than expected',
        category: IssueCategory.SCHEDULE,
        severity: IssueSeverity.MEDIUM,
        status: IssueStatus.RESOLVED,
        reportedBy: 'John Smith',
        reportedAt: '2024-03-01',
        assignedTo: 'John Smith',
        dueDate: '2024-04-15',
        resolvedAt: '2024-04-15',
        resolution: 'Permit approved after additional documentation',
        impact: '2 week delay in construction start',
        rootCause: 'Incomplete documentation in initial submission',
        prevention: 'More thorough review of permit requirements',
        documents: ['permit_delay_report.pdf']
      }
    ],
    communications: [
      {
        id: 'comm1',
        type: CommunicationType.EMAIL,
        subject: 'Weekly Project Update',
        message: 'Project is on schedule and within budget',
        from: 'John Smith',
        to: ['jane@abcdev.com', 'bob@xyzconstruction.com'],
        cc: ['director@abcdev.com'],
        date: '2024-01-15T10:00:00Z',
        priority: Priority.MEDIUM,
        status: CommunicationStatus.SENT,
        attachments: ['weekly_report.pdf']
      }
    ],
    progress: {
      overallProgress: 45,
      phaseProgress: [
        {
          phase: 'Design',
          progress: 100,
          completed: 1,
          total: 1,
          onTime: true,
          onBudget: true
        },
        {
          phase: 'Permitting',
          progress: 100,
          completed: 1,
          total: 1,
          onTime: true,
          onBudget: true
        },
        {
          phase: 'Construction',
          progress: 45,
          completed: 1,
          total: 3,
          onTime: true,
          onBudget: true
        }
      ],
      taskProgress: [
        {
          task: 'Excavation',
          progress: 100,
          completed: 1,
          total: 1,
          onTime: true,
          blocked: false
        }
      ],
      budgetProgress: {
        spent: 6960000,
        budgeted: 14700000,
        remaining: 7740000,
        variance: 0,
        percentage: 47
      },
      scheduleProgress: {
        elapsed: 180,
        planned: 180,
        remaining: 330,
        variance: 0,
        percentage: 35
      },
      qualityProgress: {
        defects: 0,
        rework: 0,
        inspections: 1,
        passed: 1,
        failed: 0,
        percentage: 100
      },
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    analytics: {
      projectId: 'dev1',
      metrics: {
        schedulePerformance: 100,
        costPerformance: 100,
        qualityPerformance: 100,
        safetyPerformance: 100,
        productivity: 85,
        efficiency: 90,
        customerSatisfaction: 95,
        teamSatisfaction: 88
      },
      trends: [
        {
          metric: 'Progress',
          values: [
            {
              date: '2024-01-01',
              value: 0,
              context: 'Project start'
            },
            {
              date: '2024-06-01',
              value: 35,
              context: 'Construction start'
            },
            {
              date: '2024-07-01',
              value: 45,
              context: 'Foundation complete'
            }
          ],
          direction: TrendDirection.UP,
          significance: 0.95
        }
      ],
      benchmarks: [
        {
          metric: 'Schedule Performance',
          value: 100,
          industry: 85,
          bestPractice: 95,
          target: 90,
          performance: 100
        }
      ],
      insights: [
        {
          id: 'insight1',
          type: InsightType.PERFORMANCE,
          title: 'Project On Track',
          description: 'Project is performing above industry benchmarks',
          impact: 'Positive impact on project success',
          confidence: 0.9,
          source: 'Project data analysis',
          date: '2024-01-15'
        }
      ],
      recommendations: [
        {
          id: 'rec1',
          type: RecommendationType.PROCESS,
          title: 'Implement Daily Standups',
          description: 'Add daily standup meetings for better communication',
          priority: Priority.MEDIUM,
          effort: 2,
          impact: 7,
          timeline: '1 week',
          responsible: 'John Smith',
          status: RecommendationStatus.PENDING
        }
      ],
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    notifications: [
      {
        id: 'notif1',
        type: NotificationType.MILESTONE,
        title: 'Foundation Complete',
        message: 'Foundation milestone has been completed',
        recipient: 'John Smith',
        priority: Priority.MEDIUM,
        isRead: false,
        actionRequired: false,
        createdAt: '2024-06-30T16:00:00Z'
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

class DevelopmentService {
  private projects: DevelopmentProject[] = mockDevelopmentProjects;

  // Project Management
  async getDevelopmentProjects(request: DevelopmentApiRequest): Promise<DevelopmentApiResponse> {
    try {
      let filteredProjects = [...this.projects];

      if (request.filters) {
        filteredProjects = this.applyFilters(filteredProjects, request.filters);
      }

      if (request.search) {
        filteredProjects = this.applySearch(filteredProjects, request.search);
      }

      const sortedProjects = this.sortProjects(filteredProjects, request.sortBy, request.sortOrder);
      const paginatedProjects = this.paginateResults(sortedProjects, request.page, request.limit);

      return {
        success: true,
        data: paginatedProjects.results,
        pagination: paginatedProjects.pagination
      };
    } catch (error) {
      throw this.createApiError('PROJECTS_FETCH_FAILED', 'Failed to fetch development projects', error);
    }
  }

  async getDevelopmentProject(projectId: string): Promise<DevelopmentProject> {
    try {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) {
        throw this.createApiError('PROJECT_NOT_FOUND', 'Development project not found', { projectId });
      }
      return project;
    } catch (error) {
      throw this.createApiError('PROJECT_FETCH_FAILED', 'Failed to fetch development project', error);
    }
  }

  async createDevelopmentProject(project: Omit<DevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<DevelopmentProject> {
    try {
      const newProject: DevelopmentProject = {
        ...project,
        id: `dev_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.projects.push(newProject);
      return newProject;
    } catch (error) {
      throw this.createApiError('PROJECT_CREATION_FAILED', 'Failed to create development project', error);
    }
  }

  async updateDevelopmentProject(projectId: string, updates: Partial<DevelopmentProject>): Promise<DevelopmentProject> {
    try {
      const index = this.projects.findIndex(p => p.id === projectId);
      if (index === -1) {
        throw this.createApiError('PROJECT_NOT_FOUND', 'Development project not found', { projectId });
      }

      this.projects[index] = {
        ...this.projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.projects[index];
    } catch (error) {
      throw this.createApiError('PROJECT_UPDATE_FAILED', 'Failed to update development project', error);
    }
  }

  // Task Management
  async getTasks(projectId: string): Promise<Task[]> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      return project.tasks;
    } catch (error) {
      throw this.createApiError('TASKS_FETCH_FAILED', 'Failed to fetch tasks', error);
    }
  }

  async getTask(projectId: string, taskId: string): Promise<Task> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      const task = project.tasks.find(t => t.id === taskId);
      if (!task) {
        throw this.createApiError('TASK_NOT_FOUND', 'Task not found', { taskId });
      }
      return task;
    } catch (error) {
      throw this.createApiError('TASK_FETCH_FAILED', 'Failed to fetch task', error);
    }
  }

  async updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw this.createApiError('TASK_NOT_FOUND', 'Task not found', { taskId });
      }

      project.tasks[taskIndex] = {
        ...project.tasks[taskIndex],
        ...updates
      };

      await this.updateDevelopmentProject(projectId, { tasks: project.tasks });
      return project.tasks[taskIndex];
    } catch (error) {
      throw this.createApiError('TASK_UPDATE_FAILED', 'Failed to update task', error);
    }
  }

  // Milestone Management
  async getMilestones(projectId: string): Promise<Milestone[]> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      return project.milestones;
    } catch (error) {
      throw this.createApiError('MILESTONES_FETCH_FAILED', 'Failed to fetch milestones', error);
    }
  }

  async getMilestone(projectId: string, milestoneId: string): Promise<Milestone> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      const milestone = project.milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        throw this.createApiError('MILESTONE_NOT_FOUND', 'Milestone not found', { milestoneId });
      }
      return milestone;
    } catch (error) {
      throw this.createApiError('MILESTONE_FETCH_FAILED', 'Failed to fetch milestone', error);
    }
  }

  async updateMilestone(projectId: string, milestoneId: string, updates: Partial<Milestone>): Promise<Milestone> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      const milestoneIndex = project.milestones.findIndex(m => m.id === milestoneId);
      if (milestoneIndex === -1) {
        throw this.createApiError('MILESTONE_NOT_FOUND', 'Milestone not found', { milestoneId });
      }

      project.milestones[milestoneIndex] = {
        ...project.milestones[milestoneIndex],
        ...updates
      };

      await this.updateDevelopmentProject(projectId, { milestones: project.milestones });
      return project.milestones[milestoneIndex];
    } catch (error) {
      throw this.createApiError('MILESTONE_UPDATE_FAILED', 'Failed to update milestone', error);
    }
  }

  // Progress Tracking
  async getProgress(projectId: string): Promise<ProgressTracking> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      return project.progress;
    } catch (error) {
      throw this.createApiError('PROGRESS_FETCH_FAILED', 'Failed to fetch progress', error);
    }
  }

  async updateProgress(projectId: string, progress: Partial<ProgressTracking>): Promise<ProgressTracking> {
    try {
      const project = await this.getDevelopmentProject(projectId);
      const updatedProgress = {
        ...project.progress,
        ...progress,
        lastUpdated: new Date().toISOString()
      };

      await this.updateDevelopmentProject(projectId, { progress: updatedProgress });
      return updatedProgress;
    } catch (error) {
      throw this.createApiError('PROGRESS_UPDATE_FAILED', 'Failed to update progress', error);
    }
  }

  // Private helper methods
  private applyFilters(projects: DevelopmentProject[], filters: DevelopmentFilters): DevelopmentProject[] {
    return projects.filter(project => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(project.status)) return false;
      }

      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(project.type)) return false;
      }

      if (filters.phase && filters.phase.length > 0) {
        if (!filters.phase.includes(project.phase)) return false;
      }

      if (filters.budgetRange) {
        if (project.budget.totalBudget < filters.budgetRange.min || project.budget.totalBudget > filters.budgetRange.max) {
          return false;
        }
      }

      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        const projectStartDate = new Date(project.timeline.startDate);
        const projectEndDate = new Date(project.timeline.endDate);

        if (projectStartDate < startDate || projectEndDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }

  private applySearch(projects: DevelopmentProject[], query: string): DevelopmentProject[] {
    const lowercaseQuery = query.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.location.city.toLowerCase().includes(lowercaseQuery) ||
      project.location.state.toLowerCase().includes(lowercaseQuery)
    );
  }

  private sortProjects(projects: DevelopmentProject[], sortBy?: SortBy, sortOrder?: SortOrder): DevelopmentProject[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return projects.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case SortBy.NAME:
          comparison = a.name.localeCompare(b.name);
          break;
        case SortBy.STATUS:
          comparison = a.status.localeCompare(b.status);
          break;
        case SortBy.PHASE:
          comparison = a.phase.localeCompare(b.phase);
          break;
        case SortBy.START_DATE:
          comparison = new Date(a.timeline.startDate).getTime() - new Date(b.timeline.startDate).getTime();
          break;
        case SortBy.END_DATE:
          comparison = new Date(a.timeline.endDate).getTime() - new Date(b.timeline.endDate).getTime();
          break;
        case SortBy.BUDGET:
          comparison = a.budget.totalBudget - b.budget.totalBudget;
          break;
        case SortBy.PROGRESS:
          comparison = a.progress.overallProgress - b.progress.overallProgress;
          break;
        case SortBy.CREATED_AT:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case SortBy.UPDATED_AT:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return comparison * order;
    });
  }

  private paginateResults<T>(items: T[], page: number = 1, limit: number = 10): { results: T[], pagination: Pagination } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = items.slice(startIndex, endIndex);
    
    const pagination: Pagination = {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    };

    return { results, pagination };
  }

  private createApiError(code: string, message: string, details?: any): DevelopmentApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const developmentService = new DevelopmentService();
