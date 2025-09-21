'use client'

import { useState, useCallback } from 'react'
import { PropertyImage } from '@/types'
import { Button } from '@/components/ui/Button'

interface ImageGalleryProps {
  images: PropertyImage[]
  className?: string
  showThumbnails?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function ImageGallery({ 
  images, 
  className = '',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentImage = images[currentIndex]

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  }, [images.length])

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🏠</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative ${className}`}>
        {/* Main Image */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ›
              </Button>
            </>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ⛶
          </Button>
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <FullscreenGallery
          images={images}
          currentIndex={currentIndex}
          onClose={() => setIsFullscreen(false)}
          onNavigate={goToImage}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  )
}

interface FullscreenGalleryProps {
  images: PropertyImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
  onPrevious: () => void
  onNext: () => void
}

function FullscreenGallery({
  images,
  currentIndex,
  onClose,
  onNavigate,
  onPrevious,
  onNext
}: FullscreenGalleryProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        onPrevious()
        break
      case 'ArrowRight':
        onNext()
        break
    }
  }, [onClose, onPrevious, onNext])

  // Add keyboard event listener
  useState(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="outline"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
        >
          ✕
        </Button>

        {/* Main Image */}
        <div className="relative max-w-full max-h-full">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
              >
                ›
              </Button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 rounded-lg p-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onNavigate(index)}
                className={`w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-white'
                    : 'border-gray-400 hover:border-gray-200'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Info */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-80">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </div>
  )
}
