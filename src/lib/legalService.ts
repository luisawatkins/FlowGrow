// Legal Document Generator Service
// Business logic for property legal document generation

import {
  LegalDocument,
  DocumentTemplate,
  DocumentContent,
  DocumentSection,
  ContentSection,
  ContentVariable,
  DocumentFormatting,
  Margins,
  HeaderFooter,
  Party,
  ContactInfo,
  Address,
  Identification,
  Representation,
  Capacity,
  Authority,
  DocumentTerms,
  TerminationClause,
  RenewalClause,
  ModificationClause,
  AssignmentClause,
  DisputeResolution,
  ForceMajeureClause,
  ConfidentialityClause,
  IndemnificationClause,
  LimitationClause,
  WarrantyClause,
  RepresentationClause,
  CovenantClause,
  ConditionClause,
  RemedyClause,
  PenaltyClause,
  NoticeClause,
  SeverabilityClause,
  EntireAgreementClause,
  InterpretationClause,
  DefinitionClause,
  Definition,
  ScheduleClause,
  Schedule,
  ExhibitClause,
  Exhibit,
  OtherClause,
  Clause,
  Signature,
  Attachment,
  DocumentMetadata,
  ChangeLogEntry,
  Approval,
  Review,
  Comment,
  TableOfContentsEntry,
  CrossReference,
  RelatedDocument,
  Precedent,
  Citation,
  Footnote,
  Endnote,
  BibliographyEntry,
  IndexEntry,
  GlossaryEntry,
  Appendix,
  Supplement,
  TemplateVariable,
  ValidationRule,
  Requirement,
  LegalApiRequest,
  LegalFilters,
  DateRange,
  LegalApiResponse,
  LegalApiError,
  DocumentType,
  DocumentStatus,
  DocumentCategory,
  PartyType,
  VariableType,
  ValidationType,
  RequirementType,
  ClauseType,
  SignatureType,
  SignatureMethod,
  SignatureStatus,
  ApprovalStatus,
  ReviewStatus,
  SortBy,
  SortOrder,
  Pagination
} from '@/types/legal';

// Mock data for development and testing
const mockLegalDocuments: LegalDocument[] = [
  {
    id: 'legal1',
    propertyId: 'prop1',
    type: DocumentType.LEASE,
    title: 'Residential Lease Agreement',
    description: 'Standard residential lease agreement for 123 Main St',
    status: DocumentStatus.DRAFT,
    template: {
      id: 'template1',
      name: 'Standard Residential Lease',
      type: DocumentType.LEASE,
      category: DocumentCategory.LEASE,
      jurisdiction: 'California',
      version: '1.0',
      description: 'Standard residential lease template for California',
      content: 'Lease agreement content...',
      variables: [
        {
          name: 'tenant_name',
          type: VariableType.TEXT,
          description: 'Full name of the tenant',
          required: true,
          validation: [
            {
              type: ValidationType.REQUIRED,
              value: true,
              message: 'Tenant name is required'
            }
          ]
        }
      ],
      sections: [
        {
          id: 'section1',
          title: 'Parties',
          content: 'This lease agreement is between {{landlord_name}} and {{tenant_name}}.',
          order: 1,
          required: true,
          variables: ['landlord_name', 'tenant_name'],
          clauses: []
        }
      ],
      requirements: [
        {
          id: 'req1',
          description: 'Property must be habitable',
          type: RequirementType.LEGAL,
          mandatory: true,
          alternatives: [],
          documentation: ['Property inspection report']
        }
      ],
      isActive: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    content: {
      html: '<html>Lease agreement HTML content</html>',
      text: 'Lease agreement text content',
      pdf: '/documents/legal1/lease.pdf',
      sections: [
        {
          id: 'section1',
          title: 'Parties',
          content: 'This lease agreement is between John Smith and Jane Doe.',
          order: 1,
          variables: [
            {
              name: 'landlord_name',
              value: 'John Smith',
              type: VariableType.TEXT,
              required: true,
              validation: []
            }
          ]
        }
      ],
      variables: [
        {
          name: 'landlord_name',
          value: 'John Smith',
          type: VariableType.TEXT,
          required: true,
          validation: []
        }
      ],
      formatting: {
        font: 'Times New Roman',
        fontSize: 12,
        lineSpacing: 1.5,
        margins: {
          top: 1,
          bottom: 1,
          left: 1,
          right: 1
        },
        headers: {
          content: 'Residential Lease Agreement',
          fontSize: 14,
          alignment: 'center'
        },
        footers: {
          content: 'Page {{page}} of {{total_pages}}',
          fontSize: 10,
          alignment: 'center'
        },
        pageNumbers: true,
        watermark: ''
      }
    },
    parties: [
      {
        id: 'party1',
        type: PartyType.INDIVIDUAL,
        name: 'John Smith',
        role: 'Landlord',
        contact: {
          email: 'john@example.com',
          phone: '(555) 123-4567'
        },
        address: {
          street: '456 Oak Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA'
        },
        identification: {
          type: 'Driver License',
          number: 'DL123456789',
          issuer: 'California DMV'
        },
        representation: {
          isRepresented: false
        },
        capacity: {
          isMinor: false,
          isIncompetent: false,
          isBankrupt: false,
          isInsolvent: false
        },
        authority: {
          hasAuthority: true,
          source: 'Property ownership'
        }
      }
    ],
    terms: {
      effectiveDate: '2024-02-01',
      expiryDate: '2025-01-31',
      termination: {
        events: ['Non-payment of rent', 'Property damage', 'Violation of terms'],
        notice: '30 days written notice',
        consequences: ['Eviction proceedings', 'Forfeiture of security deposit'],
        survival: ['Confidentiality', 'Indemnification']
      },
      renewal: {
        automatic: false,
        notice: '60 days written notice',
        conditions: ['Good standing', 'Market rate adjustment'],
        terms: ['Same terms and conditions']
      },
      modification: {
        allowed: true,
        requirements: ['Written agreement', 'Both parties consent'],
        limitations: ['No rent reduction', 'No term extension'],
        consequences: ['Updated agreement', 'New signatures required']
      },
      assignment: {
        allowed: false,
        restrictions: ['No subletting', 'No assignment'],
        requirements: ['Landlord approval required'],
        consequences: ['Lease termination', 'Penalty fees']
      },
      governingLaw: 'California Civil Code',
      jurisdiction: 'San Francisco County',
      disputeResolution: {
        method: 'Arbitration',
        venue: 'San Francisco',
        language: 'English',
        costs: 'Split equally',
        enforcement: 'Binding arbitration'
      },
      forceMajeure: {
        events: ['Natural disasters', 'Government actions', 'Pandemics'],
        consequences: ['Suspension of obligations', 'No penalties'],
        notice: 'Immediate written notice',
        mitigation: ['Reasonable efforts to resume performance']
      },
      confidentiality: {
        scope: 'All non-public information',
        duration: '5 years after termination',
        exceptions: ['Legal requirements', 'Court orders'],
        remedies: ['Injunctive relief', 'Damages']
      },
      indemnification: {
        scope: 'Third party claims',
        limitations: ['Tenant's negligence', 'Tenant's breach'],
        procedures: ['Notice within 30 days', 'Cooperation required'],
        insurance: ['General liability', 'Property damage']
      },
      limitation: {
        liability: 'Limited to actual damages',
        damages: 'No punitive damages',
        time: '1 year limitation period',
        other: ['No consequential damages']
      },
      warranties: {
        scope: 'Property condition',
        duration: 'During lease term',
        limitations: ['Normal wear and tear', 'Tenant damage'],
        remedies: ['Repair or replacement', 'Rent reduction']
      },
      representations: {
        scope: 'Property information',
        accuracy: 'True and complete',
        updates: 'Immediate notice of changes',
        consequences: ['Breach of contract', 'Termination rights']
      },
      covenants: {
        affirmative: ['Pay rent on time', 'Maintain property', 'Comply with laws'],
        negative: ['No illegal activities', 'No excessive noise', 'No pets'],
        financial: ['Maintain insurance', 'Pay utilities', 'No liens'],
        operational: ['Regular maintenance', 'Emergency access', 'Inspections']
      },
      conditions: {
        precedent: ['Security deposit', 'Background check', 'Insurance'],
        subsequent: ['Property inspection', 'Utilities connection'],
        performance: ['Rent payment', 'Property maintenance'],
        other: ['Compliance with laws', 'No violations']
      },
      remedies: {
        specific: ['Eviction', 'Rent collection', 'Property recovery'],
        monetary: ['Rent arrears', 'Late fees', 'Damages'],
        injunctive: ['Cease and desist', 'Property access', 'Quiet enjoyment'],
        other: ['Lease termination', 'Security deposit forfeiture']
      },
      penalties: {
        late: '$50 per day',
        breach: 'Actual damages',
        other: ['Legal fees', 'Collection costs']
      },
      notices: {
        method: 'Written notice',
        address: 'Property address',
        language: 'English',
        timing: '5 business days'
      },
      severability: {
        effect: 'Remaining provisions remain in effect',
        replacement: 'Reasonable interpretation',
        remainder: 'Valid and enforceable'
      },
      entireAgreement: {
        scope: 'All terms and conditions',
        integration: 'Supersedes all prior agreements',
        parol: 'No oral modifications'
      },
      interpretation: {
        rules: ['Plain meaning', 'Context consideration', 'Reasonable construction'],
        definitions: ['Technical terms', 'Legal terms', 'Industry terms'],
        headings: 'For convenience only',
        gender: 'Includes all genders'
      },
      definitions: {
        terms: [
          {
            term: 'Property',
            definition: 'The premises described in this lease',
            context: 'Throughout the agreement',
            examples: ['123 Main St', 'Apartment 2B']
          }
        ],
        crossReferences: ['Schedule A', 'Exhibit 1'],
        updates: 'As needed for clarity'
      },
      schedules: {
        schedules: [
          {
            id: 'schedule1',
            title: 'Property Description',
            content: 'Detailed property description',
            order: 1
          }
        ],
        incorporation: 'By reference',
        updates: 'As needed'
      },
      exhibits: {
        exhibits: [
          {
            id: 'exhibit1',
            title: 'Property Photos',
            content: 'Property photographs',
            order: 1
          }
        ],
        incorporation: 'By reference',
        updates: 'As needed'
      },
      other: []
    },
    clauses: [
      {
        id: 'clause1',
        title: 'Rent Payment',
        content: 'Tenant shall pay rent of $3,000 per month on the 1st of each month.',
        type: ClauseType.TERM,
        order: 1,
        required: true,
        variables: ['rent_amount', 'payment_date'],
        conditions: ['Good standing', 'No violations'],
        consequences: ['Late fees', 'Eviction proceedings']
      }
    ],
    signatures: [
      {
        id: 'sig1',
        partyId: 'party1',
        type: SignatureType.ELECTRONIC_SIGNATURE,
        method: SignatureMethod.WEB_BASED,
        status: SignatureStatus.PENDING
      }
    ],
    attachments: [
      {
        id: 'att1',
        name: 'Property Photos',
        type: 'image',
        url: '/attachments/legal1/photos.zip',
        size: 2048000,
        uploadedAt: '2024-01-15T10:00:00Z',
        uploadedBy: 'user1',
        description: 'Property photographs',
        isRequired: true,
        isPublic: false
      }
    ],
    metadata: {
      version: '1.0',
      language: 'English',
      jurisdiction: 'California',
      governingLaw: 'California Civil Code',
      lastModified: '2024-01-15T10:00:00Z',
      modifiedBy: 'user1',
      changeLog: [
        {
          date: '2024-01-15T10:00:00Z',
          user: 'user1',
          changes: ['Initial creation'],
          reason: 'New lease agreement',
          version: '1.0'
        }
      ],
      approvals: [],
      reviews: [],
      comments: [],
      tags: ['lease', 'residential', 'california'],
      categories: ['legal', 'property', 'residential'],
      keywords: ['lease', 'rental', 'residential', 'property'],
      summary: 'Standard residential lease agreement',
      abstract: 'Lease agreement for residential property',
      tableOfContents: [
        {
          title: 'Parties',
          page: 1,
          level: 1,
          children: []
        }
      ],
      crossReferences: [],
      relatedDocuments: [],
      precedents: [],
      citations: [],
      footnotes: [],
      endnotes: [],
      bibliography: [],
      index: [],
      glossary: [],
      appendices: [],
      supplements: []
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

class LegalService {
  private documents: LegalDocument[] = mockLegalDocuments;

  // Document Management
  async getLegalDocuments(request: LegalApiRequest): Promise<LegalApiResponse> {
    try {
      let filteredDocuments = [...this.documents];

      if (request.filters) {
        filteredDocuments = this.applyFilters(filteredDocuments, request.filters);
      }

      if (request.search) {
        filteredDocuments = this.applySearch(filteredDocuments, request.search);
      }

      const sortedDocuments = this.sortDocuments(filteredDocuments, request.sortBy, request.sortOrder);
      const paginatedDocuments = this.paginateResults(sortedDocuments, request.page, request.limit);

      return {
        success: true,
        data: paginatedDocuments.results,
        pagination: paginatedDocuments.pagination
      };
    } catch (error) {
      throw this.createApiError('DOCUMENTS_FETCH_FAILED', 'Failed to fetch legal documents', error);
    }
  }

  async getLegalDocument(documentId: string): Promise<LegalDocument> {
    try {
      const document = this.documents.find(d => d.id === documentId);
      if (!document) {
        throw this.createApiError('DOCUMENT_NOT_FOUND', 'Legal document not found', { documentId });
      }
      return document;
    } catch (error) {
      throw this.createApiError('DOCUMENT_FETCH_FAILED', 'Failed to fetch legal document', error);
    }
  }

  async createLegalDocument(document: Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegalDocument> {
    try {
      const newDocument: LegalDocument = {
        ...document,
        id: `legal_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.documents.push(newDocument);
      return newDocument;
    } catch (error) {
      throw this.createApiError('DOCUMENT_CREATION_FAILED', 'Failed to create legal document', error);
    }
  }

  async updateLegalDocument(documentId: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    try {
      const index = this.documents.findIndex(d => d.id === documentId);
      if (index === -1) {
        throw this.createApiError('DOCUMENT_NOT_FOUND', 'Legal document not found', { documentId });
      }

      this.documents[index] = {
        ...this.documents[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.documents[index];
    } catch (error) {
      throw this.createApiError('DOCUMENT_UPDATE_FAILED', 'Failed to update legal document', error);
    }
  }

  // Template Management
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    try {
      const templates: DocumentTemplate[] = [
        {
          id: 'template1',
          name: 'Standard Residential Lease',
          type: DocumentType.LEASE,
          category: DocumentCategory.LEASE,
          jurisdiction: 'California',
          version: '1.0',
          description: 'Standard residential lease template for California',
          content: 'Lease agreement content...',
          variables: [],
          sections: [],
          requirements: [],
          isActive: true,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ];
      return templates;
    } catch (error) {
      throw this.createApiError('TEMPLATES_FETCH_FAILED', 'Failed to fetch document templates', error);
    }
  }

  async getDocumentTemplate(templateId: string): Promise<DocumentTemplate> {
    try {
      const templates = await this.getDocumentTemplates();
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw this.createApiError('TEMPLATE_NOT_FOUND', 'Document template not found', { templateId });
      }
      return template;
    } catch (error) {
      throw this.createApiError('TEMPLATE_FETCH_FAILED', 'Failed to fetch document template', error);
    }
  }

  // Document Generation
  async generateDocument(templateId: string, variables: Record<string, any>): Promise<LegalDocument> {
    try {
      const template = await this.getDocumentTemplate(templateId);
      
      const document: LegalDocument = {
        id: `legal_${Date.now()}`,
        propertyId: variables.propertyId || '',
        type: template.type,
        title: template.name,
        description: template.description,
        status: DocumentStatus.DRAFT,
        template,
        content: {
          html: template.content,
          text: template.content,
          pdf: '',
          sections: [],
          variables: Object.entries(variables).map(([name, value]) => ({
            name,
            value: String(value),
            type: VariableType.TEXT,
            required: false,
            validation: []
          })),
          formatting: {
            font: 'Times New Roman',
            fontSize: 12,
            lineSpacing: 1.5,
            margins: { top: 1, bottom: 1, left: 1, right: 1 },
            headers: { content: '', fontSize: 12, alignment: 'left' },
            footers: { content: '', fontSize: 10, alignment: 'left' },
            pageNumbers: true,
            watermark: ''
          }
        },
        parties: [],
        terms: {
          effectiveDate: new Date().toISOString(),
          termination: { events: [], notice: '', consequences: [], survival: [] },
          renewal: { automatic: false, notice: '', conditions: [], terms: [] },
          modification: { allowed: false, requirements: [], limitations: [], consequences: [] },
          assignment: { allowed: false, restrictions: [], requirements: [], consequences: [] },
          governingLaw: '',
          jurisdiction: '',
          disputeResolution: { method: '', venue: '', language: '', costs: '', enforcement: '' },
          forceMajeure: { events: [], consequences: [], notice: '', mitigation: [] },
          confidentiality: { scope: '', duration: '', exceptions: [], remedies: [] },
          indemnification: { scope: '', limitations: [], procedures: [], insurance: [] },
          limitation: { liability: '', damages: '', time: '', other: [] },
          warranties: { scope: '', duration: '', limitations: [], remedies: [] },
          representations: { scope: '', accuracy: '', updates: '', consequences: [] },
          covenants: { affirmative: [], negative: [], financial: [], operational: [] },
          conditions: { precedent: [], subsequent: [], performance: [], other: [] },
          remedies: { specific: [], monetary: [], injunctive: [], other: [] },
          penalties: { late: '', breach: '', other: [] },
          notices: { method: '', address: '', language: '', timing: '' },
          severability: { effect: '', replacement: '', remainder: '' },
          entireAgreement: { scope: '', integration: '', parol: '' },
          interpretation: { rules: [], definitions: [], headings: '', gender: '' },
          definitions: { terms: [], crossReferences: [], updates: '' },
          schedules: { schedules: [], incorporation: '', updates: '' },
          exhibits: { exhibits: [], incorporation: '', updates: '' },
          other: []
        },
        clauses: [],
        signatures: [],
        attachments: [],
        metadata: {
          version: '1.0',
          language: 'English',
          jurisdiction: template.jurisdiction,
          governingLaw: '',
          lastModified: new Date().toISOString(),
          modifiedBy: 'system',
          changeLog: [],
          approvals: [],
          reviews: [],
          comments: [],
          tags: [],
          categories: [],
          keywords: [],
          summary: '',
          abstract: '',
          tableOfContents: [],
          crossReferences: [],
          relatedDocuments: [],
          precedents: [],
          citations: [],
          footnotes: [],
          endnotes: [],
          bibliography: [],
          index: [],
          glossary: [],
          appendices: [],
          supplements: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.documents.push(document);
      return document;
    } catch (error) {
      throw this.createApiError('DOCUMENT_GENERATION_FAILED', 'Failed to generate legal document', error);
    }
  }

  // Private helper methods
  private applyFilters(documents: LegalDocument[], filters: LegalFilters): LegalDocument[] {
    return documents.filter(document => {
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(document.type)) return false;
      }

      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(document.status)) return false;
      }

      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(document.template.category)) return false;
      }

      if (filters.jurisdiction && filters.jurisdiction.length > 0) {
        if (!filters.jurisdiction.includes(document.template.jurisdiction)) return false;
      }

      if (filters.dateRange) {
        const documentDate = new Date(document.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);

        if (documentDate < startDate || documentDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }

  private applySearch(documents: LegalDocument[], query: string): LegalDocument[] {
    const lowercaseQuery = query.toLowerCase();
    return documents.filter(document =>
      document.title.toLowerCase().includes(lowercaseQuery) ||
      document.description.toLowerCase().includes(lowercaseQuery) ||
      document.template.jurisdiction.toLowerCase().includes(lowercaseQuery)
    );
  }

  private sortDocuments(documents: LegalDocument[], sortBy?: SortBy, sortOrder?: SortOrder): LegalDocument[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return documents.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case SortBy.TITLE:
          comparison = a.title.localeCompare(b.title);
          break;
        case SortBy.TYPE:
          comparison = a.type.localeCompare(b.type);
          break;
        case SortBy.STATUS:
          comparison = a.status.localeCompare(b.status);
          break;
        case SortBy.CREATED_AT:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case SortBy.UPDATED_AT:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case SortBy.EFFECTIVE_DATE:
          comparison = new Date(a.terms.effectiveDate).getTime() - new Date(b.terms.effectiveDate).getTime();
          break;
        case SortBy.EXPIRY_DATE:
          const aExpiry = a.terms.expiryDate ? new Date(a.terms.expiryDate).getTime() : 0;
          const bExpiry = b.terms.expiryDate ? new Date(b.terms.expiryDate).getTime() : 0;
          comparison = aExpiry - bExpiry;
          break;
        case SortBy.PARTY:
          comparison = a.parties[0]?.name.localeCompare(b.parties[0]?.name || '') || 0;
          break;
        case SortBy.JURISDICTION:
          comparison = a.template.jurisdiction.localeCompare(b.template.jurisdiction);
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

  private createApiError(code: string, message: string, details?: any): LegalApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const legalService = new LegalService();
