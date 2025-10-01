// Virtual Tour Service
// Business logic for virtual property tours

import {
  VirtualTour,
  TourScene,
  TourHotspot,
  TourTemplate,
  TourAnalytics,
  TourComment,
  TourShare,
  CreateTourRequest,
  UpdateTourRequest,
  AddSceneRequest,
  AddHotspotRequest,
  TourSearchRequest,
  TourSearchResponse,
  TourType,
  TourStatus,
  SceneType,
  MediaType,
  MediaQuality,
  HotspotType,
  HotspotAction,
  TourQuality,
  LoadingStrategy,
  ErrorHandling,
  TemplateCategory,
  SharePlatform,
  VirtualTourApiError
} from '@/types/virtualTour';

// Mock data for development and testing
const mockTours: VirtualTour[] = [
  {
    id: 'tour1',
    propertyId: 'prop1',
    title: 'Luxury Downtown Condo - 360° Virtual Tour',
    description: 'Experience this stunning 2-bedroom condo with panoramic city views',
    type: TourType.PHOTO_360,
    status: TourStatus.PUBLISHED,
    thumbnailUrl: '/images/tours/luxury-condo-thumb.jpg',
    duration: 180,
    scenes: [],
    hotspots: [],
    settings: {
      autoplay: false,
      autoplayDelay: 3,
      loop: true,
      showProgress: true,
      showSceneList: true,
      showFullscreenButton: true,
      showShareButton: true,
      showInfoButton: true,
      keyboardNavigation: true,
      mouseNavigation: true,
      touchNavigation: true,
      vrMode: true,
      quality: TourQuality.HIGH,
      loadingStrategy: LoadingStrategy.PROGRESSIVE,
      errorHandling: ErrorHandling.RETRY
    },
    metadata: {
      author: 'Virtual Tour Pro',
      tags: ['luxury', 'condo', 'downtown', '360'],
      category: 'real_estate',
      language: 'en',
      version: '1.0',
      createdWith: 'FlowGrow Tour Creator',
      lastModified: '2024-01-15T10:00:00Z',
      fileSize: 52428800, // 50MB
      compressionRatio: 0.8,
      technicalSpecs: {
        resolution: '4K',
        frameRate: 30,
        bitrate: 10000,
        codec: 'H.264',
        format: 'MP4',
        compression: 'H.264',
        colorSpace: 'sRGB',
        hdr: false,
        stereo: false
      }
    },
    isPublic: true,
    isEmbeddable: true,
    viewCount: 1250,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-10T00:00:00Z'
  }
];

const mockTemplates: TourTemplate[] = [
  {
    id: 'template1',
    name: 'Real Estate Showcase',
    description: 'Professional template for real estate virtual tours',
    category: TemplateCategory.REAL_ESTATE,
    thumbnailUrl: '/images/templates/real-estate.jpg',
    scenes: [],
    settings: {
      autoplay: false,
      showProgress: true,
      showSceneList: true,
      quality: TourQuality.HIGH
    },
    isPremium: false,
    downloads: 1250,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template2',
    name: 'Luxury Property Tour',
    description: 'Premium template for luxury property showcases',
    category: TemplateCategory.REAL_ESTATE,
    thumbnailUrl: '/images/templates/luxury-property.jpg',
    scenes: [],
    settings: {
      autoplay: true,
      autoplayDelay: 5,
      showProgress: true,
      showSceneList: true,
      quality: TourQuality.ULTRA
    },
    isPremium: true,
    price: 99.99,
    downloads: 450,
    rating: 4.9,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

class VirtualTourService {
  private tours: VirtualTour[] = mockTours;
  private templates: TourTemplate[] = mockTemplates;
  private analytics: TourAnalytics[] = [];
  private comments: TourComment[] = [];
  private shares: TourShare[] = [];

  // Tour Management
  async createTour(request: CreateTourRequest): Promise<VirtualTour> {
    try {
      const tour: VirtualTour = {
        id: `tour_${Date.now()}`,
        propertyId: request.propertyId,
        title: request.title,
        description: request.description || '',
        type: request.type,
        status: TourStatus.DRAFT,
        duration: 0,
        scenes: [],
        hotspots: [],
        settings: this.getDefaultSettings(),
        metadata: this.getDefaultMetadata(),
        isPublic: request.isPublic || false,
        isEmbeddable: request.isEmbeddable || false,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Apply template if specified
      if (request.templateId) {
        const template = this.templates.find(t => t.id === request.templateId);
        if (template) {
          tour.settings = { ...tour.settings, ...template.settings };
          tour.metadata.tags = [...tour.metadata.tags, ...template.name.toLowerCase().split(' ')];
        }
      }

      this.tours.push(tour);
      return tour;
    } catch (error) {
      throw this.createApiError('CREATE_TOUR_FAILED', 'Failed to create virtual tour', error);
    }
  }

  async getTour(id: string): Promise<VirtualTour | null> {
    try {
      return this.tours.find(tour => tour.id === id) || null;
    } catch (error) {
      throw this.createApiError('GET_TOUR_FAILED', 'Failed to get virtual tour', error);
    }
  }

  async updateTour(id: string, request: UpdateTourRequest): Promise<VirtualTour> {
    try {
      const tourIndex = this.tours.findIndex(tour => tour.id === id);
      if (tourIndex === -1) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const tour = this.tours[tourIndex];
      const updatedTour: VirtualTour = {
        ...tour,
        ...request,
        settings: request.settings ? { ...tour.settings, ...request.settings } : tour.settings,
        updatedAt: new Date().toISOString()
      };

      this.tours[tourIndex] = updatedTour;
      return updatedTour;
    } catch (error) {
      throw this.createApiError('UPDATE_TOUR_FAILED', 'Failed to update virtual tour', error);
    }
  }

  async deleteTour(id: string): Promise<void> {
    try {
      const tourIndex = this.tours.findIndex(tour => tour.id === id);
      if (tourIndex === -1) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      this.tours.splice(tourIndex, 1);
    } catch (error) {
      throw this.createApiError('DELETE_TOUR_FAILED', 'Failed to delete virtual tour', error);
    }
  }

  async publishTour(id: string): Promise<VirtualTour> {
    try {
      const tour = await this.getTour(id);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      if (tour.scenes.length === 0) {
        throw this.createApiError('NO_SCENES', 'Cannot publish tour without scenes');
      }

      const updatedTour = await this.updateTour(id, {
        status: TourStatus.PUBLISHED,
        publishedAt: new Date().toISOString()
      });

      return updatedTour;
    } catch (error) {
      throw this.createApiError('PUBLISH_TOUR_FAILED', 'Failed to publish virtual tour', error);
    }
  }

  // Scene Management
  async addScene(request: AddSceneRequest): Promise<TourScene> {
    try {
      const tour = await this.getTour(request.tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const scene: TourScene = {
        id: `scene_${Date.now()}`,
        tourId: request.tourId,
        name: request.name,
        description: request.description,
        type: request.type,
        media: {
          type: request.media.type,
          url: request.media.url,
          width: 4096,
          height: 2048,
          format: 'jpg',
          size: 0,
          quality: MediaQuality.HIGH,
          isSpherical: request.media.isSpherical,
          metadata: {}
        },
        position: {
          x: 0,
          y: 0,
          z: 0,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          ...request.position
        },
        settings: {
          autoRotate: false,
          rotationSpeed: 1,
          initialFov: 75,
          minFov: 30,
          maxFov: 120,
          enableZoom: true,
          enablePan: true,
          enableFullscreen: true,
          showControls: true,
          showCompass: true,
          showLoadingSpinner: true,
          backgroundColor: '#000000',
          ...request.settings
        },
        hotspots: [],
        transitions: [],
        createdAt: new Date().toISOString()
      };

      // Add scene to tour
      tour.scenes.push(scene);
      tour.updatedAt = new Date().toISOString();

      return scene;
    } catch (error) {
      throw this.createApiError('ADD_SCENE_FAILED', 'Failed to add scene to tour', error);
    }
  }

  async updateScene(tourId: string, sceneId: string, updates: Partial<TourScene>): Promise<TourScene> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const sceneIndex = tour.scenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex === -1) {
        throw this.createApiError('SCENE_NOT_FOUND', 'Scene not found');
      }

      const scene = tour.scenes[sceneIndex];
      const updatedScene: TourScene = {
        ...scene,
        ...updates,
        settings: updates.settings ? { ...scene.settings, ...updates.settings } : scene.settings,
        position: updates.position ? { ...scene.position, ...updates.position } : scene.position
      };

      tour.scenes[sceneIndex] = updatedScene;
      tour.updatedAt = new Date().toISOString();

      return updatedScene;
    } catch (error) {
      throw this.createApiError('UPDATE_SCENE_FAILED', 'Failed to update scene', error);
    }
  }

  async deleteScene(tourId: string, sceneId: string): Promise<void> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const sceneIndex = tour.scenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex === -1) {
        throw this.createApiError('SCENE_NOT_FOUND', 'Scene not found');
      }

      tour.scenes.splice(sceneIndex, 1);
      tour.updatedAt = new Date().toISOString();
    } catch (error) {
      throw this.createApiError('DELETE_SCENE_FAILED', 'Failed to delete scene', error);
    }
  }

  // Hotspot Management
  async addHotspot(request: AddHotspotRequest): Promise<TourHotspot> {
    try {
      const tour = await this.getTour(request.tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const scene = tour.scenes.find(s => s.id === request.sceneId);
      if (!scene) {
        throw this.createApiError('SCENE_NOT_FOUND', 'Scene not found');
      }

      const hotspot: TourHotspot = {
        id: `hotspot_${Date.now()}`,
        tourId: request.tourId,
        sceneId: request.sceneId,
        type: request.type,
        position: request.position,
        content: request.content,
        settings: {
          size: 20,
          color: '#ffffff',
          opacity: 0.8,
          pulse: true,
          pulseColor: '#ff6b6b',
          showOnHover: true,
          tooltip: true,
          tooltipPosition: 'top' as any,
          animation: 'pulse' as any,
          ...request.settings
        },
        isVisible: true,
        isInteractive: true,
        createdAt: new Date().toISOString()
      };

      // Add hotspot to tour and scene
      tour.hotspots.push(hotspot);
      scene.hotspots.push(hotspot.id);
      tour.updatedAt = new Date().toISOString();

      return hotspot;
    } catch (error) {
      throw this.createApiError('ADD_HOTSPOT_FAILED', 'Failed to add hotspot', error);
    }
  }

  async updateHotspot(tourId: string, hotspotId: string, updates: Partial<TourHotspot>): Promise<TourHotspot> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const hotspotIndex = tour.hotspots.findIndex(hotspot => hotspot.id === hotspotId);
      if (hotspotIndex === -1) {
        throw this.createApiError('HOTSPOT_NOT_FOUND', 'Hotspot not found');
      }

      const hotspot = tour.hotspots[hotspotIndex];
      const updatedHotspot: TourHotspot = {
        ...hotspot,
        ...updates,
        settings: updates.settings ? { ...hotspot.settings, ...updates.settings } : hotspot.settings,
        position: updates.position ? { ...hotspot.position, ...updates.position } : hotspot.position,
        content: updates.content ? { ...hotspot.content, ...updates.content } : hotspot.content
      };

      tour.hotspots[hotspotIndex] = updatedHotspot;
      tour.updatedAt = new Date().toISOString();

      return updatedHotspot;
    } catch (error) {
      throw this.createApiError('UPDATE_HOTSPOT_FAILED', 'Failed to update hotspot', error);
    }
  }

  async deleteHotspot(tourId: string, hotspotId: string): Promise<void> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const hotspotIndex = tour.hotspots.findIndex(hotspot => hotspot.id === hotspotId);
      if (hotspotIndex === -1) {
        throw this.createApiError('HOTSPOT_NOT_FOUND', 'Hotspot not found');
      }

      const hotspot = tour.hotspots[hotspotIndex];
      
      // Remove hotspot from scene
      const scene = tour.scenes.find(s => s.id === hotspot.sceneId);
      if (scene) {
        const sceneHotspotIndex = scene.hotspots.indexOf(hotspotId);
        if (sceneHotspotIndex > -1) {
          scene.hotspots.splice(sceneHotspotIndex, 1);
        }
      }

      // Remove hotspot from tour
      tour.hotspots.splice(hotspotIndex, 1);
      tour.updatedAt = new Date().toISOString();
    } catch (error) {
      throw this.createApiError('DELETE_HOTSPOT_FAILED', 'Failed to delete hotspot', error);
    }
  }

  // Search and Discovery
  async searchTours(request: TourSearchRequest): Promise<TourSearchResponse> {
    try {
      let results = [...this.tours];

      // Apply filters
      if (request.query) {
        const query = request.query.toLowerCase();
        results = results.filter(tour =>
          tour.title.toLowerCase().includes(query) ||
          tour.description.toLowerCase().includes(query) ||
          tour.metadata.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (request.propertyId) {
        results = results.filter(tour => tour.propertyId === request.propertyId);
      }

      if (request.type) {
        results = results.filter(tour => tour.type === request.type);
      }

      if (request.status) {
        results = results.filter(tour => tour.status === request.status);
      }

      if (request.isPublic !== undefined) {
        results = results.filter(tour => tour.isPublic === request.isPublic);
      }

      if (request.tags && request.tags.length > 0) {
        results = results.filter(tour =>
          request.tags!.some(tag => tour.metadata.tags.includes(tag))
        );
      }

      if (request.category) {
        results = results.filter(tour => tour.metadata.category === request.category);
      }

      // Sort results
      if (request.sortBy) {
        results.sort((a, b) => {
          let comparison = 0;
          switch (request.sortBy) {
            case 'created':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'updated':
              comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
              break;
            case 'views':
              comparison = b.viewCount - a.viewCount;
              break;
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;
          }
          return request.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // Apply pagination
      const limit = request.limit || 20;
      const offset = request.offset || 0;
      const paginatedResults = results.slice(offset, offset + limit);

      return {
        tours: paginatedResults,
        total: results.length,
        limit,
        offset,
        hasMore: offset + limit < results.length
      };
    } catch (error) {
      throw this.createApiError('SEARCH_TOURS_FAILED', 'Failed to search tours', error);
    }
  }

  // Templates
  async getTemplates(category?: TemplateCategory): Promise<TourTemplate[]> {
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

  async getTemplate(id: string): Promise<TourTemplate | null> {
    try {
      return this.templates.find(template => template.id === id) || null;
    } catch (error) {
      throw this.createApiError('GET_TEMPLATE_FAILED', 'Failed to get template', error);
    }
  }

  // Analytics
  async getTourAnalytics(tourId: string, timeRange?: { start: string; end: string }): Promise<TourAnalytics | null> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        return null;
      }

      // Generate mock analytics
      const analytics: TourAnalytics = {
        id: `analytics_${tourId}`,
        tourId,
        views: tour.viewCount,
        uniqueViews: Math.floor(tour.viewCount * 0.8),
        averageViewTime: 45,
        completionRate: 0.75,
        hotspots: tour.hotspots.map(hotspot => ({
          hotspotId: hotspot.id,
          clicks: Math.floor(Math.random() * 100),
          hoverTime: Math.floor(Math.random() * 30),
          conversionRate: Math.random() * 0.3
        })),
        scenes: tour.scenes.map(scene => ({
          sceneId: scene.id,
          views: Math.floor(Math.random() * 200),
          averageViewTime: Math.floor(Math.random() * 60),
          transitions: Math.floor(Math.random() * 50)
        })),
        devices: [
          { device: 'Desktop', views: Math.floor(tour.viewCount * 0.6), percentage: 60 },
          { device: 'Mobile', views: Math.floor(tour.viewCount * 0.35), percentage: 35 },
          { device: 'Tablet', views: Math.floor(tour.viewCount * 0.05), percentage: 5 }
        ],
        locations: [
          { country: 'United States', views: Math.floor(tour.viewCount * 0.7), percentage: 70 },
          { country: 'Canada', views: Math.floor(tour.viewCount * 0.15), percentage: 15 },
          { country: 'United Kingdom', views: Math.floor(tour.viewCount * 0.1), percentage: 10 },
          { country: 'Other', views: Math.floor(tour.viewCount * 0.05), percentage: 5 }
        ],
        timeRange: timeRange || {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        createdAt: new Date().toISOString()
      };

      return analytics;
    } catch (error) {
      throw this.createApiError('GET_ANALYTICS_FAILED', 'Failed to get tour analytics', error);
    }
  }

  // Comments
  async addComment(tourId: string, comment: Omit<TourComment, 'id' | 'createdAt'>): Promise<TourComment> {
    try {
      const newComment: TourComment = {
        id: `comment_${Date.now()}`,
        ...comment,
        createdAt: new Date().toISOString()
      };

      this.comments.push(newComment);
      return newComment;
    } catch (error) {
      throw this.createApiError('ADD_COMMENT_FAILED', 'Failed to add comment', error);
    }
  }

  async getComments(tourId: string): Promise<TourComment[]> {
    try {
      return this.comments.filter(comment => comment.tourId === tourId);
    } catch (error) {
      throw this.createApiError('GET_COMMENTS_FAILED', 'Failed to get comments', error);
    }
  }

  // Sharing
  async shareTour(tourId: string, platform: SharePlatform, customData?: any): Promise<TourShare> {
    try {
      const tour = await this.getTour(tourId);
      if (!tour) {
        throw this.createApiError('TOUR_NOT_FOUND', 'Virtual tour not found');
      }

      const share: TourShare = {
        id: `share_${Date.now()}`,
        tourId,
        platform,
        url: this.generateShareUrl(tourId, platform),
        title: tour.title,
        description: tour.description,
        thumbnailUrl: tour.thumbnailUrl,
        isActive: true,
        shareCount: 0,
        createdAt: new Date().toISOString()
      };

      this.shares.push(share);
      return share;
    } catch (error) {
      throw this.createApiError('SHARE_TOUR_FAILED', 'Failed to share tour', error);
    }
  }

  // Private helper methods
  private getDefaultSettings() {
    return {
      autoplay: false,
      autoplayDelay: 3,
      loop: true,
      showProgress: true,
      showSceneList: true,
      showFullscreenButton: true,
      showShareButton: true,
      showInfoButton: true,
      keyboardNavigation: true,
      mouseNavigation: true,
      touchNavigation: true,
      vrMode: true,
      quality: TourQuality.HIGH,
      loadingStrategy: LoadingStrategy.PROGRESSIVE,
      errorHandling: ErrorHandling.RETRY
    };
  }

  private getDefaultMetadata() {
    return {
      author: 'FlowGrow User',
      tags: [],
      category: 'real_estate',
      language: 'en',
      version: '1.0',
      createdWith: 'FlowGrow Tour Creator',
      lastModified: new Date().toISOString(),
      fileSize: 0,
      compressionRatio: 1,
      technicalSpecs: {
        resolution: '4K',
        format: 'MP4',
        compression: 'H.264',
        colorSpace: 'sRGB',
        hdr: false,
        stereo: false
      }
    };
  }

  private generateShareUrl(tourId: string, platform: SharePlatform): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://flowgrow.com';
    
    switch (platform) {
      case SharePlatform.EMBED:
        return `${baseUrl}/embed/tour/${tourId}`;
      case SharePlatform.LINK:
        return `${baseUrl}/tour/${tourId}`;
      case SharePlatform.QR_CODE:
        return `${baseUrl}/qr/tour/${tourId}`;
      default:
        return `${baseUrl}/tour/${tourId}`;
    }
  }

  private createApiError(code: string, message: string, details?: any): VirtualTourApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const virtualTourService = new VirtualTourService();
