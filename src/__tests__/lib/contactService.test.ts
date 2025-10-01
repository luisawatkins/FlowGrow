import { ContactService } from '@/lib/contactService';
import { ContactForm, ContactStatus, ContactTemplate } from '@/types/contact';

describe('ContactService', () => {
  beforeEach(() => {
    // Clear any existing data
    jest.clearAllMocks();
  });

  describe('Contact CRUD operations', () => {
    it('should create a new contact', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'Interested in this property',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const contact = await ContactService.createContact(contactData);

      expect(contact).toBeDefined();
      expect(contact.id).toBeDefined();
      expect(contact.name).toBe(contactData.name);
      expect(contact.email).toBe(contactData.email);
      expect(contact.createdAt).toBeInstanceOf(Date);
      expect(contact.updatedAt).toBeInstanceOf(Date);
    });

    it('should get a contact by id', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Test message',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const createdContact = await ContactService.createContact(contactData);
      const retrievedContact = await ContactService.getContact(createdContact.id);

      expect(retrievedContact).toBeDefined();
      expect(retrievedContact?.id).toBe(createdContact.id);
      expect(retrievedContact?.name).toBe(contactData.name);
    });

    it('should get contacts by property', async () => {
      const propertyId = 'prop-1';
      const contactData1 = {
        propertyId,
        userId: 'user-1',
        name: 'Contact 1',
        email: 'contact1@example.com',
        message: 'Message 1',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };
      const contactData2 = {
        propertyId,
        userId: 'user-2',
        name: 'Contact 2',
        email: 'contact2@example.com',
        message: 'Message 2',
        preferredContactMethod: 'phone' as const,
        status: ContactStatus.NEW,
      };

      await ContactService.createContact(contactData1);
      await ContactService.createContact(contactData2);

      const contacts = await ContactService.getContactsByProperty(propertyId);

      expect(contacts).toHaveLength(2);
      expect(contacts.every(contact => contact.propertyId === propertyId)).toBe(true);
    });

    it('should update a contact', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'Original Name',
        email: 'original@example.com',
        message: 'Original message',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const createdContact = await ContactService.createContact(contactData);
      const updates = {
        name: 'Updated Name',
        status: ContactStatus.CONTACTED,
      };

      const updatedContact = await ContactService.updateContact(createdContact.id, updates);

      expect(updatedContact).toBeDefined();
      expect(updatedContact?.name).toBe(updates.name);
      expect(updatedContact?.status).toBe(updates.status);
      expect(updatedContact?.updatedAt.getTime()).toBeGreaterThan(createdContact.updatedAt.getTime());
    });

    it('should delete a contact', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'To Delete',
        email: 'delete@example.com',
        message: 'Delete me',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const createdContact = await ContactService.createContact(contactData);
      const deleteResult = await ContactService.deleteContact(createdContact.id);
      const retrievedContact = await ContactService.getContact(createdContact.id);

      expect(deleteResult).toBe(true);
      expect(retrievedContact).toBeNull();
    });
  });

  describe('Contact filtering', () => {
    beforeEach(async () => {
      // Create test contacts with different statuses
      await ContactService.createContact({
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'New Contact',
        email: 'new@example.com',
        message: 'New message',
        preferredContactMethod: 'email',
        status: ContactStatus.NEW,
      });

      await ContactService.createContact({
        propertyId: 'prop-2',
        userId: 'user-2',
        name: 'Contacted User',
        email: 'contacted@example.com',
        message: 'Contacted message',
        preferredContactMethod: 'phone',
        status: ContactStatus.CONTACTED,
      });

      await ContactService.createContact({
        propertyId: 'prop-1',
        userId: 'user-3',
        name: 'Closed Contact',
        email: 'closed@example.com',
        message: 'Closed message',
        preferredContactMethod: 'email',
        status: ContactStatus.CLOSED,
      });
    });

    it('should filter contacts by status', async () => {
      const newContacts = await ContactService.getContacts({ status: ContactStatus.NEW });
      const contactedContacts = await ContactService.getContacts({ status: ContactStatus.CONTACTED });

      expect(newContacts.every(contact => contact.status === ContactStatus.NEW)).toBe(true);
      expect(contactedContacts.every(contact => contact.status === ContactStatus.CONTACTED)).toBe(true);
    });

    it('should filter contacts by property', async () => {
      const prop1Contacts = await ContactService.getContacts({ propertyId: 'prop-1' });
      const prop2Contacts = await ContactService.getContacts({ propertyId: 'prop-2' });

      expect(prop1Contacts.every(contact => contact.propertyId === 'prop-1')).toBe(true);
      expect(prop2Contacts.every(contact => contact.propertyId === 'prop-2')).toBe(true);
    });

    it('should filter contacts by search term', async () => {
      const nameSearch = await ContactService.getContacts({ searchTerm: 'New' });
      const emailSearch = await ContactService.getContacts({ searchTerm: 'contacted@' });

      expect(nameSearch.every(contact => 
        contact.name.toLowerCase().includes('new') ||
        contact.email.toLowerCase().includes('new') ||
        contact.message.toLowerCase().includes('new')
      )).toBe(true);

      expect(emailSearch.every(contact => 
        contact.name.toLowerCase().includes('contacted@') ||
        contact.email.toLowerCase().includes('contacted@') ||
        contact.message.toLowerCase().includes('contacted@')
      )).toBe(true);
    });
  });

  describe('Template operations', () => {
    it('should create a template', async () => {
      const templateData = {
        name: 'Test Template',
        subject: 'Test Subject',
        message: 'Test message with {{propertyTitle}}',
        isDefault: false,
      };

      const template = await ContactService.createTemplate(templateData);

      expect(template).toBeDefined();
      expect(template.id).toBeDefined();
      expect(template.name).toBe(templateData.name);
      expect(template.subject).toBe(templateData.subject);
      expect(template.message).toBe(templateData.message);
      expect(template.isDefault).toBe(templateData.isDefault);
    });

    it('should get all templates', async () => {
      const templates = await ContactService.getTemplates();

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should update a template', async () => {
      const templateData = {
        name: 'Original Template',
        subject: 'Original Subject',
        message: 'Original message',
        isDefault: false,
      };

      const createdTemplate = await ContactService.createTemplate(templateData);
      const updates = {
        name: 'Updated Template',
        subject: 'Updated Subject',
      };

      const updatedTemplate = await ContactService.updateTemplate(createdTemplate.id, updates);

      expect(updatedTemplate).toBeDefined();
      expect(updatedTemplate?.name).toBe(updates.name);
      expect(updatedTemplate?.subject).toBe(updates.subject);
      expect(updatedTemplate?.updatedAt.getTime()).toBeGreaterThan(createdTemplate.updatedAt.getTime());
    });

    it('should delete a template', async () => {
      const templateData = {
        name: 'To Delete',
        subject: 'Delete Subject',
        message: 'Delete message',
        isDefault: false,
      };

      const createdTemplate = await ContactService.createTemplate(templateData);
      const deleteResult = await ContactService.deleteTemplate(createdTemplate.id);

      expect(deleteResult).toBe(true);
    });
  });

  describe('Response operations', () => {
    it('should add a response to a contact', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'Test Contact',
        email: 'test@example.com',
        message: 'Test message',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const contact = await ContactService.createContact(contactData);
      const responseData = {
        contactId: contact.id,
        responderId: 'responder-1',
        responderName: 'Responder Name',
        responderEmail: 'responder@example.com',
        message: 'Response message',
      };

      const response = await ContactService.addResponse(contact.id, responseData);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.contactId).toBe(contact.id);
      expect(response.responderName).toBe(responseData.responderName);
      expect(response.message).toBe(responseData.message);
    });

    it('should get responses for a contact', async () => {
      const contactData = {
        propertyId: 'prop-1',
        userId: 'user-1',
        name: 'Test Contact',
        email: 'test@example.com',
        message: 'Test message',
        preferredContactMethod: 'email' as const,
        status: ContactStatus.NEW,
      };

      const contact = await ContactService.createContact(contactData);
      const responseData = {
        contactId: contact.id,
        responderId: 'responder-1',
        responderName: 'Responder Name',
        responderEmail: 'responder@example.com',
        message: 'Response message',
      };

      await ContactService.addResponse(contact.id, responseData);
      const responses = await ContactService.getResponses(contact.id);

      expect(responses).toHaveLength(1);
      expect(responses[0].responderName).toBe(responseData.responderName);
    });
  });

  describe('Analytics', () => {
    it('should get contact analytics', async () => {
      const analytics = await ContactService.getAnalytics();

      expect(analytics).toBeDefined();
      expect(analytics.totalInquiries).toBeGreaterThanOrEqual(0);
      expect(analytics.responseRate).toBeGreaterThanOrEqual(0);
      expect(analytics.averageResponseTime).toBeGreaterThanOrEqual(0);
      expect(analytics.inquiriesByStatus).toBeDefined();
      expect(analytics.inquiriesByMonth).toBeDefined();
      expect(analytics.topProperties).toBeDefined();
    });
  });
});
