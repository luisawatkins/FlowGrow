import { useState, useCallback } from 'react';
import { ContactForm, ContactStatus, ContactTemplate, ContactAnalytics, ContactFilters, ContactResponse } from '@/types/contact';
import { ContactService } from '@/lib/contactService';

export function useEnhancedContact() {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [templates, setTemplates] = useState<ContactTemplate[]>([]);
  const [analytics, setAnalytics] = useState<ContactAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contact operations
  const createContact = useCallback(async (contactData: Omit<ContactForm, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const contact = await ContactService.createContact(contactData);
      setContacts(prev => [contact, ...prev]);
      return contact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContacts = useCallback(async (filters?: ContactFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const contacts = await ContactService.getContacts(filters);
      setContacts(contacts);
      return contacts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getContactsByProperty = useCallback(async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const contacts = await ContactService.getContactsByProperty(propertyId);
      return contacts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property contacts');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContact = useCallback(async (id: string, updates: Partial<ContactForm>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedContact = await ContactService.updateContact(id, updates);
      if (updatedContact) {
        setContacts(prev => prev.map(contact => 
          contact.id === id ? updatedContact : contact
        ));
      }
      return updatedContact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await ContactService.deleteContact(id);
      if (success) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Template operations
  const getTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const templates = await ContactService.getTemplates();
      setTemplates(templates);
      return templates;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (templateData: Omit<ContactTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const template = await ContactService.createTemplate(templateData);
      setTemplates(prev => [...prev, template]);
      return template;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<ContactTemplate>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTemplate = await ContactService.updateTemplate(id, updates);
      if (updatedTemplate) {
        setTemplates(prev => prev.map(template => 
          template.id === id ? updatedTemplate : template
        ));
      }
      return updatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await ContactService.deleteTemplate(id);
      if (success) {
        setTemplates(prev => prev.filter(template => template.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Response operations
  const addResponse = useCallback(async (contactId: string, responseData: Omit<ContactResponse, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ContactService.addResponse(contactId, responseData);
      
      // Update the contact in the list
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, status: ContactStatus.CONTACTED, response, updatedAt: new Date() }
          : contact
      ));
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add response');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getResponses = useCallback(async (contactId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const responses = await ContactService.getResponses(contactId);
      return responses;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch responses');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analytics
  const getAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const analytics = await ContactService.getAnalytics();
      setAnalytics(analytics);
      return analytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    contacts,
    templates,
    analytics,
    isLoading,
    error,
    
    // Contact operations
    createContact,
    getContacts,
    getContactsByProperty,
    updateContact,
    deleteContact,
    
    // Template operations
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    
    // Response operations
    addResponse,
    getResponses,
    
    // Analytics
    getAnalytics,
  };
}
