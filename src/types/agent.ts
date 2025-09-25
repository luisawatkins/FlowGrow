export interface Agent {
  id: string
  userId: string
  licenseNumber: string
  licenseState: string
  licenseExpiry: string
  brokerageId: string
  brokerageName: string
  specialties: AgentSpecialty[]
  experience: number
  rating: number
  reviewCount: number
  commissionRate: number
  isVerified: boolean
  isActive: boolean
  profile: AgentProfile
  stats: AgentStats
  createdAt: string
  updatedAt: string
}

export interface AgentProfile {
  displayName: string
  bio: string
  avatar?: string
  phone?: string
  email?: string
  website?: string
  languages: string[]
  serviceAreas: string[]
  certifications: string[]
  awards: string[]
}

export interface AgentStats {
  totalSales: number
  totalSalesValue: number
  averageDaysOnMarket: number
  clientSatisfactionScore: number
  propertiesSold: number
  propertiesListed: number
  activeListings: number
  pendingSales: number
  closedSales: number
  averageCommission: number
  totalCommission: number
  lastYearSales: number
  lastYearValue: number
}

export type AgentSpecialty = 
  | 'residential'
  | 'commercial'
  | 'luxury'
  | 'investment'
  | 'first_time_buyers'
  | 'relocation'
  | 'foreclosure'
  | 'new_construction'
  | 'condos'
  | 'townhouses'
  | 'single_family'
  | 'multi_family'

export interface Brokerage {
  id: string
  name: string
  description: string
  logo?: string
  website?: string
  phone?: string
  email?: string
  address: BrokerageAddress
  licenseNumber: string
  licenseState: string
  isVerified: boolean
  isActive: boolean
  agents: Agent[]
  stats: BrokerageStats
  createdAt: string
  updatedAt: string
}

export interface BrokerageAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface BrokerageStats {
  totalAgents: number
  totalSales: number
  totalSalesValue: number
  averageAgentRating: number
  marketShare: number
  activeListings: number
  pendingSales: number
}

export interface AgentClient {
  id: string
  agentId: string
  clientId: string
  relationshipType: 'buyer' | 'seller' | 'both'
  status: 'active' | 'inactive' | 'completed'
  startDate: string
  endDate?: string
  notes?: string
  properties: string[]
  createdAt: string
  updatedAt: string
}

export interface Commission {
  id: string
  agentId: string
  propertyId: string
  transactionId: string
  amount: number
  percentage: number
  status: 'pending' | 'approved' | 'paid' | 'disputed'
  dueDate: string
  paidDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AgentReview {
  id: string
  agentId: string
  clientId: string
  rating: number
  title: string
  comment: string
  transactionType: 'buy' | 'sell' | 'both'
  propertyId?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AgentSearchFilters {
  specialties?: AgentSpecialty[]
  experience?: {
    min: number
    max: number
  }
  rating?: {
    min: number
  }
  serviceAreas?: string[]
  languages?: string[]
  commissionRate?: {
    min: number
    max: number
  }
  isVerified?: boolean
  brokerageId?: string
}

export interface AgentMatchingCriteria {
  propertyType?: string
  priceRange?: {
    min: number
    max: number
  }
  location?: string
  timeline?: 'urgent' | 'flexible' | 'planning'
  experience?: 'first_time' | 'experienced' | 'investor'
  communication?: 'email' | 'phone' | 'in_person'
  languages?: string[]
}