import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OptimizedImage, ImageGrid, ImageCarousel } from '@/components/OptimizedImage'
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

describe('OptimizedImage', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  it('renders image with correct alt text', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
        alt="Test image"
      />
    )
    
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  it('uses image alt text when no alt prop provided', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    expect(screen.getByAltText('Property exterior')).toBeInTheDocument()
  })

  it('shows loading spinner initially', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows primary badge for primary images', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    expect(screen.getByText('Primary')).toBeInTheDocument()
  })

  it('does not show primary badge for non-primary images', () => {
    render(
      <OptimizedImage
        image={mockImages[1]}
      />
    )
    
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
  })

  it('handles image load', async () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    
    // Simulate image load
    fireEvent.load(image)
    
    await waitFor(() => {
      expect(image).toHaveClass('opacity-100')
    })
  })

  it('handles image error', async () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    
    // Simulate image error
    fireEvent.error(image)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load')).toBeInTheDocument()
    })
  })

  it('shows hover overlay when onClick is provided', () => {
    const mockOnClick = jest.fn()
    
    render(
      <OptimizedImage
        image={mockImages[0]}
        onClick={mockOnClick}
      />
    )
    
    const container = screen.getByAltText('Property exterior').closest('div')
    expect(container).toHaveClass('cursor-pointer')
  })

  it('calls onClick when image is clicked', () => {
    const mockOnClick = jest.fn()
    
    render(
      <OptimizedImage
        image={mockImages[0]}
        onClick={mockOnClick}
      />
    )
    
    const container = screen.getByAltText('Property exterior').closest('div')
    fireEvent.click(container!)
    
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('uses eager loading for priority images', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
        priority={true}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    expect(image).toHaveAttribute('loading', 'eager')
  })

  it('uses lazy loading for non-priority images', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
        priority={false}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('generates responsive srcSet', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    const srcSet = image.getAttribute('srcset')
    
    expect(srcSet).toContain('320w')
    expect(srcSet).toContain('640w')
    expect(srcSet).toContain('768w')
  })

  it('applies custom className', () => {
    render(
      <OptimizedImage
        image={mockImages[0]}
        className="custom-class"
      />
    )
    
    const container = screen.getByAltText('Property exterior').closest('div')
    expect(container).toHaveClass('custom-class')
  })
})

describe('ImageGrid', () => {
  it('renders all images when showAll is true', () => {
    render(
      <ImageGrid
        images={mockImages}
        showAll={true}
      />
    )
    
    expect(screen.getByAltText('Property exterior')).toBeInTheDocument()
    expect(screen.getByAltText('Living room')).toBeInTheDocument()
    expect(screen.getByAltText('Kitchen')).toBeInTheDocument()
  })

  it('limits displayed images when showAll is false', () => {
    render(
      <ImageGrid
        images={mockImages}
        maxImages={2}
        showAll={false}
      />
    )
    
    expect(screen.getByAltText('Property exterior')).toBeInTheDocument()
    expect(screen.getByAltText('Living room')).toBeInTheDocument()
    expect(screen.queryByAltText('Kitchen')).not.toBeInTheDocument()
  })

  it('shows more images overlay when there are more images', () => {
    render(
      <ImageGrid
        images={mockImages}
        maxImages={2}
        showAll={false}
      />
    )
    
    expect(screen.getByText('+1')).toBeInTheDocument()
    expect(screen.getByText('more images')).toBeInTheDocument()
  })

  it('shows show more button when there are more images', () => {
    render(
      <ImageGrid
        images={mockImages}
        maxImages={2}
        showMoreButton={true}
      />
    )
    
    expect(screen.getByText('Show All 3 Images')).toBeInTheDocument()
  })

  it('toggles show all when show more button is clicked', () => {
    render(
      <ImageGrid
        images={mockImages}
        maxImages={2}
        showMoreButton={true}
      />
    )
    
    const showMoreButton = screen.getByText('Show All 3 Images')
    fireEvent.click(showMoreButton)
    
    expect(screen.getByText('Show Less')).toBeInTheDocument()
    expect(screen.getByAltText('Kitchen')).toBeInTheDocument()
  })

  it('calls onImageClick when image is clicked', () => {
    const mockOnImageClick = jest.fn()
    
    render(
      <ImageGrid
        images={mockImages}
        onImageClick={mockOnImageClick}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    fireEvent.click(image)
    
    expect(mockOnImageClick).toHaveBeenCalledWith(mockImages[0], 0)
  })

  it('applies custom className', () => {
    render(
      <ImageGrid
        images={mockImages}
        className="custom-grid"
      />
    )
    
    const grid = screen.getByAltText('Property exterior').closest('.custom-grid')
    expect(grid).toBeInTheDocument()
  })

  it('handles empty images array', () => {
    render(
      <ImageGrid
        images={[]}
      />
    )
    
    // Should not crash and render empty grid
    expect(screen.queryByAltText('Property exterior')).not.toBeInTheDocument()
  })
})

describe('ImageCarousel', () => {
  it('renders first image by default', () => {
    render(
      <ImageCarousel
        images={mockImages}
      />
    )
    
    expect(screen.getByAltText('Property exterior')).toBeInTheDocument()
  })

  it('shows image counter', () => {
    render(
      <ImageCarousel
        images={mockImages}
      />
    )
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows navigation arrows for multiple images', () => {
    render(
      <ImageCarousel
        images={mockImages}
      />
    )
    
    expect(screen.getByText('‹')).toBeInTheDocument()
    expect(screen.getByText('›')).toBeInTheDocument()
  })

  it('navigates to next image', () => {
    render(
      <ImageCarousel
        images={mockImages}
      />
    )
    
    const nextButton = screen.getByText('›')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('navigates to previous image', () => {
    render(
      <ImageCarousel
        images={mockImages}
      />
    )
    
    const nextButton = screen.getByText('›')
    fireEvent.click(nextButton)
    
    const prevButton = screen.getByText('‹')
    fireEvent.click(prevButton)
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows thumbnails when showThumbnails is true', () => {
    render(
      <ImageCarousel
        images={mockImages}
        showThumbnails={true}
      />
    )
    
    // Should have navigation buttons + thumbnail buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(2)
  })

  it('hides thumbnails when showThumbnails is false', () => {
    render(
      <ImageCarousel
        images={mockImages}
        showThumbnails={false}
      />
    )
    
    // Should only have navigation buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it('navigates to specific image when thumbnail is clicked', () => {
    render(
      <ImageCarousel
        images={mockImages}
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

  it('calls onImageClick when image is clicked', () => {
    const mockOnImageClick = jest.fn()
    
    render(
      <ImageCarousel
        images={mockImages}
        onImageClick={mockOnImageClick}
      />
    )
    
    const image = screen.getByAltText('Property exterior')
    fireEvent.click(image)
    
    expect(mockOnImageClick).toHaveBeenCalledWith(mockImages[0], 0)
  })

  it('shows no images message when images array is empty', () => {
    render(
      <ImageCarousel
        images={[]}
      />
    )
    
    expect(screen.getByText('No images available')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ImageCarousel
        images={mockImages}
        className="custom-carousel"
      />
    )
    
    const carousel = screen.getByAltText('Property exterior').closest('.custom-carousel')
    expect(carousel).toBeInTheDocument()
  })

  it('wraps around when navigating past last image', () => {
    render(
      <ImageCarousel
        images={mockImages}
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
      <ImageCarousel
        images={mockImages}
      />
    )
    
    const prevButton = screen.getByText('‹')
    fireEvent.click(prevButton)
    
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })
})
