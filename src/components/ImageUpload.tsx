'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PropertyImage } from '@/types'

interface ImageUploadProps {
  onUpload: (images: PropertyImage[]) => void
  existingImages?: PropertyImage[]
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadedFile {
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export function ImageUpload({
  onUpload,
  existingImages = [],
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
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

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const simulateUpload = async (file: File): Promise<PropertyImage> => {
    // Simulate upload progress
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          // Create PropertyImage object
          const propertyImage: PropertyImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: URL.createObjectURL(file), // In real app, this would be the uploaded URL
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            isPrimary: false,
            order: existingImages.length + uploadedFiles.length,
            uploadedAt: new Date().toISOString(),
          }
          
          resolve(propertyImage)
        }
        
        // Update progress
        setUploadedFiles(prev => prev.map(uf => 
          uf.file === file 
            ? { ...uf, progress: Math.min(progress, 100) }
            : uf
        ))
      }, 200)
    })
  }

  const handleFiles = async (files: FileList | File[]) => {
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

    if (validFiles.length === 0) return

    setIsUploading(true)

    // Create previews and start uploads
    const newUploadedFiles: UploadedFile[] = []
    
    for (const file of validFiles) {
      const preview = await createPreview(file)
      const uploadedFile: UploadedFile = {
        file,
        preview,
        progress: 0,
        status: 'uploading',
      }
      newUploadedFiles.push(uploadedFile)
    }

    setUploadedFiles(prev => [...prev, ...newUploadedFiles])

    // Simulate uploads
    try {
      const uploadedImages: PropertyImage[] = []
      
      for (const uploadedFile of newUploadedFiles) {
        try {
          const propertyImage = await simulateUpload(uploadedFile.file)
          uploadedImages.push(propertyImage)
          
          setUploadedFiles(prev => prev.map(uf => 
            uf.file === uploadedFile.file 
              ? { ...uf, status: 'completed' as const }
              : uf
          ))
        } catch (error) {
          setUploadedFiles(prev => prev.map(uf => 
            uf.file === uploadedFile.file 
              ? { 
                  ...uf, 
                  status: 'error' as const, 
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : uf
          ))
        }
      }

      if (uploadedImages.length > 0) {
        onUpload(uploadedImages)
      }
    } finally {
      setIsUploading(false)
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

  const removeUploadedFile = (file: File) => {
    setUploadedFiles(prev => prev.filter(uf => uf.file !== file))
  }

  const retryUpload = async (file: File) => {
    setUploadedFiles(prev => prev.map(uf => 
      uf.file === file 
        ? { ...uf, status: 'uploading' as const, progress: 0, error: undefined }
        : uf
    ))

    try {
      const propertyImage = await simulateUpload(file)
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file 
          ? { ...uf, status: 'completed' as const }
          : uf
      ))
      onUpload([propertyImage])
    } catch (error) {
      setUploadedFiles(prev => prev.map(uf => 
        uf.file === file 
          ? { 
              ...uf, 
              status: 'error' as const, 
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : uf
      ))
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
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
            
            <Button 
              onClick={openFileDialog} 
              variant="outline"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
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
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Upload Progress</h4>
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  {/* Preview */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {/* Progress/Status */}
                  <div className="flex items-center space-x-2">
                    {uploadedFile.status === 'uploading' && (
                      <>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right">
                          {Math.round(uploadedFile.progress)}%
                        </span>
                      </>
                    )}

                    {uploadedFile.status === 'completed' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <span className="text-sm">✓</span>
                        <span className="text-xs">Complete</span>
                      </div>
                    )}

                    {uploadedFile.status === 'error' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <span className="text-sm">✗</span>
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    {uploadedFile.status === 'error' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(uploadedFile.file)}
                      >
                        Retry
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUploadedFile(uploadedFile.file)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {image.isPrimary && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white px-1 py-0.5 rounded text-xs">
                        Primary
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" variant="outline" className="bg-white">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}