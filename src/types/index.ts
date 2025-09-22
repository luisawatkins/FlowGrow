export interface Property {
  id: string
  name: string
  description: string
  address: string
  squareFootage: number
  price: string
  owner: string
  imageUrl?: string
  images?: PropertyImage[]
  isListed: boolean
  tokenId?: string
  contractAddress?: string
  createdAt?: string
  updatedAt?: string
  // Enhanced property details
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  propertyType?: 'condo' | 'house' | 'villa' | 'apartment' | 'townhouse'
  features?: string[]
  amenities?: string[]
  location?: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
}

export interface PropertyImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
  uploadedAt: string
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

export interface UserProfile {
  id: string
  address: string
  username?: string
  displayName?: string
  bio?: string
  avatar?: string
  email?: string
  preferences: UserPreferences
  stats: UserStats
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  currency: 'FLOW' | 'USD' | 'EUR'
  language: string
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    propertyUpdates: boolean
    priceChanges: boolean
  }
  privacy: {
    showEmail: boolean
    showProfile: boolean
    showActivity: boolean
  }
}

export interface UserStats {
  totalProperties: number
  propertiesListed: number
  propertiesSold: number
  propertiesBought: number
  totalSpent: number
  totalEarned: number
  favoritesCount: number
  joinDate: string
  lastActive: string
}

export interface FavoriteProperty {
  id: string
  userId: string
  propertyId: string
  property: Property
  addedAt: string
  notes?: string
  tags?: string[]
}

export interface UserActivity {
  id: string
  userId: string
  type: 'property_minted' | 'property_listed' | 'property_bought' | 'property_sold' | 'favorite_added' | 'profile_updated'
  description: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: string
}

export type NotificationType = 
  | 'property_update'
  | 'offer_received'
  | 'offer_accepted'
  | 'message_received'
  | 'price_change'
  | 'favorite_update'
  | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: MessageType
  isRead: boolean
  createdAt: string
}

export type MessageType = 'text' | 'image' | 'file' | 'system'

export interface Conversation {
  id: string
  participants: Participant[]
  title: string
  lastMessage?: Message
  unreadCount?: number
  createdAt: string
  updatedAt: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}