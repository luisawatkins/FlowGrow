'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/types'

interface DocumentManagerProps {
  property: Property
  onDocumentUpload: (document: PropertyDocument) => void
  onDocumentDelete: (documentId: string) => void
  onDocumentShare: (documentId: string, shareData: ShareData) => void
  className?: string
}

interface PropertyDocument {
  id: string
  propertyId: string
  name: string
  type: DocumentType
  category: DocumentCategory
  fileSize: number
  uploadDate: string
  uploadedBy: string
  description?: string
  tags: string[]
  isPublic: boolean
  downloadUrl: string
  thumbnailUrl?: string
}

interface ShareData {
  email: string
  message: string
  expiresAt?: string
  permissions: 'view' | 'download' | 'edit'
}

type DocumentType = 'pdf' | 'image' | 'word' | 'excel' | 'text' | 'other'
type DocumentCategory = 'deed' | 'inspection' | 'appraisal' | 'insurance' | 'tax' | 'maintenance' | 'legal' | 'other'

export function DocumentManager({
  property,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentShare,
  className = ''
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<PropertyDocument[]>([])
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'other' as DocumentCategory,
    description: '',
    tags: '',
    isPublic: false
  })

  const [shareForm, setShareForm] = useState({
    email: '',
    message: '',
    permissions: 'view' as ShareData['permissions'],
    expiresAt: ''
  })

  // Mock documents for demonstration
  useEffect(() => {
    const mockDocuments: PropertyDocument[] = [
      {
        id: '1',
        propertyId: property.id,
        name: 'Property Deed',
        type: 'pdf',
        category: 'deed',
        fileSize: 2048576,
        uploadDate: '2024-01-15',
        uploadedBy: 'John Doe',
        description: 'Official property deed document',
        tags: ['legal', 'ownership'],
        isPublic: false,
        downloadUrl: '/documents/deed.pdf'
      },
      {
        id: '2',
        propertyId: property.id,
        name: 'Home Inspection Report',
        type: 'pdf',
        category: 'inspection',
        fileSize: 5120000,
        uploadDate: '2024-01-10',
        uploadedBy: 'Jane Smith',
        description: 'Comprehensive home inspection report',
        tags: ['inspection', 'condition'],
        isPublic: true,
        downloadUrl: '/documents/inspection.pdf'
      },
      {
        id: '3',
        propertyId: property.id,
        name: 'Property Photos',
        type: 'image',
        category: 'other',
        fileSize: 10240000,
        uploadDate: '2024-01-05',
        uploadedBy: 'John Doe',
        description: 'High-resolution property photos',
        tags: ['photos', 'visual'],
        isPublic: true,
        downloadUrl: '/documents/photos.zip',
        thumbnailUrl: '/thumbnails/photos.jpg'
      }
    ]
    setDocuments(mockDocuments)
  }, [property.id])

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newDocument: PropertyDocument = {
      id: Date.now().toString(),
      propertyId: property.id,
      name: uploadForm.name || file.name,
      type: getFileType(file.name),
      category: uploadForm.category,
      fileSize: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      description: uploadForm.description,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublic: uploadForm.isPublic,
      downloadUrl: URL.createObjectURL(file)
    }

    setDocuments(prev => [...prev, newDocument])
    onDocumentUpload(newDocument)
    
    setIsUploading(false)
    setShowUploadModal(false)
    setUploadForm({
      name: '',
      category: 'other',
      description: '',
      tags: '',
      isPublic: false
    })
  }

  const handleDocumentDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    onDocumentDelete(documentId)
  }

  const handleDocumentShare = () => {
    if (!selectedDocument) return
    
    onDocumentShare(selectedDocument.id, shareForm)
    setShowShareModal(false)
    setShareForm({
      email: '',
      message: '',
      permissions: 'view',
      expiresAt: ''
    })
  }

  const getFileType = (filename: string): DocumentType => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return 'pdf'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image'
      case 'doc':
      case 'docx': return 'word'
      case 'xls':
      case 'xlsx': return 'excel'
      case 'txt': return 'text'
      default: return 'other'
    }
  }

  const getFileIcon = (type: DocumentType) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'image': return '🖼️'
      case 'word': return '📝'
      case 'excel': return '📊'
      case 'text': return '📃'
      default: return '📁'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const categories: { id: DocumentCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Documents', icon: '📁' },
    { id: 'deed', label: 'Deeds & Titles', icon: '📜' },
    { id: 'inspection', label: 'Inspections', icon: '🔍' },
    { id: 'appraisal', label: 'Appraisals', icon: '💰' },
    { id: 'insurance', label: 'Insurance', icon: '🛡️' },
    { id: 'tax', label: 'Tax Documents', icon: '🧾' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'other', label: 'Other', icon: '📄' }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📁 Document Manager
        </CardTitle>
        <CardDescription>
          Manage documents for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            Upload Document
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No documents found.</p>
              <p className="text-sm">Upload your first document to get started.</p>
            </div>
          ) : (
            filteredDocuments.map(document => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getFileIcon(document.type)}</div>
                  <div>
                    <h3 className="font-semibold">{document.name}</h3>
                    <p className="text-sm text-gray-600">{document.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>Uploaded {document.uploadDate}</span>
                      <span>by {document.uploadedBy}</span>
                      {document.isPublic && (
                        <span className="text-green-600">Public</span>
                      )}
                    </div>
                    {document.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {document.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDocument(document)
                      setShowShareModal(true)
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(document.downloadUrl, '_blank')}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDocumentDelete(document.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name
                  </label>
                  <Input
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter document name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="legal, important, etc."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={uploadForm.isPublic}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this document public
                  </label>
                </div>
                
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? 'Uploading...' : 'Select File'}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Share Document</h3>
              <p className="text-sm text-gray-600 mb-4">Sharing: {selectedDocument.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={shareForm.email}
                    onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="recipient@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Input
                    value={shareForm.message}
                    onChange={(e) => setShareForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Optional message"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <select
                    value={shareForm.permissions}
                    onChange={(e) => setShareForm(prev => ({ ...prev, permissions: e.target.value as ShareData['permissions'] }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="view">View Only</option>
                    <option value="download">View & Download</option>
                    <option value="edit">View, Download & Edit</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires At (optional)
                  </label>
                  <Input
                    type="date"
                    value={shareForm.expiresAt}
                    onChange={(e) => setShareForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDocumentShare}
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
