'use client'

import { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 75,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

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
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate optimized image URL (in a real app, you'd use a service like Cloudinary or Next.js Image)
  const getOptimizedSrc = (originalSrc: string) => {
    // For demo purposes, we'll just return the original src
    // In production, you'd generate optimized URLs with width, height, quality parameters
    return originalSrc
  }

  const optimizedSrc = isInView ? getOptimizedSrc(src) : ''

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Failed to load image</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${blurDataURL})`
          }}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  )
}

// Utility function to generate blur data URL
export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Create a simple gradient as blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

// Hook for image optimization
export function useImageOptimization() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if browser supports modern image formats
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Check WebP support
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      setIsSupported(webpSupported)
    }
  }, [])

  const getOptimalFormat = (originalSrc: string) => {
    if (isSupported && originalSrc.includes('.')) {
      const extension = originalSrc.split('.').pop()?.toLowerCase()
      if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
        return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      }
    }
    return originalSrc
  }

  const getResponsiveSrc = (originalSrc: string, width: number) => {
    // In a real app, you'd generate responsive image URLs
    // For now, we'll just return the original
    return originalSrc
  }

  return {
    isSupported,
    getOptimalFormat,
    getResponsiveSrc
  }
}
