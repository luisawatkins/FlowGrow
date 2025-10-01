// Document Service
// Business logic for property document management

import {
  PropertyDocument,
  DocumentFile,
  DocumentMetadata,
  DocumentPermissions,
  DocumentVersion,
  DocumentTemplate,
  DocumentWorkflow,
  DocumentSignature,
  DocumentAuditLog,
  DocumentSearchRequest,
  DocumentSearchResponse,
  SearchFacets,
  FacetCount,
  UploadDocumentRequest,
  UpdateDocumentRequest,
  DocumentShareRequest,
  DocumentType,
  DocumentCategory,
  DocumentStatus,
  StorageProvider,
  EntityType,
  FieldType,
  SectionType,
  WorkflowType,
  StepType,
  AssigneeType,
  TriggerType,
  ConditionOperator,
  LogicalOperator,
  ActionType,
  SignatureType,
  SignatureStatus,
  AuditAction,
  DocumentApiError
} from '@/types/documents';

// Mock data for development and testing
const mockDocuments: PropertyDocument[] = [
  {
    id: 'doc1',
    propertyId: 'prop1',
    title: 'Purchase Agreement',
    description: 'Standard residential purchase agreement',
    type: DocumentType.CONTRACT,
    category: DocumentCategory.LEGAL,
    status: DocumentStatus.APPROVED,
    file: {
      id: 'file1',
      name: 'purchase_agreement.pdf',
      originalName: 'Purchase Agreement - 123 Main St.pdf',
      size: 2048576, // 2MB
      mimeType: 'application/pdf',
      extension: 'pdf',
      url: '/documents/purchase_agreement.pdf',
      thumbnailUrl: '/documents/thumbnails/purchase_agreement.jpg',
      previewUrl: '/documents/previews/purchase_agreement.html',
      checksum: 'sha256:abc123...',
      isEncrypted: false,
      storageProvider: StorageProvider.LOCAL,
      storagePath: '/documents/prop1/purchase_agreement.pdf',
      uploadedAt: '2024-01-01T00:00:00Z'
    },
    metadata: {
      author: 'John Smith',
      createdDate: '2024-01-01',
      modifiedDate: '2024-01-01',
      subject: 'Property Purchase Agreement',
      keywords: ['purchase', 'agreement', 'residential'],
      language: 'en',
      pageCount: 15,
      wordCount: 2500,
      characterCount: 15000,
      customFields: {
        contractNumber: 'PA-2024-001',
        buyerName: 'John Doe',
        sellerName: 'Jane Smith',
        propertyAddress: '123 Main St, Anytown, ST 12345'
      },
      ocrText: 'This Purchase Agreement is made between...',
      extractedData: {
        text: 'This Purchase Agreement is made between...',
        entities: [
          {
            type: EntityType.PERSON,
            value: 'John Doe',
            confidence: 0.95,
            position: { page: 1, x: 100, y: 200, width: 80, height: 20 }
          }
        ],
        tables: [],
        images: [],
        signatures: [],
        dates: [],
        amounts: [],
        addresses: []
      }
    },
    permissions: {
      owner: 'user1',
      viewers: ['user2', 'user3'],
      editors: ['user1'],
      admins: ['user1'],
      publicAccess: false,
      allowDownload: true,
      allowPrint: true,
      allowCopy: false,
      allowEdit: false,
      allowShare: true,
      watermark: true
    },
    tags: ['contract', 'purchase', 'legal'],
    isPublic: false,
    isRequired: true,
    isExpired: false,
    uploadedBy: 'user1',
    uploadedAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    previousVersions: []
  }
];

const mockTemplates: DocumentTemplate[] = [
  {
    id: 'template1',
    name: 'Residential Purchase Agreement',
    description: 'Standard template for residential property purchases',
    type: DocumentType.CONTRACT,
    category: DocumentCategory.LEGAL,
    template: {
      html: '<div class="contract-template">...</div>',
      css: '.contract-template { font-family: Arial; }',
      javascript: 'function validateForm() { ... }',
      variables: ['buyerName', 'sellerName', 'propertyAddress', 'purchasePrice'],
      sections: []
    },
    fields: [
      {
        id: 'field1',
        name: 'buyerName',
        type: FieldType.TEXT,
        label: 'Buyer Name',
        placeholder: 'Enter buyer name',
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          required: true
        }
      }
    ],
    isPublic: true,
    isPremium: false,
    usageCount: 150,
    rating: 4.5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockWorkflows: DocumentWorkflow[] = [
  {
    id: 'workflow1',
    name: 'Document Approval Workflow',
    description: 'Standard workflow for document approval',
    type: WorkflowType.APPROVAL,
    steps: [
      {
        id: 'step1',
        name: 'Initial Review',
        type: StepType.REVIEW,
        order: 1,
        assignee: 'reviewer1',
        assigneeType: AssigneeType.USER,
        conditions: [],
        actions: [],
        isRequired: true,
        timeout: 24
      }
    ],
    triggers: [
      {
        id: 'trigger1',
        type: TriggerType.UPLOAD,
        conditions: [
          {
            field: 'type',
            operator: ConditionOperator.EQUALS,
            value: DocumentType.CONTRACT
          }
        ],
        isActive: true
      }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

class DocumentService {
  private documents: PropertyDocument[] = mockDocuments;
  private templates: DocumentTemplate[] = mockTemplates;
  private workflows: DocumentWorkflow[] = mockWorkflows;
  private signatures: DocumentSignature[] = [];
  private auditLogs: DocumentAuditLog[] = [];

  // Document Management
  async uploadDocument(file: File, request: UploadDocumentRequest): Promise<PropertyDocument> {
    try {
      // Simulate file upload
      const documentFile: DocumentFile = {
        id: `file_${Date.now()}`,
        name: file.name,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        extension: file.name.split('.').pop() || '',
        url: `/documents/${request.propertyId}/${file.name}`,
        thumbnailUrl: this.generateThumbnailUrl(file),
        previewUrl: this.generatePreviewUrl(file),
        checksum: await this.calculateChecksum(file),
        isEncrypted: false,
        storageProvider: StorageProvider.LOCAL,
        storagePath: `/documents/${request.propertyId}/${file.name}`,
        uploadedAt: new Date().toISOString()
      };

      const document: PropertyDocument = {
        id: `doc_${Date.now()}`,
        propertyId: request.propertyId,
        title: request.title,
        description: request.description,
        type: request.type,
        category: request.category,
        status: DocumentStatus.DRAFT,
        file: documentFile,
        metadata: await this.extractMetadata(file),
        permissions: {
          owner: 'current_user', // In real app, get from auth context
          viewers: [],
          editors: [],
          admins: [],
          publicAccess: request.isPublic || false,
          allowDownload: true,
          allowPrint: true,
          allowCopy: false,
          allowEdit: false,
          allowShare: true,
          watermark: false,
          ...request.permissions
        },
        tags: request.tags || [],
        isPublic: request.isPublic || false,
        isRequired: request.isRequired || false,
        isExpired: false,
        expirationDate: request.expirationDate,
        uploadedBy: 'current_user',
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        previousVersions: []
      };

      this.documents.push(document);
      await this.logAuditEvent(document.id, AuditAction.CREATED, 'Document uploaded');

      return document;
    } catch (error) {
      throw this.createApiError('UPLOAD_FAILED', 'Failed to upload document', error);
    }
  }

  async getDocument(id: string): Promise<PropertyDocument | null> {
    try {
      const document = this.documents.find(doc => doc.id === id);
      if (document) {
        await this.logAuditEvent(id, AuditAction.VIEWED, 'Document viewed');
      }
      return document || null;
    } catch (error) {
      throw this.createApiError('GET_DOCUMENT_FAILED', 'Failed to get document', error);
    }
  }

  async updateDocument(id: string, request: UpdateDocumentRequest): Promise<PropertyDocument> {
    try {
      const documentIndex = this.documents.findIndex(doc => doc.id === id);
      if (documentIndex === -1) {
        throw this.createApiError('DOCUMENT_NOT_FOUND', 'Document not found');
      }

      const document = this.documents[documentIndex];
      const updatedDocument: PropertyDocument = {
        ...document,
        ...request,
        permissions: request.permissions ? { ...document.permissions, ...request.permissions } : document.permissions,
        updatedAt: new Date().toISOString()
      };

      this.documents[documentIndex] = updatedDocument;
      await this.logAuditEvent(id, AuditAction.UPDATED, 'Document updated');

      return updatedDocument;
    } catch (error) {
      throw this.createApiError('UPDATE_DOCUMENT_FAILED', 'Failed to update document', error);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const documentIndex = this.documents.findIndex(doc => doc.id === id);
      if (documentIndex === -1) {
        throw this.createApiError('DOCUMENT_NOT_FOUND', 'Document not found');
      }

      this.documents.splice(documentIndex, 1);
      await this.logAuditEvent(id, AuditAction.DELETED, 'Document deleted');
    } catch (error) {
      throw this.createApiError('DELETE_DOCUMENT_FAILED', 'Failed to delete document', error);
    }
  }

  // Document Search
  async searchDocuments(request: DocumentSearchRequest): Promise<DocumentSearchResponse> {
    try {
      let results = [...this.documents];

      // Apply filters
      if (request.query) {
        const query = request.query.toLowerCase();
        results = results.filter(doc =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.metadata.ocrText?.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (request.propertyId) {
        results = results.filter(doc => doc.propertyId === request.propertyId);
      }

      if (request.type) {
        results = results.filter(doc => doc.type === request.type);
      }

      if (request.category) {
        results = results.filter(doc => doc.category === request.category);
      }

      if (request.status) {
        results = results.filter(doc => doc.status === request.status);
      }

      if (request.tags && request.tags.length > 0) {
        results = results.filter(doc =>
          request.tags!.some(tag => doc.tags.includes(tag))
        );
      }

      if (request.uploadedBy) {
        results = results.filter(doc => doc.uploadedBy === request.uploadedBy);
      }

      if (request.dateRange) {
        results = results.filter(doc => {
          const uploadDate = new Date(doc.uploadedAt);
          const start = new Date(request.dateRange!.start);
          const end = new Date(request.dateRange!.end);
          return uploadDate >= start && uploadDate <= end;
        });
      }

      if (request.sizeRange) {
        results = results.filter(doc =>
          doc.file.size >= request.sizeRange!.min &&
          doc.file.size <= request.sizeRange!.max
        );
      }

      if (request.isPublic !== undefined) {
        results = results.filter(doc => doc.isPublic === request.isPublic);
      }

      if (request.isRequired !== undefined) {
        results = results.filter(doc => doc.isRequired === request.isRequired);
      }

      if (request.isExpired !== undefined) {
        results = results.filter(doc => doc.isExpired === request.isExpired);
      }

      // Sort results
      if (request.sortBy) {
        results.sort((a, b) => {
          let comparison = 0;
          switch (request.sortBy) {
            case 'name':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'uploadedAt':
              comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
              break;
            case 'size':
              comparison = a.file.size - b.file.size;
              break;
            case 'type':
              comparison = a.type.localeCompare(b.type);
              break;
          }
          return request.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // Apply pagination
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginatedResults = results.slice(offset, offset + limit);

      // Generate facets
      const facets = this.generateSearchFacets(results);

      return {
        documents: paginatedResults,
        total: results.length,
        limit,
        offset,
        hasMore: offset + limit < results.length,
        facets
      };
    } catch (error) {
      throw this.createApiError('SEARCH_DOCUMENTS_FAILED', 'Failed to search documents', error);
    }
  }

  // Document Templates
  async getTemplates(category?: DocumentCategory): Promise<DocumentTemplate[]> {
    try {
      let templates = [...this.templates];

      if (category) {
        templates = templates.filter(template => template.category === category);
      }

      return templates;
    } catch (error) {
      throw this.createApiError('GET_TEMPLATES_FAILED', 'Failed to get templates', error);
    }
  }

  async getTemplate(id: string): Promise<DocumentTemplate | null> {
    try {
      return this.templates.find(template => template.id === id) || null;
    } catch (error) {
      throw this.createApiError('GET_TEMPLATE_FAILED', 'Failed to get template', error);
    }
  }

  async createTemplate(template: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentTemplate> {
    try {
      const newTemplate: DocumentTemplate = {
        id: `template_${Date.now()}`,
        ...template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.templates.push(newTemplate);
      return newTemplate;
    } catch (error) {
      throw this.createApiError('CREATE_TEMPLATE_FAILED', 'Failed to create template', error);
    }
  }

  // Document Workflows
  async getWorkflows(): Promise<DocumentWorkflow[]> {
    try {
      return [...this.workflows];
    } catch (error) {
      throw this.createApiError('GET_WORKFLOWS_FAILED', 'Failed to get workflows', error);
    }
  }

  async createWorkflow(workflow: Omit<DocumentWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentWorkflow> {
    try {
      const newWorkflow: DocumentWorkflow = {
        id: `workflow_${Date.now()}`,
        ...workflow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.workflows.push(newWorkflow);
      return newWorkflow;
    } catch (error) {
      throw this.createApiError('CREATE_WORKFLOW_FAILED', 'Failed to create workflow', error);
    }
  }

  async updateWorkflow(id: string, updates: Partial<DocumentWorkflow>): Promise<DocumentWorkflow> {
    try {
      const workflowIndex = this.workflows.findIndex(workflow => workflow.id === id);
      if (workflowIndex === -1) {
        throw this.createApiError('WORKFLOW_NOT_FOUND', 'Workflow not found');
      }

      const workflow = this.workflows[workflowIndex];
      const updatedWorkflow: DocumentWorkflow = {
        ...workflow,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.workflows[workflowIndex] = updatedWorkflow;
      return updatedWorkflow;
    } catch (error) {
      throw this.createApiError('UPDATE_WORKFLOW_FAILED', 'Failed to update workflow', error);
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    try {
      const workflowIndex = this.workflows.findIndex(workflow => workflow.id === id);
      if (workflowIndex === -1) {
        throw this.createApiError('WORKFLOW_NOT_FOUND', 'Workflow not found');
      }

      this.workflows.splice(workflowIndex, 1);
    } catch (error) {
      throw this.createApiError('DELETE_WORKFLOW_FAILED', 'Failed to delete workflow', error);
    }
  }

  // Document Signatures
  async requestSignature(documentId: string, signerInfo: any): Promise<DocumentSignature> {
    try {
      const signature: DocumentSignature = {
        id: `signature_${Date.now()}`,
        documentId,
        signerId: signerInfo.signerId,
        signerName: signerInfo.signerName,
        signerEmail: signerInfo.signerEmail,
        signatureType: SignatureType.ELECTRONIC,
        signatureData: '',
        position: signerInfo.position,
        status: SignatureStatus.PENDING,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      this.signatures.push(signature);
      return signature;
    } catch (error) {
      throw this.createApiError('REQUEST_SIGNATURE_FAILED', 'Failed to request signature', error);
    }
  }

  async signDocument(signatureId: string, signatureData: string): Promise<DocumentSignature> {
    try {
      const signatureIndex = this.signatures.findIndex(sig => sig.id === signatureId);
      if (signatureIndex === -1) {
        throw this.createApiError('SIGNATURE_NOT_FOUND', 'Signature request not found');
      }

      const signature = this.signatures[signatureIndex];
      const updatedSignature: DocumentSignature = {
        ...signature,
        signatureData,
        status: SignatureStatus.SIGNED,
        signedAt: new Date().toISOString()
      };

      this.signatures[signatureIndex] = updatedSignature;
      await this.logAuditEvent(signature.documentId, AuditAction.SIGNED, 'Document signed');

      return updatedSignature;
    } catch (error) {
      throw this.createApiError('SIGN_DOCUMENT_FAILED', 'Failed to sign document', error);
    }
  }

  // Document Sharing
  async shareDocument(request: DocumentShareRequest): Promise<string> {
    try {
      const document = await this.getDocument(request.documentId);
      if (!document) {
        throw this.createApiError('DOCUMENT_NOT_FOUND', 'Document not found');
      }

      // Generate share link
      const shareToken = this.generateShareToken(request.documentId);
      await this.logAuditEvent(request.documentId, AuditAction.SHARED, 'Document shared');

      return shareToken;
    } catch (error) {
      throw this.createApiError('SHARE_DOCUMENT_FAILED', 'Failed to share document', error);
    }
  }

  // Audit Logs
  async getAuditLogs(documentId: string): Promise<DocumentAuditLog[]> {
    try {
      return this.auditLogs.filter(log => log.documentId === documentId);
    } catch (error) {
      throw this.createApiError('GET_AUDIT_LOGS_FAILED', 'Failed to get audit logs', error);
    }
  }

  // Private helper methods
  private async extractMetadata(file: File): Promise<DocumentMetadata> {
    // Simulate metadata extraction
    return {
      author: 'Unknown',
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      subject: file.name,
      keywords: [],
      language: 'en',
      pageCount: 1,
      wordCount: 0,
      characterCount: 0,
      customFields: {},
      ocrText: '',
      extractedData: {
        text: '',
        entities: [],
        tables: [],
        images: [],
        signatures: [],
        dates: [],
        amounts: [],
        addresses: []
      }
    };
  }

  private generateThumbnailUrl(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return `/documents/thumbnails/${file.name}`;
    }
    return `/documents/thumbnails/default_${extension}.png`;
  }

  private generatePreviewUrl(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return `/documents/previews/${file.name.replace('.pdf', '.html')}`;
    }
    return `/documents/previews/${file.name}`;
  }

  private async calculateChecksum(file: File): Promise<string> {
    // Simulate checksum calculation
    return `sha256:${Math.random().toString(36).substring(2)}`;
  }

  private generateSearchFacets(documents: PropertyDocument[]): SearchFacets {
    const typeCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    const statusCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();
    const uploaderCounts = new Map<string, number>();

    documents.forEach(doc => {
      typeCounts.set(doc.type, (typeCounts.get(doc.type) || 0) + 1);
      categoryCounts.set(doc.category, (categoryCounts.get(doc.category) || 0) + 1);
      statusCounts.set(doc.status, (statusCounts.get(doc.status) || 0) + 1);
      uploaderCounts.set(doc.uploadedBy, (uploaderCounts.get(doc.uploadedBy) || 0) + 1);

      doc.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return {
      types: Array.from(typeCounts.entries()).map(([value, count]) => ({ value, count })),
      categories: Array.from(categoryCounts.entries()).map(([value, count]) => ({ value, count })),
      statuses: Array.from(statusCounts.entries()).map(([value, count]) => ({ value, count })),
      tags: Array.from(tagCounts.entries()).map(([value, count]) => ({ value, count })),
      uploaders: Array.from(uploaderCounts.entries()).map(([value, count]) => ({ value, count }))
    };
  }

  private generateShareToken(documentId: string): string {
    return `share_${documentId}_${Date.now()}`;
  }

  private async logAuditEvent(documentId: string, action: AuditAction, details: string): Promise<void> {
    const auditLog: DocumentAuditLog = {
      id: `audit_${Date.now()}`,
      documentId,
      action,
      userId: 'current_user',
      userName: 'Current User',
      timestamp: new Date().toISOString(),
      details: { message: details }
    };

    this.auditLogs.push(auditLog);
  }

  private createApiError(code: string, message: string, details?: any): DocumentApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const documentService = new DocumentService();
