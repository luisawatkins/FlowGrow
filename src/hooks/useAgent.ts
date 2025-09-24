import { useState, useEffect, useCallback } from 'react';
import { Agent, Brokerage, Commission, AgentClient, AgentPerformance, AgentSearchFilters, AgentMatch, AgentReview, AgentLead, AgentDashboard } from '@/types/agent';
import { AgentService } from '@/lib/agentService';

export interface UseAgentReturn {
  // Agent data
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  
  // Brokerage data
  brokerages: Brokerage[];
  selectedBrokerage: Brokerage | null;
  
  // Commission data
  commissions: Commission[];
  commissionLoading: boolean;
  
  // Performance data
  performance: AgentPerformance | null;
  performanceLoading: boolean;
  
  // Dashboard data
  dashboard: AgentDashboard | null;
  dashboardLoading: boolean;
  
  // Search and filters
  searchFilters: AgentSearchFilters;
  searchResults: Agent[];
  searchLoading: boolean;
  
  // Matching
  agentMatches: AgentMatch[];
  matchingLoading: boolean;
  
  // Actions
  loadAgents: (filters?: AgentSearchFilters) => Promise<void>;
  selectAgent: (agentId: string) => Promise<void>;
  createAgent: (agentData: Partial<Agent>) => Promise<Agent | null>;
  updateAgent: (agentId: string, updates: Partial<Agent>) => Promise<boolean>;
  verifyAgent: (agentId: string, verificationData: any) => Promise<boolean>;
  loadBrokerages: () => Promise<void>;
  selectBrokerage: (brokerageId: string) => Promise<void>;
  loadCommissions: (agentId: string) => Promise<void>;
  loadPerformance: (agentId: string, period?: string) => Promise<void>;
  loadDashboard: (agentId: string) => Promise<void>;
  searchAgents: (filters: AgentSearchFilters) => Promise<void>;
  findMatchingAgents: (preferences: any) => Promise<void>;
  clearError: () => void;
}

export const useAgent = (): UseAgentReturn => {
  // State management
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [brokerages, setBrokerages] = useState<Brokerage[]>([]);
  const [selectedBrokerage, setSelectedBrokerage] = useState<Brokerage | null>(null);
  
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [commissionLoading, setCommissionLoading] = useState(false);
  
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  
  const [dashboard, setDashboard] = useState<AgentDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState<AgentSearchFilters>({});
  const [searchResults, setSearchResults] = useState<Agent[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [agentMatches, setAgentMatches] = useState<AgentMatch[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Error handling
  const handleError = useCallback((err: any) => {
    console.error('Agent service error:', err);
    setError(err.message || 'An error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load agents
  const loadAgents = useCallback(async (filters?: AgentSearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const agentList = await AgentService.getAgents(filters);
      setAgents(agentList);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Select agent
  const selectAgent = useCallback(async (agentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const agent = await AgentService.getAgentById(agentId);
      setSelectedAgent(agent);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Create agent
  const createAgent = useCallback(async (agentData: Partial<Agent>): Promise<Agent | null> => {
    try {
      setLoading(true);
      setError(null);
      const newAgent = await AgentService.createAgent(agentData);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Update agent
  const updateAgent = useCallback(async (agentId: string, updates: Partial<Agent>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedAgent = await AgentService.updateAgent(agentId, updates);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? updatedAgent : agent
        ));
        if (selectedAgent?.id === agentId) {
          setSelectedAgent(updatedAgent);
        }
        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, selectedAgent]);

  // Verify agent
  const verifyAgent = useCallback(async (agentId: string, verificationData: any): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const isVerified = await AgentService.verifyAgent(agentId, verificationData);
      if (isVerified) {
        // Update the agent in the list
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? { ...agent, isVerified: true } : agent
        ));
        if (selectedAgent?.id === agentId) {
          setSelectedAgent(prev => prev ? { ...prev, isVerified: true } : null);
        }
      }
      return isVerified;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, selectedAgent]);

  // Load brokerages
  const loadBrokerages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const brokerageList = await AgentService.getBrokerages();
      setBrokerages(brokerageList);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Select brokerage
  const selectBrokerage = useCallback(async (brokerageId: string) => {
    try {
      setLoading(true);
      setError(null);
      const brokerage = await AgentService.getBrokerageById(brokerageId);
      setSelectedBrokerage(brokerage);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Load commissions
  const loadCommissions = useCallback(async (agentId: string) => {
    try {
      setCommissionLoading(true);
      setError(null);
      const commissionList = await AgentService.getCommissions(agentId);
      setCommissions(commissionList);
    } catch (err) {
      handleError(err);
    } finally {
      setCommissionLoading(false);
    }
  }, [handleError]);

  // Load performance
  const loadPerformance = useCallback(async (agentId: string, period?: string) => {
    try {
      setPerformanceLoading(true);
      setError(null);
      const performanceData = await AgentService.getAgentPerformance(agentId, period);
      setPerformance(performanceData);
    } catch (err) {
      handleError(err);
    } finally {
      setPerformanceLoading(false);
    }
  }, [handleError]);

  // Load dashboard
  const loadDashboard = useCallback(async (agentId: string) => {
    try {
      setDashboardLoading(true);
      setError(null);
      const dashboardData = await AgentService.getAgentDashboard(agentId);
      setDashboard(dashboardData);
    } catch (err) {
      handleError(err);
    } finally {
      setDashboardLoading(false);
    }
  }, [handleError]);

  // Search agents
  const searchAgents = useCallback(async (filters: AgentSearchFilters) => {
    try {
      setSearchLoading(true);
      setError(null);
      setSearchFilters(filters);
      const results = await AgentService.getAgents(filters);
      setSearchResults(results);
    } catch (err) {
      handleError(err);
    } finally {
      setSearchLoading(false);
    }
  }, [handleError]);

  // Find matching agents
  const findMatchingAgents = useCallback(async (preferences: any) => {
    try {
      setMatchingLoading(true);
      setError(null);
      const matches = await AgentService.findMatchingAgents(preferences);
      setAgentMatches(matches);
    } catch (err) {
      handleError(err);
    } finally {
      setMatchingLoading(false);
    }
  }, [handleError]);

  // Load initial data
  useEffect(() => {
    loadAgents();
    loadBrokerages();
  }, [loadAgents, loadBrokerages]);

  return {
    // Agent data
    agents,
    selectedAgent,
    loading,
    error,
    
    // Brokerage data
    brokerages,
    selectedBrokerage,
    
    // Commission data
    commissions,
    commissionLoading,
    
    // Performance data
    performance,
    performanceLoading,
    
    // Dashboard data
    dashboard,
    dashboardLoading,
    
    // Search and filters
    searchFilters,
    searchResults,
    searchLoading,
    
    // Matching
    agentMatches,
    matchingLoading,
    
    // Actions
    loadAgents,
    selectAgent,
    createAgent,
    updateAgent,
    verifyAgent,
    loadBrokerages,
    selectBrokerage,
    loadCommissions,
    loadPerformance,
    loadDashboard,
    searchAgents,
    findMatchingAgents,
    clearError
  };
};
