import { 
  Proposal, 
  Vote, 
  Stakeholder, 
  StakeholderProfile, 
  GovernanceSettings, 
  VotingResults,
  GovernanceStats,
  GovernanceAnalytics,
  ProposalFormData,
  StakeholderRegistrationData,
  VoteType,
  ProposalType,
  ProposalStatus,
  VerificationLevel,
  StakeholderStatus,
  GovernanceEvent,
  GovernanceError,
  GovernanceTransaction,
  GovernanceNotification,
  EmergencyMode
} from '@/types/governance';

// Mock Flow SDK - in real implementation, this would be the actual Flow SDK
const mockFlowSDK = {
  sendTransaction: async (transaction: any) => {
    // Simulate transaction processing
    return {
      id: `tx_${Date.now()}`,
      status: 'SEALED',
      hash: `0x${Math.random().toString(16).substr(2, 64)}`
    };
  },
  executeScript: async (script: any) => {
    // Simulate script execution
    return Math.random() > 0.1 ? 'success' : null;
  },
  getAccount: async (address: string) => {
    // Simulate account retrieval
    return { address, balance: 1000 };
  },
  getLatestBlock: async () => {
    // Simulate block retrieval
    return { height: 1000000, timestamp: Date.now() };
  }
};

// Contract addresses - these would be set after deployment
const CONTRACT_ADDRESSES = {
  governance: '0x1234567890abcdef',
  stakeholderRegistry: '0x1234567890abcdef',
  propertyNFT: '0x1234567890abcdef',
  propertyMarketplace: '0x1234567890abcdef'
};

// Event listeners
const eventListeners: Array<(event: GovernanceEvent) => void> = [];

// Mock data storage
let mockProposals: Proposal[] = [];
let mockStakeholders: Stakeholder[] = [];
let mockVotes: Vote[] = [];
let mockTransactions: GovernanceTransaction[] = [];
let mockNotifications: GovernanceNotification[] = [];

// Initialize mock data
const initializeMockData = () => {
  // Mock proposals
  mockProposals = [
    {
      id: 1,
      title: 'Increase Platform Fee to 3%',
      description: 'This proposal suggests increasing the platform fee from 2.5% to 3% to fund new features and improvements.',
      proposer: '0x1234567890abcdef',
      proposalType: ProposalType.FeeChange,
      status: ProposalStatus.Active,
      createdAt: Date.now() - 86400000, // 1 day ago
      votingStartTime: Date.now() - 86400000,
      votingEndTime: Date.now() + 86400000, // 1 day from now
      yesVotes: 1500,
      noVotes: 800,
      abstainVotes: 200,
      totalVotingPower: 10000,
      quorumRequired: 10,
      executionData: '{"feePercent": 3.0}',
      targetContract: CONTRACT_ADDRESSES.propertyMarketplace
    },
    {
      id: 2,
      title: 'Add New Property Categories',
      description: 'This proposal suggests adding new property categories including commercial, industrial, and agricultural properties.',
      proposer: '0x9876543210fedcba',
      proposalType: ProposalType.PropertyRule,
      status: ProposalStatus.Passed,
      createdAt: Date.now() - 172800000, // 2 days ago
      votingStartTime: Date.now() - 172800000,
      votingEndTime: Date.now() - 86400000, // 1 day ago
      executionTime: Date.now() - 3600000, // 1 hour ago
      yesVotes: 2500,
      noVotes: 500,
      abstainVotes: 300,
      totalVotingPower: 10000,
      quorumRequired: 10,
      executionData: '{"categories": ["commercial", "industrial", "agricultural"]}',
      targetContract: CONTRACT_ADDRESSES.propertyNFT
    }
  ];

  // Mock stakeholders
  mockStakeholders = [
    {
      address: '0x1234567890abcdef',
      votingPower: 1000,
      propertyCount: 5,
      totalPropertyValue: 5000,
      isActive: true,
      joinedAt: Date.now() - 2592000000, // 30 days ago
      lastVoteAt: Date.now() - 3600000 // 1 hour ago
    },
    {
      address: '0x9876543210fedcba',
      votingPower: 2000,
      propertyCount: 10,
      totalPropertyValue: 10000,
      isActive: true,
      joinedAt: Date.now() - 5184000000, // 60 days ago
      lastVoteAt: Date.now() - 7200000 // 2 hours ago
    }
  ];

  // Mock votes
  mockVotes = [
    {
      proposalID: 1,
      voter: '0x1234567890abcdef',
      voteType: VoteType.Yes,
      votingPower: 1000,
      timestamp: Date.now() - 3600000
    },
    {
      proposalID: 1,
      voter: '0x9876543210fedcba',
      voteType: VoteType.No,
      votingPower: 2000,
      timestamp: Date.now() - 7200000
    }
  ];
};

// Initialize mock data
initializeMockData();

export class GovernanceService {
  private static instance: GovernanceService;
  private eventListeners: Array<(event: GovernanceEvent) => void> = [];

  private constructor() {}

  public static getInstance(): GovernanceService {
    if (!GovernanceService.instance) {
      GovernanceService.instance = new GovernanceService();
    }
    return GovernanceService.instance;
  }

  // Proposal Management
  async createProposal(data: ProposalFormData): Promise<number> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              let proposalID = governance.createProposal(
                title: "${data.title}",
                description: "${data.description}",
                proposer: acct.address,
                proposalType: GovernanceContract.ProposalType.${data.proposalType},
                votingDuration: ${data.votingDuration},
                quorumRequired: ${data.quorumRequired || 10.0},
                executionData: ${data.executionData ? `"${data.executionData}"` : 'nil'},
                targetContract: ${data.targetContract ? `"${data.targetContract}"` : 'nil'}
              )
              
              assert(proposalID > 0, message: "Failed to create proposal")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);
      
      // Create mock proposal
      const newProposal: Proposal = {
        id: mockProposals.length + 1,
        title: data.title,
        description: data.description,
        proposer: '0x1234567890abcdef', // This would be the actual user address
        proposalType: data.proposalType,
        status: ProposalStatus.Active,
        createdAt: Date.now(),
        votingStartTime: Date.now(),
        votingEndTime: Date.now() + (data.votingDuration * 1000),
        yesVotes: 0,
        noVotes: 0,
        abstainVotes: 0,
        totalVotingPower: 10000,
        quorumRequired: data.quorumRequired || 10,
        executionData: data.executionData,
        targetContract: data.targetContract
      };

      mockProposals.push(newProposal);

      // Record transaction
      const governanceTransaction: GovernanceTransaction = {
        id: result.id,
        type: 'createProposal',
        status: 'success',
        hash: result.hash,
        timestamp: Date.now(),
        data: data
      };
      mockTransactions.push(governanceTransaction);

      // Emit event
      this.emitEvent({
        id: `event_${Date.now()}`,
        type: 'ProposalCreated',
        timestamp: Date.now(),
        data: newProposal,
        blockNumber: 1000000,
        transactionHash: result.hash || ''
      });

      return newProposal.id;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw new Error('Failed to create proposal');
    }
  }

  async castVote(proposalID: number, voteType: VoteType): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              let success = governance.castVote(
                proposalID: ${proposalID},
                voter: acct.address,
                voteType: GovernanceContract.VoteType.${voteType}
              )
              
              assert(success, message: "Failed to cast vote")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);

      // Update mock data
      const proposal = mockProposals.find(p => p.id === proposalID);
      if (proposal) {
        const voter = '0x1234567890abcdef'; // This would be the actual user address
        const votingPower = 1000; // This would be calculated from property ownership

        // Remove existing vote if any
        const existingVoteIndex = mockVotes.findIndex(v => v.proposalID === proposalID && v.voter === voter);
        if (existingVoteIndex >= 0) {
          const existingVote = mockVotes[existingVoteIndex];
          // Subtract from proposal totals
          switch (existingVote.voteType) {
            case VoteType.Yes:
              proposal.yesVotes -= existingVote.votingPower;
              break;
            case VoteType.No:
              proposal.noVotes -= existingVote.votingPower;
              break;
            case VoteType.Abstain:
              proposal.abstainVotes -= existingVote.votingPower;
              break;
          }
          mockVotes.splice(existingVoteIndex, 1);
        }

        // Add new vote
        const newVote: Vote = {
          proposalID,
          voter,
          voteType,
          votingPower,
          timestamp: Date.now()
        };
        mockVotes.push(newVote);

        // Update proposal totals
        switch (voteType) {
          case VoteType.Yes:
            proposal.yesVotes += votingPower;
            break;
          case VoteType.No:
            proposal.noVotes += votingPower;
            break;
          case VoteType.Abstain:
            proposal.abstainVotes += votingPower;
            break;
        }
      }

      // Record transaction
      const governanceTransaction: GovernanceTransaction = {
        id: result.id,
        type: 'castVote',
        status: 'success',
        hash: result.hash,
        timestamp: Date.now(),
        data: { proposalID, voteType }
      };
      mockTransactions.push(governanceTransaction);

      // Emit event
      this.emitEvent({
        id: `event_${Date.now()}`,
        type: 'VoteCast',
        timestamp: Date.now(),
        data: { proposalID, voteType, voter: '0x1234567890abcdef' },
        blockNumber: 1000000,
        transactionHash: result.hash || ''
      });

      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw new Error('Failed to cast vote');
    }
  }

  async executeProposal(proposalID: number): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              let success = governance.executeProposal(proposalID: ${proposalID})
              
              assert(success, message: "Failed to execute proposal")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);

      // Update proposal status
      const proposal = mockProposals.find(p => p.id === proposalID);
      if (proposal) {
        proposal.status = ProposalStatus.Executed;
        proposal.executionTime = Date.now();
      }

      // Record transaction
      const governanceTransaction: GovernanceTransaction = {
        id: result.id,
        type: 'executeProposal',
        status: 'success',
        hash: result.hash,
        timestamp: Date.now(),
        data: { proposalID }
      };
      mockTransactions.push(governanceTransaction);

      // Emit event
      this.emitEvent({
        id: `event_${Date.now()}`,
        type: 'ProposalExecuted',
        timestamp: Date.now(),
        data: { proposalID },
        blockNumber: 1000000,
        transactionHash: result.hash || ''
      });

      return true;
    } catch (error) {
      console.error('Error executing proposal:', error);
      throw new Error('Failed to execute proposal');
    }
  }

  async getProposal(proposalID: number): Promise<Proposal | null> {
    try {
      const script = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          pub fun main(proposalID: UInt64): GovernanceContract.Proposal? {
            let governance = getAccount(${CONTRACT_ADDRESSES.governance})
              .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
              .borrow() ?? panic("Could not borrow GovernanceContract")
            
            return governance.getProposal(proposalID: proposalID)
          }
        `,
        args: [proposalID]
      };

      const result = await mockFlowSDK.executeScript(script);
      return mockProposals.find(p => p.id === proposalID) || null;
    } catch (error) {
      console.error('Error getting proposal:', error);
      return null;
    }
  }

  async getActiveProposals(): Promise<Proposal[]> {
    try {
      const script = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          pub fun main(): [UInt64] {
            let governance = getAccount(${CONTRACT_ADDRESSES.governance})
              .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
              .borrow() ?? panic("Could not borrow GovernanceContract")
            
            return governance.getActiveProposals()
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.executeScript(script);
      return mockProposals.filter(p => p.status === ProposalStatus.Active);
    } catch (error) {
      console.error('Error getting active proposals:', error);
      return [];
    }
  }

  async getVotingResults(proposalID: number): Promise<VotingResults | null> {
    try {
      const script = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          pub fun main(proposalID: UInt64): (UFix64, UFix64, UFix64, UFix64)? {
            let governance = getAccount(${CONTRACT_ADDRESSES.governance})
              .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
              .borrow() ?? panic("Could not borrow GovernanceContract")
            
            return governance.getVotingResults(proposalID: proposalID)
          }
        `,
        args: [proposalID]
      };

      const result = await mockFlowSDK.executeScript(script);
      const proposal = mockProposals.find(p => p.id === proposalID);
      
      if (!proposal) return null;

      const totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes;
      const participationRate = (totalVotes / proposal.totalVotingPower) * 100;
      const quorumMet = totalVotes >= (proposal.totalVotingPower * proposal.quorumRequired / 100);
      const majorityYes = proposal.yesVotes > proposal.noVotes;

      return {
        yesVotes: proposal.yesVotes,
        noVotes: proposal.noVotes,
        abstainVotes: proposal.abstainVotes,
        totalVotes,
        participationRate,
        quorumMet,
        majorityYes
      };
    } catch (error) {
      console.error('Error getting voting results:', error);
      return null;
    }
  }

  // Stakeholder Management
  async registerStakeholder(data: StakeholderRegistrationData): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import StakeholderRegistry from ${CONTRACT_ADDRESSES.stakeholderRegistry}
          
          transaction {
            prepare(acct: AuthAccount) {
              let registry = acct.getAccount(${CONTRACT_ADDRESSES.stakeholderRegistry})
                .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
                .borrow() ?? panic("Could not borrow StakeholderRegistry")
              
              let success = registry.registerStakeholder(
                address: acct.address,
                name: ${data.name ? `"${data.name}"` : 'nil'},
                email: ${data.email ? `"${data.email}"` : 'nil'},
                organization: ${data.organization ? `"${data.organization}"` : 'nil'}
              )
              
              assert(success, message: "Failed to register stakeholder")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);

      // Create mock stakeholder
      const newStakeholder: Stakeholder = {
        address: '0x1234567890abcdef', // This would be the actual user address
        votingPower: 1000,
        propertyCount: 0,
        totalPropertyValue: 0,
        isActive: true,
        joinedAt: Date.now()
      };

      mockStakeholders.push(newStakeholder);

      // Record transaction
      const governanceTransaction: GovernanceTransaction = {
        id: result.id,
        type: 'registerStakeholder',
        status: 'success',
        hash: result.hash,
        timestamp: Date.now(),
        data: data
      };
      mockTransactions.push(governanceTransaction);

      // Emit event
      this.emitEvent({
        id: `event_${Date.now()}`,
        type: 'StakeholderRegistered',
        timestamp: Date.now(),
        data: newStakeholder,
        blockNumber: 1000000,
        transactionHash: result.hash || ''
      });

      return true;
    } catch (error) {
      console.error('Error registering stakeholder:', error);
      throw new Error('Failed to register stakeholder');
    }
  }

  async getStakeholderProfile(address: string): Promise<StakeholderProfile | null> {
    try {
      const script = {
        script: `
          import StakeholderRegistry from ${CONTRACT_ADDRESSES.stakeholderRegistry}
          
          pub fun main(address: Address): StakeholderRegistry.StakeholderProfile? {
            let registry = getAccount(${CONTRACT_ADDRESSES.stakeholderRegistry})
              .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
              .borrow() ?? panic("Could not borrow StakeholderRegistry")
            
            return registry.getStakeholderProfile(address: address)
          }
        `,
        args: [address]
      };

      const result = await mockFlowSDK.executeScript(script);
      const stakeholder = mockStakeholders.find(s => s.address === address);
      
      if (!stakeholder) return null;

      return {
        address: stakeholder.address,
        name: 'Test User',
        email: 'test@example.com',
        organization: 'Test Organization',
        status: StakeholderStatus.Active,
        verificationLevel: VerificationLevel.Verified,
        votingPower: stakeholder.votingPower,
        propertyCount: stakeholder.propertyCount,
        totalPropertyValue: stakeholder.totalPropertyValue,
        reputationScore: 50,
        joinedAt: stakeholder.joinedAt,
        lastActiveAt: Date.now(),
        verificationDate: Date.now() - 86400000,
        kycCompleted: true,
        amlCompleted: true
      };
    } catch (error) {
      console.error('Error getting stakeholder profile:', error);
      return null;
    }
  }

  // Governance Statistics
  async getGovernanceStats(): Promise<GovernanceStats> {
    try {
      const totalStakeholders = mockStakeholders.length;
      const totalVotingPower = mockStakeholders.reduce((sum, s) => sum + s.votingPower, 0);
      const activeProposals = mockProposals.filter(p => p.status === ProposalStatus.Active).length;
      const totalProposals = mockProposals.length;
      const participationRate = 75; // This would be calculated from actual voting data
      const averageVotingPower = totalVotingPower / totalStakeholders;

      return {
        totalStakeholders,
        totalVotingPower,
        activeProposals,
        totalProposals,
        participationRate,
        averageVotingPower
      };
    } catch (error) {
      console.error('Error getting governance stats:', error);
      throw new Error('Failed to get governance stats');
    }
  }

  async getGovernanceAnalytics(): Promise<GovernanceAnalytics> {
    try {
      const proposalsByType = mockProposals.reduce((acc, proposal) => {
        acc[proposal.proposalType] = (acc[proposal.proposalType] || 0) + 1;
        return acc;
      }, {} as Record<ProposalType, number>);

      const totalVoters = new Set(mockVotes.map(v => v.voter)).size;
      const participationRate = (totalVoters / mockStakeholders.length) * 100;
      const averageVotingPower = mockStakeholders.reduce((sum, s) => sum + s.votingPower, 0) / mockStakeholders.length;

      const successfulProposals = mockProposals.filter(p => p.status === ProposalStatus.Executed).length;
      const successRate = (successfulProposals / totalProposals) * 100;

      const topVoters = mockStakeholders
        .map(s => ({
          address: s.address,
          votingPower: s.votingPower,
          votesCast: mockVotes.filter(v => v.voter === s.address).length
        }))
        .sort((a, b) => b.votingPower - a.votingPower)
        .slice(0, 10);

      return {
        proposalsByType,
        votingParticipation: {
          totalVoters,
          participationRate,
          averageVotingPower
        },
        stakeholderGrowth: {
          totalStakeholders: mockStakeholders.length,
          newStakeholdersThisMonth: 5,
          growthRate: 10
        },
        proposalSuccessRate: {
          totalProposals,
          successfulProposals,
          successRate
        },
        topVoters
      };
    } catch (error) {
      console.error('Error getting governance analytics:', error);
      throw new Error('Failed to get governance analytics');
    }
  }

  // Utility Functions
  async calculateVotingPower(address: string): Promise<number> {
    try {
      const script = {
        script: `
          import StakeholderRegistry from ${CONTRACT_ADDRESSES.stakeholderRegistry}
          
          pub fun main(address: Address): UFix64 {
            let registry = getAccount(${CONTRACT_ADDRESSES.stakeholderRegistry})
              .getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
              .borrow() ?? panic("Could not borrow StakeholderRegistry")
            
            return registry.calculateVotingPower(address: address)
          }
        `,
        args: [address]
      };

      const result = await mockFlowSDK.executeScript(script);
      const stakeholder = mockStakeholders.find(s => s.address === address);
      return stakeholder?.votingPower || 0;
    } catch (error) {
      console.error('Error calculating voting power:', error);
      return 0;
    }
  }

  async getTotalVotingPower(): Promise<number> {
    try {
      const script = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          pub fun main(): UFix64 {
            let governance = getAccount(${CONTRACT_ADDRESSES.governance})
              .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
              .borrow() ?? panic("Could not borrow GovernanceContract")
            
            return governance.getTotalVotingPower()
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.executeScript(script);
      return mockStakeholders.reduce((sum, s) => sum + s.votingPower, 0);
    } catch (error) {
      console.error('Error getting total voting power:', error);
      return 0;
    }
  }

  async isStakeholder(address: string): Promise<boolean> {
    try {
      const stakeholder = mockStakeholders.find(s => s.address === address);
      return !!stakeholder && stakeholder.isActive;
    } catch (error) {
      console.error('Error checking stakeholder status:', error);
      return false;
    }
  }

  async canVote(address: string, proposalID: number): Promise<boolean> {
    try {
      const stakeholder = mockStakeholders.find(s => s.address === address);
      const proposal = mockProposals.find(p => p.id === proposalID);
      
      if (!stakeholder || !stakeholder.isActive || !proposal) {
        return false;
      }

      const now = Date.now();
      return now >= proposal.votingStartTime && now <= proposal.votingEndTime;
    } catch (error) {
      console.error('Error checking voting eligibility:', error);
      return false;
    }
  }

  // Event Management
  subscribeToEvents(callback: (event: GovernanceEvent) => void): void {
    this.eventListeners.push(callback);
  }

  unsubscribeFromEvents(): void {
    this.eventListeners = [];
  }

  private emitEvent(event: GovernanceEvent): void {
    this.eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  async getEventHistory(limit: number = 100): Promise<GovernanceEvent[]> {
    // In a real implementation, this would fetch from the blockchain
    return [];
  }

  // Settings Management
  async updateSettings(settings: Partial<GovernanceSettings>): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              governance.updateSettings(
                minVotingDuration: ${settings.minVotingDuration || 'nil'},
                maxVotingDuration: ${settings.maxVotingDuration || 'nil'},
                defaultQuorum: ${settings.defaultQuorum || 'nil'},
                minProposalDeposit: ${settings.minProposalDeposit || 'nil'},
                executionDelay: ${settings.executionDelay || 'nil'},
                emergencyThreshold: ${settings.emergencyThreshold || 'nil'}
              )
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);

      // Record transaction
      const governanceTransaction: GovernanceTransaction = {
        id: result.id,
        type: 'updateSettings',
        status: 'success',
        hash: result.hash,
        timestamp: Date.now(),
        data: settings
      };
      mockTransactions.push(governanceTransaction);

      // Emit event
      this.emitEvent({
        id: `event_${Date.now()}`,
        type: 'SettingsUpdated',
        timestamp: Date.now(),
        data: settings,
        blockNumber: 1000000,
        transactionHash: result.hash || ''
      });

      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }

  // Emergency Mode
  async activateEmergencyMode(proposalID: number): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              let success = governance.activateEmergencyMode(proposalID: ${proposalID})
              
              assert(success, message: "Failed to activate emergency mode")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);
      return true;
    } catch (error) {
      console.error('Error activating emergency mode:', error);
      throw new Error('Failed to activate emergency mode');
    }
  }

  async deactivateEmergencyMode(): Promise<boolean> {
    try {
      const transaction = {
        script: `
          import GovernanceContract from ${CONTRACT_ADDRESSES.governance}
          
          transaction {
            prepare(acct: AuthAccount) {
              let governance = acct.getAccount(${CONTRACT_ADDRESSES.governance})
                .getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
                .borrow() ?? panic("Could not borrow GovernanceContract")
              
              let success = governance.deactivateEmergencyMode()
              
              assert(success, message: "Failed to deactivate emergency mode")
            }
          }
        `,
        args: []
      };

      const result = await mockFlowSDK.sendTransaction(transaction);
      return true;
    } catch (error) {
      console.error('Error deactivating emergency mode:', error);
      throw new Error('Failed to deactivate emergency mode');
    }
  }
}

// Export singleton instance
export const governanceService = GovernanceService.getInstance();
