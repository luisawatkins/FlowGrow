import { ContactForm, ContactStatus, ContactTemplate, ContactAnalytics, ContactFilters, ContactResponse } from '@/types/contact';

// Mock database
const contacts = new Map<string, ContactForm>();
const contactTemplates = new Map<string, ContactTemplate>();
const contactResponses = new Map<string, ContactResponse[]>();

// Initialize with some mock data
const mockContacts: ContactForm[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    userId: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'I am interested in viewing this property. When is the best time to schedule a viewing?',
    preferredContactMethod: 'email',
    preferredViewingTime: 'Weekend mornings',
    isPreApproved: true,
    budget: 500000,
    timeline: '3 months',
    status: ContactStatus.NEW,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    propertyId: 'prop-2',
    userId: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    message: 'This property looks perfect for my family. Could you provide more details about the neighborhood?',
    preferredContactMethod: 'phone',
    preferredViewingTime: 'Weekday evenings',
    isPreApproved: false,
    budget: 750000,
    timeline: '6 months',
    status: ContactStatus.CONTACTED,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
];

const mockTemplates: ContactTemplate[] = [
  {
    id: '1',
    name: 'Property Inquiry Response',
    subject: 'Thank you for your interest in {{propertyTitle}}',
    message: 'Thank you for your interest in {{propertyTitle}}. I will get back to you within 24 hours to discuss your requirements and schedule a viewing.',
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Viewing Confirmation',
    subject: 'Viewing Confirmed for {{propertyTitle}}',
    message: 'Your viewing for {{propertyTitle}} has been confirmed for {{viewingTime}}. Please arrive 10 minutes early.',
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Initialize mock data
mockContacts.forEach(contact => contacts.set(contact.id, contact));
mockTemplates.forEach(template => contactTemplates.set(template.id, template));

export class ContactService {
  // Contact CRUD operations
  static async createContact(contactData: Omit<ContactForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactForm> {
    const contact: ContactForm = {
      ...contactData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    contacts.set(contact.id, contact);
    return contact;
  }

  static async getContact(id: string): Promise<ContactForm | null> {
    return contacts.get(id) || null;
  }

  static async getContactsByProperty(propertyId: string): Promise<ContactForm[]> {
    return Array.from(contacts.values()).filter(contact => contact.propertyId === propertyId);
  }

  static async getContactsByUser(userId: string): Promise<ContactForm[]> {
    return Array.from(contacts.values()).filter(contact => contact.userId === userId);
  }

  static async updateContact(id: string, updates: Partial<ContactForm>): Promise<ContactForm | null> {
    const contact = contacts.get(id);
    if (!contact) return null;

    const updatedContact = {
      ...contact,
      ...updates,
      updatedAt: new Date(),
    };
    
    contacts.set(id, updatedContact);
    return updatedContact;
  }

  static async deleteContact(id: string): Promise<boolean> {
    return contacts.delete(id);
  }

  static async getContacts(filters?: ContactFilters): Promise<ContactForm[]> {
    let results = Array.from(contacts.values());

    if (filters) {
      if (filters.status) {
        results = results.filter(contact => contact.status === filters.status);
      }

      if (filters.propertyId) {
        results = results.filter(contact => contact.propertyId === filters.propertyId);
      }

      if (filters.dateRange) {
        results = results.filter(contact => 
          contact.createdAt >= filters.dateRange!.start && 
          contact.createdAt <= filters.dateRange!.end
        );
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        results = results.filter(contact =>
          contact.name.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower) ||
          contact.message.toLowerCase().includes(searchLower)
        );
      }
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Contact Templates
  static async getTemplates(): Promise<ContactTemplate[]> {
    return Array.from(contactTemplates.values());
  }

  static async createTemplate(templateData: Omit<ContactTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactTemplate> {
    const template: ContactTemplate = {
      ...templateData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    contactTemplates.set(template.id, template);
    return template;
  }

  static async updateTemplate(id: string, updates: Partial<ContactTemplate>): Promise<ContactTemplate | null> {
    const template = contactTemplates.get(id);
    if (!template) return null;

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date(),
    };
    
    contactTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  static async deleteTemplate(id: string): Promise<boolean> {
    return contactTemplates.delete(id);
  }

  // Contact Responses
  static async addResponse(contactId: string, responseData: Omit<ContactResponse, 'id' | 'createdAt'>): Promise<ContactResponse> {
    const response: ContactResponse = {
      ...responseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    const responses = contactResponses.get(contactId) || [];
    responses.push(response);
    contactResponses.set(contactId, responses);

    // Update contact status
    await this.updateContact(contactId, { status: ContactStatus.CONTACTED });

    return response;
  }

  static async getResponses(contactId: string): Promise<ContactResponse[]> {
    return contactResponses.get(contactId) || [];
  }

  // Analytics
  static async getAnalytics(): Promise<ContactAnalytics> {
    const allContacts = Array.from(contacts.values());
    const totalInquiries = allContacts.length;
    
    const responses = Array.from(contactResponses.values()).flat();
    const responseRate = totalInquiries > 0 ? (responses.length / totalInquiries) * 100 : 0;
    
    const averageResponseTime = this.calculateAverageResponseTime(allContacts);
    
    const inquiriesByStatus = Object.values(ContactStatus).reduce((acc, status) => {
      acc[status] = allContacts.filter(contact => contact.status === status).length;
      return acc;
    }, {} as Record<ContactStatus, number>);

    const inquiriesByMonth = this.getInquiriesByMonth(allContacts);
    
    const topProperties = this.getTopProperties(allContacts);

    return {
      totalInquiries,
      responseRate,
      averageResponseTime,
      inquiriesByStatus,
      inquiriesByMonth,
      topProperties,
    };
  }

  private static calculateAverageResponseTime(contacts: ContactForm[]): number {
    const contactsWithResponses = contacts.filter(contact => contact.response);
    if (contactsWithResponses.length === 0) return 0;

    const totalTime = contactsWithResponses.reduce((sum, contact) => {
      if (contact.response) {
        const responseTime = contact.response.createdAt.getTime() - contact.createdAt.getTime();
        return sum + responseTime;
      }
      return sum;
    }, 0);

    return totalTime / contactsWithResponses.length;
  }

  private static getInquiriesByMonth(contacts: ContactForm[]): Array<{ month: string; count: number }> {
    const monthCounts = new Map<string, number>();
    
    contacts.forEach(contact => {
      const month = contact.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    });

    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private static getTopProperties(contacts: ContactForm[]): Array<{ propertyId: string; propertyTitle: string; inquiryCount: number }> {
    const propertyCounts = new Map<string, number>();
    
    contacts.forEach(contact => {
      propertyCounts.set(contact.propertyId, (propertyCounts.get(contact.propertyId) || 0) + 1);
    });

    return Array.from(propertyCounts.entries())
      .map(([propertyId, inquiryCount]) => ({
        propertyId,
        propertyTitle: `Property ${propertyId}`,
        inquiryCount,
      }))
      .sort((a, b) => b.inquiryCount - a.inquiryCount)
      .slice(0, 10);
  }
}
