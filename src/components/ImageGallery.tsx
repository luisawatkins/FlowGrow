'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PropertyImage } from '@/types'

interface ImageGalleryProps {
  images: PropertyImage[]
  propertyName: string
  className?: string
  showThumbnails?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImageClick?: (image: PropertyImage, index: number) => void
}

export function ImageGallery({
  images,
  propertyName,
  className = '',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onImageClick,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreen) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
        case 'Escape':
          event.preventDefault()
          setIsFullscreen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const handleImageClick = useCallback(() => {
    if (onImageClick) {
      onImageClick(images[currentIndex], currentIndex)
    } else {
      setIsFullscreen(true)
    }
  }, [images, currentIndex, onImageClick])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleImageError = useCallback((index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index))
    setIsLoading(false)
  }, [])

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false)
  }, [])

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <p>No images available</p>
        </div>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <>
      <div className={`relative ${className}`} ref={galleryRef}>
        {/* Main Image Display */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gray-100">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {imageLoadErrors.has(currentIndex) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p>Failed to load image</p>
                  </div>
                </div>
              ) : (
                <img
                  src={currentImage.url}
                  alt={currentImage.alt || `${propertyName} - Image ${currentIndex + 1}`}
                  className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onClick={handleImageClick}
                  onLoad={handleImageLoad}
                  onError={() => handleImageError(currentIndex)}
                  loading="lazy"
                />
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={goToPrevious}
                  >
                    ‹
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={goToNext}
                  >
                    ›
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}

              {/* Primary Badge */}
              {currentImage.isPrimary && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Primary
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Navigation */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {imageLoadErrors.has(index) ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400 text-xs">❌</div>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto-play Controls */}
        {autoPlay && images.length > 1 && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current)
                  intervalRef.current = null
                } else {
                  intervalRef.current = setInterval(() => {
                    setCurrentIndex((prev) => (prev + 1) % images.length)
                  }, autoPlayInterval)
                }
              }}
            >
              {intervalRef.current ? '⏸️ Pause' : '▶️ Play'}
            </Button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
              onClick={handleCloseFullscreen}
            >
              ✕
            </Button>

            {/* Fullscreen Image */}
            <div className="relative">
              <img
                src={currentImage.url}
                alt={currentImage.alt || `${propertyName} - Fullscreen`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation in Fullscreen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={goToPrevious}
                  >
                    ‹
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={goToNext}
                  >
                    ›
                  </Button>
                </>
              )}

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                <h3 className="font-semibold">{propertyName}</h3>
                <p className="text-sm opacity-90">
                  {currentImage.alt || `Image ${currentIndex + 1} of ${images.length}`}
                </p>
                {currentImage.isPrimary && (
                  <span className="inline-block mt-1 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Primary Image
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Image Upload Component
interface ImageUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-4">📷</div>
        <h3 className="text-lg font-semibold mb-2">Upload Property Images</h3>
        <p className="text-gray-600 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Max {maxFiles} files, {maxSize}MB each. Supported: JPG, PNG, WebP
        </p>
        
        <Button onClick={openFileDialog} variant="outline">
          Choose Files
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">
                {progress}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}