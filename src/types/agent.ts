export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  brokerage: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  bio: string;
  languages: string[];
  serviceAreas: string[];
  commissionRate: number;
  isVerified: boolean;
  isActive: boolean;
  joinDate: string;
  lastActive: string;
  totalSales: number;
  totalVolume: number;
  averageDaysOnMarket: number;
  clientSatisfactionScore: number;
  certifications: string[];
  awards: string[];
  socialMedia: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Brokerage {
  id: string;
  name: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  website: string;
  description: string;
  foundedYear: number;
  agentCount: number;
  totalSales: number;
  totalVolume: number;
  specialties: string[];
  serviceAreas: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  socialMedia: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Commission {
  id: string;
  agentId: string;
  propertyId: string;
  transactionId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentClient {
  id: string;
  agentId: string;
  clientId: string;
  relationshipType: 'buyer' | 'seller' | 'both';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'completed';
  notes?: string;
  properties: string[];
  totalTransactions: number;
  totalVolume: number;
  satisfactionRating?: number;
  feedback?: string;
}

export interface AgentPerformance {
  agentId: string;
  period: string;
  totalListings: number;
  totalSales: number;
  totalVolume: number;
  averageDaysOnMarket: number;
  listToSaleRatio: number;
  clientSatisfactionScore: number;
  commissionEarned: number;
  ranking: number;
  marketShare: number;
  growthRate: number;
}

export interface AgentSearchFilters {
  location?: string;
  specialties?: string[];
  experience?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  commissionRate?: {
    min: number;
    max: number;
  };
  languages?: string[];
  serviceAreas?: string[];
  isVerified?: boolean;
  availability?: boolean;
}

export interface AgentMatch {
  agentId: string;
  matchScore: number;
  reasons: string[];
  compatibility: {
    location: number;
    specialties: number;
    experience: number;
    rating: number;
    availability: number;
  };
}

export interface AgentReview {
  id: string;
  agentId: string;
  clientId: string;
  clientName: string;
  rating: number;
  title: string;
  comment: string;
  transactionType: 'buy' | 'sell' | 'rent';
  propertyType: string;
  date: string;
  isVerified: boolean;
  helpful: number;
  response?: {
    agentId: string;
    comment: string;
    date: string;
  };
}

export interface AgentLead {
  id: string;
  agentId: string;
  clientId: string;
  propertyId?: string;
  type: 'inquiry' | 'showing' | 'offer' | 'contract' | 'closing';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  notes: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentDashboard {
  agent: Agent;
  performance: AgentPerformance;
  activeClients: AgentClient[];
  recentLeads: AgentLead[];
  upcomingTasks: {
    id: string;
    title: string;
    type: 'showing' | 'meeting' | 'follow-up' | 'closing';
    date: string;
    clientId: string;
    propertyId?: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  commissions: Commission[];
  reviews: AgentReview[];
  marketInsights: {
    averageDaysOnMarket: number;
    marketTrend: 'up' | 'down' | 'stable';
    priceChange: number;
    inventoryLevel: 'low' | 'medium' | 'high';
  };
}
