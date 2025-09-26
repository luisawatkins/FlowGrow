import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Proposal, 
  StakeholderProfile, 
  GovernanceStats, 
  GovernanceAnalytics,
  ProposalFormData,
  StakeholderRegistrationData,
  VoteType,
  ProposalStatus,
  VotingResults,
  GovernanceEvent,
  GovernanceError,
  GovernanceTransaction,
  GovernanceNotification,
  EmergencyMode
} from '@/types/governance';
import { governanceService } from '@/lib/governanceService';

interface UseGovernanceReturn {
  // State
  proposals: Proposal[];
  activeProposals: Proposal[];
  stakeholderProfile: StakeholderProfile | null;
  stats: GovernanceStats | null;
  analytics: GovernanceAnalytics | null;
  emergencyMode: EmergencyMode | null;
  loading: boolean;
  error: GovernanceError | null;
  notifications: GovernanceNotification[];
  transactions: GovernanceTransaction[];
  
  // Actions
  createProposal: (data: ProposalFormData) => Promise<number>;
  castVote: (proposalID: number, voteType: VoteType) => Promise<boolean>;
  executeProposal: (proposalID: number) => Promise<boolean>;
  registerStakeholder: (data: StakeholderRegistrationData) => Promise<boolean>;
  updateStakeholderProfile: (data: Partial<StakeholderRegistrationData>) => Promise<boolean>;
  updateSettings: (settings: any) => Promise<boolean>;
  activateEmergencyMode: (proposalID: number) => Promise<boolean>;
  deactivateEmergencyMode: () => Promise<boolean>;
  
  // Utility functions
  getProposal: (proposalID: number) => Promise<Proposal | null>;
  getVotingResults: (proposalID: number) => Promise<VotingResults | null>;
  calculateVotingPower: (address: string) => Promise<number>;
  isStakeholder: (address: string) => Promise<boolean>;
  canVote: (address: string, proposalID: number) => Promise<boolean>;
  
  // Event management
  subscribeToEvents: (callback: (event: GovernanceEvent) => void) => void;
  unsubscribeFromEvents: () => void;
  
  // Refresh functions
  refreshProposals: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  refreshStakeholderProfile: (address: string) => Promise<void>;
}

export const useGovernance = (userAddress?: string): UseGovernanceReturn => {
  // State
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [stakeholderProfile, setStakeholderProfile] = useState<StakeholderProfile | null>(null);
  const [stats, setStats] = useState<GovernanceStats | null>(null);
  const [analytics, setAnalytics] = useState<GovernanceAnalytics | null>(null);
  const [emergencyMode, setEmergencyMode] = useState<EmergencyMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GovernanceError | null>(null);
  const [notifications, setNotifications] = useState<GovernanceNotification[]>([]);
  const [transactions, setTransactions] = useState<GovernanceTransaction[]>([]);
  
  // Refs
  const eventListenersRef = useRef<Array<(event: GovernanceEvent) => void>>([]);
  const isInitializedRef = useRef(false);

  // Initialize governance data
  const initializeGovernance = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load initial data
      await Promise.all([
        refreshProposals(),
        refreshStats(),
        refreshAnalytics(),
        userAddress ? refreshStakeholderProfile(userAddress) : Promise.resolve()
      ]);
      
      isInitializedRef.current = true;
    } catch (err) {
      setError({
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize governance data',
        details: err,
        timestamp: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  // Refresh proposals
  const refreshProposals = useCallback(async () => {
    try {
      const [allProposals, activeProposalsData] = await Promise.all([
        Promise.all([1, 2, 3, 4, 5].map(id => governanceService.getProposal(id))),
        governanceService.getActiveProposals()
      ]);
      
      const validProposals = allProposals.filter(p => p !== null) as Proposal[];
      setProposals(validProposals);
      setActiveProposals(activeProposalsData);
    } catch (err) {
      console.error('Error refreshing proposals:', err);
      setError({
        code: 'PROPOSALS_REFRESH_ERROR',
        message: 'Failed to refresh proposals',
        details: err,
        timestamp: Date.now()
      });
    }
  }, []);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await governanceService.getGovernanceStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error refreshing stats:', err);
      setError({
        code: 'STATS_REFRESH_ERROR',
        message: 'Failed to refresh governance stats',
        details: err,
        timestamp: Date.now()
      });
    }
  }, []);

  // Refresh analytics
  const refreshAnalytics = useCallback(async () => {
    try {
      const analyticsData = await governanceService.getGovernanceAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error refreshing analytics:', err);
      setError({
        code: 'ANALYTICS_REFRESH_ERROR',
        message: 'Failed to refresh governance analytics',
        details: err,
        timestamp: Date.now()
      });
    }
  }, []);

  // Refresh stakeholder profile
  const refreshStakeholderProfile = useCallback(async (address: string) => {
    try {
      const profile = await governanceService.getStakeholderProfile(address);
      setStakeholderProfile(profile);
    } catch (err) {
      console.error('Error refreshing stakeholder profile:', err);
      setError({
        code: 'PROFILE_REFRESH_ERROR',
        message: 'Failed to refresh stakeholder profile',
        details: err,
        timestamp: Date.now()
      });
    }
  }, []);

  // Create proposal
  const createProposal = useCallback(async (data: ProposalFormData): Promise<number> => {
    setLoading(true);
    setError(null);
    
    try {
      const proposalID = await governanceService.createProposal(data);
      
      // Refresh proposals after creation
      await refreshProposals();
      
      // Add notification
      const notification: GovernanceNotification = {
        id: `notification_${Date.now()}`,
        type: 'proposal',
        title: 'Proposal Created',
        message: `Your proposal "${data.title}" has been created successfully.`,
        timestamp: Date.now(),
        read: false,
        actionRequired: false,
        data: { proposalID }
      };
      setNotifications(prev => [notification, ...prev]);
      
      return proposalID;
    } catch (err) {
      const error: GovernanceError = {
        code: 'PROPOSAL_CREATION_ERROR',
        message: 'Failed to create proposal',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshProposals]);

  // Cast vote
  const castVote = useCallback(async (proposalID: number, voteType: VoteType): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.castVote(proposalID, voteType);
      
      if (success) {
        // Refresh proposals to update vote counts
        await refreshProposals();
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'vote',
          title: 'Vote Cast',
          message: `Your ${voteType} vote has been recorded for proposal #${proposalID}.`,
          timestamp: Date.now(),
          read: false,
          actionRequired: false,
          data: { proposalID, voteType }
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'VOTE_CASTING_ERROR',
        message: 'Failed to cast vote',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshProposals]);

  // Execute proposal
  const executeProposal = useCallback(async (proposalID: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.executeProposal(proposalID);
      
      if (success) {
        // Refresh proposals to update status
        await refreshProposals();
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'execution',
          title: 'Proposal Executed',
          message: `Proposal #${proposalID} has been executed successfully.`,
          timestamp: Date.now(),
          read: false,
          actionRequired: false,
          data: { proposalID }
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'PROPOSAL_EXECUTION_ERROR',
        message: 'Failed to execute proposal',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshProposals]);

  // Register stakeholder
  const registerStakeholder = useCallback(async (data: StakeholderRegistrationData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.registerStakeholder(data);
      
      if (success && userAddress) {
        // Refresh stakeholder profile
        await refreshStakeholderProfile(userAddress);
        
        // Refresh stats
        await refreshStats();
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'stakeholder',
          title: 'Stakeholder Registered',
          message: 'You have been successfully registered as a stakeholder.',
          timestamp: Date.now(),
          read: false,
          actionRequired: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'STAKEHOLDER_REGISTRATION_ERROR',
        message: 'Failed to register stakeholder',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userAddress, refreshStakeholderProfile, refreshStats]);

  // Update stakeholder profile
  const updateStakeholderProfile = useCallback(async (data: Partial<StakeholderRegistrationData>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.registerStakeholder(data as StakeholderRegistrationData);
      
      if (success && userAddress) {
        // Refresh stakeholder profile
        await refreshStakeholderProfile(userAddress);
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'stakeholder',
          title: 'Profile Updated',
          message: 'Your stakeholder profile has been updated successfully.',
          timestamp: Date.now(),
          read: false,
          actionRequired: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'PROFILE_UPDATE_ERROR',
        message: 'Failed to update stakeholder profile',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userAddress, refreshStakeholderProfile]);

  // Update settings
  const updateSettings = useCallback(async (settings: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.updateSettings(settings);
      
      if (success) {
        // Refresh stats and analytics
        await Promise.all([refreshStats(), refreshAnalytics()]);
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'proposal',
          title: 'Settings Updated',
          message: 'Governance settings have been updated successfully.',
          timestamp: Date.now(),
          read: false,
          actionRequired: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'SETTINGS_UPDATE_ERROR',
        message: 'Failed to update settings',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [refreshStats, refreshAnalytics]);

  // Activate emergency mode
  const activateEmergencyMode = useCallback(async (proposalID: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.activateEmergencyMode(proposalID);
      
      if (success) {
        // Update emergency mode state
        setEmergencyMode({
          isActive: true,
          activatedBy: userAddress || 'unknown',
          activatedAt: Date.now(),
          proposalID,
          reason: 'Emergency action required'
        });
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'emergency',
          title: 'Emergency Mode Activated',
          message: `Emergency mode has been activated for proposal #${proposalID}.`,
          timestamp: Date.now(),
          read: false,
          actionRequired: true,
          data: { proposalID }
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'EMERGENCY_ACTIVATION_ERROR',
        message: 'Failed to activate emergency mode',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  // Deactivate emergency mode
  const deactivateEmergencyMode = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await governanceService.deactivateEmergencyMode();
      
      if (success) {
        // Update emergency mode state
        setEmergencyMode(null);
        
        // Add notification
        const notification: GovernanceNotification = {
          id: `notification_${Date.now()}`,
          type: 'emergency',
          title: 'Emergency Mode Deactivated',
          message: 'Emergency mode has been deactivated.',
          timestamp: Date.now(),
          read: false,
          actionRequired: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      return success;
    } catch (err) {
      const error: GovernanceError = {
        code: 'EMERGENCY_DEACTIVATION_ERROR',
        message: 'Failed to deactivate emergency mode',
        details: err,
        timestamp: Date.now()
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility functions
  const getProposal = useCallback(async (proposalID: number): Promise<Proposal | null> => {
    try {
      return await governanceService.getProposal(proposalID);
    } catch (err) {
      console.error('Error getting proposal:', err);
      return null;
    }
  }, []);

  const getVotingResults = useCallback(async (proposalID: number): Promise<VotingResults | null> => {
    try {
      return await governanceService.getVotingResults(proposalID);
    } catch (err) {
      console.error('Error getting voting results:', err);
      return null;
    }
  }, []);

  const calculateVotingPower = useCallback(async (address: string): Promise<number> => {
    try {
      return await governanceService.calculateVotingPower(address);
    } catch (err) {
      console.error('Error calculating voting power:', err);
      return 0;
    }
  }, []);

  const isStakeholder = useCallback(async (address: string): Promise<boolean> => {
    try {
      return await governanceService.isStakeholder(address);
    } catch (err) {
      console.error('Error checking stakeholder status:', err);
      return false;
    }
  }, []);

  const canVote = useCallback(async (address: string, proposalID: number): Promise<boolean> => {
    try {
      return await governanceService.canVote(address, proposalID);
    } catch (err) {
      console.error('Error checking voting eligibility:', err);
      return false;
    }
  }, []);

  // Event management
  const subscribeToEvents = useCallback((callback: (event: GovernanceEvent) => void) => {
    eventListenersRef.current.push(callback);
    governanceService.subscribeToEvents(callback);
  }, []);

  const unsubscribeFromEvents = useCallback(() => {
    eventListenersRef.current.forEach(callback => {
      governanceService.unsubscribeFromEvents();
    });
    eventListenersRef.current = [];
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeGovernance();
    
    return () => {
      unsubscribeFromEvents();
    };
  }, [initializeGovernance, unsubscribeFromEvents]);

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitializedRef.current) {
        refreshProposals();
        refreshStats();
        refreshAnalytics();
        if (userAddress) {
          refreshStakeholderProfile(userAddress);
        }
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshProposals, refreshStats, refreshAnalytics, refreshStakeholderProfile, userAddress]);

  return {
    // State
    proposals,
    activeProposals,
    stakeholderProfile,
    stats,
    analytics,
    emergencyMode,
    loading,
    error,
    notifications,
    transactions,
    
    // Actions
    createProposal,
    castVote,
    executeProposal,
    registerStakeholder,
    updateStakeholderProfile,
    updateSettings,
    activateEmergencyMode,
    deactivateEmergencyMode,
    
    // Utility functions
    getProposal,
    getVotingResults,
    calculateVotingPower,
    isStakeholder,
    canVote,
    
    // Event management
    subscribeToEvents,
    unsubscribeFromEvents,
    
    // Refresh functions
    refreshProposals,
    refreshStats,
    refreshAnalytics,
    refreshStakeholderProfile
  };
};
