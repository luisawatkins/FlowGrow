import { Agent, Brokerage, Commission, AgentClient, AgentPerformance, AgentSearchFilters, AgentMatch, AgentReview, AgentLead, AgentDashboard } from '@/types/agent';

// Mock data for development
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@realestate.com',
    phone: '+1-555-0123',
    licenseNumber: 'RE123456',
    licenseState: 'CA',
    licenseExpiry: '2025-12-31',
    brokerage: 'Premier Realty Group',
    specialties: ['Luxury Homes', 'First-time Buyers', 'Investment Properties'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    profileImage: '/images/agents/sarah-johnson.jpg',
    bio: 'With over 8 years of experience in the real estate market, Sarah specializes in luxury homes and first-time buyer assistance. She has helped over 200 families find their dream homes.',
    languages: ['English', 'Spanish'],
    serviceAreas: ['Beverly Hills', 'West Hollywood', 'Santa Monica'],
    commissionRate: 2.5,
    isVerified: true,
    isActive: true,
    joinDate: '2016-03-15',
    lastActive: '2024-01-15',
    totalSales: 45,
    totalVolume: 125000000,
    averageDaysOnMarket: 28,
    clientSatisfactionScore: 4.9,
    certifications: ['CRS', 'ABR', 'GRI'],
    awards: ['Top Producer 2023', 'Client Choice Award 2022'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      instagram: 'https://instagram.com/sarahjohnsonre'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@realestate.com',
    phone: '+1-555-0124',
    licenseNumber: 'RE789012',
    licenseState: 'CA',
    licenseExpiry: '2025-08-15',
    brokerage: 'Elite Properties',
    specialties: ['Commercial Real Estate', 'Investment Properties', 'Property Management'],
    experience: 12,
    rating: 4.8,
    reviewCount: 89,
    profileImage: '/images/agents/michael-chen.jpg',
    bio: 'Michael is a seasoned commercial real estate expert with 12 years of experience. He specializes in investment properties and has closed over $500M in transactions.',
    languages: ['English', 'Mandarin', 'Cantonese'],
    serviceAreas: ['Downtown LA', 'Century City', 'Beverly Hills'],
    commissionRate: 3.0,
    isVerified: true,
    isActive: true,
    joinDate: '2012-01-10',
    lastActive: '2024-01-14',
    totalSales: 78,
    totalVolume: 500000000,
    averageDaysOnMarket: 35,
    clientSatisfactionScore: 4.8,
    certifications: ['CCIM', 'SIOR', 'CRS'],
    awards: ['Commercial Agent of the Year 2023', 'Top 1% Producer'],
    socialMedia: {
      linkedin: 'https://linkedin.com/in/michaelchen',
      twitter: 'https://twitter.com/michaelchenre'
    }
  }
];

const mockBrokerages: Brokerage[] = [
  {
    id: '1',
    name: 'Premier Realty Group',
    logo: '/images/brokerages/premier-realty.png',
    address: {
      street: '123 Rodeo Drive',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    phone: '+1-555-0100',
    email: 'info@premierrealty.com',
    website: 'https://premierrealty.com',
    description: 'Premier Realty Group is a luxury real estate brokerage specializing in high-end properties in Beverly Hills and surrounding areas.',
    foundedYear: 2010,
    agentCount: 45,
    totalSales: 1250,
    totalVolume: 2500000000,
    specialties: ['Luxury Homes', 'Investment Properties', 'Commercial Real Estate'],
    serviceAreas: ['Beverly Hills', 'West Hollywood', 'Santa Monica', 'Malibu'],
    isVerified: true,
    rating: 4.9,
    reviewCount: 234,
    socialMedia: {
      linkedin: 'https://linkedin.com/company/premier-realty',
      instagram: 'https://instagram.com/premierrealty'
    }
  }
];

export class AgentService {
  // Agent Management
  static async getAgents(filters?: AgentSearchFilters): Promise<Agent[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredAgents = [...mockAgents];
    
    if (filters) {
      if (filters.location) {
        filteredAgents = filteredAgents.filter(agent => 
          agent.serviceAreas.some(area => 
            area.toLowerCase().includes(filters.location!.toLowerCase())
          )
        );
      }
      
      if (filters.specialties && filters.specialties.length > 0) {
        filteredAgents = filteredAgents.filter(agent =>
          filters.specialties!.some(specialty =>
            agent.specialties.includes(specialty)
          )
        );
      }
      
      if (filters.experience) {
        filteredAgents = filteredAgents.filter(agent =>
          agent.experience >= filters.experience!.min &&
          agent.experience <= filters.experience!.max
        );
      }
      
      if (filters.rating) {
        filteredAgents = filteredAgents.filter(agent =>
          agent.rating >= filters.rating!.min &&
          agent.rating <= filters.rating!.max
        );
      }
      
      if (filters.isVerified !== undefined) {
        filteredAgents = filteredAgents.filter(agent =>
          agent.isVerified === filters.isVerified
        );
      }
    }
    
    return filteredAgents;
  }

  static async getAgentById(id: string): Promise<Agent | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAgents.find(agent => agent.id === id) || null;
  }

  static async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentData.name || '',
      email: agentData.email || '',
      phone: agentData.phone || '',
      licenseNumber: agentData.licenseNumber || '',
      licenseState: agentData.licenseState || '',
      licenseExpiry: agentData.licenseExpiry || '',
      brokerage: agentData.brokerage || '',
      specialties: agentData.specialties || [],
      experience: agentData.experience || 0,
      rating: 0,
      reviewCount: 0,
      bio: agentData.bio || '',
      languages: agentData.languages || [],
      serviceAreas: agentData.serviceAreas || [],
      commissionRate: agentData.commissionRate || 2.5,
      isVerified: false,
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      totalSales: 0,
      totalVolume: 0,
      averageDaysOnMarket: 0,
      clientSatisfactionScore: 0,
      certifications: agentData.certifications || [],
      awards: agentData.awards || [],
      socialMedia: agentData.socialMedia || {}
    };
    
    mockAgents.push(newAgent);
    return newAgent;
  }

  static async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) return null;
    
    mockAgents[agentIndex] = { ...mockAgents[agentIndex], ...updates };
    return mockAgents[agentIndex];
  }

  // Brokerage Management
  static async getBrokerages(): Promise<Brokerage[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBrokerages;
  }

  static async getBrokerageById(id: string): Promise<Brokerage | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBrokerages.find(brokerage => brokerage.id === id) || null;
  }

  // Agent Matching
  static async findMatchingAgents(
    clientPreferences: {
      location: string;
      propertyType: string;
      budget: number;
      timeline: string;
      specialRequirements?: string[];
    }
  ): Promise<AgentMatch[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matches: AgentMatch[] = [];
    
    for (const agent of mockAgents) {
      let matchScore = 0;
      const reasons: string[] = [];
      const compatibility = {
        location: 0,
        specialties: 0,
        experience: 0,
        rating: 0,
        availability: 0
      };
      
      // Location compatibility
      if (agent.serviceAreas.some(area => 
        area.toLowerCase().includes(clientPreferences.location.toLowerCase())
      )) {
        compatibility.location = 100;
        matchScore += 30;
        reasons.push('Serves your preferred location');
      }
      
      // Specialty compatibility
      if (agent.specialties.some(specialty =>
        specialty.toLowerCase().includes(clientPreferences.propertyType.toLowerCase())
      )) {
        compatibility.specialties = 100;
        matchScore += 25;
        reasons.push(`Specializes in ${clientPreferences.propertyType}`);
      }
      
      // Experience compatibility
      if (agent.experience >= 5) {
        compatibility.experience = 100;
        matchScore += 20;
        reasons.push('Experienced agent with proven track record');
      } else if (agent.experience >= 2) {
        compatibility.experience = 70;
        matchScore += 15;
        reasons.push('Moderately experienced agent');
      }
      
      // Rating compatibility
      if (agent.rating >= 4.5) {
        compatibility.rating = 100;
        matchScore += 15;
        reasons.push('Highly rated by clients');
      } else if (agent.rating >= 4.0) {
        compatibility.rating = 80;
        matchScore += 10;
        reasons.push('Well-rated agent');
      }
      
      // Availability compatibility
      if (agent.isActive) {
        compatibility.availability = 100;
        matchScore += 10;
        reasons.push('Currently active and available');
      }
      
      if (matchScore > 0) {
        matches.push({
          agentId: agent.id,
          matchScore,
          reasons,
          compatibility
        });
      }
    }
    
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Commission Management
  static async getCommissions(agentId: string): Promise<Commission[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Mock commission data
    return [
      {
        id: '1',
        agentId,
        propertyId: 'prop-1',
        transactionId: 'txn-1',
        amount: 15000,
        percentage: 2.5,
        status: 'paid',
        dueDate: '2024-01-15',
        paidDate: '2024-01-10',
        notes: 'Luxury home sale in Beverly Hills',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      }
    ];
  }

  // Performance Analytics
  static async getAgentPerformance(agentId: string, period: string = '2024'): Promise<AgentPerformance> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    return {
      agentId,
      period,
      totalListings: 25,
      totalSales: agent.totalSales,
      totalVolume: agent.totalVolume,
      averageDaysOnMarket: agent.averageDaysOnMarket,
      listToSaleRatio: 0.85,
      clientSatisfactionScore: agent.clientSatisfactionScore,
      commissionEarned: 125000,
      ranking: 1,
      marketShare: 15.5,
      growthRate: 12.3
    };
  }

  // Dashboard Data
  static async getAgentDashboard(agentId: string): Promise<AgentDashboard> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const agent = await this.getAgentById(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    const performance = await this.getAgentPerformance(agentId);
    const commissions = await this.getCommissions(agentId);
    
    return {
      agent,
      performance,
      activeClients: [],
      recentLeads: [],
      upcomingTasks: [
        {
          id: '1',
          title: 'Property showing - 123 Main St',
          type: 'showing',
          date: '2024-01-20T14:00:00Z',
          clientId: 'client-1',
          propertyId: 'prop-1',
          priority: 'high'
        }
      ],
      commissions,
      reviews: [],
      marketInsights: {
        averageDaysOnMarket: 32,
        marketTrend: 'up',
        priceChange: 5.2,
        inventoryLevel: 'low'
      }
    };
  }

  // Verification
  static async verifyAgent(id: string, verificationData: {
    licenseNumber: string;
    licenseState: string;
    backgroundCheck: boolean;
    references: string[];
  }): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const agent = mockAgents.find(a => a.id === id);
    if (!agent) return false;
    
    // Simulate verification process
    const isVerified = verificationData.licenseNumber === agent.licenseNumber &&
                      verificationData.licenseState === agent.licenseState &&
                      verificationData.backgroundCheck &&
                      verificationData.references.length >= 2;
    
    if (isVerified) {
      agent.isVerified = true;
    }
    
    return isVerified;
  }
}
