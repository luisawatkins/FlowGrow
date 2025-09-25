import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

/// BrokerageRegistry - Manages real estate brokerages and their agents
/// This contract handles brokerage registration, verification, and management
access(all) contract BrokerageRegistry {
    
    // Brokerage NFT Resource
    access(all) resource Brokerage: NonFungibleToken.INFT, MetadataViews.Resolver {
        
        // Brokerage metadata
        access(all) let id: UInt64
        access(all) let name: String
        access(all) let description: String
        access(all) let logo: String?
        access(all) let website: String?
        access(all) let phone: String?
        access(all) let email: String?
        access(all) let address: BrokerageAddress
        access(all) let licenseNumber: String
        access(all) let licenseState: String
        access(all) let isVerified: Bool
        access(all) let isActive: Bool
        access(all) let stats: BrokerageStats
        access(all) let createdAt: UFix64
        access(all) let updatedAt: UFix64

        init(
            id: UInt64,
            name: String,
            description: String,
            logo: String?,
            website: String?,
            phone: String?,
            email: String?,
            address: BrokerageAddress,
            licenseNumber: String,
            licenseState: String,
            stats: BrokerageStats
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.logo = logo
            self.website = website
            self.phone = phone
            self.email = email
            self.address = address
            self.licenseNumber = licenseNumber
            self.licenseState = licenseState
            self.isVerified = false
            self.isActive = true
            self.stats = stats
            self.createdAt = getCurrentBlock().timestamp
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Update brokerage profile
        access(all) fun updateProfile(
            name: String,
            description: String,
            logo: String?,
            website: String?,
            phone: String?,
            email: String?
        ) {
            self.name = name
            self.description = description
            self.logo = logo
            self.website = website
            self.phone = phone
            self.email = email
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Update brokerage stats
        access(all) fun updateStats(newStats: BrokerageStats) {
            self.stats = newStats
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Verify brokerage
        access(all) fun verify() {
            self.isVerified = true
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Unverify brokerage
        access(all) fun unverify() {
            self.isVerified = false
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Deactivate brokerage
        access(all) fun deactivate() {
            self.isActive = false
            self.updatedAt = getCurrentBlock().timestamp
        }

        // Activate brokerage
        access(all) fun activate() {
            self.isActive = true
            self.updatedAt = getCurrentBlock().timestamp
        }

        // MetadataViews implementation
        access(all) fun getViews(): [Type] {
            return [Type<BrokerageMetadataView>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<BrokerageMetadataView>():
                    return BrokerageMetadataView(
                        id: self.id,
                        name: self.name,
                        description: self.description,
                        logo: self.logo,
                        website: self.website,
                        phone: self.phone,
                        email: self.email,
                        address: self.address,
                        licenseNumber: self.licenseNumber,
                        licenseState: self.licenseState,
                        isVerified: self.isVerified,
                        isActive: self.isActive,
                        stats: self.stats,
                        createdAt: self.createdAt,
                        updatedAt: self.updatedAt
                    )
                default:
                    return nil
            }
        }
    }

    // Brokerage Address struct
    access(all) struct BrokerageAddress {
        access(all) let street: String
        access(all) let city: String
        access(all) let state: String
        access(all) let zipCode: String
        access(all) let country: String

        init(
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        ) {
            self.street = street
            self.city = city
            self.state = state
            self.zipCode = zipCode
            self.country = country
        }
    }

    // Brokerage Stats struct
    access(all) struct BrokerageStats {
        access(all) let totalAgents: UInt32
        access(all) let totalSales: UInt32
        access(all) let totalSalesValue: UFix64
        access(all) let averageAgentRating: UFix64
        access(all) let marketShare: UFix64
        access(all) let activeListings: UInt32
        access(all) let pendingSales: UInt32

        init(
            totalAgents: UInt32,
            totalSales: UInt32,
            totalSalesValue: UFix64,
            averageAgentRating: UFix64,
            marketShare: UFix64,
            activeListings: UInt32,
            pendingSales: UInt32
        ) {
            self.totalAgents = totalAgents
            self.totalSales = totalSales
            self.totalSalesValue = totalSalesValue
            self.averageAgentRating = averageAgentRating
            self.marketShare = marketShare
            self.activeListings = activeListings
            self.pendingSales = pendingSales
        }
    }

    // Brokerage Metadata View
    access(all) struct BrokerageMetadataView {
        access(all) let id: UInt64
        access(all) let name: String
        access(all) let description: String
        access(all) let logo: String?
        access(all) let website: String?
        access(all) let phone: String?
        access(all) let email: String?
        access(all) let address: BrokerageAddress
        access(all) let licenseNumber: String
        access(all) let licenseState: String
        access(all) let isVerified: Bool
        access(all) let isActive: Bool
        access(all) let stats: BrokerageStats
        access(all) let createdAt: UFix64
        access(all) let updatedAt: UFix64
    }

    // Brokerage Collection Resource
    access(all) resource BrokerageCollection {
        access(all) var ownedBrokerages: @{UInt64: Brokerage}

        init() {
            self.ownedBrokerages <- {}
        }

        // Deposit a brokerage
        access(all) fun deposit(token: @Brokerage) {
            let id = token.id
            let oldToken <- self.ownedBrokerages[id] <- token
            destroy oldToken
        }

        // Get a brokerage by ID
        access(all) fun getBrokerage(id: UInt64): &Brokerage? {
            return &self.ownedBrokerages[id] as &Brokerage?
        }

        // Get all brokerage IDs
        access(all) fun getIDs(): [UInt64] {
            return self.ownedBrokerages.keys
        }

        // Withdraw a brokerage
        access(all) fun withdraw(withdrawID: UInt64): @Brokerage {
            let token <- self.ownedBrokerages.remove(key: withdrawID)
                ?? panic("Brokerage not found in collection")
            return <-token
        }

        // Get count of brokerages
        access(all) fun getCount(): UInt32 {
            return self.ownedBrokerages.length
        }

        destroy() {
            destroy self.ownedBrokerages
        }
    }

    // Brokerage Collection Public
    access(all) resource interface BrokerageCollectionPublic {
        access(all) fun deposit(token: @Brokerage)
        access(all) fun getBrokerage(id: UInt64): &Brokerage?
        access(all) fun getIDs(): [UInt64]
        access(all) fun withdraw(withdrawID: UInt64): @Brokerage
        access(all) fun getCount(): UInt32
    }

    // Brokerage Collection Provider
    access(all) resource BrokerageCollectionProvider {
        access(all) fun createEmptyCollection(): @BrokerageCollection {
            return <-create BrokerageCollection()
        }
    }

    // Contract state
    access(all) var totalSupply: UInt64
    access(all) var nextBrokerageID: UInt64
    access(all) var brokerages: @{UInt64: Brokerage}
    access(all) var brokerageCollections: @{Address: BrokerageCollection}

    // Events
    access(all) event BrokerageCreated(id: UInt64, name: String, licenseNumber: String)
    access(all) event BrokerageVerified(id: UInt64)
    access(all) event BrokerageUnverified(id: UInt64)
    access(all) event BrokerageDeactivated(id: UInt64)
    access(all) event BrokerageActivated(id: UInt64)
    access(all) event BrokerageProfileUpdated(id: UInt64)
    access(all) event BrokerageStatsUpdated(id: UInt64)

    init() {
        self.totalSupply = 0
        self.nextBrokerageID = 1
        self.brokerages <- {}
        self.brokerageCollections <- {}

        // Create the collection provider
        let provider <- create BrokerageCollectionProvider()
        self.account.save(<-provider, to: /storage/BrokerageCollectionProvider)

        // Create the public capability
        self.account.link<&BrokerageCollectionProvider{BrokerageCollectionProvider}>(
            /public/BrokerageCollectionProvider,
            target: /storage/BrokerageCollectionProvider
        )

        // Create the public capability for the collection
        self.account.link<&BrokerageCollection{BrokerageCollectionPublic}>(
            /public/BrokerageCollection,
            target: /storage/BrokerageCollection
        )
    }

    // Create a new brokerage
    access(all) fun createBrokerage(
        name: String,
        description: String,
        logo: String?,
        website: String?,
        phone: String?,
        email: String?,
        address: BrokerageAddress,
        licenseNumber: String,
        licenseState: String,
        stats: BrokerageStats
    ): @Brokerage {
        let id = self.nextBrokerageID
        self.nextBrokerageID = self.nextBrokerageID + 1
        self.totalSupply = self.totalSupply + 1

        let brokerage <- create Brokerage(
            id: id,
            name: name,
            description: description,
            logo: logo,
            website: website,
            phone: phone,
            email: email,
            address: address,
            licenseNumber: licenseNumber,
            licenseState: licenseState,
            stats: stats
        )

        self.brokerages[id] <-! brokerage

        emit BrokerageCreated(id: id, name: name, licenseNumber: licenseNumber)

        return <-brokerage
    }

    // Get brokerage by ID
    access(all) fun getBrokerage(id: UInt64): &Brokerage? {
        return &self.brokerages[id] as &Brokerage?
    }

    // Get all brokerages
    access(all) fun getAllBrokerages(): [&Brokerage] {
        var brokerages: [&Brokerage] = []
        for brokerage in self.brokerages.values {
            brokerages.append(&brokerage)
        }
        return brokerages
    }

    // Get verified brokerages
    access(all) fun getVerifiedBrokerages(): [&Brokerage] {
        var brokerages: [&Brokerage] = []
        for brokerage in self.brokerages.values {
            if brokerage.isVerified && brokerage.isActive {
                brokerages.append(&brokerage)
            }
        }
        return brokerages
    }

    // Get brokerages by state
    access(all) fun getBrokeragesByState(state: String): [&Brokerage] {
        var brokerages: [&Brokerage] = []
        for brokerage in self.brokerages.values {
            if brokerage.address.state == state && brokerage.isActive {
                brokerages.append(&brokerage)
            }
        }
        return brokerages
    }

    // Get brokerages by city
    access(all) fun getBrokeragesByCity(city: String): [&Brokerage] {
        var brokerages: [&Brokerage] = []
        for brokerage in self.brokerages.values {
            if brokerage.address.city == city && brokerage.isActive {
                brokerages.append(&brokerage)
            }
        }
        return brokerages
    }

    // Get total supply
    access(all) fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }

    // Get next brokerage ID
    access(all) fun getNextBrokerageID(): UInt64 {
        return self.nextBrokerageID
    }
}
