import { useState, useCallback, useEffect } from 'react'
import { Agent, Brokerage, AgentClient, Commission, AgentReview, AgentSearchFilters, AgentMatchingCriteria } from '../types/agent'
import { AgentService } from '../lib/agentService'
import { CommissionCalculator, CommissionCalculation } from '../lib/commissionCalculator'

interface AgentState {
  agent: Agent | null
  brokerage: Brokerage | null
  clients: AgentClient[]
  commissions: Commission[]
  reviews: AgentReview[]
  isLoading: boolean
  error: string | null
}

interface AgentSearchState {
  agents: Agent[]
  totalCount: number
  isLoading: boolean
  error: string | null
  filters: AgentSearchFilters
}

interface AgentAnalytics {
  totalCommission: number
  averageRating: number
  totalReviews: number
  totalClients: number
  activeClients: number
  pendingCommissions: number
  paidCommissions: number
  monthlyProjections: any
  yearlySummary: any
  goalPerformance: any
}

export function useAgent(agentId?: string) {
  const [state, setState] = useState<AgentState>({
    agent: null,
    brokerage: null,
    clients: [],
    commissions: [],
    reviews: [],
    isLoading: true,
    error: null,
  })

  // Load agent data
  const loadAgent = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const [agent, brokerage, clients, commissions, reviews] = await Promise.all([
        AgentService.getAgent(id),
        AgentService.getAgent(id).then(agent => 
          agent ? AgentService.getBrokerage(agent.brokerageId) : null
        ),
        AgentService.getAgentClients(id),
        AgentService.getAgentCommissions(id),
        AgentService.getAgentReviews(id),
      ])

      setState({
        agent,
        brokerage,
        clients: clients || [],
        commissions: commissions || [],
        reviews: reviews || [],
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load agent',
        isLoading: false,
      }))
    }
  }, [])

  // Update agent
  const updateAgent = useCallback(async (updates: Partial<Agent>) => {
    if (!state.agent) return

    try {
      const updatedAgent = await AgentService.updateAgent(state.agent.id, updates)
      setState(prev => ({ ...prev, agent: updatedAgent }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update agent',
      }))
    }
  }, [state.agent])

  // Add client
  const addClient = useCallback(async (clientId: string, relationshipType: 'buyer' | 'seller' | 'both') => {
    if (!state.agent) return

    try {
      const newClient = await AgentService.addClient(state.agent.id, clientId, relationshipType)
      setState(prev => ({
        ...prev,
        clients: [...prev.clients, newClient],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add client',
      }))
    }
  }, [state.agent])

  // Update client relationship
  const updateClient = useCallback(async (clientId: string, updates: Partial<AgentClient>) => {
    try {
      const updatedClient = await AgentService.updateClientRelationship(clientId, updates)
      setState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === clientId ? updatedClient : c),
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update client',
      }))
    }
  }, [])

  // Create commission
  const createCommission = useCallback(async (commissionData: Partial<Commission>) => {
    if (!state.agent) return

    try {
      const newCommission = await AgentService.createCommission({
        ...commissionData,
        agentId: state.agent.id,
      })
      setState(prev => ({
        ...prev,
        commissions: [newCommission, ...prev.commissions],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create commission',
      }))
    }
  }, [state.agent])

  // Update commission
  const updateCommission = useCallback(async (commissionId: string, updates: Partial<Commission>) => {
    try {
      const updatedCommission = await AgentService.updateCommission(commissionId, updates)
      setState(prev => ({
        ...prev,
        commissions: prev.commissions.map(c => c.id === commissionId ? updatedCommission : c),
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update commission',
      }))
    }
  }, [])

  // Create review
  const createReview = useCallback(async (reviewData: Partial<AgentReview>) => {
    if (!state.agent) return

    try {
      const newReview = await AgentService.createReview({
        ...reviewData,
        agentId: state.agent.id,
      })
      setState(prev => ({
        ...prev,
        reviews: [newReview, ...prev.reviews],
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create review',
      }))
    }
  }, [state.agent])

  // Load agent on mount
  useEffect(() => {
    if (agentId) {
      loadAgent(agentId)
    }
  }, [agentId, loadAgent])

  return {
    ...state,
    loadAgent,
    updateAgent,
    addClient,
    updateClient,
    createCommission,
    updateCommission,
    createReview,
  }
}

export function useAgentSearch() {
  const [state, setState] = useState<AgentSearchState>({
    agents: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    filters: {},
  })

  // Search agents
  const searchAgents = useCallback(async (filters: AgentSearchFilters, limit = 20, offset = 0) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, filters }))
      
      const agents = await AgentService.searchAgents(filters, limit, offset)
      
      setState(prev => ({
        ...prev,
        agents,
        totalCount: agents.length,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to search agents',
        isLoading: false,
      }))
    }
  }, [])

  // Find matching agents
  const findMatchingAgents = useCallback(async (criteria: AgentMatchingCriteria) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const agents = await AgentService.findMatchingAgents(criteria)
      
      setState(prev => ({
        ...prev,
        agents,
        totalCount: agents.length,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to find matching agents',
        isLoading: false,
      }))
    }
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setState({
      agents: [],
      totalCount: 0,
      isLoading: false,
      error: null,
      filters: {},
    })
  }, [])

  return {
    ...state,
    searchAgents,
    findMatchingAgents,
    clearSearch,
  }
}

export function useAgentAnalytics(agentId?: string) {
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load analytics
  const loadAnalytics = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const agentData = await AgentService.getAgentAnalytics(id)
      const agent = agentData.agent
      const commissions = agentData.commissions || []

      // Calculate projections
      const monthlyProjections = CommissionCalculator.calculateMonthlyProjections(
        agent,
        agent.stats.propertiesSold / 12, // Average monthly sales
        agent.stats.totalSalesValue / agent.stats.totalSales // Average sale price
      )

      // Calculate yearly summary
      const yearlySummary = CommissionCalculator.calculateYearToDateSummary(commissions)

      // Calculate goal performance
      const monthlyGoal = agent.stats.totalCommission / 12 // Average monthly goal
      const yearlyGoal = agent.stats.totalCommission
      const goalPerformance = CommissionCalculator.calculateGoalPerformance(
        commissions,
        monthlyGoal,
        yearlyGoal
      )

      setAnalytics({
        totalCommission: agentData.totalCommission,
        averageRating: agentData.averageRating,
        totalReviews: agentData.totalReviews,
        totalClients: agentData.totalClients,
        activeClients: agentData.activeClients,
        pendingCommissions: agentData.pendingCommissions,
        paidCommissions: agentData.paidCommissions,
        monthlyProjections,
        yearlySummary,
        goalPerformance,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Calculate commission for property
  const calculateCommission = useCallback((propertyValue: number): CommissionCalculation => {
    if (!analytics) {
      throw new Error('Analytics not loaded')
    }
    
    // This would need the actual agent data, but for now we'll use a mock
    const mockAgent = {
      id: agentId || '',
      commissionRate: 0.03, // 3%
    } as Agent

    return CommissionCalculator.calculateCommission(propertyValue, mockAgent)
  }, [analytics, agentId])

  // Load analytics on mount
  useEffect(() => {
    if (agentId) {
      loadAnalytics(agentId)
    }
  }, [agentId, loadAnalytics])

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics,
    calculateCommission,
  }
}

export function useBrokerage(brokerageId?: string) {
  const [brokerage, setBrokerage] = useState<Brokerage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load brokerage
  const loadBrokerage = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const brokerageData = await AgentService.getBrokerage(id)
      setBrokerage(brokerageData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load brokerage')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load brokerage on mount
  useEffect(() => {
    if (brokerageId) {
      loadBrokerage(brokerageId)
    }
  }, [brokerageId, loadBrokerage])

  return {
    brokerage,
    isLoading,
    error,
    loadBrokerage,
  }
}