import { supabase } from './supabase'
import { Agent, Brokerage, AgentClient, Commission, AgentReview, AgentSearchFilters, AgentMatchingCriteria } from '../types/agent'

export class AgentService {
  // Agent Management
  static async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .insert(agentData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create agent: ${error.message}`)
    return data
  }

  static async getAgent(agentId: string): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to get agent: ${error.message}`)
    }
    return data
  }

  static async getAgentByUserId(userId: string): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to get agent by user ID: ${error.message}`)
    }
    return data
  }

  static async updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
    const { data, error } = await supabase
      .from('agents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', agentId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update agent: ${error.message}`)
    return data
  }

  static async deleteAgent(agentId: string): Promise<void> {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId)

    if (error) throw new Error(`Failed to delete agent: ${error.message}`)
  }

  // Agent Search and Filtering
  static async searchAgents(filters: AgentSearchFilters, limit = 20, offset = 0): Promise<Agent[]> {
    let query = supabase
      .from('agents')
      .select('*')
      .eq('is_active', true)

    if (filters.specialties && filters.specialties.length > 0) {
      query = query.overlaps('specialties', filters.specialties)
    }

    if (filters.experience) {
      query = query.gte('experience', filters.experience.min)
      if (filters.experience.max) {
        query = query.lte('experience', filters.experience.max)
      }
    }

    if (filters.rating) {
      query = query.gte('rating', filters.rating.min)
    }

    if (filters.serviceAreas && filters.serviceAreas.length > 0) {
      query = query.overlaps('profile->service_areas', filters.serviceAreas)
    }

    if (filters.languages && filters.languages.length > 0) {
      query = query.overlaps('profile->languages', filters.languages)
    }

    if (filters.commissionRate) {
      query = query.gte('commission_rate', filters.commissionRate.min)
      if (filters.commissionRate.max) {
        query = query.lte('commission_rate', filters.commissionRate.max)
      }
    }

    if (filters.isVerified !== undefined) {
      query = query.eq('is_verified', filters.isVerified)
    }

    if (filters.brokerageId) {
      query = query.eq('brokerage_id', filters.brokerageId)
    }

    const { data, error } = await query
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw new Error(`Failed to search agents: ${error.message}`)
    return data || []
  }

  // Agent Matching
  static async findMatchingAgents(criteria: AgentMatchingCriteria): Promise<Agent[]> {
    const filters: AgentSearchFilters = {
      isVerified: true,
    }

    // Map criteria to filters
    if (criteria.languages) {
      filters.languages = criteria.languages
    }

    // For property type, we'll match against specialties
    if (criteria.propertyType) {
      const specialtyMap: Record<string, string[]> = {
        'condo': ['condos', 'residential'],
        'house': ['single_family', 'residential'],
        'townhouse': ['townhouses', 'residential'],
        'commercial': ['commercial'],
        'luxury': ['luxury', 'residential'],
        'investment': ['investment'],
      }
      filters.specialties = specialtyMap[criteria.propertyType] || ['residential']
    }

    // For experience level, adjust experience filter
    if (criteria.experience === 'first_time') {
      filters.experience = { min: 0, max: 2 }
    } else if (criteria.experience === 'experienced') {
      filters.experience = { min: 3, max: 10 }
    } else if (criteria.experience === 'investor') {
      filters.specialties = ['investment']
    }

    // For location, we'll use service areas
    if (criteria.location) {
      filters.serviceAreas = [criteria.location]
    }

    return this.searchAgents(filters, 10)
  }

  // Brokerage Management
  static async createBrokerage(brokerageData: Partial<Brokerage>): Promise<Brokerage> {
    const { data, error } = await supabase
      .from('brokerages')
      .insert(brokerageData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create brokerage: ${error.message}`)
    return data
  }

  static async getBrokerage(brokerageId: string): Promise<Brokerage | null> {
    const { data, error } = await supabase
      .from('brokerages')
      .select(`
        *,
        agents (*)
      `)
      .eq('id', brokerageId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to get brokerage: ${error.message}`)
    }
    return data
  }

  static async getAllBrokerages(): Promise<Brokerage[]> {
    const { data, error } = await supabase
      .from('brokerages')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw new Error(`Failed to get brokerages: ${error.message}`)
    return data || []
  }

  // Client Management
  static async addClient(agentId: string, clientId: string, relationshipType: 'buyer' | 'seller' | 'both'): Promise<AgentClient> {
    const clientData = {
      agent_id: agentId,
      client_id: clientId,
      relationship_type: relationshipType,
      status: 'active',
      start_date: new Date().toISOString(),
      properties: [],
    }

    const { data, error } = await supabase
      .from('agent_clients')
      .insert(clientData)
      .select()
      .single()

    if (error) throw new Error(`Failed to add client: ${error.message}`)
    return data
  }

  static async getAgentClients(agentId: string): Promise<AgentClient[]> {
    const { data, error } = await supabase
      .from('agent_clients')
      .select('*')
      .eq('agent_id', agentId)
      .eq('status', 'active')

    if (error) throw new Error(`Failed to get agent clients: ${error.message}`)
    return data || []
  }

  static async updateClientRelationship(clientId: string, updates: Partial<AgentClient>): Promise<AgentClient> {
    const { data, error } = await supabase
      .from('agent_clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', clientId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update client relationship: ${error.message}`)
    return data
  }

  // Commission Management
  static async createCommission(commissionData: Partial<Commission>): Promise<Commission> {
    const { data, error } = await supabase
      .from('commissions')
      .insert(commissionData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create commission: ${error.message}`)
    return data
  }

  static async getAgentCommissions(agentId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get agent commissions: ${error.message}`)
    return data || []
  }

  static async updateCommission(commissionId: string, updates: Partial<Commission>): Promise<Commission> {
    const { data, error } = await supabase
      .from('commissions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', commissionId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update commission: ${error.message}`)
    return data
  }

  // Reviews
  static async createReview(reviewData: Partial<AgentReview>): Promise<AgentReview> {
    const { data, error } = await supabase
      .from('agent_reviews')
      .insert(reviewData)
      .select()
      .single()

    if (error) throw new Error(`Failed to create review: ${error.message}`)
    return data
  }

  static async getAgentReviews(agentId: string): Promise<AgentReview[]> {
    const { data, error } = await supabase
      .from('agent_reviews')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get agent reviews: ${error.message}`)
    return data || []
  }

  // Agent Verification
  static async verifyAgent(agentId: string): Promise<Agent> {
    return this.updateAgent(agentId, { is_verified: true })
  }

  static async unverifyAgent(agentId: string): Promise<Agent> {
    return this.updateAgent(agentId, { is_verified: false })
  }

  // Analytics
  static async getAgentAnalytics(agentId: string): Promise<any> {
    const [agent, commissions, reviews, clients] = await Promise.all([
      this.getAgent(agentId),
      this.getAgentCommissions(agentId),
      this.getAgentReviews(agentId),
      this.getAgentClients(agentId),
    ])

    if (!agent) throw new Error('Agent not found')

    const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0)
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    return {
      agent,
      totalCommission,
      averageRating,
      totalReviews: reviews.length,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      pendingCommissions: commissions.filter(c => c.status === 'pending').length,
      paidCommissions: commissions.filter(c => c.status === 'paid').length,
    }
  }
}