// Rental Management Service
// Business logic for property rental management functionality

import {
  RentalProperty,
  RentalLocation,
  PropertyDetails,
  ParkingInfo,
  UtilityInfo,
  PetPolicy,
  PetDeposit,
  SmokingPolicy,
  FurnishedDetails,
  FurnishedItem,
  Amenity,
  NearbyAmenity,
  RentalPricing,
  UtilityPricing,
  AdditionalFee,
  RentalDiscount,
  SeasonalPricing,
  LeaseTerm,
  Availability,
  Showing,
  BlackoutDate,
  RentalImage,
  RentalDocument,
  RentalRules,
  RulePenalty,
  RentalPolicies,
  CancellationPolicy,
  RefundPolicy,
  DamagePolicy,
  InsurancePolicy,
  BackgroundCheckPolicy,
  CreditCheckPolicy,
  IncomePolicy,
  RentalStatistics,
  RentalReview,
  ReviewCategory,
  ReviewResponse,
  RentalInquiry,
  ContactInfo,
  InquiryResponse,
  RentalApplication,
  PersonalInfo,
  EmploymentInfo,
  Reference,
  PetInfo,
  EmergencyContact,
  ApplicationDocument,
  BackgroundCheckResult,
  CheckResult,
  CreditCheckResult,
  CreditFactor,
  IncomeVerification,
  Lease,
  LeaseTerms,
  GuestPolicy,
  MaintenancePolicy,
  TerminationPolicy,
  LeasePayment,
  LeaseRenewal,
  LeaseViolation,
  LeaseDocument,
  MaintenanceRequest,
  RentalApiRequest,
  RentalFilters,
  LocationFilter,
  PriceRange,
  RentalApiResponse,
  Pagination,
  RentalApiError,
  PropertyType,
  RentalStatus,
  ParkingType,
  PetType,
  FurnishingLevel,
  ItemCondition,
  AmenityCategory,
  AmenityType,
  PaymentFrequency,
  FeeFrequency,
  DiscountType,
  TimeUnit,
  ShowingType,
  ImageCategory,
  DocumentType,
  InsuranceType,
  BackgroundCheckType,
  ContactMethod,
  InquiryStatus,
  ApplicationStatus,
  EmploymentType,
  CheckStatus,
  LeaseStatus,
  PaymentStatus,
  PaymentMethod,
  RenewalStatus,
  ViolationType,
  ViolationSeverity,
  ViolationStatus,
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
  SortBy,
  SortOrder,
  Address,
  Coordinates,
  ImageMetadata
} from '@/types/rental';

// Mock data for development and testing
const mockRentalProperties: RentalProperty[] = [
  {
    id: 'rental1',
    propertyId: 'prop1',
    ownerId: 'owner1',
    title: 'Modern 2BR Apartment in Downtown',
    description: 'Beautiful 2-bedroom apartment with modern amenities and great location',
    type: PropertyType.APARTMENT,
    status: RentalStatus.AVAILABLE,
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      neighborhood: 'Downtown',
      schoolDistrict: 'San Francisco Unified',
      walkScore: 95,
      transitScore: 88,
      bikeScore: 72,
      nearbyAmenities: [
        {
          name: 'Whole Foods Market',
          type: AmenityType.GROCERY,
          distance: 0.2,
          rating: 4.5,
          address: '125 Main St',
          phone: '(555) 123-4567'
        }
      ]
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200,
      lotSize: 0,
      yearBuilt: 2018,
      parking: {
        type: ParkingType.GARAGE,
        spaces: 1,
        covered: true,
        assigned: true,
        cost: 200,
        restrictions: ['No oversized vehicles']
      },
      heating: 'Central',
      cooling: 'Central',
      flooring: ['Hardwood', 'Tile'],
      appliances: ['Dishwasher', 'Washer/Dryer', 'Microwave'],
      utilities: {
        included: ['Water', 'Sewer', 'Trash'],
        notIncluded: ['Electricity', 'Gas', 'Internet'],
        averageCost: 150,
        setupRequired: ['Electricity', 'Gas', 'Internet']
      },
      petPolicy: {
        allowed: true,
        types: [PetType.DOG, PetType.CAT],
        restrictions: ['No aggressive breeds'],
        deposits: [
          {
            type: PetType.DOG,
            amount: 500,
            refundable: true,
            description: 'Refundable pet deposit for dogs'
          }
        ],
        monthlyFees: 50,
        weightLimit: 50,
        breedRestrictions: ['Pit Bull', 'Rottweiler', 'German Shepherd']
      },
      smokingPolicy: {
        allowed: false,
        restrictions: ['No smoking anywhere on property'],
        designatedAreas: [],
        penalties: ['$500 fine per violation']
      },
      furnished: false
    },
    amenities: [
      {
        id: 'amenity1',
        name: 'Fitness Center',
        category: AmenityCategory.FITNESS,
        description: '24/7 access to fitness center',
        icon: 'fitness',
        isIncluded: true,
        additionalCost: 0,
        restrictions: ['Must be 18+']
      }
    ],
    pricing: {
      baseRent: 3500,
      currency: 'USD',
      paymentFrequency: PaymentFrequency.MONTHLY,
      deposit: 3500,
      applicationFee: 50,
      petFee: 50,
      utilities: {
        included: ['Water', 'Sewer', 'Trash'],
        estimated: { electricity: 80, gas: 40, internet: 60 },
        setup: { electricity: 50, gas: 30, internet: 0 }
      },
      additionalFees: [
        {
          name: 'Parking',
          amount: 200,
          frequency: FeeFrequency.MONTHLY,
          description: 'Assigned parking space',
          isRequired: false,
          isRefundable: false
        }
      ],
      discounts: [
        {
          name: 'First Month Free',
          type: DiscountType.FREE_MONTHS,
          amount: 0,
          percentage: 0,
          conditions: ['12-month lease', 'Good credit score'],
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          isActive: true
        }
      ],
      seasonalPricing: [],
      leaseTerms: [
        {
          duration: 12,
          unit: TimeUnit.MONTHS,
          discount: 0,
          isPopular: true,
          description: 'Standard 12-month lease'
        }
      ]
    },
    availability: {
      isAvailable: true,
      availableFrom: '2024-02-01',
      availableTo: undefined,
      minimumLease: 6,
      maximumLease: 24,
      noticePeriod: 30,
      showings: [
        {
          id: 'showing1',
          date: '2024-01-25',
          startTime: '14:00',
          endTime: '16:00',
          type: ShowingType.GROUP,
          maxAttendees: 10,
          registeredAttendees: ['inquirer1', 'inquirer2'],
          isFull: false,
          instructions: 'Meet at the main entrance',
          contact: {
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            preferredTime: '9 AM - 5 PM'
          }
        }
      ],
      blackoutDates: [],
      restrictions: ['No smoking', 'Pet restrictions apply']
    },
    images: [
      {
        id: 'img1',
        url: '/images/rental1/living_room.jpg',
        thumbnailUrl: '/images/rental1/thumb_living_room.jpg',
        caption: 'Spacious living room with modern finishes',
        category: ImageCategory.LIVING_ROOM,
        isPrimary: true,
        order: 1,
        metadata: {
          width: 1920,
          height: 1080,
          fileSize: 2048000,
          format: 'JPEG',
          takenAt: '2024-01-15T14:30:00Z'
        }
      }
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Lease Agreement Template',
        type: DocumentType.LEASE,
        url: '/documents/rental1/lease_template.pdf',
        description: 'Standard lease agreement template',
        isRequired: true,
        isPublic: true,
        fileSize: 1024000,
        uploadedAt: '2024-01-15T10:00:00Z',
        downloadedBy: ['inquirer1', 'inquirer2']
      }
    ],
    rules: {
      id: 'rules1',
      propertyId: 'rental1',
      generalRules: ['No smoking', 'No loud music after 10 PM'],
      noiseRules: ['Quiet hours 10 PM - 7 AM', 'No excessive noise'],
      guestRules: ['Guests allowed up to 7 days', 'Registration required for longer stays'],
      parkingRules: ['Assigned parking only', 'No oversized vehicles'],
      maintenanceRules: ['Report issues within 24 hours', 'Emergency maintenance available 24/7'],
      safetyRules: ['Smoke detectors must not be tampered with', 'Emergency exits must remain clear'],
      communityRules: ['Respect common areas', 'No littering'],
      penalties: [
        {
          violation: 'Noise violation',
          firstOffense: 'Warning',
          secondOffense: '$100 fine',
          thirdOffense: '$250 fine',
          severeOffense: 'Lease termination'
        }
      ],
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    policies: {
      id: 'policies1',
      propertyId: 'rental1',
      cancellationPolicy: {
        allowed: true,
        noticeRequired: 30,
        penalties: ['Loss of deposit'],
        refundPercentage: 0,
        exceptions: ['Military deployment', 'Job relocation']
      },
      refundPolicy: {
        depositRefundable: true,
        conditions: ['No damage', 'Clean condition', 'All rent paid'],
        processingTime: 14,
        fees: 0,
        exceptions: ['Damage beyond normal wear and tear']
      },
      damagePolicy: {
        normalWearAndTear: ['Minor scuffs', 'Faded paint', 'Worn carpet'],
        tenantResponsibility: ['Holes in walls', 'Broken appliances', 'Stains'],
        landlordResponsibility: ['Structural issues', 'Plumbing problems', 'HVAC maintenance'],
        reportingRequirements: ['Report within 24 hours', 'Provide photos'],
        repairProcess: ['Assessment within 48 hours', 'Repair within 7 days']
      },
      insurancePolicy: {
        required: true,
        minimumCoverage: 100000,
        types: [InsuranceType.RENTERS, InsuranceType.LIABILITY],
        proofRequired: true,
        renewalRequired: true
      },
      backgroundCheckPolicy: {
        required: true,
        checks: [BackgroundCheckType.CRIMINAL, BackgroundCheckType.EVICTION],
        criteria: ['No felonies', 'No evictions in past 5 years'],
        fees: 50,
        processingTime: 3
      },
      creditCheckPolicy: {
        required: true,
        minimumScore: 650,
        criteria: ['Good payment history', 'Low debt-to-income ratio'],
        fees: 25,
        processingTime: 1
      },
      incomePolicy: {
        required: true,
        minimumIncome: 10500,
        incomeMultiplier: 3,
        proofRequired: ['Pay stubs', 'Bank statements', 'Employment verification'],
        verificationProcess: ['Submit documents', 'Employer verification', 'Bank verification']
      },
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    statistics: {
      totalViews: 0,
      uniqueViews: 0,
      inquiries: 0,
      applications: 0,
      leases: 0,
      averageRating: 0,
      totalReviews: 0,
      occupancyRate: 0,
      averageRent: 3500,
      revenue: 0,
      expenses: 0,
      profit: 0,
      maintenanceCosts: 0,
      vacancyDays: 0,
      averageLeaseLength: 0,
      renewalRate: 0,
      lastUpdated: '2024-01-15T10:00:00Z'
    },
    reviews: [],
    inquiries: [],
    applications: [],
    leases: [],
    maintenance: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const mockRentalInquiries: RentalInquiry[] = [
  {
    id: 'inquiry1',
    propertyId: 'rental1',
    inquirerId: 'inquirer1',
    subject: 'Interested in 2BR Apartment',
    message: 'I am interested in viewing this apartment. When is it available for showing?',
    contactInfo: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '(555) 987-6543',
      preferredTime: 'Evenings and weekends'
    },
    preferredContactMethod: ContactMethod.EMAIL,
    moveInDate: '2024-02-15',
    leaseLength: 12,
    status: InquiryStatus.NEW,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

const mockRentalApplications: RentalApplication[] = [
  {
    id: 'app1',
    propertyId: 'rental1',
    applicantId: 'applicant1',
    status: ApplicationStatus.SUBMITTED,
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1990-05-15',
      ssn: '123-45-6789',
      currentAddress: {
        street: '456 Oak Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        country: 'USA'
      },
      previousAddresses: [],
      emergencyContact: {
        name: 'Mary Smith',
        relationship: 'Mother',
        phone: '(555) 111-2222',
        email: 'mary@example.com',
        address: {
          street: '789 Pine St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94104',
          country: 'USA'
        }
      },
      dependents: 0,
      pets: []
    },
    employmentInfo: {
      employer: 'Tech Corp',
      position: 'Software Engineer',
      startDate: '2020-01-15',
      salary: 120000,
      employmentType: EmploymentType.FULL_TIME,
      supervisor: 'Bob Johnson',
      supervisorPhone: '(555) 333-4444'
    },
    references: [
      {
        name: 'Alice Brown',
        company: 'Previous Landlord',
        phone: '(555) 555-6666',
        email: 'alice@example.com',
        relationship: 'Previous Landlord'
      }
    ],
    documents: [
      {
        id: 'doc1',
        type: DocumentType.IDENTIFICATION,
        name: 'Driver License',
        url: '/documents/app1/driver_license.pdf',
        uploadedAt: '2024-01-22T10:00:00Z',
        isVerified: false
      }
    ],
    backgroundCheck: {
      status: CheckStatus.PENDING,
      results: [],
      completedAt: ''
    },
    creditCheck: {
      status: CheckStatus.PENDING,
      score: 0,
      completedAt: '',
      factors: []
    },
    incomeVerification: {
      status: CheckStatus.PENDING,
      verifiedIncome: 0,
      documents: [],
      completedAt: '',
      notes: []
    },
    notes: ['Application submitted online'],
    submittedAt: '2024-01-22T10:00:00Z'
  }
];

class RentalService {
  private properties: RentalProperty[] = mockRentalProperties;
  private inquiries: RentalInquiry[] = mockRentalInquiries;
  private applications: RentalApplication[] = mockRentalApplications;

  // Property Management
  async getRentalProperties(request: RentalApiRequest): Promise<RentalApiResponse> {
    try {
      let filteredProperties = [...this.properties];

      if (request.filters) {
        filteredProperties = this.applyFilters(filteredProperties, request.filters);
      }

      if (request.search) {
        filteredProperties = this.applySearch(filteredProperties, request.search);
      }

      const sortedProperties = this.sortProperties(filteredProperties, request.sortBy, request.sortOrder);
      const paginatedProperties = this.paginateResults(sortedProperties, request.page, request.limit);

      return {
        success: true,
        data: paginatedProperties.results,
        pagination: paginatedProperties.pagination
      };
    } catch (error) {
      throw this.createApiError('PROPERTIES_FETCH_FAILED', 'Failed to fetch rental properties', error);
    }
  }

  async getRentalProperty(propertyId: string): Promise<RentalProperty> {
    try {
      const property = this.properties.find(p => p.id === propertyId);
      if (!property) {
        throw this.createApiError('PROPERTY_NOT_FOUND', 'Rental property not found', { propertyId });
      }
      return property;
    } catch (error) {
      throw this.createApiError('PROPERTY_FETCH_FAILED', 'Failed to fetch rental property', error);
    }
  }

  async createRentalProperty(property: Omit<RentalProperty, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalProperty> {
    try {
      const newProperty: RentalProperty = {
        ...property,
        id: `rental_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.properties.push(newProperty);
      return newProperty;
    } catch (error) {
      throw this.createApiError('PROPERTY_CREATION_FAILED', 'Failed to create rental property', error);
    }
  }

  async updateRentalProperty(propertyId: string, updates: Partial<RentalProperty>): Promise<RentalProperty> {
    try {
      const index = this.properties.findIndex(p => p.id === propertyId);
      if (index === -1) {
        throw this.createApiError('PROPERTY_NOT_FOUND', 'Rental property not found', { propertyId });
      }

      this.properties[index] = {
        ...this.properties[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.properties[index];
    } catch (error) {
      throw this.createApiError('PROPERTY_UPDATE_FAILED', 'Failed to update rental property', error);
    }
  }

  // Inquiry Management
  async getInquiries(propertyId?: string): Promise<RentalInquiry[]> {
    try {
      if (propertyId) {
        return this.inquiries.filter(i => i.propertyId === propertyId);
      }
      return this.inquiries;
    } catch (error) {
      throw this.createApiError('INQUIRIES_FETCH_FAILED', 'Failed to fetch inquiries', error);
    }
  }

  async getInquiry(inquiryId: string): Promise<RentalInquiry> {
    try {
      const inquiry = this.inquiries.find(i => i.id === inquiryId);
      if (!inquiry) {
        throw this.createApiError('INQUIRY_NOT_FOUND', 'Inquiry not found', { inquiryId });
      }
      return inquiry;
    } catch (error) {
      throw this.createApiError('INQUIRY_FETCH_FAILED', 'Failed to fetch inquiry', error);
    }
  }

  async createInquiry(inquiry: Omit<RentalInquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<RentalInquiry> {
    try {
      const newInquiry: RentalInquiry = {
        ...inquiry,
        id: `inquiry_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.inquiries.push(newInquiry);
      return newInquiry;
    } catch (error) {
      throw this.createApiError('INQUIRY_CREATION_FAILED', 'Failed to create inquiry', error);
    }
  }

  async updateInquiry(inquiryId: string, updates: Partial<RentalInquiry>): Promise<RentalInquiry> {
    try {
      const index = this.inquiries.findIndex(i => i.id === inquiryId);
      if (index === -1) {
        throw this.createApiError('INQUIRY_NOT_FOUND', 'Inquiry not found', { inquiryId });
      }

      this.inquiries[index] = {
        ...this.inquiries[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.inquiries[index];
    } catch (error) {
      throw this.createApiError('INQUIRY_UPDATE_FAILED', 'Failed to update inquiry', error);
    }
  }

  // Application Management
  async getApplications(propertyId?: string): Promise<RentalApplication[]> {
    try {
      if (propertyId) {
        return this.applications.filter(a => a.propertyId === propertyId);
      }
      return this.applications;
    } catch (error) {
      throw this.createApiError('APPLICATIONS_FETCH_FAILED', 'Failed to fetch applications', error);
    }
  }

  async getApplication(applicationId: string): Promise<RentalApplication> {
    try {
      const application = this.applications.find(a => a.id === applicationId);
      if (!application) {
        throw this.createApiError('APPLICATION_NOT_FOUND', 'Application not found', { applicationId });
      }
      return application;
    } catch (error) {
      throw this.createApiError('APPLICATION_FETCH_FAILED', 'Failed to fetch application', error);
    }
  }

  async createApplication(application: Omit<RentalApplication, 'id' | 'submittedAt'>): Promise<RentalApplication> {
    try {
      const newApplication: RentalApplication = {
        ...application,
        id: `app_${Date.now()}`,
        submittedAt: new Date().toISOString()
      };

      this.applications.push(newApplication);
      return newApplication;
    } catch (error) {
      throw this.createApiError('APPLICATION_CREATION_FAILED', 'Failed to create application', error);
    }
  }

  async updateApplication(applicationId: string, updates: Partial<RentalApplication>): Promise<RentalApplication> {
    try {
      const index = this.applications.findIndex(a => a.id === applicationId);
      if (index === -1) {
        throw this.createApiError('APPLICATION_NOT_FOUND', 'Application not found', { applicationId });
      }

      this.applications[index] = {
        ...this.applications[index],
        ...updates
      };

      return this.applications[index];
    } catch (error) {
      throw this.createApiError('APPLICATION_UPDATE_FAILED', 'Failed to update application', error);
    }
  }

  // Private helper methods
  private applyFilters(properties: RentalProperty[], filters: RentalFilters): RentalProperty[] {
    return properties.filter(property => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(property.status)) return false;
      }

      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(property.type)) return false;
      }

      if (filters.priceRange) {
        if (property.pricing.baseRent < filters.priceRange.min || property.pricing.baseRent > filters.priceRange.max) {
          return false;
        }
      }

      if (filters.bedrooms && filters.bedrooms.length > 0) {
        if (!filters.bedrooms.includes(property.details.bedrooms)) return false;
      }

      if (filters.bathrooms && filters.bathrooms.length > 0) {
        if (!filters.bathrooms.includes(property.details.bathrooms)) return false;
      }

      if (filters.petFriendly !== undefined) {
        if (property.details.petPolicy.allowed !== filters.petFriendly) return false;
      }

      if (filters.furnished !== undefined) {
        if (property.details.furnished !== filters.furnished) return false;
      }

      if (filters.availableFrom) {
        if (new Date(property.availability.availableFrom) > new Date(filters.availableFrom)) return false;
      }

      return true;
    });
  }

  private applySearch(properties: RentalProperty[], query: string): RentalProperty[] {
    const lowercaseQuery = query.toLowerCase();
    return properties.filter(property =>
      property.title.toLowerCase().includes(lowercaseQuery) ||
      property.description.toLowerCase().includes(lowercaseQuery) ||
      property.location.city.toLowerCase().includes(lowercaseQuery) ||
      property.location.state.toLowerCase().includes(lowercaseQuery) ||
      property.location.neighborhood.toLowerCase().includes(lowercaseQuery)
    );
  }

  private sortProperties(properties: RentalProperty[], sortBy?: SortBy, sortOrder?: SortOrder): RentalProperty[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return properties.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case SortBy.PRICE:
          comparison = a.pricing.baseRent - b.pricing.baseRent;
          break;
        case SortBy.BEDROOMS:
          comparison = a.details.bedrooms - b.details.bedrooms;
          break;
        case SortBy.BATHROOMS:
          comparison = a.details.bathrooms - b.details.bathrooms;
          break;
        case SortBy.SQUARE_FOOTAGE:
          comparison = a.details.squareFootage - b.details.squareFootage;
          break;
        case SortBy.CREATED_AT:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case SortBy.UPDATED_AT:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case SortBy.RATING:
          comparison = a.statistics.averageRating - b.statistics.averageRating;
          break;
        case SortBy.AVAILABILITY:
          comparison = new Date(a.availability.availableFrom).getTime() - new Date(b.availability.availableFrom).getTime();
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

  private createApiError(code: string, message: string, details?: any): RentalApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const rentalService = new RentalService();
