import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

/// AgentRegistry - Manages real estate agents and their verification status
/// This contract handles agent registration, verification, and profile management
access(all) contract AgentRegistry {
    
    // Agent NFT Resource
    access(all) resource Agent: NonFungibleToken.INFT, MetadataViews.Resolver {
        
        // Agent metadata
        access(all) let id: UInt64
        access(all) let userId: Address
        access(all) let licenseNumber: String
        access(all) let licenseState: String
        access(all) let licenseExpiry: UFix64
        access(all) let brokerageId: UInt64
        access(all) let brokerageName: String
        access(all) let specialties: [String]
        access(all) let experience: UInt32
        access(all) let rating: UFix64
        access(all) let reviewCount: UInt32
        access(all) let commissionRate: UFix64
        access(all) let isVerified: Bool
        access(all) let isActive: Bool
        access(all) let profile: AgentProfile
        access(all) let stats: AgentStats
        access(all) let createdAt: UFix64
        access(all) let updatedAt: UFix64

        init(
            id: UInt64,
            userId: Address,
            licenseNumber: String,
            licenseState: String,
            licenseExpiry: UFix64,
            brokerageId: UInt64,
            brokerageName: String,
            specialties: [String],
            experience: UInt32,
            commissionRate: UFix64,
            profile: AgentProfile,
            stats: AgentStats
        ) {
            self.id = id
            self.userId = userId
            self.licenseNumber = licenseNumber
            self.licenseState = licenseState
            self.licenseExpiry = licenseExpiry
            self.brokerageId = brokerageId
            self.brokerageName = brokerageName
            self.specialties = specialties
            self.experience = experience
            self.rating = 0.0
            self.reviewCount = 0
            self.commissionRate = commissionRate
            self.isVerified = false
            self.isActive = true
            self.profile = profile
            self.stats = stats
            self.createdAt = getCurrentBlock().timestamp
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Update agent profile
        access(all) fun updateProfile(newProfile: AgentProfile) {
            self.profile = newProfile
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Update agent stats
        access(all) fun updateStats(newStats: AgentStats) {
            self.stats = newStats
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Update rating
        access(all) fun updateRating(newRating: UFix64, newReviewCount: UInt32) {
            self.rating = newRating
            self.reviewCount = newReviewCount
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Verify agent
        access(all) fun verify() {
            self.isVerified = true
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Unverify agent
        access(all) fun unverify() {
            self.isVerified = false
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Deactivate agent
        access(all) fun deactivate() {
            self.isActive = false
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Activate agent
        access(all) fun activate() {
            self.isActive = true
            self.updatedAt = getCurrentBlock().timestamp
        }

        // MetadataViews implementation
        access(all) fun getViews(): [Type] {
            return [Type<AgentMetadataView>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<AgentMetadataView>():
                    return AgentMetadataView(
                        id: self.id,
                        userId: self.userId,
                        licenseNumber: self.licenseNumber,
                        licenseState: self.licenseState,
                        licenseExpiry: self.licenseExpiry,
                        brokerageId: self.brokerageId,
                        brokerageName: self.brokerageName,
                        specialties: self.specialties,
                        experience: self.experience,
                        rating: self.rating,
                        reviewCount: self.reviewCount,
                        commissionRate: self.commissionRate,
                        isVerified: self.isVerified,
                        isActive: self.isActive,
                        profile: self.profile,
                        stats: self.stats,
                        createdAt: self.createdAt,
                        updatedAt: self.updatedAt
                    )
                default:
                    return nil
            }
        }
    }

    // Agent Profile struct
    access(all) struct AgentProfile {
        access(all) let displayName: String
        access(all) let bio: String
        access(all) let avatar: String?
        access(all) let phone: String?
        access(all) let email: String?
        access(all) let website: String?
        access(all) let languages: [String]
        access(all) let serviceAreas: [String]
        access(all) let certifications: [String]
        access(all) let awards: [String]

        init(
            displayName: String,
            bio: String,
            avatar: String?,
            phone: String?,
            email: String?,
            website: String?,
            languages: [String],
            serviceAreas: [String],
            certifications: [String],
            awards: [String]
        ) {
            self.displayName = displayName
            self.bio = bio
            self.avatar = avatar
            self.phone = phone
            self.email = email
            self.website = website
            self.languages = languages
            self.serviceAreas = serviceAreas
            self.certifications = certifications
            self.awards = awards
        }
    }

    // Agent Stats struct
    access(all) struct AgentStats {
        access(all) let totalSales: UInt32
        access(all) let totalSalesValue: UFix64
        access(all) let averageDaysOnMarket: UInt32
        access(all) let clientSatisfactionScore: UInt32
        access(all) let propertiesSold: UInt32
        access(all) let propertiesListed: UInt32
        access(all) let activeListings: UInt32
        access(all) let pendingSales: UInt32
        access(all) let closedSales: UInt32
        access(all) let averageCommission: UFix64
        access(all) let totalCommission: UFix64
        access(all) let lastYearSales: UInt32
        access(all) let lastYearValue: UFix64

        init(
            totalSales: UInt32,
            totalSalesValue: UFix64,
            averageDaysOnMarket: UInt32,
            clientSatisfactionScore: UInt32,
            propertiesSold: UInt32,
            propertiesListed: UInt32,
            activeListings: UInt32,
            pendingSales: UInt32,
            closedSales: UInt32,
            averageCommission: UFix64,
            totalCommission: UFix64,
            lastYearSales: UInt32,
            lastYearValue: UFix64
        ) {
            self.totalSales = totalSales
            self.totalSalesValue = totalSalesValue
            self.averageDaysOnMarket = averageDaysOnMarket
            self.clientSatisfactionScore = clientSatisfactionScore
            self.propertiesSold = propertiesSold
            self.propertiesListed = propertiesListed
            self.activeListings = activeListings
            self.pendingSales = pendingSales
            self.closedSales = closedSales
            self.averageCommission = averageCommission
            self.totalCommission = totalCommission
            self.lastYearSales = lastYearSales
            self.lastYearValue = lastYearValue
        }
    }

    // Agent Metadata View
    access(all) struct AgentMetadataView {
        access(all) let id: UInt64
        access(all) let userId: Address
        access(all) let licenseNumber: String
        access(all) let licenseState: String
        access(all) let licenseExpiry: UFix64
        access(all) let brokerageId: UInt64
        access(all) let brokerageName: String
        access(all) let specialties: [String]
        access(all) let experience: UInt32
        access(all) let rating: UFix64
        access(all) let reviewCount: UInt32
        access(all) let commissionRate: UFix64
        access(all) let isVerified: Bool
        access(all) let isActive: Bool
        access(all) let profile: AgentProfile
        access(all) let stats: AgentStats
        access(all) let createdAt: UFix64
        access(all) let updatedAt: UFix64
    }

    // Agent Collection Resource
    access(all) resource AgentCollection {
        access(all) var ownedAgents: @{UInt64: Agent}

        init() {
            self.ownedAgents <- {}
        }

        // Deposit an agent
        access(all) fun deposit(token: @Agent) {
            let id = token.id
            let oldToken <- self.ownedAgents[id] <- token
            destroy oldToken
        }

        // Get an agent by ID
        access(all) fun getAgent(id: UInt64): &Agent? {
            return &self.ownedAgents[id] as &Agent?
        }

        // Get all agent IDs
        access(all) fun getIDs(): [UInt64] {
            return self.ownedAgents.keys
        }

        // Withdraw an agent
        access(all) fun withdraw(withdrawID: UInt64): @Agent {
            let token <- self.ownedAgents.remove(key: withdrawID)
                ?? panic("Agent not found in collection")
            return <-token
        }

        // Get count of agents
        access(all) fun getCount(): UInt32 {
            return self.ownedAgents.length
        }

        destroy() {
            destroy self.ownedAgents
        }
    }

    // Agent Collection Public
    access(all) resource interface AgentCollectionPublic {
        access(all) fun deposit(token: @Agent)
        access(all) fun getAgent(id: UInt64): &Agent?
        access(all) fun getIDs(): [UInt64]
        access(all) fun withdraw(withdrawID: UInt64): @Agent
        access(all) fun getCount(): UInt32
    }

    // Agent Collection Provider
    access(all) resource AgentCollectionProvider {
        access(all) fun createEmptyCollection(): @AgentCollection {
            return <-create AgentCollection()
        }
    }

    // Contract state
    access(all) var totalSupply: UInt64
    access(all) var nextAgentID: UInt64
    access(all) var agents: @{UInt64: Agent}
    access(all) var agentCollections: @{Address: AgentCollection}

    // Events
    access(all) event AgentCreated(id: UInt64, userId: Address, brokerageId: UInt64)
    access(all) event AgentVerified(id: UInt64)
    access(all) event AgentUnverified(id: UInt64)
    access(all) event AgentDeactivated(id: UInt64)
    access(all) event AgentActivated(id: UInt64)
    access(all) event AgentProfileUpdated(id: UInt64)
    access(all) event AgentStatsUpdated(id: UInt64)
    access(all) event AgentRatingUpdated(id: UInt64, rating: UFix64, reviewCount: UInt32)

    init() {
        self.totalSupply = 0
        self.nextAgentID = 1
        self.agents <- {}
        self.agentCollections <- {}

        // Create the collection provider
        let provider <- create AgentCollectionProvider()
        self.account.save(<-provider, to: /storage/AgentCollectionProvider)

        // Create the public capability
        self.account.link<&AgentCollectionProvider{AgentCollectionProvider}>(
            /public/AgentCollectionProvider,
            target: /storage/AgentCollectionProvider
        )

        // Create the public capability for the collection
        self.account.link<&AgentCollection{AgentCollectionPublic}>(
            /public/AgentCollection,
            target: /storage/AgentCollection
        )
    }

    // Create a new agent
    access(all) fun createAgent(
        userId: Address,
        licenseNumber: String,
        licenseState: String,
        licenseExpiry: UFix64,
        brokerageId: UInt64,
        brokerageName: String,
        specialties: [String],
        experience: UInt32,
        commissionRate: UFix64,
        profile: AgentProfile,
        stats: AgentStats
    ): @Agent {
        let id = self.nextAgentID
        self.nextAgentID = self.nextAgentID + 1
        self.totalSupply = self.totalSupply + 1

        let agent <- create Agent(
            id: id,
            userId: userId,
            licenseNumber: licenseNumber,
            licenseState: licenseState,
            licenseExpiry: licenseExpiry,
            brokerageId: brokerageId,
            brokerageName: brokerageName,
            specialties: specialties,
            experience: experience,
            commissionRate: commissionRate,
            profile: profile,
            stats: stats
        )

        self.agents[id] <-! agent

        emit AgentCreated(id: id, userId: userId, brokerageId: brokerageId)

        return <-agent
    }

    // Get agent by ID
    access(all) fun getAgent(id: UInt64): &Agent? {
        return &self.agents[id] as &Agent?
    }

    // Get all agents
    access(all) fun getAllAgents(): [&Agent] {
        var agents: [&Agent] = []
        for agent in self.agents.values {
            agents.append(&agent)
        }
        return agents
    }

    // Get verified agents
    access(all) fun getVerifiedAgents(): [&Agent] {
        var agents: [&Agent] = []
        for agent in self.agents.values {
            if agent.isVerified && agent.isActive {
                agents.append(&agent)
            }
        }
        return agents
    }

    // Get agents by brokerage
    access(all) fun getAgentsByBrokerage(brokerageId: UInt64): [&Agent] {
        var agents: [&Agent] = []
        for agent in self.agents.values {
            if agent.brokerageId == brokerageId && agent.isActive {
                agents.append(&agent)
            }
        }
        return agents
    }

    // Get agents by specialty
    access(all) fun getAgentsBySpecialty(specialty: String): [&Agent] {
        var agents: [&Agent] = []
        for agent in self.agents.values {
            if agent.specialties.contains(specialty) && agent.isActive {
                agents.append(&agent)
            }
        }
        return agents
    }

    // Get total supply
    access(all) fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }

    // Get next agent ID
    access(all) fun getNextAgentID(): UInt64 {
        return self.nextAgentID
    }
}
