import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PropertyComparison } from '@/components/PropertyComparison'
import { Property } from '@/types'

const mockProperties: Property[] = [
  {
    id: 'prop_1',
    name: 'Downtown Luxury Apartment',
    description: 'Beautiful apartment in downtown',
    address: '123 Main St, New York, NY',
    squareFootage: 1200,
    price: '850000',
    owner: 'owner_1',
    isListed: true,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2020,
    propertyType: 'apartment',
    features: ['Balcony', 'Parking'],
    amenities: ['Gym', 'Pool'],
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
    },
  },
  {
    id: 'prop_2',
    name: 'Beach House Villa',
    description: 'Stunning beach house',
    address: '456 Ocean Dr, Miami, FL',
    squareFootage: 2000,
    price: '1200000',
    owner: 'owner_2',
    isListed: true,
    bedrooms: 3,
    bathrooms: 3,
    yearBuilt: 2018,
    propertyType: 'house',
    features: ['Ocean View', 'Private Pool'],
    amenities: ['Beach Access', 'Garden'],
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
    },
  },
  {
    id: 'prop_3',
    name: 'Mountain Cabin',
    description: 'Cozy mountain retreat',
    address: '789 Mountain Rd, Aspen, CO',
    squareFootage: 1500,
    price: '650000',
    owner: 'owner_3',
    isListed: true,
    bedrooms: 2,
    bathrooms: 1,
    yearBuilt: 2015,
    propertyType: 'house',
    features: ['Fireplace', 'Mountain View'],
    amenities: ['Hiking Trails'],
    location: {
      city: 'Aspen',
      state: 'CO',
      country: 'USA',
    },
  },
]

const mockOnRemoveProperty = jest.fn()
const mockOnClearAll = jest.fn()

describe('PropertyComparison', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no properties', () => {
    render(
      <PropertyComparison
        properties={[]}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    expect(screen.getByText('No properties to compare')).toBeInTheDocument()
    expect(screen.getByText('Add properties to your comparison to see side-by-side details')).toBeInTheDocument()
    expect(screen.getByText('Browse Properties')).toBeInTheDocument()
  })

  it('renders properties in comparison', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    expect(screen.getByText('Property Comparison')).toBeInTheDocument()
    expect(screen.getByText('Compare 3 of 4 properties')).toBeInTheDocument()
    expect(screen.getByText('Downtown Luxury Apartment')).toBeInTheDocument()
    expect(screen.getByText('Beach House Villa')).toBeInTheDocument()
    expect(screen.getByText('Mountain Cabin')).toBeInTheDocument()
  })

  it('shows table view by default', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    expect(screen.getByText('Table View')).toBeInTheDocument()
    expect(screen.getByText('Grid View')).toBeInTheDocument()
    expect(screen.getByText('Select Features to Compare')).toBeInTheDocument()
  })

  it('switches to grid view when grid button is clicked', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    const gridButton = screen.getByText('Grid View')
    fireEvent.click(gridButton)
    
    // Should show grid layout (implementation specific)
    expect(gridButton).toHaveClass('bg-blue-600') // Active state
  })

  it('switches to table view when table button is clicked', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    const tableButton = screen.getByText('Table View')
    fireEvent.click(tableButton)
    
    expect(tableButton).toHaveClass('bg-blue-600') // Active state
  })

  it('shows feature selection buttons', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Square Footage')).toBeInTheDocument()
    expect(screen.getByText('Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('Bathrooms')).toBeInTheDocument()
    expect(screen.getByText('Year Built')).toBeInTheDocument()
    expect(screen.getByText('Property Type')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Amenities')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
  })

  it('toggles feature selection when feature button is clicked', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    const priceButton = screen.getByText('Price')
    fireEvent.click(priceButton)
    
    // Should show price in comparison table
    expect(screen.getByText('850000 FLOW')).toBeInTheDocument()
    expect(screen.getByText('1200000 FLOW')).toBeInTheDocument()
    expect(screen.getByText('650000 FLOW')).toBeInTheDocument()
  })

  it('shows comparison table when features are selected', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Select multiple features
    fireEvent.click(screen.getByText('Price'))
    fireEvent.click(screen.getByText('Bedrooms'))
    fireEvent.click(screen.getByText('Bathrooms'))
    
    // Should show comparison table
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('Bathrooms')).toBeInTheDocument()
  })

  it('shows comparison summary when features are selected', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Select features
    fireEvent.click(screen.getByText('Price'))
    fireEvent.click(screen.getByText('Bedrooms'))
    
    expect(screen.getByText('Comparison Summary')).toBeInTheDocument()
    expect(screen.getByText('Key insights from your property comparison')).toBeInTheDocument()
  })

  it('removes property when remove button is clicked', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Switch to table view to see remove buttons
    fireEvent.click(screen.getByText('Price'))
    
    const removeButtons = screen.getAllByText('✕')
    fireEvent.click(removeButtons[0])
    
    expect(mockOnRemoveProperty).toHaveBeenCalledWith('prop_1')
  })

  it('clears all properties when clear all button is clicked', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    const clearAllButton = screen.getByText('Clear All')
    fireEvent.click(clearAllButton)
    
    expect(mockOnClearAll).toHaveBeenCalled()
  })

  it('shows export report button', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    expect(screen.getByText('Export Report')).toBeInTheDocument()
  })

  it('formats property values correctly', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Select features to see formatted values
    fireEvent.click(screen.getByText('Price'))
    fireEvent.click(screen.getByText('Square Footage'))
    fireEvent.click(screen.getByText('Bedrooms'))
    
    expect(screen.getByText('850000 FLOW')).toBeInTheDocument()
    expect(screen.getByText('1,200 sq ft')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Bedrooms
  })

  it('shows winner indicators for best values', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Select price feature (lowest price wins)
    fireEvent.click(screen.getByText('Price'))
    
    // Should show winner indicator for lowest price
    expect(screen.getByText('🏆 Best')).toBeInTheDocument()
  })

  it('handles properties with missing data gracefully', () => {
    const propertiesWithMissingData = [
      {
        ...mockProperties[0],
        bedrooms: undefined,
        bathrooms: undefined,
        yearBuilt: undefined,
      },
    ]
    
    render(
      <PropertyComparison
        properties={propertiesWithMissingData}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    fireEvent.click(screen.getByText('Bedrooms'))
    fireEvent.click(screen.getByText('Bathrooms'))
    fireEvent.click(screen.getByText('Year Built'))
    
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('shows add more properties option when under limit', () => {
    render(
      <PropertyComparison
        properties={mockProperties.slice(0, 2)}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Switch to grid view to see add more option
    fireEvent.click(screen.getByText('Grid View'))
    
    expect(screen.getByText('Add more properties')).toBeInTheDocument()
  })

  it('does not show add more option when at limit', () => {
    const maxProperties = [
      ...mockProperties,
      {
        id: 'prop_4',
        name: 'Fourth Property',
        description: 'Fourth property',
        address: '999 Test St, Test City, TS',
        squareFootage: 1000,
        price: '500000',
        owner: 'owner_4',
        isListed: true,
      },
    ]
    
    render(
      <PropertyComparison
        properties={maxProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    // Switch to grid view
    fireEvent.click(screen.getByText('Grid View'))
    
    expect(screen.queryByText('Add more properties')).not.toBeInTheDocument()
  })

  it('handles location formatting correctly', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    fireEvent.click(screen.getByText('Location'))
    
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getByText('Miami, FL')).toBeInTheDocument()
    expect(screen.getByText('Aspen, CO')).toBeInTheDocument()
  })

  it('handles amenities and features formatting', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    fireEvent.click(screen.getByText('Amenities'))
    fireEvent.click(screen.getByText('Features'))
    
    expect(screen.getByText('Gym, Pool')).toBeInTheDocument()
    expect(screen.getByText('Balcony, Parking')).toBeInTheDocument()
  })

  it('shows property type correctly', () => {
    render(
      <PropertyComparison
        properties={mockProperties}
        onRemoveProperty={mockOnRemoveProperty}
        onClearAll={mockOnClearAll}
      />
    )
    
    fireEvent.click(screen.getByText('Property Type'))
    
    expect(screen.getByText('apartment')).toBeInTheDocument()
    expect(screen.getByText('house')).toBeInTheDocument()
  })
})
