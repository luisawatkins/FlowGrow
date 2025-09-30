import { historyService } from '../../lib/historyService';
import {
  CreateHistoryEventRequest,
  UpdateHistoryEventRequest,
  GetTimelineRequest,
  HistoryEventType,
  EventSource,
  HistorySearchQuery
} from '../../types/history';

// Mock data
const mockUserId = 'test-user-123';
const mockPropertyId = '1';

const mockCreateEventRequest: CreateHistoryEventRequest = {
  propertyId: mockPropertyId,
  type: HistoryEventType.PRICE_CHANGE,
  title: 'Price Reduced',
  description: 'Property price was reduced by $25,000',
  data: {
    price: {
      oldPrice: 450000,
      newPrice: 425000,
      changePercentage: -5.56,
      changeAmount: -25000,
      currency: 'USD'
    }
  },
  source: {
    type: 'agent',
    id: 'agent-456',
    name: 'John Smith',
    verified: true
  },
  isPublic: true,
  tags: ['price', 'reduction']
};

const mockUpdateEventRequest: UpdateHistoryEventRequest = {
  title: 'Updated Price Reduction',
  description: 'Property price was reduced by $30,000',
  isPublic: false,
  tags: ['price', 'reduction', 'updated']
};

const mockGetTimelineRequest: GetTimelineRequest = {
  propertyId: mockPropertyId,
  filters: {
    eventTypes: [HistoryEventType.PRICE_CHANGE, HistoryEventType.STATUS_CHANGE],
    sources: ['agent', 'mls'],
    importance: ['high', 'medium'],
    tags: ['price'],
    isPublic: true
  },
  page: 1,
  limit: 10
};

const mockSearchQuery: HistorySearchQuery = {
  propertyId: mockPropertyId,
  eventTypes: [HistoryEventType.PRICE_CHANGE],
  keywords: 'price',
  importance: ['high', 'medium']
};

describe('HistoryService', () => {
  beforeEach(() => {
    // Reset service state before each test
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create a new history event successfully', async () => {
      const response = await historyService.createEvent(mockCreateEventRequest);

      expect(response.success).toBe(true);
      expect(response.event).toBeDefined();
      expect(response.event!.propertyId).toBe(mockPropertyId);
      expect(response.event!.type).toBe(mockCreateEventRequest.type);
      expect(response.event!.title).toBe(mockCreateEventRequest.title);
      expect(response.event!.description).toBe(mockCreateEventRequest.description);
      expect(response.event!.data).toEqual(mockCreateEventRequest.data);
      expect(response.event!.source).toEqual(mockCreateEventRequest.source);
      expect(response.event!.isPublic).toBe(mockCreateEventRequest.isPublic);
      expect(response.event!.tags).toEqual(mockCreateEventRequest.tags);
    });

    it('should fail to create event with empty title', async () => {
      const invalidRequest = { ...mockCreateEventRequest, title: '' };
      const response = await historyService.createEvent(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.message).toContain('Event title is required');
    });

    it('should fail to create event with empty description', async () => {
      const invalidRequest = { ...mockCreateEventRequest, description: '' };
      const response = await historyService.createEvent(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.message).toContain('Event description is required');
    });

    it('should fail to create event without source', async () => {
      const invalidRequest = { ...mockCreateEventRequest, source: null as any };
      const response = await historyService.createEvent(invalidRequest);

      expect(response.success).toBe(false);
      expect(response.message).toContain('Event source is required');
    });
  });

  describe('getEvent', () => {
    it('should retrieve a history event by ID', async () => {
      // First create an event
      const createResponse = await historyService.createEvent(mockCreateEventRequest);
      expect(createResponse.success).toBe(true);

      // Then retrieve it
      const response = await historyService.getEvent(createResponse.event!.id);

      expect(response.success).toBe(true);
      expect(response.event).toBeDefined();
      expect(response.event!.id).toBe(createResponse.event!.id);
      expect(response.event!.title).toBe(mockCreateEventRequest.title);
    });

    it('should return null for non-existent event', async () => {
      const response = await historyService.getEvent('non-existent-id');

      expect(response.success).toBe(false);
      expect(response.message).toBe('History event not found');
    });
  });

  describe('updateEvent', () => {
    it('should update history event successfully', async () => {
      // Create an event first
      const createResponse = await historyService.createEvent(mockCreateEventRequest);
      expect(createResponse.success).toBe(true);

      // Update it
      const response = await historyService.updateEvent(
        createResponse.event!.id,
        mockUpdateEventRequest
      );

      expect(response.success).toBe(true);
      expect(response.event!.title).toBe(mockUpdateEventRequest.title);
      expect(response.event!.description).toBe(mockUpdateEventRequest.description);
      expect(response.event!.isPublic).toBe(mockUpdateEventRequest.isPublic);
      expect(response.event!.tags).toEqual(mockUpdateEventRequest.tags);
    });

    it('should fail to update non-existent event', async () => {
      const response = await historyService.updateEvent(
        'non-existent-id',
        mockUpdateEventRequest
      );

      expect(response.success).toBe(false);
      expect(response.message).toBe('History event not found');
    });
  });

  describe('deleteEvent', () => {
    it('should delete history event successfully', async () => {
      // Create an event first
      const createResponse = await historyService.createEvent(mockCreateEventRequest);
      expect(createResponse.success).toBe(true);

      // Delete it
      const response = await historyService.deleteEvent(createResponse.event!.id);

      expect(response.success).toBe(true);

      // Verify it's deleted
      const getResponse = await historyService.getEvent(createResponse.event!.id);
      expect(getResponse.success).toBe(false);
    });

    it('should fail to delete non-existent event', async () => {
      const response = await historyService.deleteEvent('non-existent-id');

      expect(response.success).toBe(false);
      expect(response.message).toBe('History event not found');
    });
  });

  describe('getPropertyHistory', () => {
    it('should retrieve property history', async () => {
      // Create multiple events for the property
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        type: HistoryEventType.STATUS_CHANGE,
        title: 'Status Changed',
        description: 'Property status was updated'
      });

      const history = await historyService.getPropertyHistory(mockPropertyId);

      expect(history).toBeDefined();
      expect(history!.propertyId).toBe(mockPropertyId);
      expect(history!.events.length).toBeGreaterThanOrEqual(2);
      expect(history!.totalEvents).toBeGreaterThanOrEqual(2);
    });

    it('should return null for property with no history', async () => {
      const history = await historyService.getPropertyHistory('non-existent-property');

      expect(history).toBeNull();
    });
  });

  describe('getPropertyTimeline', () => {
    it('should retrieve property timeline with filters', async () => {
      // Create events first
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        type: HistoryEventType.STATUS_CHANGE,
        title: 'Status Changed',
        description: 'Property status was updated'
      });

      const response = await historyService.getPropertyTimeline(mockGetTimelineRequest);

      expect(response.success).toBe(true);
      expect(response.timeline).toBeDefined();
      expect(response.timeline!.propertyId).toBe(mockPropertyId);
      expect(response.timeline!.events).toBeDefined();
      expect(response.timeline!.summary).toBeDefined();
      expect(response.timeline!.filters).toBeDefined();
      expect(response.timeline!.pagination).toBeDefined();
    });

    it('should apply event type filters correctly', async () => {
      // Create events of different types
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        type: HistoryEventType.VIEWING_COMPLETED,
        title: 'Viewing Completed',
        description: 'Property viewing was completed'
      });

      const request = {
        ...mockGetTimelineRequest,
        filters: {
          eventTypes: [HistoryEventType.PRICE_CHANGE]
        }
      };

      const response = await historyService.getPropertyTimeline(request);

      expect(response.success).toBe(true);
      expect(response.timeline!.events.every(event => 
        event.type === HistoryEventType.PRICE_CHANGE
      )).toBe(true);
    });

    it('should apply date range filters correctly', async () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const request = {
        ...mockGetTimelineRequest,
        filters: {
          dateRange: {
            start: oneWeekAgo,
            end: now
          }
        }
      };

      const response = await historyService.getPropertyTimeline(request);

      expect(response.success).toBe(true);
      expect(response.timeline!.events.every(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= oneWeekAgo && eventDate <= now;
      })).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      // Create multiple events
      for (let i = 0; i < 5; i++) {
        await historyService.createEvent({
          ...mockCreateEventRequest,
          title: `Event ${i}`,
          description: `Description for event ${i}`
        });
      }

      const request = {
        ...mockGetTimelineRequest,
        page: 1,
        limit: 2
      };

      const response = await historyService.getPropertyTimeline(request);

      expect(response.success).toBe(true);
      expect(response.timeline!.events.length).toBeLessThanOrEqual(2);
      expect(response.timeline!.pagination.page).toBe(1);
      expect(response.timeline!.pagination.limit).toBe(2);
      expect(response.timeline!.pagination.hasMore).toBe(true);
    });
  });

  describe('searchEvents', () => {
    it('should search events by property ID', async () => {
      // Create events for different properties
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        propertyId: '2',
        title: 'Different Property Event'
      });

      const response = await historyService.searchEvents({
        propertyId: mockPropertyId
      });

      expect(response.events.every(event => event.propertyId === mockPropertyId)).toBe(true);
    });

    it('should search events by keywords', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const response = await historyService.searchEvents({
        keywords: 'price'
      });

      expect(response.events.some(event => 
        event.title.toLowerCase().includes('price') ||
        event.description.toLowerCase().includes('price')
      )).toBe(true);
    });

    it('should search events by event types', async () => {
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        type: HistoryEventType.STATUS_CHANGE,
        title: 'Status Changed'
      });

      const response = await historyService.searchEvents({
        eventTypes: [HistoryEventType.PRICE_CHANGE]
      });

      expect(response.events.every(event => 
        event.type === HistoryEventType.PRICE_CHANGE
      )).toBe(true);
    });

    it('should return search facets', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const response = await historyService.searchEvents(mockSearchQuery);

      expect(response.facets).toBeDefined();
      expect(response.facets.eventTypes).toBeDefined();
      expect(response.facets.sources).toBeDefined();
      expect(response.facets.dateRanges).toBeDefined();
    });
  });

  describe('getHistoryAnalytics', () => {
    it('should return analytics for property with events', async () => {
      // Create multiple events
      await historyService.createEvent(mockCreateEventRequest);
      await historyService.createEvent({
        ...mockCreateEventRequest,
        type: HistoryEventType.VIEWING_COMPLETED,
        title: 'Viewing Completed'
      });

      const analytics = await historyService.getHistoryAnalytics(mockPropertyId);

      expect(analytics).toBeDefined();
      expect(analytics!.propertyId).toBe(mockPropertyId);
      expect(analytics!.totalEvents).toBeGreaterThanOrEqual(2);
      expect(analytics!.eventTypeDistribution).toBeDefined();
      expect(analytics!.activityTrend).toBeDefined();
      expect(analytics!.keyMetrics).toBeDefined();
      expect(analytics!.marketComparison).toBeDefined();
      expect(analytics!.timelineInsights).toBeDefined();
    });

    it('should return null for property with no events', async () => {
      const analytics = await historyService.getHistoryAnalytics('non-existent-property');

      expect(analytics).toBeNull();
    });
  });

  describe('exportTimeline', () => {
    it('should export timeline as JSON', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const blob = await historyService.exportTimeline(mockPropertyId, {
        format: 'json',
        includeMetadata: true
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });

    it('should export timeline as CSV', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const blob = await historyService.exportTimeline(mockPropertyId, {
        format: 'csv',
        includeMetadata: false
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/csv');
    });

    it('should export timeline as PDF', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const blob = await historyService.exportTimeline(mockPropertyId, {
        format: 'pdf',
        includeMetadata: true
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
    });

    it('should handle export with date range filter', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const blob = await historyService.exportTimeline(mockPropertyId, {
        format: 'json',
        dateRange: {
          start: oneWeekAgo,
          end: now
        },
        includeMetadata: true
      });

      expect(blob).toBeInstanceOf(Blob);
    });

    it('should handle export with event type filter', async () => {
      await historyService.createEvent(mockCreateEventRequest);

      const blob = await historyService.exportTimeline(mockPropertyId, {
        format: 'json',
        eventTypes: [HistoryEventType.PRICE_CHANGE],
        includeMetadata: false
      });

      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Mock a service error
      const originalCreateEvent = historyService.createEvent;
      historyService.createEvent = jest.fn().mockRejectedValue(new Error('Service error'));

      const response = await historyService.createEvent(mockCreateEventRequest);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Failed to create history event');

      // Restore original method
      historyService.createEvent = originalCreateEvent;
    });

    it('should validate event data structure', async () => {
      const invalidRequest = {
        ...mockCreateEventRequest,
        data: null as any
      };

      const response = await historyService.createEvent(invalidRequest);

      expect(response.success).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should handle large number of events efficiently', async () => {
      // Create many events
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(historyService.createEvent({
          ...mockCreateEventRequest,
          title: `Event ${i}`,
          description: `Description for event ${i}`
        }));
      }

      const responses = await Promise.all(promises);
      expect(responses.every(response => response.success)).toBe(true);

      // Test timeline retrieval
      const startTime = Date.now();
      const timeline = await historyService.getPropertyTimeline({
        propertyId: mockPropertyId,
        page: 1,
        limit: 20
      });
      const endTime = Date.now();

      expect(timeline.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
