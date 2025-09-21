'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

// Lazy load heavy components
export const LazyPropertyModal = lazy(() => 
  import('./PropertyModal').then(module => ({ default: module.PropertyModal }))
)

export const LazyUserDashboard = lazy(() => 
  import('./UserDashboard').then(module => ({ default: module.UserDashboard }))
)

export const LazyImageGallery = lazy(() => 
  import('./ImageGallery').then(module => ({ default: module.ImageGallery }))
)

export const LazyImageUpload = lazy(() => 
  import('./ImageUpload').then(module => ({ default: module.ImageUpload }))
)

export const LazyFavoritesManager = lazy(() => 
  import('./FavoritesManager').then(module => ({ default: module.FavoritesManager }))
)

export const LazyUserProfile = lazy(() => 
  import('./UserProfile').then(module => ({ default: module.UserProfileComponent }))
)

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// Lazy loading wrapper with custom fallback
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string
}

export function LazyWrapper({ 
  children, 
  fallback, 
  minHeight = '200px' 
}: LazyWrapperProps) {
  return (
    <Suspense 
      fallback={
        fallback || (
          <div 
            className="flex items-center justify-center p-8"
            style={{ minHeight }}
          >
            <LoadingSpinner />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}

// Preload components for better UX
export function preloadComponents() {
  if (typeof window === 'undefined') return

  // Preload critical components
  const componentsToPreload = [
    () => import('./PropertyModal'),
    () => import('./UserDashboard'),
    () => import('./ImageGallery'),
  ]

  // Preload after initial load
  setTimeout(() => {
    componentsToPreload.forEach(preload => {
      preload().catch(console.error)
    })
  }, 2000)
}

// Route-based code splitting
export const LazyMarketplace = lazy(() => 
  import('../app/marketplace/page').then(module => ({ default: module.default }))
)

export const LazyFlowPage = lazy(() => 
  import('../app/flow/page').then(module => ({ default: module.default }))
)

// Conditional lazy loading based on user interaction
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  shouldLoad: boolean = true
) {
  const [Component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (shouldLoad && !Component && !loading) {
      setLoading(true)
      importFn()
        .then(module => {
          setComponent(() => module.default)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [shouldLoad, Component, loading, importFn])

  return { Component, loading }
}

// Image lazy loading component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  onLoad,
  onError 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    onError?.()
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {placeholder || <div className="text-gray-400">Loading...</div>}
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}
    </div>
  )
}

// Dynamic import utility
export async function dynamicImport<T>(importFn: () => Promise<T>): Promise<T> {
  try {
    return await importFn()
  } catch (error) {
    console.error('Dynamic import failed:', error)
    throw error
  }
}

// Component preloader
export class ComponentPreloader {
  private static cache = new Map<string, Promise<any>>()

  static async preload<T>(key: string, importFn: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }

    const promise = importFn()
    this.cache.set(key, promise)
    return promise
  }

  static clearCache(): void {
    this.cache.clear()
  }

  static getCacheSize(): number {
    return this.cache.size
  }
}
