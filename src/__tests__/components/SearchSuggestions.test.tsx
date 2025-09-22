import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchInputWithSuggestions, SearchSuggestions } from '@/components/SearchSuggestions'
import { Property } from '@/types'

// Mock properties for testing
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Downtown Luxury Condo',
    description: 'Modern 2-bedroom condo with city views',
    address: '123 Main St, Downtown, NY 10001',
    squareFootage: 1200,
    price: '150.50',
    owner: '0x1234...5678',
    isListed: true,
    tokenId: '1',
    contractAddress: '0x1234...5678',
  },
  {
    id: '2',
    name: 'Suburban Family Home',
    description: 'Spacious 4-bedroom home with large backyard',
    address: '456 Oak Ave, Suburbia, CA 90210',
    squareFootage: 2500,
    price: '300.75',
    owner: '0x9876...5432',
    isListed: true,
    tokenId: '2',
    contractAddress: '0x1234...5678',
  },
]

describe('SearchSuggestions', () => {
  const mockOnSuggestionClick = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders suggestions when visible', () => {
    render(
      <SearchSuggestions
        query="downtown"
        properties={mockProperties}
        onSuggestionClick={mockOnSuggestionClick}
        onClose={mockOnClose}
        isVisible={true}
      />
    )

    expect(screen.getByText('Suggestions for "downtown"')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    render(
      <SearchSuggestions
        query="downtown"
        properties={mockProperties}
        onSuggestionClick={mockOnSuggestionClick}
        onClose={mockOnClose}
        isVisible={false}
      />
    )

    expect(screen.queryByText('Suggestions for "downtown"')).not.toBeInTheDocument()
  })

  it('calls onSuggestionClick when suggestion is clicked', () => {
    render(
      <SearchSuggestions
        query="downtown"
        properties={mockProperties}
        onSuggestionClick={mockOnSuggestionClick}
        onClose={mockOnClose}
        isVisible={true}
      />
    )

    const suggestion = screen.getByText('Downtown Luxury Condo')
    fireEvent.click(suggestion)

    expect(mockOnSuggestionClick).toHaveBeenCalledWith('Downtown Luxury Condo')
  })

  it('handles keyboard navigation', () => {
    render(
      <SearchSuggestions
        query="downtown"
        properties={mockProperties}
        onSuggestionClick={mockOnSuggestionClick}
        onClose={mockOnClose}
        isVisible={true}
      />
    )

    // Test arrow down
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    // Test enter
    fireEvent.keyDown(document, { key: 'Enter' })
    // Test escape
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalled()
  })
})

describe('SearchInputWithSuggestions', () => {
  const mockOnChange = jest.fn()
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders input with placeholder', () => {
    render(
      <SearchInputWithSuggestions
        value=""
        onChange={mockOnChange}
        properties={mockProperties}
        placeholder="Search properties..."
      />
    )

    expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    render(
      <SearchInputWithSuggestions
        value=""
        onChange={mockOnChange}
        properties={mockProperties}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(mockOnChange).toHaveBeenCalledWith('test')
  })

  it('debounces search calls', () => {
    render(
      <SearchInputWithSuggestions
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        properties={mockProperties}
        debounceMs={300}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    // Should not call onSearch immediately
    expect(mockOnSearch).not.toHaveBeenCalled()

    // Fast-forward time
    jest.advanceTimersByTime(300)

    // Should call onSearch after debounce delay
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('calls onSearch immediately when Enter is pressed', () => {
    render(
      <SearchInputWithSuggestions
        value="test"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        properties={mockProperties}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('shows loading indicator when searching', () => {
    render(
      <SearchInputWithSuggestions
        value=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        properties={mockProperties}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    // Should show loading indicator
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument()
  })
})
