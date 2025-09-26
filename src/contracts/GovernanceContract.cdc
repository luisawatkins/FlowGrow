import NonFungibleToken from 0x1d7e57aa558c48ec
import PropertyNFT from 0x1234567890abcdef
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowGrow Governance Contract
/// This contract manages decentralized governance for property-related decisions
pub contract GovernanceContract {
    
    // Proposal Status Enum
    pub enum ProposalStatus {
        case Active
        case Passed
        case Rejected
        case Executed
        case Cancelled
    }
    
    // Vote Type Enum
    pub enum VoteType {
        case Yes
        case No
        case Abstain
    }
    
    // Proposal Type Enum
    pub enum ProposalType {
        case PropertyRule
        case FeeChange
        case ContractUpgrade
        case CommunityFund
        case EmergencyAction
    }
    
    // Proposal Structure
    pub struct Proposal {
        pub let id: UInt64
        pub let title: String
        pub let description: String
        pub let proposer: Address
        pub let proposalType: ProposalType
        pub let status: ProposalStatus
        pub let createdAt: UFix64
        pub let votingStartTime: UFix64
        pub let votingEndTime: UFix64
        pub let executionTime: UFix64?
        pub let yesVotes: UFix64
        pub let noVotes: UFix64
        pub let abstainVotes: UFix64
        pub let totalVotingPower: UFix64
        pub let quorumRequired: UFix64
        pub let executionData: String?
        pub let targetContract: Address?
        
        init(
            id: UInt64,
            title: String,
            description: String,
            proposer: Address,
            proposalType: ProposalType,
            votingDuration: UFix64,
            quorumRequired: UFix64,
            executionData: String?,
            targetContract: Address?
        ) {
            self.id = id
            self.title = title
            self.description = description
            self.proposer = proposer
            self.proposalType = proposalType
            self.status = ProposalStatus.Active
            self.createdAt = getCurrentBlock().timestamp
            self.votingStartTime = getCurrentBlock().timestamp
            self.votingEndTime = getCurrentBlock().timestamp + votingDuration
            self.executionTime = nil
            self.yesVotes = 0.0
            self.noVotes = 0.0
            self.abstainVotes = 0.0
            self.totalVotingPower = 0.0
            self.quorumRequired = quorumRequired
            self.executionData = executionData
            self.targetContract = targetContract
        }
    }
    
    // Vote Structure
    pub struct Vote {
        pub let proposalID: UInt64
        pub let voter: Address
        pub let voteType: VoteType
        pub let votingPower: UFix64
        pub let timestamp: UFix64
        
        init(
            proposalID: UInt64,
            voter: Address,
            voteType: VoteType,
            votingPower: UFix64
        ) {
            self.proposalID = proposalID
            self.voter = voter
            self.voteType = voteType
            self.votingPower = votingPower
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    // Stakeholder Structure
    pub struct Stakeholder {
        pub let address: Address
        pub let votingPower: UFix64
        pub let propertyCount: UInt32
        pub let totalPropertyValue: UFix64
        pub let isActive: Bool
        pub let joinedAt: UFix64
        pub let lastVoteAt: UFix64?
        
        init(address: Address, propertyCount: UInt32, totalPropertyValue: UFix64) {
            self.address = address
            self.votingPower = 0.0
            self.propertyCount = propertyCount
            self.totalPropertyValue = totalPropertyValue
            self.isActive = true
            self.joinedAt = getCurrentBlock().timestamp
            self.lastVoteAt = nil
        }
    }
    
    // Governance Settings Structure
    pub struct GovernanceSettings {
        pub let minVotingDuration: UFix64
        pub let maxVotingDuration: UFix64
        pub let defaultQuorum: UFix64
        pub let minProposalDeposit: UFix64
        pub let executionDelay: UFix64
        pub let emergencyThreshold: UFix64
        
        init() {
            self.minVotingDuration = 86400.0 // 1 day
            self.maxVotingDuration = 604800.0 // 7 days
            self.defaultQuorum = 10.0 // 10% of total voting power
            self.minProposalDeposit = 1.0 // 1 FLOW
            self.executionDelay = 3600.0 // 1 hour
            self.emergencyThreshold = 50.0 // 50% for emergency actions
        }
    }
    
    // Governance Collection Resource
    pub resource GovernanceCollection {
        pub var proposals: {UInt64: Proposal}
        pub var votes: {UInt64: {Address: Vote}} // proposalID -> voter -> vote
        pub var stakeholders: {Address: Stakeholder}
        pub var settings: GovernanceSettings
        pub var nextProposalID: UInt64
        pub var totalVotingPower: UFix64
        pub var isEmergencyMode: Bool
        
        init() {
            self.proposals = {}
            self.votes = {}
            self.stakeholders = {}
            self.settings = GovernanceSettings()
            self.nextProposalID = 1
            self.totalVotingPower = 0.0
            self.isEmergencyMode = false
        }
        
        // Register a stakeholder
        pub fun registerStakeholder(
            address: Address,
            propertyCollection: &PropertyNFT.Collection
        ): Bool {
            // Calculate voting power based on property ownership
            let propertyCount = propertyCollection.getIDsCount()
            var totalValue: UFix64 = 0.0
            
            for id in propertyCollection.getIDs() {
                if let property = propertyCollection.getPropertyDetails(id: id) {
                    totalValue = totalValue + property.price
                }
            }
            
            let stakeholder = Stakeholder(
                address: address,
                propertyCount: propertyCount,
                totalPropertyValue: totalValue
            )
            
            // Calculate voting power (1 vote per FLOW of property value, minimum 1 vote)
            stakeholder.votingPower = max(1.0, totalValue)
            
            self.stakeholders[address] = stakeholder
            self.totalVotingPower = self.totalVotingPower + stakeholder.votingPower
            
            emit StakeholderRegistered(
                address: address,
                votingPower: stakeholder.votingPower,
                propertyCount: propertyCount
            )
            
            return true
        }
        
        // Update stakeholder voting power
        pub fun updateStakeholderPower(
            address: Address,
            propertyCollection: &PropertyNFT.Collection
        ) {
            if let stakeholder = self.stakeholders[address] {
                let oldPower = stakeholder.votingPower
                let propertyCount = propertyCollection.getIDsCount()
                var totalValue: UFix64 = 0.0
                
                for id in propertyCollection.getIDs() {
                    if let property = propertyCollection.getPropertyDetails(id: id) {
                        totalValue = totalValue + property.price
                    }
                }
                
                let newPower = max(1.0, totalValue)
                
                // Update stakeholder
                self.stakeholders[address] = Stakeholder(
                    address: address,
                    propertyCount: propertyCount,
                    totalPropertyValue: totalValue
                )
                
                // Update total voting power
                self.totalVotingPower = self.totalVotingPower - oldPower + newPower
                
                emit StakeholderPowerUpdated(
                    address: address,
                    oldPower: oldPower,
                    newPower: newPower
                )
            }
        }
        
        // Create a new proposal
        pub fun createProposal(
            title: String,
            description: String,
            proposer: Address,
            proposalType: ProposalType,
            votingDuration: UFix64,
            quorumRequired: UFix64?,
            executionData: String?,
            targetContract: Address?
        ): UInt64 {
            // Validate proposer is a stakeholder
            assert(self.stakeholders[proposer] != nil, message: "Only stakeholders can create proposals")
            
            // Validate voting duration
            assert(votingDuration >= self.settings.minVotingDuration, message: "Voting duration too short")
            assert(votingDuration <= self.settings.maxVotingDuration, message: "Voting duration too long")
            
            // Use default quorum if not specified
            let quorum = quorumRequired ?? self.settings.defaultQuorum
            
            let proposalID = self.nextProposalID
            self.nextProposalID = self.nextProposalID + 1
            
            let proposal = Proposal(
                id: proposalID,
                title: title,
                description: description,
                proposer: proposer,
                proposalType: proposalType,
                votingDuration: votingDuration,
                quorumRequired: quorum,
                executionData: executionData,
                targetContract: targetContract
            )
            
            self.proposals[proposalID] = proposal
            
            emit ProposalCreated(
                proposalID: proposalID,
                title: title,
                proposer: proposer,
                proposalType: proposalType,
                votingEndTime: proposal.votingEndTime
            )
            
            return proposalID
        }
        
        // Cast a vote on a proposal
        pub fun castVote(
            proposalID: UInt64,
            voter: Address,
            voteType: VoteType
        ): Bool {
            // Validate proposal exists and is active
            if let proposal = self.proposals[proposalID] {
                assert(proposal.status == ProposalStatus.Active, message: "Proposal is not active")
                assert(getCurrentBlock().timestamp >= proposal.votingStartTime, message: "Voting has not started")
                assert(getCurrentBlock().timestamp <= proposal.votingEndTime, message: "Voting has ended")
                
                // Validate voter is a stakeholder
                if let stakeholder = self.stakeholders[voter] {
                    assert(stakeholder.isActive, message: "Stakeholder is not active")
                    
                    // Check if voter has already voted
                    if self.votes[proposalID] == nil {
                        self.votes[proposalID] = {}
                    }
                    
                    // Remove previous vote if exists
                    if let previousVote = self.votes[proposalID]![voter] {
                        // Subtract previous vote from totals
                        switch previousVote.voteType {
                            case VoteType.Yes:
                                self.proposals[proposalID]!.yesVotes = self.proposals[proposalID]!.yesVotes - previousVote.votingPower
                            case VoteType.No:
                                self.proposals[proposalID]!.noVotes = self.proposals[proposalID]!.noVotes - previousVote.votingPower
                            case VoteType.Abstain:
                                self.proposals[proposalID]!.abstainVotes = self.proposals[proposalID]!.abstainVotes - previousVote.votingPower
                        }
                    }
                    
                    // Create new vote
                    let vote = Vote(
                        proposalID: proposalID,
                        voter: voter,
                        voteType: voteType,
                        votingPower: stakeholder.votingPower
                    )
                    
                    self.votes[proposalID]![voter] = vote
                    
                    // Add vote to totals
                    switch voteType {
                        case VoteType.Yes:
                            self.proposals[proposalID]!.yesVotes = self.proposals[proposalID]!.yesVotes + vote.votingPower
                        case VoteType.No:
                            self.proposals[proposalID]!.noVotes = self.proposals[proposalID]!.noVotes + vote.votingPower
                        case VoteType.Abstain:
                            self.proposals[proposalID]!.abstainVotes = self.proposals[proposalID]!.abstainVotes + vote.votingPower
                    }
                    
                    // Update stakeholder last vote time
                    self.stakeholders[voter]!.lastVoteAt = getCurrentBlock().timestamp
                    
                    emit VoteCast(
                        proposalID: proposalID,
                        voter: voter,
                        voteType: voteType,
                        votingPower: vote.votingPower
                    )
                    
                    return true
                }
            }
            return false
        }
        
        // Execute a proposal
        pub fun executeProposal(proposalID: UInt64): Bool {
            if let proposal = self.proposals[proposalID] {
                assert(proposal.status == ProposalStatus.Passed, message: "Proposal has not passed")
                assert(getCurrentBlock().timestamp >= proposal.votingEndTime + self.settings.executionDelay, message: "Execution delay not met")
                
                // Check if proposal has enough votes to pass
                let totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes
                let quorumMet = totalVotes >= (self.totalVotingPower * proposal.quorumRequired / 100.0)
                let majorityYes = proposal.yesVotes > proposal.noVotes
                
                if quorumMet && majorityYes {
                    // Mark proposal as executed
                    self.proposals[proposalID]!.status = ProposalStatus.Executed
                    self.proposals[proposalID]!.executionTime = getCurrentBlock().timestamp
                    
                    emit ProposalExecuted(
                        proposalID: proposalID,
                        executionTime: getCurrentBlock().timestamp
                    )
                    
                    return true
                } else {
                    // Mark proposal as rejected
                    self.proposals[proposalID]!.status = ProposalStatus.Rejected
                    
                    emit ProposalRejected(
                        proposalID: proposalID,
                        reason: "Insufficient quorum or majority"
                    )
                    
                    return false
                }
            }
            return false
        }
        
        // Get proposal details
        pub fun getProposal(proposalID: UInt64): &Proposal? {
            return &self.proposals[proposalID]
        }
        
        // Get active proposals
        pub fun getActiveProposals(): [UInt64] {
            let activeProposals: [UInt64] = []
            for proposalID in self.proposals.keys {
                if let proposal = self.proposals[proposalID] {
                    if proposal.status == ProposalStatus.Active {
                        activeProposals.append(proposalID)
                    }
                }
            }
            return activeProposals
        }
        
        // Get stakeholder details
        pub fun getStakeholder(address: Address): &Stakeholder? {
            return &self.stakeholders[address]
        }
        
        // Get voting results for a proposal
        pub fun getVotingResults(proposalID: UInt64): (UFix64, UFix64, UFix64, UFix64)? {
            if let proposal = self.proposals[proposalID] {
                let totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes
                return (proposal.yesVotes, proposal.noVotes, proposal.abstainVotes, totalVotes)
            }
            return nil
        }
        
        // Update governance settings (admin only)
        pub fun updateSettings(
            minVotingDuration: UFix64?,
            maxVotingDuration: UFix64?,
            defaultQuorum: UFix64?,
            minProposalDeposit: UFix64?,
            executionDelay: UFix64?,
            emergencyThreshold: UFix64?
        ) {
            // In a real implementation, this would require admin privileges
            if minVotingDuration != nil {
                self.settings.minVotingDuration = minVotingDuration!
            }
            if maxVotingDuration != nil {
                self.settings.maxVotingDuration = maxVotingDuration!
            }
            if defaultQuorum != nil {
                self.settings.defaultQuorum = defaultQuorum!
            }
            if minProposalDeposit != nil {
                self.settings.minProposalDeposit = minProposalDeposit!
            }
            if executionDelay != nil {
                self.settings.executionDelay = executionDelay!
            }
            if emergencyThreshold != nil {
                self.settings.emergencyThreshold = emergencyThreshold!
            }
            
            emit SettingsUpdated(settings: self.settings)
        }
        
        // Emergency mode functions
        pub fun activateEmergencyMode(proposalID: UInt64): Bool {
            if let proposal = self.proposals[proposalID] {
                if proposal.proposalType == ProposalType.EmergencyAction {
                    let totalVotes = proposal.yesVotes + proposal.noVotes + proposal.abstainVotes
                    let emergencyThreshold = self.totalVotingPower * self.settings.emergencyThreshold / 100.0
                    
                    if totalVotes >= emergencyThreshold && proposal.yesVotes > proposal.noVotes {
                        self.isEmergencyMode = true
                        emit EmergencyModeActivated(proposalID: proposalID)
                        return true
                    }
                }
            }
            return false
        }
        
        pub fun deactivateEmergencyMode(): Bool {
            if self.isEmergencyMode {
                self.isEmergencyMode = false
                emit EmergencyModeDeactivated()
                return true
            }
            return false
        }
    }
    
    // Events
    pub event StakeholderRegistered(
        address: Address,
        votingPower: UFix64,
        propertyCount: UInt32
    )
    
    pub event StakeholderPowerUpdated(
        address: Address,
        oldPower: UFix64,
        newPower: UFix64
    )
    
    pub event ProposalCreated(
        proposalID: UInt64,
        title: String,
        proposer: Address,
        proposalType: ProposalType,
        votingEndTime: UFix64
    )
    
    pub event VoteCast(
        proposalID: UInt64,
        voter: Address,
        voteType: VoteType,
        votingPower: UFix64
    )
    
    pub event ProposalExecuted(
        proposalID: UInt64,
        executionTime: UFix64
    )
    
    pub event ProposalRejected(
        proposalID: UInt64,
        reason: String
    )
    
    pub event SettingsUpdated(
        settings: GovernanceSettings
    )
    
    pub event EmergencyModeActivated(
        proposalID: UInt64
    )
    
    pub event EmergencyModeDeactivated()
    
    // Global Variables
    pub var governance: &GovernanceCollection?
    
    init() {
        let governance <- create GovernanceCollection()
        self.governance = &governance as &GovernanceCollection
    }
    
    // Create governance collection
    pub fun createGovernanceCollection(): @GovernanceCollection {
        return <-create GovernanceCollection()
    }
    
    // Public functions that delegate to the governance collection
    pub fun registerStakeholder(
        address: Address,
        propertyCollection: &PropertyNFT.Collection
    ): Bool {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.registerStakeholder(address: address, propertyCollection: propertyCollection)
    }
    
    pub fun createProposal(
        title: String,
        description: String,
        proposer: Address,
        proposalType: ProposalType,
        votingDuration: UFix64,
        quorumRequired: UFix64?,
        executionData: String?,
        targetContract: Address?
    ): UInt64 {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.createProposal(
            title: title,
            description: description,
            proposer: proposer,
            proposalType: proposalType,
            votingDuration: votingDuration,
            quorumRequired: quorumRequired,
            executionData: executionData,
            targetContract: targetContract
        )
    }
    
    pub fun castVote(
        proposalID: UInt64,
        voter: Address,
        voteType: VoteType
    ): Bool {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.castVote(proposalID: proposalID, voter: voter, voteType: voteType)
    }
    
    pub fun executeProposal(proposalID: UInt64): Bool {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.executeProposal(proposalID: proposalID)
    }
    
    pub fun getProposal(proposalID: UInt64): &Proposal? {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.getProposal(proposalID: proposalID)
    }
    
    pub fun getActiveProposals(): [UInt64] {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.getActiveProposals()
    }
    
    pub fun getStakeholder(address: Address): &Stakeholder? {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.getStakeholder(address: address)
    }
    
    pub fun getVotingResults(proposalID: UInt64): (UFix64, UFix64, UFix64, UFix64)? {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.getVotingResults(proposalID: proposalID)
    }
    
    pub fun getTotalVotingPower(): UFix64 {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return self.governance!.totalVotingPower
    }
    
    pub fun getGovernanceSettings(): &GovernanceSettings {
        pre {
            self.governance != nil: "Governance not initialized"
        }
        return &self.governance!.settings
    }
}
