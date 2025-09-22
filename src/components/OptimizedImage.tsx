'use client'

import { useState, useRef, useEffect } from 'react'
import { PropertyImage } from '@/types'

interface OptimizedImageProps {
  image: PropertyImage
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  onClick?: () => void
}

interface ImageDimensions {
  width: number
  height: number
}

export function OptimizedImage({
  image,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
      observerRef.current = observer
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [priority, isInView])

  // Get image dimensions
  useEffect(() => {
    if (!isInView || dimensions) return

    const img = new Image()
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.src = image.url
  }, [isInView, image.url, dimensions])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    onError?.()
  }

  const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Create a simple gradient blur
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#f3f4f6')
      gradient.addColorStop(1, '#e5e7eb')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }
    
    return canvas.toDataURL()
  }

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL()

  // Generate responsive srcSet
  const generateSrcSet = (baseUrl: string): string => {
    const widths = [320, 640, 768, 1024, 1280, 1536]
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ')
  }

  const aspectRatio = dimensions 
    ? `${dimensions.width} / ${dimensions.height}`
    : '16 / 9'

  if (isError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ aspectRatio }}
        onClick={onClick}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-1">🖼️</div>
          <p className="text-sm">Failed to load</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
      onClick={onClick}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${defaultBlurDataURL})`,
          }}
        />
      )}

      {/* Loading Spinner */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={image.url}
          srcSet={generateSrcSet(image.url)}
          sizes={sizes}
          alt={alt || image.alt || 'Property image'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${onClick ? 'cursor-pointer' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Primary Badge */}
      {image.isPrimary && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          Primary
        </div>
      )}

      {/* Hover Overlay */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 rounded-full p-2">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Image Gallery Grid Component
interface ImageGridProps {
  images: PropertyImage[]
  onImageClick?: (image: PropertyImage, index: number) => void
  className?: string
  maxImages?: number
  showMoreButton?: boolean
}

export function ImageGrid({
  images,
  onImageClick,
  className = '',
  maxImages = 6,
  showMoreButton = true,
}: ImageGridProps) {
  const [showAll, setShowAll] = useState(false)
  
  const displayImages = showAll ? images : images.slice(0, maxImages)
  const hasMoreImages = images.length > maxImages

  const getGridLayout = (imageCount: number) => {
    if (imageCount === 1) return 'grid-cols-1'
    if (imageCount === 2) return 'grid-cols-2'
    if (imageCount === 3) return 'grid-cols-3'
    if (imageCount === 4) return 'grid-cols-2'
    if (imageCount >= 5) return 'grid-cols-3'
    return 'grid-cols-2'
  }

  return (
    <div className={className}>
      <div className={`grid gap-2 ${getGridLayout(displayImages.length)}`}>
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className={`relative ${
              index === 0 && displayImages.length > 1 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <OptimizedImage
              image={image}
              className="w-full h-full min-h-[120px]"
              onClick={() => onImageClick?.(image, index)}
              priority={index < 2}
            />
            
            {/* More Images Overlay */}
            {index === maxImages - 1 && hasMoreImages && !showAll && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">+{images.length - maxImages}</div>
                  <div className="text-sm">more images</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMoreImages && showMoreButton && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show Less' : `Show All ${images.length} Images`}
          </button>
        </div>
      )}
    </div>
  )
}

// Image Carousel Component
interface ImageCarouselProps {
  images: PropertyImage[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showThumbnails?: boolean
  onImageClick?: (image: PropertyImage, index: number) => void
}

export function ImageCarousel({
  images,
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
  showThumbnails = true,
  onImageClick,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <OptimizedImage
          image={images[currentIndex]}
          className="w-full h-full"
          onClick={() => onImageClick?.(images[currentIndex], currentIndex)}
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <OptimizedImage
                  image={image}
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}