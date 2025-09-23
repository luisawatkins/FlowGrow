import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VirtualPropertyTours } from '@/components/VirtualPropertyTours'
import { Property } from '@/types'

// Mock data
const mockProperty: Property = {
  id: '1',
  name: 'Test Property',
  description: 'A beautiful test property',
  address: '123 Test St',
  squareFootage: 1500,
  price: '300000',
  owner: '0x123',
  isListed: true,
  propertyType: 'house',
  bedrooms: 3,
  bathrooms: 2
}

describe('VirtualPropertyTours', () => {
  const mockOnTourComplete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders virtual property tours component', () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    expect(screen.getByText('🏠 Virtual Property Tours')).toBeInTheDocument()
    expect(screen.getByText('Experience Test Property through immersive virtual tours and 360° views')).toBeInTheDocument()
  })

  it('displays available tours', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Available Tours')).toBeInTheDocument()
    })
  })

  it('shows tour creation and edit buttons', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Create Tour')).toBeInTheDocument()
      expect(screen.getByText('Edit Tour')).toBeInTheDocument()
    })
  })

  it('displays tour information when tour is selected', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Start Tour')).toBeInTheDocument()
    })
  })

  it('calls onTourComplete when tour is started', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
      expect(mockOnTourComplete).toHaveBeenCalled()
    })
  })

  it('shows tour controls when tour is active', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Hide Hotspots')).toBeInTheDocument()
      expect(screen.getByText('Pause')).toBeInTheDocument()
    })
  })

  it('toggles hotspots visibility', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      const hideHotspotsButton = screen.getByText('Hide Hotspots')
      fireEvent.click(hideHotspotsButton)
      expect(screen.getByText('Show Hotspots')).toBeInTheDocument()
    })
  })

  it('toggles play/pause functionality', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      const pauseButton = screen.getByText('Pause')
      fireEvent.click(pauseButton)
      expect(screen.getByText('Play')).toBeInTheDocument()
    })
  })

  it('displays tour duration and views', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Duration')).toBeInTheDocument()
      expect(screen.getByText('Views')).toBeInTheDocument()
      expect(screen.getByText('Completion Rate')).toBeInTheDocument()
    })
  })

  it('shows tour highlights', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Tour Highlights')).toBeInTheDocument()
    })
  })

  it('displays accessibility features', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Accessibility Features')).toBeInTheDocument()
      expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument()
      expect(screen.getByText('Elevator Access')).toBeInTheDocument()
    })
  })

  it('opens create tour modal when create button is clicked', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const createTourButton = screen.getByText('Create Tour')
      fireEvent.click(createTourButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Create New Tour')).toBeInTheDocument()
      expect(screen.getByText('Tour Type')).toBeInTheDocument()
      expect(screen.getByText('Tour Name')).toBeInTheDocument()
    })
  })

  it('closes create tour modal when cancel is clicked', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const createTourButton = screen.getByText('Create Tour')
      fireEvent.click(createTourButton)
    })

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })

    await waitFor(() => {
      expect(screen.queryByText('Create New Tour')).not.toBeInTheDocument()
    })
  })

  it('displays tour type options in create modal', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const createTourButton = screen.getByText('Create Tour')
      fireEvent.click(createTourButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Virtual Tour')).toBeInTheDocument()
      expect(screen.getByText('360° Tour')).toBeInTheDocument()
      expect(screen.getByText('Video Tour')).toBeInTheDocument()
      expect(screen.getByText('Interactive Tour')).toBeInTheDocument()
      expect(screen.getByText('AR Tour')).toBeInTheDocument()
    })
  })

  it('shows tour progress indicator', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      // Should show progress indicator (1 / X format)
      expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument()
    })
  })

  it('handles navigation between tour views', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      const startTourButton = screen.getByText('Start Tour')
      fireEvent.click(startTourButton)
    })

    await waitFor(() => {
      // Should show navigation arrows
      expect(screen.getByText('⬅️')).toBeInTheDocument()
      expect(screen.getByText('➡️')).toBeInTheDocument()
    })
  })

  it('displays tour icons for different tour types', async () => {
    render(
      <VirtualPropertyTours
        property={mockProperty}
        onTourComplete={mockOnTourComplete}
      />
    )

    await waitFor(() => {
      // Should display tour type icons
      expect(screen.getByText('🏠')).toBeInTheDocument() // Virtual tour icon
    })
  })
})
