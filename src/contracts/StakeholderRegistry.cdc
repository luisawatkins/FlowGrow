import NonFungibleToken from 0x1d7e57aa558c48ec
import PropertyNFT from 0x1234567890abcdef
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowGrow Stakeholder Registry Contract
/// This contract manages stakeholder registration and verification for governance
pub contract StakeholderRegistry {
    
    // Stakeholder Status Enum
    pub enum StakeholderStatus {
        case Pending
        case Active
        case Suspended
        case Revoked
    }
    
    // Verification Level Enum
    pub enum VerificationLevel {
        case Basic
        case Verified
        case Premium
        case Institutional
    }
    
    // Stakeholder Profile Structure
    pub struct StakeholderProfile {
        pub let address: Address
        pub let name: String?
        pub let email: String?
        pub let organization: String?
        pub let status: StakeholderStatus
        pub let verificationLevel: VerificationLevel
        pub let votingPower: UFix64
        pub let propertyCount: UInt32
        pub let totalPropertyValue: UFix64
        pub let reputationScore: UFix64
        pub let joinedAt: UFix64
        pub let lastActiveAt: UFix64
        pub let verificationDate: UFix64?
        pub let kycCompleted: Bool
        pub let amlCompleted: Bool
        
        init(
            address: Address,
            name: String?,
            email: String?,
            organization: String?
        ) {
            self.address = address
            self.name = name
            self.email = email
            self.organization = organization
            self.status = StakeholderStatus.Pending
            self.verificationLevel = VerificationLevel.Basic
            self.votingPower = 0.0
            self.propertyCount = 0
            self.totalPropertyValue = 0.0
            self.reputationScore = 0.0
            self.joinedAt = getCurrentBlock().timestamp
            self.lastActiveAt = getCurrentBlock().timestamp
            self.verificationDate = nil
            self.kycCompleted = false
            self.amlCompleted = false
        }
    }
    
    // Property Ownership Record
    pub struct PropertyOwnership {
        pub let propertyID: UInt64
        pub let owner: Address
        pub let ownershipPercentage: UFix64
        pub let acquiredAt: UFix64
        pub let acquisitionPrice: UFix64
        pub let isActive: Bool
        
        init(
            propertyID: UInt64,
            owner: Address,
            ownershipPercentage: UFix64,
            acquisitionPrice: UFix64
        ) {
            self.propertyID = propertyID
            self.owner = owner
            self.ownershipPercentage = ownershipPercentage
            self.acquiredAt = getCurrentBlock().timestamp
            self.acquisitionPrice = acquisitionPrice
            self.isActive = true
        }
    }
    
    // Voting Power Calculation Rules
    pub struct VotingPowerRules {
        pub let baseVotingPower: UFix64
        pub let propertyValueMultiplier: UFix64
        pub let reputationMultiplier: UFix64
        pub let verificationBonus: UFix64
        pub let maxVotingPower: UFix64
        pub let minVotingPower: UFix64
        
        init() {
            self.baseVotingPower = 1.0
            self.propertyValueMultiplier = 1.0 // 1 vote per FLOW of property value
            self.reputationMultiplier = 1.0
            self.verificationBonus = 0.0
            self.maxVotingPower = 10000.0
            self.minVotingPower = 1.0
        }
    }
    
    // Registry Collection Resource
    pub resource RegistryCollection {
        pub var stakeholders: {Address: StakeholderProfile}
        pub var propertyOwnership: {UInt64: {Address: PropertyOwnership}} // propertyID -> owner -> ownership
        pub var votingPowerRules: VotingPowerRules
        pub var totalRegisteredStakeholders: UInt32
        pub var totalVotingPower: UFix64
        pub var verificationThresholds: {VerificationLevel: UFix64}
        
        init() {
            self.stakeholders = {}
            self.propertyOwnership = {}
            self.votingPowerRules = VotingPowerRules()
            self.totalRegisteredStakeholders = 0
            self.totalVotingPower = 0.0
            self.verificationThresholds = {
                VerificationLevel.Basic: 0.0,
                VerificationLevel.Verified: 100.0,
                VerificationLevel.Premium: 1000.0,
                VerificationLevel.Institutional: 10000.0
            }
        }
        
        // Register a new stakeholder
        pub fun registerStakeholder(
            address: Address,
            name: String?,
            email: String?,
            organization: String?
        ): Bool {
            // Check if stakeholder already exists
            if self.stakeholders[address] != nil {
                return false
            }
            
            let profile = StakeholderProfile(
                address: address,
                name: name,
                email: email,
                organization: organization
            )
            
            self.stakeholders[address] = profile
            self.totalRegisteredStakeholders = self.totalRegisteredStakeholders + 1
            
            emit StakeholderRegistered(
                address: address,
                name: name,
                organization: organization
            )
            
            return true
        }
        
        // Update stakeholder profile
        pub fun updateStakeholderProfile(
            address: Address,
            name: String?,
            email: String?,
            organization: String?
        ): Bool {
            if let stakeholder = self.stakeholders[address] {
                // Create updated profile
                let updatedProfile = StakeholderProfile(
                    address: address,
                    name: name ?? stakeholder.name,
                    email: email ?? stakeholder.email,
                    organization: organization ?? stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = stakeholder.status
                updatedProfile.verificationLevel = stakeholder.verificationLevel
                updatedProfile.votingPower = stakeholder.votingPower
                updatedProfile.propertyCount = stakeholder.propertyCount
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                updatedProfile.reputationScore = stakeholder.reputationScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = stakeholder.verificationDate
                updatedProfile.kycCompleted = stakeholder.kycCompleted
                updatedProfile.amlCompleted = stakeholder.amlCompleted
                
                self.stakeholders[address] = updatedProfile
                
                emit StakeholderProfileUpdated(
                    address: address,
                    name: name,
                    organization: organization
                )
                
                return true
            }
            return false
        }
        
        // Verify stakeholder
        pub fun verifyStakeholder(
            address: Address,
            verificationLevel: VerificationLevel,
            kycCompleted: Bool,
            amlCompleted: Bool
        ): Bool {
            if let stakeholder = self.stakeholders[address] {
                // Check if stakeholder meets verification requirements
                let requiredValue = self.verificationThresholds[verificationLevel] ?? 0.0
                if stakeholder.totalPropertyValue < requiredValue {
                    return false
                }
                
                // Update stakeholder verification
                let updatedProfile = StakeholderProfile(
                    address: address,
                    name: stakeholder.name,
                    email: stakeholder.email,
                    organization: stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = StakeholderStatus.Active
                updatedProfile.verificationLevel = verificationLevel
                updatedProfile.votingPower = stakeholder.votingPower
                updatedProfile.propertyCount = stakeholder.propertyCount
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                updatedProfile.reputationScore = stakeholder.reputationScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = getCurrentBlock().timestamp
                updatedProfile.kycCompleted = kycCompleted
                updatedProfile.amlCompleted = amlCompleted
                
                self.stakeholders[address] = updatedProfile
                
                emit StakeholderVerified(
                    address: address,
                    verificationLevel: verificationLevel,
                    kycCompleted: kycCompleted,
                    amlCompleted: amlCompleted
                )
                
                return true
            }
            return false
        }
        
        // Record property ownership
        pub fun recordPropertyOwnership(
            propertyID: UInt64,
            owner: Address,
            ownershipPercentage: UFix64,
            acquisitionPrice: UFix64
        ): Bool {
            // Validate ownership percentage
            assert(ownershipPercentage > 0.0 && ownershipPercentage <= 100.0, message: "Invalid ownership percentage")
            
            // Check if stakeholder exists
            if let stakeholder = self.stakeholders[owner] {
                // Initialize property ownership mapping if needed
                if self.propertyOwnership[propertyID] == nil {
                    self.propertyOwnership[propertyID] = {}
                }
                
                // Record ownership
                let ownership = PropertyOwnership(
                    propertyID: propertyID,
                    owner: owner,
                    ownershipPercentage: ownershipPercentage,
                    acquisitionPrice: acquisitionPrice
                )
                
                self.propertyOwnership[propertyID]![owner] = ownership
                
                // Update stakeholder property count and value
                let updatedProfile = StakeholderProfile(
                    address: owner,
                    name: stakeholder.name,
                    email: stakeholder.email,
                    organization: stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = stakeholder.status
                updatedProfile.verificationLevel = stakeholder.verificationLevel
                updatedProfile.votingPower = stakeholder.votingPower
                updatedProfile.propertyCount = stakeholder.propertyCount + 1
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue + acquisitionPrice
                updatedProfile.reputationScore = stakeholder.reputationScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = stakeholder.verificationDate
                updatedProfile.kycCompleted = stakeholder.kycCompleted
                updatedProfile.amlCompleted = stakeholder.amlCompleted
                
                self.stakeholders[owner] = updatedProfile
                
                // Recalculate voting power
                self.recalculateVotingPower(address: owner)
                
                emit PropertyOwnershipRecorded(
                    propertyID: propertyID,
                    owner: owner,
                    ownershipPercentage: ownershipPercentage,
                    acquisitionPrice: acquisitionPrice
                )
                
                return true
            }
            return false
        }
        
        // Remove property ownership
        pub fun removePropertyOwnership(
            propertyID: UInt64,
            owner: Address
        ): Bool {
            if let stakeholder = self.stakeholders[owner] {
                if let ownership = self.propertyOwnership[propertyID]?[owner] {
                    // Remove ownership record
                    self.propertyOwnership[propertyID]![owner] = nil
                    
                    // Update stakeholder property count and value
                    let updatedProfile = StakeholderProfile(
                        address: owner,
                        name: stakeholder.name,
                        email: stakeholder.email,
                        organization: stakeholder.organization
                    )
                    
                    // Copy over existing data
                    updatedProfile.status = stakeholder.status
                    updatedProfile.verificationLevel = stakeholder.verificationLevel
                    updatedProfile.votingPower = stakeholder.votingPower
                    updatedProfile.propertyCount = stakeholder.propertyCount - 1
                    updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue - ownership.acquisitionPrice
                    updatedProfile.reputationScore = stakeholder.reputationScore
                    updatedProfile.joinedAt = stakeholder.joinedAt
                    updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                    updatedProfile.verificationDate = stakeholder.verificationDate
                    updatedProfile.kycCompleted = stakeholder.kycCompleted
                    updatedProfile.amlCompleted = stakeholder.amlCompleted
                    
                    self.stakeholders[owner] = updatedProfile
                    
                    // Recalculate voting power
                    self.recalculateVotingPower(address: owner)
                    
                    emit PropertyOwnershipRemoved(
                        propertyID: propertyID,
                        owner: owner
                    )
                    
                    return true
                }
            }
            return false
        }
        
        // Calculate voting power for a stakeholder
        pub fun calculateVotingPower(address: Address): UFix64 {
            if let stakeholder = self.stakeholders[address] {
                var votingPower = self.votingPowerRules.baseVotingPower
                
                // Add property value based voting power
                let propertyValuePower = stakeholder.totalPropertyValue * self.votingPowerRules.propertyValueMultiplier
                votingPower = votingPower + propertyValuePower
                
                // Add reputation based voting power
                let reputationPower = stakeholder.reputationScore * self.votingPowerRules.reputationMultiplier
                votingPower = votingPower + reputationPower
                
                // Add verification bonus
                switch stakeholder.verificationLevel {
                    case VerificationLevel.Basic:
                        votingPower = votingPower + 0.0
                    case VerificationLevel.Verified:
                        votingPower = votingPower + 10.0
                    case VerificationLevel.Premium:
                        votingPower = votingPower + 50.0
                    case VerificationLevel.Institutional:
                        votingPower = votingPower + 100.0
                }
                
                // Apply min/max limits
                votingPower = max(self.votingPowerRules.minVotingPower, votingPower)
                votingPower = min(self.votingPowerRules.maxVotingPower, votingPower)
                
                return votingPower
            }
            return 0.0
        }
        
        // Recalculate voting power for a stakeholder
        pub fun recalculateVotingPower(address: Address) {
            if let stakeholder = self.stakeholders[address] {
                let oldPower = stakeholder.votingPower
                let newPower = self.calculateVotingPower(address: address)
                
                // Update stakeholder voting power
                let updatedProfile = StakeholderProfile(
                    address: address,
                    name: stakeholder.name,
                    email: stakeholder.email,
                    organization: stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = stakeholder.status
                updatedProfile.verificationLevel = stakeholder.verificationLevel
                updatedProfile.votingPower = newPower
                updatedProfile.propertyCount = stakeholder.propertyCount
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                updatedProfile.reputationScore = stakeholder.reputationScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = stakeholder.verificationDate
                updatedProfile.kycCompleted = stakeholder.kycCompleted
                updatedProfile.amlCompleted = stakeholder.amlCompleted
                
                self.stakeholders[address] = updatedProfile
                
                // Update total voting power
                self.totalVotingPower = self.totalVotingPower - oldPower + newPower
                
                emit VotingPowerUpdated(
                    address: address,
                    oldPower: oldPower,
                    newPower: newPower
                )
            }
        }
        
        // Update reputation score
        pub fun updateReputationScore(
            address: Address,
            scoreChange: UFix64
        ): Bool {
            if let stakeholder = self.stakeholders[address] {
                let newScore = max(0.0, stakeholder.reputationScore + scoreChange)
                
                // Update stakeholder reputation
                let updatedProfile = StakeholderProfile(
                    address: address,
                    name: stakeholder.name,
                    email: stakeholder.email,
                    organization: stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = stakeholder.status
                updatedProfile.verificationLevel = stakeholder.verificationLevel
                updatedProfile.votingPower = stakeholder.votingPower
                updatedProfile.propertyCount = stakeholder.propertyCount
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                updatedProfile.reputationScore = newScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = stakeholder.verificationDate
                updatedProfile.kycCompleted = stakeholder.kycCompleted
                updatedProfile.amlCompleted = stakeholder.amlCompleted
                
                self.stakeholders[address] = updatedProfile
                
                // Recalculate voting power
                self.recalculateVotingPower(address: address)
                
                emit ReputationScoreUpdated(
                    address: address,
                    oldScore: stakeholder.reputationScore,
                    newScore: newScore
                )
                
                return true
            }
            return false
        }
        
        // Get stakeholder profile
        pub fun getStakeholderProfile(address: Address): &StakeholderProfile? {
            return &self.stakeholders[address]
        }
        
        // Get property owners
        pub fun getPropertyOwners(propertyID: UInt64): [Address] {
            let owners: [Address] = []
            if let ownership = self.propertyOwnership[propertyID] {
                for owner in ownership.keys {
                    if let ownershipRecord = ownership[owner] {
                        if ownershipRecord.isActive {
                            owners.append(owner)
                        }
                    }
                }
            }
            return owners
        }
        
        // Get stakeholder properties
        pub fun getStakeholderProperties(address: Address): [UInt64] {
            let properties: [UInt64] = []
            for propertyID in self.propertyOwnership.keys {
                if let ownership = self.propertyOwnership[propertyID] {
                    if let ownershipRecord = ownership[address] {
                        if ownershipRecord.isActive {
                            properties.append(propertyID)
                        }
                    }
                }
            }
            return properties
        }
        
        // Get all stakeholders
        pub fun getAllStakeholders(): [Address] {
            let stakeholders: [Address] = []
            for address in self.stakeholders.keys {
                if let stakeholder = self.stakeholders[address] {
                    if stakeholder.status == StakeholderStatus.Active {
                        stakeholders.append(address)
                    }
                }
            }
            return stakeholders
        }
        
        // Get stakeholders by verification level
        pub fun getStakeholdersByVerificationLevel(level: VerificationLevel): [Address] {
            let stakeholders: [Address] = []
            for address in self.stakeholders.keys {
                if let stakeholder = self.stakeholders[address] {
                    if stakeholder.verificationLevel == level && stakeholder.status == StakeholderStatus.Active {
                        stakeholders.append(address)
                    }
                }
            }
            return stakeholders
        }
        
        // Update voting power rules (admin only)
        pub fun updateVotingPowerRules(
            baseVotingPower: UFix64?,
            propertyValueMultiplier: UFix64?,
            reputationMultiplier: UFix64?,
            verificationBonus: UFix64?,
            maxVotingPower: UFix64?,
            minVotingPower: UFix64?
        ) {
            // In a real implementation, this would require admin privileges
            if baseVotingPower != nil {
                self.votingPowerRules.baseVotingPower = baseVotingPower!
            }
            if propertyValueMultiplier != nil {
                self.votingPowerRules.propertyValueMultiplier = propertyValueMultiplier!
            }
            if reputationMultiplier != nil {
                self.votingPowerRules.reputationMultiplier = reputationMultiplier!
            }
            if verificationBonus != nil {
                self.votingPowerRules.verificationBonus = verificationBonus!
            }
            if maxVotingPower != nil {
                self.votingPowerRules.maxVotingPower = maxVotingPower!
            }
            if minVotingPower != nil {
                self.votingPowerRules.minVotingPower = minVotingPower!
            }
            
            emit VotingPowerRulesUpdated(rules: self.votingPowerRules)
        }
        
        // Suspend stakeholder
        pub fun suspendStakeholder(address: Address, reason: String): Bool {
            if let stakeholder = self.stakeholders[address] {
                let updatedProfile = StakeholderProfile(
                    address: address,
                    name: stakeholder.name,
                    email: stakeholder.email,
                    organization: stakeholder.organization
                )
                
                // Copy over existing data
                updatedProfile.status = StakeholderStatus.Suspended
                updatedProfile.verificationLevel = stakeholder.verificationLevel
                updatedProfile.votingPower = 0.0 // Suspended stakeholders have no voting power
                updatedProfile.propertyCount = stakeholder.propertyCount
                updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                updatedProfile.reputationScore = stakeholder.reputationScore
                updatedProfile.joinedAt = stakeholder.joinedAt
                updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                updatedProfile.verificationDate = stakeholder.verificationDate
                updatedProfile.kycCompleted = stakeholder.kycCompleted
                updatedProfile.amlCompleted = stakeholder.amlCompleted
                
                self.stakeholders[address] = updatedProfile
                
                // Update total voting power
                self.totalVotingPower = self.totalVotingPower - stakeholder.votingPower
                
                emit StakeholderSuspended(
                    address: address,
                    reason: reason
                )
                
                return true
            }
            return false
        }
        
        // Reactivate stakeholder
        pub fun reactivateStakeholder(address: Address): Bool {
            if let stakeholder = self.stakeholders[address] {
                if stakeholder.status == StakeholderStatus.Suspended {
                    let updatedProfile = StakeholderProfile(
                        address: address,
                        name: stakeholder.name,
                        email: stakeholder.email,
                        organization: stakeholder.organization
                    )
                    
                    // Copy over existing data
                    updatedProfile.status = StakeholderStatus.Active
                    updatedProfile.verificationLevel = stakeholder.verificationLevel
                    updatedProfile.votingPower = self.calculateVotingPower(address: address)
                    updatedProfile.propertyCount = stakeholder.propertyCount
                    updatedProfile.totalPropertyValue = stakeholder.totalPropertyValue
                    updatedProfile.reputationScore = stakeholder.reputationScore
                    updatedProfile.joinedAt = stakeholder.joinedAt
                    updatedProfile.lastActiveAt = getCurrentBlock().timestamp
                    updatedProfile.verificationDate = stakeholder.verificationDate
                    updatedProfile.kycCompleted = stakeholder.kycCompleted
                    updatedProfile.amlCompleted = stakeholder.amlCompleted
                    
                    self.stakeholders[address] = updatedProfile
                    
                    // Update total voting power
                    self.totalVotingPower = self.totalVotingPower + updatedProfile.votingPower
                    
                    emit StakeholderReactivated(address: address)
                    
                    return true
                }
            }
            return false
        }
    }
    
    // Events
    pub event StakeholderRegistered(
        address: Address,
        name: String?,
        organization: String?
    )
    
    pub event StakeholderProfileUpdated(
        address: Address,
        name: String?,
        organization: String?
    )
    
    pub event StakeholderVerified(
        address: Address,
        verificationLevel: VerificationLevel,
        kycCompleted: Bool,
        amlCompleted: Bool
    )
    
    pub event PropertyOwnershipRecorded(
        propertyID: UInt64,
        owner: Address,
        ownershipPercentage: UFix64,
        acquisitionPrice: UFix64
    )
    
    pub event PropertyOwnershipRemoved(
        propertyID: UInt64,
        owner: Address
    )
    
    pub event VotingPowerUpdated(
        address: Address,
        oldPower: UFix64,
        newPower: UFix64
    )
    
    pub event ReputationScoreUpdated(
        address: Address,
        oldScore: UFix64,
        newScore: UFix64
    )
    
    pub event VotingPowerRulesUpdated(
        rules: VotingPowerRules
    )
    
    pub event StakeholderSuspended(
        address: Address,
        reason: String
    )
    
    pub event StakeholderReactivated(
        address: Address
    )
    
    // Global Variables
    pub var registry: &RegistryCollection?
    
    init() {
        let registry <- create RegistryCollection()
        self.registry = &registry as &RegistryCollection
    }
    
    // Create registry collection
    pub fun createRegistryCollection(): @RegistryCollection {
        return <-create RegistryCollection()
    }
    
    // Public functions that delegate to the registry collection
    pub fun registerStakeholder(
        address: Address,
        name: String?,
        email: String?,
        organization: String?
    ): Bool {
        pre {
            self.registry != nil: "Registry not initialized"
        }
        return self.registry!.registerStakeholder(
            address: address,
            name: name,
            email: email,
            organization: organization
        )
    }
    
    pub fun getStakeholderProfile(address: Address): &StakeholderProfile? {
        pre {
            self.registry != nil: "Registry not initialized"
        }
        return self.registry!.getStakeholderProfile(address: address)
    }
    
    pub fun getTotalVotingPower(): UFix64 {
        pre {
            self.registry != nil: "Registry not initialized"
        }
        return self.registry!.totalVotingPower
    }
    
    pub fun getTotalRegisteredStakeholders(): UInt32 {
        pre {
            self.registry != nil: "Registry not initialized"
        }
        return self.registry!.totalRegisteredStakeholders
    }
    
    pub fun getAllStakeholders(): [Address] {
        pre {
            self.registry != nil: "Registry not initialized"
        }
        return self.registry!.getAllStakeholders()
    }
}
