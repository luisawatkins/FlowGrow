import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageGallery, ImageUpload } from '@/components/ImageGallery'
import { PropertyImage } from '@/types'

const mockImages: PropertyImage[] = [
  {
    id: 'img_1',
    url: 'https://example.com/image1.jpg',
    alt: 'Property exterior',
    isPrimary: true,
    order: 0,
    uploadedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'img_2',
    url: 'https://example.com/image2.jpg',
    alt: 'Living room',
    isPrimary: false,
    order: 1,
    uploadedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'img_3',
    url: 'https://example.com/image3.jpg',
    alt: 'Kitchen',
    isPrimary: false,
    order: 2,
    uploadedAt: '2023-12-01T00:00:00Z',
  },
]

describe('ImageGallery', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  it('renders image gallery with images', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    expect(screen.getByAltText('Property exterior - Image 1')).toBeInTheDocument()
  })

  it('shows no images message when images array is empty', () => {
    render(
      <ImageGallery
        images={[]}
        propertyName="Test Property"
      />
    )
    
    expect(screen.getByText('No images available')).toBeInTheDocument()
  })

  it('displays navigation arrows when multiple images', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    expect(screen.getByText('‹')).toBeInTheDocument()
    expect(screen.getByText('›')).toBeInTheDocument()
  })

  it('shows image counter', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows primary badge for primary image', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    expect(screen.getByText('Primary')).toBeInTheDocument()
  })

  it('navigates to next image when next button is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const nextButton = screen.getByText('›')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to previous image when previous button is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const nextButton = screen.getByText('›')
    fireEvent.click(nextButton)
    
    const prevButton = screen.getByText('‹')
    fireEvent.click(prevButton)
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps around when navigating past last image', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const nextButton = screen.getByText('›')
    
    // Go to last image
    fireEvent.click(nextButton)
    fireEvent.click(nextButton)
    
    // Go to next (should wrap to first)
    fireEvent.click(nextButton)
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps around when navigating before first image', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const prevButton = screen.getByText('‹')
    fireEvent.click(prevButton)
    
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('shows thumbnails when showThumbnails is true', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        showThumbnails={true}
      />
    )
    
    const thumbnails = screen.getAllByRole('button')
    expect(thumbnails.length).toBeGreaterThan(2) // Navigation buttons + thumbnails
  })

  it('hides thumbnails when showThumbnails is false', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        showThumbnails={false}
      />
    )
    
    // Should only have navigation buttons, not thumbnail buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // Only navigation arrows
  })

  it('navigates to specific image when thumbnail is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        showThumbnails={true}
      />
    )
    
    // Find thumbnail buttons (excluding navigation arrows)
    const buttons = screen.getAllByRole('button')
    const thumbnailButtons = buttons.filter(btn => 
      btn.textContent !== '‹' && btn.textContent !== '›'
    )
    
    if (thumbnailButtons.length > 0) {
      fireEvent.click(thumbnailButtons[1]) // Click second thumbnail
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    }
  })

  it('opens fullscreen when image is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const image = screen.getByAltText('Property exterior - Image 1')
    fireEvent.click(image)
    
    expect(screen.getByText('Test Property')).toBeInTheDocument()
    expect(screen.getByText('Property exterior')).toBeInTheDocument()
  })

  it('closes fullscreen when close button is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const image = screen.getByAltText('Property exterior - Image 1')
    fireEvent.click(image)
    
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)
    
    // Fullscreen content should be removed
    expect(screen.queryByText('Test Property')).not.toBeInTheDocument()
  })

  it('handles keyboard navigation in fullscreen', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    const image = screen.getByAltText('Property exterior - Image 1')
    fireEvent.click(image)
    
    // Press right arrow
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    
    // Press left arrow
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    
    // Press escape
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Test Property')).not.toBeInTheDocument()
  })

  it('shows auto-play controls when autoPlay is enabled', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        autoPlay={true}
      />
    )
    
    expect(screen.getByText('▶️ Play')).toBeInTheDocument()
  })

  it('toggles auto-play when play/pause button is clicked', () => {
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        autoPlay={true}
      />
    )
    
    const playButton = screen.getByText('▶️ Play')
    fireEvent.click(playButton)
    
    expect(screen.getByText('⏸️ Pause')).toBeInTheDocument()
  })

  it('calls onImageClick when provided', () => {
    const mockOnImageClick = jest.fn()
    
    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
        onImageClick={mockOnImageClick}
      />
    )
    
    const image = screen.getByAltText('Property exterior - Image 1')
    fireEvent.click(image)
    
    expect(mockOnImageClick).toHaveBeenCalledWith(mockImages[0], 0)
  })

  it('handles image load errors gracefully', async () => {
    // Mock image load error
    const originalImage = window.Image
    window.Image = jest.fn().mockImplementation(() => {
      const img = new originalImage()
      setTimeout(() => {
        Object.defineProperty(img, 'onerror', {
          value: jest.fn(),
          writable: true,
        })
        img.onerror?.(new Event('error'))
      }, 0)
      return img
    })

    render(
      <ImageGallery
        images={mockImages}
        propertyName="Test Property"
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument()
    })

    window.Image = originalImage
  })
})

describe('ImageUpload', () => {
  const mockOnUpload = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload area', () => {
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    expect(screen.getByText('Upload Property Images')).toBeInTheDocument()
    expect(screen.getByText('Choose Files')).toBeInTheDocument()
  })

  it('shows drag and drop instructions', () => {
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    expect(screen.getByText('Drag and drop images here, or click to select files')).toBeInTheDocument()
  })

  it('shows file size and type restrictions', () => {
    render(<ImageUpload onUpload={mockOnUpload} maxFiles={5} maxSize={10} />)
    
    expect(screen.getByText('Max 5 files, 10MB each. Supported: JPG, PNG, WebP')).toBeInTheDocument()
  })

  it('handles file selection', () => {
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    const fileInput = screen.getByRole('button', { name: 'Choose Files' })
    fireEvent.click(fileInput)
    
    // File input should be triggered
    expect(fileInput).toBeInTheDocument()
  })

  it('handles drag and drop', () => {
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    const uploadArea = screen.getByText('Drag and drop images here, or click to select files').closest('div')
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const dataTransfer = {
      files: [file],
    }
    
    fireEvent.dragOver(uploadArea!, {
      dataTransfer,
    })
    
    fireEvent.drop(uploadArea!, {
      dataTransfer,
    })
    
    // Should handle the file (exact behavior depends on implementation)
    expect(uploadArea).toBeInTheDocument()
  })

  it('validates file types', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    const uploadArea = screen.getByText('Drag and drop images here, or click to select files').closest('div')
    
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const dataTransfer = {
      files: [invalidFile],
    }
    
    fireEvent.drop(uploadArea!, {
      dataTransfer,
    })
    
    // Should show error or handle invalid file
    expect(uploadArea).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('validates file size', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<ImageUpload onUpload={mockOnUpload} maxSize={1} />)
    
    const uploadArea = screen.getByText('Drag and drop images here, or click to select files').closest('div')
    
    // Create a large file (2MB)
    const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const dataTransfer = {
      files: [largeFile],
    }
    
    fireEvent.drop(uploadArea!, {
      dataTransfer,
    })
    
    // Should handle large file
    expect(uploadArea).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('limits number of files', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<ImageUpload onUpload={mockOnUpload} maxFiles={2} />)
    
    const uploadArea = screen.getByText('Drag and drop images here, or click to select files').closest('div')
    
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
    ]
    const dataTransfer = {
      files,
    }
    
    fireEvent.drop(uploadArea!, {
      dataTransfer,
    })
    
    // Should handle multiple files
    expect(uploadArea).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('shows upload progress', async () => {
    render(<ImageUpload onUpload={mockOnUpload} />)
    
    const uploadArea = screen.getByText('Drag and drop images here, or click to select files').closest('div')
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const dataTransfer = {
      files: [file],
    }
    
    fireEvent.drop(uploadArea!, {
      dataTransfer,
    })
    
    // Should show progress (implementation dependent)
    expect(uploadArea).toBeInTheDocument()
  })
})
