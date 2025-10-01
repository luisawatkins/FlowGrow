export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  tags?: string[];
  isPrimary?: boolean;
  order?: number;
}

export interface ImageGallery {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  images: PropertyImage[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ImageViewerSettings {
  showThumbnails: boolean;
  showCaptions: boolean;
  autoPlay: boolean;
  autoPlayInterval: number;
  showFullscreen: boolean;
  showZoom: boolean;
  showSlideshow: boolean;
  transitionEffect: 'fade' | 'slide' | 'none';
}

export interface ImageFilter {
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  uploadedBy?: string;
  isPrimary?: boolean;
  searchTerm?: string;
}

export interface ImageUpload {
  file: File;
  caption?: string;
  tags?: string[];
  isPrimary?: boolean;
  order?: number;
}

export interface ImageAnalytics {
  totalImages: number;
  totalSize: number;
  imagesByMonth: Array<{
    month: string;
    count: number;
    size: number;
  }>;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
  uploadStats: {
    totalUploads: number;
    averageSize: number;
    mostActiveUser: string;
  };
}

export interface ImageExport {
  format: 'zip' | 'pdf' | 'slideshow';
  includeMetadata: boolean;
  quality: 'low' | 'medium' | 'high';
  filters?: ImageFilter;
}
