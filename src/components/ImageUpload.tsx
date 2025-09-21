'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { PropertyImage } from '@/types'

interface ImageUploadProps {
  onImagesChange: (images: PropertyImage[]) => void
  images: PropertyImage[]
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  onImagesChange, 
  images = [], 
  maxImages = 10,
  className = '' 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    const newImages: PropertyImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`)
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        continue
      }

      try {
        // In a real app, you would upload to a cloud service like AWS S3, Cloudinary, etc.
        // For now, we'll create a local URL
        const url = URL.createObjectURL(file)
        
        const newImage: PropertyImage = {
          id: `img_${Date.now()}_${i}`,
          url,
          alt: file.name,
          isPrimary: images.length === 0 && i === 0, // First image is primary
          order: images.length + i,
          uploadedAt: new Date().toISOString(),
        }

        newImages.push(newImage)
      } catch (error) {
        console.error('Error processing file:', error)
        alert(`Error processing ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages])
    }

    setUploading(false)
  }, [images, maxImages, onImagesChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  const removeImage = useCallback((imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    
    // If we removed the primary image, make the first remaining image primary
    if (images.find(img => img.id === imageId)?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true
    }
    
    onImagesChange(updatedImages)
  }, [images, onImagesChange])

  const setPrimaryImage = useCallback((imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }))
    
    onImagesChange(updatedImages)
  }, [images, onImagesChange])

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    const updatedImages = [...images]
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    updatedImages.splice(toIndex, 0, movedImage)
    
    // Update order property
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index
    }))
    
    onImagesChange(reorderedImages)
  }, [images, onImagesChange])

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">📷</div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragging ? 'Drop images here' : 'Upload Property Images'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop images or click to select
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max {maxImages} images, 5MB each. Supports JPG, PNG, WebP
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            variant="outline"
          >
            {uploading ? 'Uploading...' : 'Choose Images'}
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Property Images ({images.length}/{maxImages})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.order - b.order)
              .map((image, index) => (
                <ImageThumbnail
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                  onSetPrimary={setPrimaryImage}
                  onReorder={reorderImages}
                  totalImages={images.length}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface ImageThumbnailProps {
  image: PropertyImage
  index: number
  onRemove: (imageId: string) => void
  onSetPrimary: (imageId: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  totalImages: number
}

function ImageThumbnail({ 
  image, 
  index, 
  onRemove, 
  onSetPrimary, 
  onReorder,
  totalImages 
}: ImageThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={image.url}
        alt={image.alt}
        className="w-full h-full object-cover"
      />
      
      {/* Primary Badge */}
      {image.isPrimary && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Primary
        </div>
      )}
      
      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSetPrimary(image.id)}
            disabled={image.isPrimary}
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            {image.isPrimary ? 'Primary' : 'Set Primary'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRemove(image.id)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Remove
          </Button>
        </div>
      )}
      
      {/* Reorder Buttons */}
      {isHovered && totalImages > 1 && (
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {index > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReorder(index, index - 1)}
              className="w-6 h-6 p-0 bg-white text-gray-700 hover:bg-gray-100"
            >
              ↑
            </Button>
          )}
          {index < totalImages - 1 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReorder(index, index + 1)}
              className="w-6 h-6 p-0 bg-white text-gray-700 hover:bg-gray-100"
            >
              ↓
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
