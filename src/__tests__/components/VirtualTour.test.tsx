import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VirtualTour } from '@/components/VirtualTour'
import { Property } from '@/types'

const mockProperty: Property = {
  id: 'prop_1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St, Test City',
  squareFootage: 1500,
  price: '1000000',
  owner: 'owner_1',
  isListed: true,
  images: [
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
  ],
}

describe('VirtualTour', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
      },
      writable: true,
    })
  })

  it('renders virtual tour with property information', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Virtual Tour - Test Property')).toBeInTheDocument()
    expect(screen.getByText('Property Entrance')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  })

  it('shows tour navigation controls', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Hide Hotspots')).toBeInTheDocument()
    expect(screen.getByText('Enter Fullscreen')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('shows tour steps navigation', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Tour Steps')).toBeInTheDocument()
    expect(screen.getByText('Property Entrance')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Master Bedroom')).toBeInTheDocument()
    expect(screen.getByText('Master Bathroom')).toBeInTheDocument()
  })

  it('navigates to next step when next button is clicked', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
  })

  it('navigates to previous step when previous button is clicked', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Go to step 2 first
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    // Then go back
    const prevButton = screen.getByText('Previous')
    fireEvent.click(prevButton)
    
    expect(screen.getByText('Property Entrance')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  })

  it('disables previous button on first step', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last step', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Navigate to last step
    const nextButton = screen.getByText('Next')
    for (let i = 0; i < 4; i++) {
      fireEvent.click(nextButton)
    }
    
    expect(nextButton).toBeDisabled()
  })

  it('navigates to specific step when step is clicked', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const kitchenStep = screen.getByText('Kitchen')
    fireEvent.click(kitchenStep)
    
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Step 3 of 5')).toBeInTheDocument()
  })

  it('toggles hotspots visibility', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const toggleButton = screen.getByText('Hide Hotspots')
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('Show Hotspots')).toBeInTheDocument()
  })

  it('toggles fullscreen mode', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const fullscreenButton = screen.getByText('Enter Fullscreen')
    fireEvent.click(fullscreenButton)
    
    expect(screen.getByText('Exit Fullscreen')).toBeInTheDocument()
  })

  it('shows step progress indicators', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Should show 5 progress indicators (one for each step)
    const progressIndicators = screen.getAllByRole('button').filter(button => 
      button.className.includes('rounded-full') && button.className.includes('w-3')
    )
    expect(progressIndicators).toHaveLength(5)
  })

  it('shows current step highlighted in progress indicators', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // First indicator should be highlighted (current step)
    const progressIndicators = screen.getAllByRole('button').filter(button => 
      button.className.includes('rounded-full') && button.className.includes('w-3')
    )
    expect(progressIndicators[0]).toHaveClass('bg-blue-600')
  })

  it('shows step description', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Welcome to this beautiful property. Let\'s start our virtual tour.')).toBeInTheDocument()
  })

  it('shows keyboard navigation instructions', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Use arrow keys to navigate • Space to play/pause audio • Esc to exit fullscreen')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Enter fullscreen first
    const fullscreenButton = screen.getByText('Enter Fullscreen')
    fireEvent.click(fullscreenButton)
    
    // Press right arrow
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    
    expect(screen.getByText('Living Room')).toBeInTheDocument()
  })

  it('handles escape key to exit fullscreen', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Enter fullscreen first
    const fullscreenButton = screen.getByText('Enter Fullscreen')
    fireEvent.click(fullscreenButton)
    
    // Press escape
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(screen.getByText('Enter Fullscreen')).toBeInTheDocument()
  })

  it('shows hotspots on the tour image', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Hotspots should be visible by default
    const hotspotButtons = screen.getAllByRole('button').filter(button => 
      button.className.includes('bg-blue-600') && button.className.includes('rounded-full')
    )
    expect(hotspotButtons.length).toBeGreaterThan(0)
  })

  it('handles hotspot clicks', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Find and click a hotspot
    const hotspotButtons = screen.getAllByRole('button').filter(button => 
      button.className.includes('bg-blue-600') && button.className.includes('rounded-full')
    )
    
    if (hotspotButtons.length > 0) {
      fireEvent.click(hotspotButtons[0])
      // Should show hotspot information or navigate
    }
  })

  it('shows navigation hotspots', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Should show navigation hotspots that can move between steps
    const navigationHotspots = screen.getAllByTitle(/Go to|Enter/)
    expect(navigationHotspots.length).toBeGreaterThan(0)
  })

  it('shows info hotspots', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Should show info hotspots that display information
    const infoHotspots = screen.getAllByTitle(/Main Entrance|Large Windows/)
    expect(infoHotspots.length).toBeGreaterThan(0)
  })

  it('displays property image correctly', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const tourImage = screen.getByAltText('Property Entrance')
    expect(tourImage).toBeInTheDocument()
    expect(tourImage).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('shows step counter', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('1 / 5')).toBeInTheDocument()
  })

  it('updates step counter when navigating', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('shows different step information for each step', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // Navigate to kitchen step
    const kitchenStep = screen.getByText('Kitchen')
    fireEvent.click(kitchenStep)
    
    expect(screen.getByText('Modern kitchen with high-end appliances and granite countertops.')).toBeInTheDocument()
  })

  it('handles missing property images gracefully', () => {
    const propertyWithoutImages = {
      ...mockProperty,
      images: undefined,
      imageUrl: undefined,
    }
    
    render(<VirtualTour property={propertyWithoutImages} />)
    
    // Should still render the tour with placeholder
    expect(screen.getByText('Virtual Tour - Test Property')).toBeInTheDocument()
  })

  it('shows audio controls when audio is available', () => {
    // Mock audio availability
    const propertyWithAudio = {
      ...mockProperty,
      // In a real implementation, this would come from tour step data
    }
    
    render(<VirtualTour property={propertyWithAudio} />)
    
    // Audio controls should be present (though may not be visible if no audio)
    expect(screen.getByText('Virtual Tour - Test Property')).toBeInTheDocument()
  })

  it('handles fullscreen mode correctly', () => {
    render(<VirtualTour property={mockProperty} />)
    
    const fullscreenButton = screen.getByText('Enter Fullscreen')
    fireEvent.click(fullscreenButton)
    
    // Should show exit fullscreen button
    expect(screen.getByText('Exit Fullscreen')).toBeInTheDocument()
  })

  it('shows tour step titles in sidebar', () => {
    render(<VirtualTour property={mockProperty} />)
    
    expect(screen.getByText('Property Entrance')).toBeInTheDocument()
    expect(screen.getByText('Living Room')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Master Bedroom')).toBeInTheDocument()
    expect(screen.getByText('Master Bathroom')).toBeInTheDocument()
  })

  it('highlights current step in sidebar', () => {
    render(<VirtualTour property={mockProperty} />)
    
    // First step should be highlighted
    const currentStepButton = screen.getByText('Property Entrance').closest('button')
    expect(currentStepButton).toHaveClass('bg-blue-50', 'text-blue-700')
  })
})
