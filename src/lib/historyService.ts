import {
  PropertyHistory,
  HistoryEvent,
  CreateHistoryEventRequest,
  UpdateHistoryEventRequest,
  GetTimelineRequest,
  PropertyTimeline,
  HistoryEventListResponse,
  TimelineResponse,
  HistoryEventResponse,
  HistoryError,
  HistoryEventType,
  EventCategory,
  EventImportance,
  PropertyStatus,
  HistoryAnalytics,
  TimelineExportOptions,
  HistorySearchQuery,
  HistorySearchResponse
} from '@/types/history';

// Mock data for development
const mockEvents: HistoryEvent[] = [
  {
    id: 'event-1',
    propertyId: '1',
    type: HistoryEventType.LISTED,
    title: 'Property Listed for Sale',
    description: 'Property was listed for sale on the market',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    data: {
      listing: {
        action: 'listed',
        listingDate: new Date('2024-01-15T10:00:00Z')
      }
    },
    source: {
      type: 'mls',
      id: 'mls-123',
      name: 'MLS System',
      verified: true
    },
    metadata: {
      confidence: 95,
      verified: true,
      sourceUrl: 'https://mls.example.com/property/1',
      externalId: 'MLS123456'
    },
    isPublic: true,
    tags: ['listing', 'market']
  },
  {
    id: 'event-2',
    propertyId: '1',
    type: HistoryEventType.PRICE_CHANGE,
    title: 'Price Reduced',
    description: 'Property price was reduced by $25,000',
    timestamp: new Date('2024-01-20T14:30:00Z'),
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
    metadata: {
      confidence: 100,
      verified: true,
      lastVerified: new Date('2024-01-20T14:30:00Z')
    },
    isPublic: true,
    tags: ['price', 'reduction']
  },
  {
    id: 'event-3',
    propertyId: '1',
    type: HistoryEventType.VIEWING_COMPLETED,
    title: 'Property Viewing Completed',
    description: 'Potential buyer completed a property viewing',
    timestamp: new Date('2024-01-22T16:00:00Z'),
    data: {
      viewing: {
        viewerId: 'buyer-789',
        viewerType: 'buyer',
        duration: 45,
        feedback: 'Very interested, considering making an offer',
        rating: 4
      }
    },
    source: {
      type: 'agent',
      id: 'agent-456',
      name: 'John Smith',
      verified: true
    },
    metadata: {
      confidence: 90,
      verified: true
    },
    isPublic: false,
    tags: ['viewing', 'buyer']
  },
  {
    id: 'event-4',
    propertyId: '1',
    type: HistoryEventType.PHOTO_ADDED,
    title: 'New Photos Added',
    description: '5 new professional photos were added to the listing',
    timestamp: new Date('2024-01-25T09:15:00Z'),
    data: {
      media: {
        action: 'photo_added',
        mediaCount: 5,
        mediaType: 'photo'
      }
    },
    source: {
      type: 'agent',
      id: 'agent-456',
      name: 'John Smith',
      verified: true
    },
    metadata: {
      confidence: 100,
      verified: true
    },
    isPublic: true,
    tags: ['media', 'photos']
  },
  {
    id: 'event-5',
    propertyId: '1',
    type: HistoryEventType.OPEN_HOUSE,
    title: 'Open House Scheduled',
    description: 'Open house scheduled for this weekend',
    timestamp: new Date('2024-01-26T11:00:00Z'),
    data: {
      viewing: {
        viewerId: 'public',
        viewerType: 'buyer',
        duration: 120
      }
    },
    source: {
      type: 'agent',
      id: 'agent-456',
      name: 'John Smith',
      verified: true
    },
    metadata: {
      confidence: 100,
      verified: true
    },
    isPublic: true,
    tags: ['open-house', 'marketing']
  }
];

class HistoryService {
  private histories: PropertyHistory[] = [];
  private events: HistoryEvent[] = [...mockEvents];
  private nextEventId = mockEvents.length + 1;

  /**
   * Create a new history event
   */
  async createEvent(data: CreateHistoryEventRequest): Promise<HistoryEventResponse> {
    try {
      // Validate input
      const validationErrors = this.validateCreateEvent(data);
      if (validationErrors.length > 0) {
        return {
          event: null as any,
          success: false,
          message: validationErrors.join(', ')
        };
      }

      // Create event
      const event: HistoryEvent = {
        id: `event-${this.nextEventId++}`,
        propertyId: data.propertyId,
        type: data.type,
        title: data.title,
        description: data.description,
        timestamp: new Date(),
        data: data.data,
        source: data.source,
        metadata: {
          confidence: 100,
          verified: true,
          ...data.source.verified ? {} : { verified: false }
        },
        isPublic: data.isPublic || false,
        tags: data.tags || []
      };

      this.events.push(event);

      // Update property history
      await this.updatePropertyHistory(data.propertyId);

      return {
        event,
        success: true,
        message: 'History event created successfully'
      };
    } catch (error) {
      return {
        event: null as any,
        success: false,
        message: 'Failed to create history event'
      };
    }
  }

  /**
   * Get history event by ID
   */
  async getEvent(id: string): Promise<HistoryEventResponse> {
    try {
      const event = this.events.find(e => e.id === id);
      
      if (!event) {
        return {
          event: null as any,
          success: false,
          message: 'History event not found'
        };
      }

      return {
        event,
        success: true
      };
    } catch (error) {
      return {
        event: null as any,
        success: false,
        message: 'Failed to get history event'
      };
    }
  }

  /**
   * Update history event
   */
  async updateEvent(id: string, updates: UpdateHistoryEventRequest): Promise<HistoryEventResponse> {
    try {
      const eventIndex = this.events.findIndex(e => e.id === id);
      
      if (eventIndex === -1) {
        return {
          event: null as any,
          success: false,
          message: 'History event not found'
        };
      }

      const event = this.events[eventIndex];
      
      // Update fields
      if (updates.title !== undefined) event.title = updates.title;
      if (updates.description !== undefined) event.description = updates.description;
      if (updates.data !== undefined) event.data = { ...event.data, ...updates.data };
      if (updates.isPublic !== undefined) event.isPublic = updates.isPublic;
      if (updates.tags !== undefined) event.tags = updates.tags;

      return {
        event,
        success: true,
        message: 'History event updated successfully'
      };
    } catch (error) {
      return {
        event: null as any,
        success: false,
        message: 'Failed to update history event'
      };
    }
  }

  /**
   * Delete history event
   */
  async deleteEvent(id: string): Promise<HistoryEventResponse> {
    try {
      const eventIndex = this.events.findIndex(e => e.id === id);
      
      if (eventIndex === -1) {
        return {
          event: null as any,
          success: false,
          message: 'History event not found'
        };
      }

      const event = this.events[eventIndex];
      this.events.splice(eventIndex, 1);

      // Update property history
      await this.updatePropertyHistory(event.propertyId);

      return {
        event,
        success: true,
        message: 'History event deleted successfully'
      };
    } catch (error) {
      return {
        event: null as any,
        success: false,
        message: 'Failed to delete history event'
      };
    }
  }

  /**
   * Get property history
   */
  async getPropertyHistory(propertyId: string): Promise<PropertyHistory | null> {
    try {
      const propertyEvents = this.events.filter(e => e.propertyId === propertyId);
      
      if (propertyEvents.length === 0) {
        return null;
      }

      const sortedEvents = propertyEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return {
        id: `history-${propertyId}`,
        propertyId,
        events: sortedEvents,
        createdAt: new Date(Math.min(...sortedEvents.map(e => new Date(e.timestamp).getTime()))),
        updatedAt: new Date(Math.max(...sortedEvents.map(e => new Date(e.timestamp).getTime()))),
        totalEvents: sortedEvents.length,
        lastEventDate: sortedEvents[0].timestamp
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get property timeline
   */
  async getPropertyTimeline(request: GetTimelineRequest): Promise<TimelineResponse> {
    try {
      const { propertyId, filters = {}, page = 1, limit = 20 } = request;
      
      let propertyEvents = this.events.filter(e => e.propertyId === propertyId);

      // Apply filters
      if (filters.eventTypes && filters.eventTypes.length > 0) {
        propertyEvents = propertyEvents.filter(e => filters.eventTypes!.includes(e.type));
      }

      if (filters.dateRange) {
        propertyEvents = propertyEvents.filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate >= filters.dateRange!.start && eventDate <= filters.dateRange!.end;
        });
      }

      if (filters.sources && filters.sources.length > 0) {
        propertyEvents = propertyEvents.filter(e => filters.sources!.includes(e.source.type));
      }

      if (filters.tags && filters.tags.length > 0) {
        propertyEvents = propertyEvents.filter(e => 
          filters.tags!.some(tag => e.tags.includes(tag))
        );
      }

      if (filters.isPublic !== undefined) {
        propertyEvents = propertyEvents.filter(e => e.isPublic === filters.isPublic);
      }

      // Sort events by timestamp (newest first)
      propertyEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = propertyEvents.slice(startIndex, endIndex);

      // Convert to timeline events
      const timelineEvents: any[] = paginatedEvents.map((event, index) => ({
        ...event,
        displayOrder: startIndex + index + 1,
        isVisible: true,
        category: this.getEventCategory(event.type),
        importance: this.getEventImportance(event.type),
        relatedEvents: this.findRelatedEvents(event, propertyEvents)
      }));

      // Generate summary
      const summary = this.generateTimelineSummary(propertyEvents);

      const timeline: PropertyTimeline = {
        propertyId,
        events: timelineEvents,
        summary,
        filters: {
          eventTypes: filters.eventTypes || [],
          dateRange: filters.dateRange,
          sources: filters.sources || [],
          importance: filters.importance || [],
          tags: filters.tags || [],
          isPublic: filters.isPublic
        },
        pagination: {
          page,
          limit,
          total: propertyEvents.length,
          hasMore: endIndex < propertyEvents.length
        }
      };

      return {
        timeline,
        success: true
      };
    } catch (error) {
      return {
        timeline: null as any,
        success: false,
        message: 'Failed to get property timeline'
      };
    }
  }

  /**
   * Search history events
   */
  async searchEvents(query: HistorySearchQuery, page = 1, limit = 20): Promise<HistorySearchResponse> {
    try {
      let filteredEvents = this.events;

      // Apply filters
      if (query.propertyId) {
        filteredEvents = filteredEvents.filter(e => e.propertyId === query.propertyId);
      }

      if (query.eventTypes && query.eventTypes.length > 0) {
        filteredEvents = filteredEvents.filter(e => query.eventTypes!.includes(e.type));
      }

      if (query.dateRange) {
        filteredEvents = filteredEvents.filter(e => {
          const eventDate = new Date(e.timestamp);
          return eventDate >= query.dateRange!.start && eventDate <= query.dateRange!.end;
        });
      }

      if (query.sources && query.sources.length > 0) {
        filteredEvents = filteredEvents.filter(e => query.sources!.includes(e.source.type));
      }

      if (query.tags && query.tags.length > 0) {
        filteredEvents = filteredEvents.filter(e => 
          query.tags!.some(tag => e.tags.includes(tag))
        );
      }

      if (query.keywords) {
        const keywords = query.keywords.toLowerCase();
        filteredEvents = filteredEvents.filter(e => 
          e.title.toLowerCase().includes(keywords) ||
          e.description.toLowerCase().includes(keywords)
        );
      }

      // Sort by timestamp
      filteredEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

      // Generate facets
      const facets = {
        eventTypes: this.generateFacet(filteredEvents, 'type'),
        sources: this.generateFacet(filteredEvents, 'source.type'),
        dateRanges: this.generateDateRangeFacet(filteredEvents)
      };

      return {
        events: paginatedEvents,
        total: filteredEvents.length,
        page,
        limit,
        facets
      };
    } catch (error) {
      return {
        events: [],
        total: 0,
        page,
        limit,
        facets: {
          eventTypes: {},
          sources: {},
          dateRanges: {}
        }
      };
    }
  }

  /**
   * Get history analytics
   */
  async getHistoryAnalytics(propertyId: string): Promise<HistoryAnalytics | null> {
    try {
      const propertyEvents = this.events.filter(e => e.propertyId === propertyId);
      
      if (propertyEvents.length === 0) {
        return null;
      }

      const eventTypeDistribution = this.generateFacet(propertyEvents, 'type');
      
      const activityTrend = this.generateActivityTrend(propertyEvents);
      
      const keyMetrics = this.calculateKeyMetrics(propertyEvents);
      
      const marketComparison = this.calculateMarketComparison(propertyEvents);
      
      const timelineInsights = this.generateTimelineInsights(propertyEvents);

      return {
        propertyId,
        totalEvents: propertyEvents.length,
        eventTypeDistribution,
        activityTrend,
        keyMetrics,
        marketComparison,
        timelineInsights
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Export timeline data
   */
  async exportTimeline(propertyId: string, options: TimelineExportOptions): Promise<Blob> {
    try {
      const timeline = await this.getPropertyTimeline({ propertyId });
      
      if (!timeline.success || !timeline.timeline) {
        throw new Error('Failed to get timeline data');
      }

      let data: string;
      let mimeType: string;

      switch (options.format) {
        case 'json':
          data = JSON.stringify(timeline.timeline, null, 2);
          mimeType = 'application/json';
          break;
        case 'csv':
          data = this.convertToCSV(timeline.timeline.events);
          mimeType = 'text/csv';
          break;
        case 'pdf':
          // In a real implementation, this would generate a PDF
          data = `PDF export for Property ${propertyId} Timeline`;
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      return new Blob([data], { type: mimeType });
    } catch (error) {
      throw new Error('Failed to export timeline');
    }
  }

  // Private helper methods
  private validateCreateEvent(data: CreateHistoryEventRequest): string[] {
    const errors: string[] = [];

    if (!data.propertyId || data.propertyId.trim().length === 0) {
      errors.push('Property ID is required');
    }

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Event title is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Event description is required');
    }

    if (!data.source || !data.source.id || !data.source.name) {
      errors.push('Event source is required');
    }

    return errors;
  }

  private async updatePropertyHistory(propertyId: string): Promise<void> {
    const existingHistory = this.histories.find(h => h.propertyId === propertyId);
    const propertyEvents = this.events.filter(e => e.propertyId === propertyId);

    if (existingHistory) {
      existingHistory.events = propertyEvents;
      existingHistory.totalEvents = propertyEvents.length;
      existingHistory.updatedAt = new Date();
      existingHistory.lastEventDate = propertyEvents.length > 0 
        ? propertyEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
        : new Date();
    } else if (propertyEvents.length > 0) {
      const sortedEvents = propertyEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      this.histories.push({
        id: `history-${propertyId}`,
        propertyId,
        events: sortedEvents,
        createdAt: new Date(Math.min(...sortedEvents.map(e => new Date(e.timestamp).getTime()))),
        updatedAt: new Date(),
        totalEvents: sortedEvents.length,
        lastEventDate: sortedEvents[0].timestamp
      });
    }
  }

  private getEventCategory(eventType: HistoryEventType): EventCategory {
    const categoryMap: { [key: string]: EventCategory } = {
      [HistoryEventType.PRICE_CHANGE]: EventCategory.PRICE,
      [HistoryEventType.PRICE_INCREASE]: EventCategory.PRICE,
      [HistoryEventType.PRICE_DECREASE]: EventCategory.PRICE,
      [HistoryEventType.PRICE_TARGET_REACHED]: EventCategory.PRICE,
      [HistoryEventType.STATUS_CHANGE]: EventCategory.STATUS,
      [HistoryEventType.LISTED]: EventCategory.STATUS,
      [HistoryEventType.DELISTED]: EventCategory.STATUS,
      [HistoryEventType.RELISTED]: EventCategory.STATUS,
      [HistoryEventType.SOLD]: EventCategory.STATUS,
      [HistoryEventType.RENTED]: EventCategory.STATUS,
      [HistoryEventType.PENDING]: EventCategory.STATUS,
      [HistoryEventType.WITHDRAWN]: EventCategory.STATUS,
      [HistoryEventType.MARKET_UPDATE]: EventCategory.MARKET,
      [HistoryEventType.COMPARABLE_SOLD]: EventCategory.MARKET,
      [HistoryEventType.MARKET_TREND_CHANGE]: EventCategory.MARKET,
      [HistoryEventType.RENOVATION]: EventCategory.PROPERTY,
      [HistoryEventType.MAINTENANCE]: EventCategory.PROPERTY,
      [HistoryEventType.INSPECTION]: EventCategory.PROPERTY,
      [HistoryEventType.APPRAISAL]: EventCategory.PROPERTY,
      [HistoryEventType.PHOTO_UPDATE]: EventCategory.MEDIA,
      [HistoryEventType.DESCRIPTION_UPDATE]: EventCategory.PROPERTY,
      [HistoryEventType.VIEWING_SCHEDULED]: EventCategory.VIEWING,
      [HistoryEventType.VIEWING_COMPLETED]: EventCategory.VIEWING,
      [HistoryEventType.OPEN_HOUSE]: EventCategory.VIEWING,
      [HistoryEventType.PHOTO_ADDED]: EventCategory.MEDIA,
      [HistoryEventType.PHOTO_REMOVED]: EventCategory.MEDIA,
      [HistoryEventType.VIDEO_ADDED]: EventCategory.MEDIA,
      [HistoryEventType.VIRTUAL_TOUR_CREATED]: EventCategory.MEDIA,
      [HistoryEventType.CUSTOM_EVENT]: EventCategory.CUSTOM,
      [HistoryEventType.NOTE_ADDED]: EventCategory.SOCIAL,
      [HistoryEventType.COMMENT_ADDED]: EventCategory.SOCIAL,
      [HistoryEventType.SHARED]: EventCategory.SOCIAL,
      [HistoryEventType.FAVORITED]: EventCategory.SOCIAL
    };

    return categoryMap[eventType] || EventCategory.CUSTOM;
  }

  private getEventImportance(eventType: HistoryEventType): EventImportance {
    const importanceMap: { [key: string]: EventImportance } = {
      [HistoryEventType.SOLD]: EventImportance.CRITICAL,
      [HistoryEventType.PRICE_TARGET_REACHED]: EventImportance.HIGH,
      [HistoryEventType.PRICE_CHANGE]: EventImportance.HIGH,
      [HistoryEventType.STATUS_CHANGE]: EventImportance.HIGH,
      [HistoryEventType.LISTED]: EventImportance.HIGH,
      [HistoryEventType.VIEWING_COMPLETED]: EventImportance.MEDIUM,
      [HistoryEventType.OPEN_HOUSE]: EventImportance.MEDIUM,
      [HistoryEventType.PHOTO_ADDED]: EventImportance.MEDIUM,
      [HistoryEventType.MARKET_UPDATE]: EventImportance.MEDIUM,
      [HistoryEventType.RENOVATION]: EventImportance.MEDIUM,
      [HistoryEventType.INSPECTION]: EventImportance.MEDIUM,
      [HistoryEventType.APPRAISAL]: EventImportance.MEDIUM,
      [HistoryEventType.VIEWING_SCHEDULED]: EventImportance.LOW,
      [HistoryEventType.PHOTO_UPDATE]: EventImportance.LOW,
      [HistoryEventType.DESCRIPTION_UPDATE]: EventImportance.LOW,
      [HistoryEventType.NOTE_ADDED]: EventImportance.LOW,
      [HistoryEventType.COMMENT_ADDED]: EventImportance.LOW,
      [HistoryEventType.SHARED]: EventImportance.LOW,
      [HistoryEventType.FAVORITED]: EventImportance.LOW
    };

    return importanceMap[eventType] || EventImportance.MEDIUM;
  }

  private findRelatedEvents(event: HistoryEvent, allEvents: HistoryEvent[]): string[] {
    // Simple logic to find related events based on type and time proximity
    const relatedEvents: string[] = [];
    const eventDate = new Date(event.timestamp);
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    allEvents.forEach(otherEvent => {
      if (otherEvent.id === event.id) return;

      const otherDate = new Date(otherEvent.timestamp);
      const timeDiff = Math.abs(eventDate.getTime() - otherDate.getTime());

      // Related if same type or within 1 day
      if (otherEvent.type === event.type || timeDiff <= oneDay) {
        relatedEvents.push(otherEvent.id);
      }
    });

    return relatedEvents.slice(0, 5); // Limit to 5 related events
  }

  private generateTimelineSummary(events: HistoryEvent[]): any {
    const eventTypes: { [key: string]: number } = {};
    events.forEach(event => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
    });

    const sortedEvents = events.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const keyMilestones = sortedEvents.filter(event => 
      [HistoryEventType.SOLD, HistoryEventType.LISTED, HistoryEventType.PRICE_CHANGE].includes(event.type)
    ).slice(0, 5);

    const recentActivity = sortedEvents.slice(0, 10);

    return {
      totalEvents: events.length,
      visibleEvents: events.length,
      dateRange: {
        start: events.length > 0 ? new Date(Math.min(...events.map(e => new Date(e.timestamp).getTime()))) : new Date(),
        end: events.length > 0 ? new Date(Math.max(...events.map(e => new Date(e.timestamp).getTime()))) : new Date()
      },
      eventTypes,
      keyMilestones,
      recentActivity
    };
  }

  private generateFacet(events: HistoryEvent[], field: string): { [key: string]: number } {
    const facet: { [key: string]: number } = {};
    
    events.forEach(event => {
      let value: string;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        value = (event as any)[parent][child];
      } else {
        value = (event as any)[field];
      }
      
      if (value) {
        facet[value] = (facet[value] || 0) + 1;
      }
    });

    return facet;
  }

  private generateDateRangeFacet(events: HistoryEvent[]): { [key: string]: number } {
    const facet: { [key: string]: number } = {};
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const threeMonths = 90 * 24 * 60 * 60 * 1000;

    events.forEach(event => {
      const eventDate = new Date(event.timestamp);
      const timeDiff = now.getTime() - eventDate.getTime();

      if (timeDiff <= oneWeek) {
        facet['Last Week'] = (facet['Last Week'] || 0) + 1;
      } else if (timeDiff <= oneMonth) {
        facet['Last Month'] = (facet['Last Month'] || 0) + 1;
      } else if (timeDiff <= threeMonths) {
        facet['Last 3 Months'] = (facet['Last 3 Months'] || 0) + 1;
      } else {
        facet['Older'] = (facet['Older'] || 0) + 1;
      }
    });

    return facet;
  }

  private generateActivityTrend(events: HistoryEvent[]): { date: Date; eventCount: number }[] {
    const trend: { [key: string]: number } = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      trend[date] = (trend[date] || 0) + 1;
    });

    return Object.entries(trend)
      .map(([date, eventCount]) => ({ date: new Date(date), eventCount }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private calculateKeyMetrics(events: HistoryEvent[]): any {
    const priceChanges = events.filter(e => e.type.includes('PRICE')).length;
    const viewings = events.filter(e => e.type.includes('VIEWING')).length;
    const statusChanges = events.filter(e => e.type.includes('STATUS')).length;
    
    // Calculate days on market (simplified)
    const listedEvent = events.find(e => e.type === HistoryEventType.LISTED);
    const soldEvent = events.find(e => e.type === HistoryEventType.SOLD);
    
    let daysOnMarket = 0;
    if (listedEvent && soldEvent) {
      daysOnMarket = Math.ceil(
        (new Date(soldEvent.timestamp).getTime() - new Date(listedEvent.timestamp).getTime()) / (24 * 60 * 60 * 1000)
      );
    } else if (listedEvent) {
      daysOnMarket = Math.ceil(
        (new Date().getTime() - new Date(listedEvent.timestamp).getTime()) / (24 * 60 * 60 * 1000)
      );
    }

    return {
      daysOnMarket,
      priceChanges,
      viewings,
      statusChanges
    };
  }

  private calculateMarketComparison(events: HistoryEvent[]): any {
    // Mock market comparison data
    return {
      averageDaysOnMarket: 45,
      averagePriceChanges: 2.3,
      marketActivity: 'medium' as const
    };
  }

  private generateTimelineInsights(events: HistoryEvent[]): string[] {
    const insights: string[] = [];
    
    const priceChanges = events.filter(e => e.type.includes('PRICE')).length;
    const viewings = events.filter(e => e.type.includes('VIEWING')).length;
    
    if (priceChanges > 2) {
      insights.push('This property has had multiple price changes, indicating market sensitivity.');
    }
    
    if (viewings > 5) {
      insights.push('High viewing activity suggests strong buyer interest.');
    }
    
    const recentEvents = events.filter(e => 
      new Date().getTime() - new Date(e.timestamp).getTime() <= 7 * 24 * 60 * 60 * 1000
    );
    
    if (recentEvents.length > 3) {
      insights.push('Recent high activity indicates active marketing efforts.');
    }

    return insights;
  }

  private convertToCSV(events: any[]): string {
    const headers = ['Date', 'Type', 'Title', 'Description', 'Source', 'Tags'];
    const rows = events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.type,
      event.title,
      event.description,
      event.source.name,
      event.tags.join(';')
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }
}

// Export singleton instance
export const historyService = new HistoryService();
export default historyService;
