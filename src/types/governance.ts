// Governance Types for FlowGrow Property Marketplace

export enum ProposalStatus {
  Active = 'Active',
  Passed = 'Passed',
  Rejected = 'Rejected',
  Executed = 'Executed',
  Cancelled = 'Cancelled'
}

export enum VoteType {
  Yes = 'Yes',
  No = 'No',
  Abstain = 'Abstain'
}

export enum ProposalType {
  PropertyRule = 'PropertyRule',
  FeeChange = 'FeeChange',
  ContractUpgrade = 'ContractUpgrade',
  CommunityFund = 'CommunityFund',
  EmergencyAction = 'EmergencyAction'
}

export enum StakeholderStatus {
  Pending = 'Pending',
  Active = 'Active',
  Suspended = 'Suspended',
  Revoked = 'Revoked'
}

export enum VerificationLevel {
  Basic = 'Basic',
  Verified = 'Verified',
  Premium = 'Premium',
  Institutional = 'Institutional'
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  proposalType: ProposalType;
  status: ProposalStatus;
  createdAt: number;
  votingStartTime: number;
  votingEndTime: number;
  executionTime?: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotingPower: number;
  quorumRequired: number;
  executionData?: string;
  targetContract?: string;
}

export interface Vote {
  proposalID: number;
  voter: string;
  voteType: VoteType;
  votingPower: number;
  timestamp: number;
}

export interface Stakeholder {
  address: string;
  votingPower: number;
  propertyCount: number;
  totalPropertyValue: number;
  isActive: boolean;
  joinedAt: number;
  lastVoteAt?: number;
}

export interface StakeholderProfile {
  address: string;
  name?: string;
  email?: string;
  organization?: string;
  status: StakeholderStatus;
  verificationLevel: VerificationLevel;
  votingPower: number;
  propertyCount: number;
  totalPropertyValue: number;
  reputationScore: number;
  joinedAt: number;
  lastActiveAt: number;
  verificationDate?: number;
  kycCompleted: boolean;
  amlCompleted: boolean;
}

export interface PropertyOwnership {
  propertyID: number;
  owner: string;
  ownershipPercentage: number;
  acquiredAt: number;
  acquisitionPrice: number;
  isActive: boolean;
}

export interface GovernanceSettings {
  minVotingDuration: number;
  maxVotingDuration: number;
  defaultQuorum: number;
  minProposalDeposit: number;
  executionDelay: number;
  emergencyThreshold: number;
}

export interface VotingPowerRules {
  baseVotingPower: number;
  propertyValueMultiplier: number;
  reputationMultiplier: number;
  verificationBonus: number;
  maxVotingPower: number;
  minVotingPower: number;
}

export interface GovernanceStats {
  totalStakeholders: number;
  totalVotingPower: number;
  activeProposals: number;
  totalProposals: number;
  participationRate: number;
  averageVotingPower: number;
}

export interface ProposalFormData {
  title: string;
  description: string;
  proposalType: ProposalType;
  votingDuration: number;
  quorumRequired?: number;
  executionData?: string;
  targetContract?: string;
}

export interface StakeholderRegistrationData {
  name?: string;
  email?: string;
  organization?: string;
}

export interface VotingResults {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotes: number;
  participationRate: number;
  quorumMet: boolean;
  majorityYes: boolean;
}

export interface GovernanceEvent {
  id: string;
  type: 'ProposalCreated' | 'VoteCast' | 'ProposalExecuted' | 'StakeholderRegistered' | 'SettingsUpdated';
  timestamp: number;
  data: any;
  blockNumber: number;
  transactionHash: string;
}

export interface GovernanceAnalytics {
  proposalsByType: Record<ProposalType, number>;
  votingParticipation: {
    totalVoters: number;
    participationRate: number;
    averageVotingPower: number;
  };
  stakeholderGrowth: {
    totalStakeholders: number;
    newStakeholdersThisMonth: number;
    growthRate: number;
  };
  proposalSuccessRate: {
    totalProposals: number;
    successfulProposals: number;
    successRate: number;
  };
  topVoters: Array<{
    address: string;
    votingPower: number;
    votesCast: number;
  }>;
}

export interface EmergencyMode {
  isActive: boolean;
  activatedBy: string;
  activatedAt: number;
  proposalID: number;
  reason: string;
}

export interface GovernanceConfig {
  contractAddresses: {
    governance: string;
    stakeholderRegistry: string;
    propertyNFT: string;
    propertyMarketplace: string;
  };
  network: 'emulator' | 'testnet' | 'mainnet';
  settings: GovernanceSettings;
  votingPowerRules: VotingPowerRules;
}

export interface GovernanceError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export interface GovernanceTransaction {
  id: string;
  type: 'createProposal' | 'castVote' | 'executeProposal' | 'registerStakeholder' | 'updateSettings';
  status: 'pending' | 'success' | 'failed';
  hash?: string;
  timestamp: number;
  data: any;
  error?: GovernanceError;
}

export interface GovernanceNotification {
  id: string;
  type: 'proposal' | 'vote' | 'execution' | 'stakeholder' | 'emergency';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionRequired: boolean;
  data?: any;
}

export interface GovernanceFilter {
  status?: ProposalStatus[];
  proposalType?: ProposalType[];
  proposer?: string;
  dateRange?: {
    start: number;
    end: number;
  };
  votingPower?: {
    min: number;
    max: number;
  };
}

export interface GovernanceSort {
  field: 'createdAt' | 'votingEndTime' | 'yesVotes' | 'noVotes' | 'totalVotingPower';
  direction: 'asc' | 'desc';
}

export interface GovernancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GovernanceSearch {
  query: string;
  filters: GovernanceFilter;
  sort: GovernanceSort;
  pagination: GovernancePagination;
}

export interface GovernanceState {
  proposals: Proposal[];
  stakeholders: Stakeholder[];
  settings: GovernanceSettings;
  stats: GovernanceStats;
  analytics: GovernanceAnalytics;
  emergencyMode: EmergencyMode;
  loading: boolean;
  error?: GovernanceError;
  notifications: GovernanceNotification[];
  transactions: GovernanceTransaction[];
}

export interface GovernanceActions {
  // Proposal actions
  createProposal: (data: ProposalFormData) => Promise<number>;
  castVote: (proposalID: number, voteType: VoteType) => Promise<boolean>;
  executeProposal: (proposalID: number) => Promise<boolean>;
  getProposal: (proposalID: number) => Promise<Proposal | null>;
  getActiveProposals: () => Promise<Proposal[]>;
  getVotingResults: (proposalID: number) => Promise<VotingResults | null>;
  
  // Stakeholder actions
  registerStakeholder: (data: StakeholderRegistrationData) => Promise<boolean>;
  updateStakeholderProfile: (data: Partial<StakeholderRegistrationData>) => Promise<boolean>;
  getStakeholderProfile: (address: string) => Promise<StakeholderProfile | null>;
  getStakeholderVotingPower: (address: string) => Promise<number>;
  
  // Governance actions
  getGovernanceStats: () => Promise<GovernanceStats>;
  getGovernanceAnalytics: () => Promise<GovernanceAnalytics>;
  updateSettings: (settings: Partial<GovernanceSettings>) => Promise<boolean>;
  activateEmergencyMode: (proposalID: number) => Promise<boolean>;
  deactivateEmergencyMode: () => Promise<boolean>;
  
  // Utility actions
  calculateVotingPower: (address: string) => Promise<number>;
  getTotalVotingPower: () => Promise<number>;
  isStakeholder: (address: string) => Promise<boolean>;
  canVote: (address: string, proposalID: number) => Promise<boolean>;
  
  // Event actions
  subscribeToEvents: (callback: (event: GovernanceEvent) => void) => void;
  unsubscribeFromEvents: () => void;
  getEventHistory: (limit?: number) => Promise<GovernanceEvent[]>;
}
