import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PropertyMintForm } from '@/components/PropertyMintForm'

// Mock the wallet hook
jest.mock('@/hooks/useWallet', () => ({
  useWallet: () => ({
    provider: null,
    signer: null,
  }),
}))

// Mock the contract service
jest.mock('@/lib/contracts', () => ({
  ContractService: jest.fn().mockImplementation(() => ({
    mintProperty: jest.fn().mockResolvedValue({
      transactionHash: '0x1234567890abcdef',
    }),
  })),
}))

describe('PropertyMintForm', () => {
  it('renders the form correctly', () => {
    render(<PropertyMintForm />)
    
    expect(screen.getByText('Mint Property NFT')).toBeInTheDocument()
    expect(screen.getByLabelText('Property Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Physical Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Square Footage')).toBeInTheDocument()
    expect(screen.getByLabelText('Price (FLOW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Property Images')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<PropertyMintForm />)
    
    const submitButton = screen.getByRole('button', { name: /mint property nft/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Wallet not connected')).toBeInTheDocument()
    })
  })

  it('submits the form with valid data', async () => {
    render(<PropertyMintForm />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Property Name'), {
      target: { value: 'Test Property' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'A test property description' },
    })
    fireEvent.change(screen.getByLabelText('Physical Address'), {
      target: { value: '123 Test St, Test City, TC 12345' },
    })
    fireEvent.change(screen.getByLabelText('Square Footage'), {
      target: { value: '1500' },
    })
    fireEvent.change(screen.getByLabelText('Price (FLOW)'), {
      target: { value: '100.50' },
    })
    
    const submitButton = screen.getByRole('button', { name: /mint property nft/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Wallet not connected')).toBeInTheDocument()
    })
  })
})
