import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from '@/components/NotificationToast'

// Mock Flow client
export const mockFlowClient = {
  getCurrentUser: jest.fn(),
  authenticate: jest.fn(),
  unauthenticate: jest.fn(),
  mintProperty: jest.fn(),
  listProperty: jest.fn(),
  buyProperty: jest.fn(),
  getMarketplaceData: jest.fn(),
  getProperty: jest.fn(),
  getTransactionStatus: jest.fn(),
}

// Mock wallet
export const mockWallet = {
  isConnected: true,
  address: '0x1234567890abcdef',
  provider: {},
  signer: {},
  chainId: 1,
}

// Mock properties data
export const mockProperties = [
  {
    id: '1',
    name: 'Test Property 1',
    description: 'A beautiful test property',
    address: '123 Test St, Test City, TC 12345',
    squareFootage: 1500,
    price: '100.50',
    owner: '0x1234567890abcdef',
    isListed: true,
    tokenId: '1',
    contractAddress: '0xabcdef1234567890',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test Property 2',
    description: 'Another beautiful test property',
    address: '456 Test Ave, Test City, TC 12345',
    squareFootage: 2000,
    price: '200.75',
    owner: '0x9876543210fedcba',
    isListed: true,
    tokenId: '2',
    contractAddress: '0xabcdef1234567890',
    createdAt: new Date().toISOString(),
  },
]

// Mock user profile
export const mockUserProfile = {
  id: 'user_123',
  address: '0x1234567890abcdef',
  username: 'testuser',
  displayName: 'Test User',
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
  email: 'test@example.com',
  preferences: {
    theme: 'light' as const,
    currency: 'FLOW' as const,
    language: 'en',
    notifications: {
      email: true,
      push: true,
      marketing: false,
      propertyUpdates: true,
      priceChanges: true,
    },
    privacy: {
      showEmail: false,
      showProfile: true,
      showActivity: true,
    },
  },
  stats: {
    totalProperties: 2,
    propertiesListed: 1,
    propertiesSold: 0,
    propertiesBought: 1,
    totalSpent: 200.75,
    totalEarned: 0,
    favoritesCount: 3,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock favorites
export const mockFavorites = [
  {
    id: 'fav_1',
    userId: 'user_123',
    propertyId: '1',
    property: mockProperties[0],
    addedAt: new Date().toISOString(),
    notes: 'Great property!',
    tags: ['luxury', 'downtown'],
  },
]

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
}

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn()
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.ResizeObserver = mockResizeObserver
}

// Mock performance API
export const mockPerformance = () => {
  const mockPerf = {
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    now: jest.fn(() => Date.now()),
  }
  Object.defineProperty(window, 'performance', {
    value: mockPerf,
    writable: true,
  })
  return mockPerf
}

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  const localStorage = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    length: 0,
    key: jest.fn(),
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorage,
    writable: true,
  })
  
  return localStorage
}

// Mock fetch
export const mockFetch = (response: any, status: number = 200) => {
  const mockResponse = {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  }
  
  global.fetch = jest.fn().mockResolvedValue(mockResponse)
  return global.fetch
}

// Test data generators
export const generateProperty = (overrides: Partial<any> = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: `Property ${Math.random().toString(36).substr(2, 5)}`,
  description: 'A beautiful property',
  address: '123 Test St, Test City, TC 12345',
  squareFootage: Math.floor(Math.random() * 3000) + 500,
  price: (Math.random() * 500 + 50).toFixed(2),
  owner: '0x' + Math.random().toString(16).substr(2, 40),
  isListed: Math.random() > 0.5,
  tokenId: Math.random().toString(),
  contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const generateUserProfile = (overrides: Partial<any> = {}) => ({
  ...mockUserProfile,
  id: Math.random().toString(36).substr(2, 9),
  address: '0x' + Math.random().toString(16).substr(2, 40),
  ...overrides,
})

// Wait for async operations
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock error boundary
export class MockErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by MockErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>
    }

    return this.props.children
  }
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
