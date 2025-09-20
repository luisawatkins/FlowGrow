export interface Property {
  id: string
  name: string
  description: string
  address: string
  squareFootage: number
  price: string
  owner: string
  imageUrl?: string
  isListed: boolean
  tokenId?: string
  contractAddress?: string
  createdAt?: string
  updatedAt?: string
}

export interface PropertyMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  provider: any
  signer: any
  chainId: number | null
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  status: 'pending' | 'success' | 'failed'
  timestamp: number
}

export interface MarketplaceListing {
  id: string
  propertyId: string
  seller: string
  price: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
