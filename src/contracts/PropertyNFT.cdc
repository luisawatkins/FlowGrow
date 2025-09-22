import NonFungibleToken from 0x1d7e57aa558c48ec
import MetadataViews from 0x1d7e57aa558c48ec
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowEstate Property NFT Contract
/// This contract manages property NFTs on Flow blockchain
pub contract PropertyNFT: NonFungibleToken, MetadataViews.Resolver {
    
    // Location Data Structure
    pub struct LocationData {
        pub let city: String
        pub let state: String
        pub let country: String
        pub let coordinates: Coordinates?
        pub let zipCode: String?
        
        init(
            city: String,
            state: String,
            country: String,
            coordinates: Coordinates?,
            zipCode: String?
        ) {
            self.city = city
            self.state = state
            self.country = country
            self.coordinates = coordinates
            self.zipCode = zipCode
        }
    }
    
    // Coordinates Structure
    pub struct Coordinates {
        pub let latitude: UFix64
        pub let longitude: UFix64
        
        init(latitude: UFix64, longitude: UFix64) {
            self.latitude = latitude
            self.longitude = longitude
        }
    }
    
    // Transaction Record Structure
    pub struct TransactionRecord {
        pub let transactionType: String
        pub let from: Address?
        pub let to: Address?
        pub let price: UFix64?
        pub let timestamp: UFix64
        pub let transactionHash: String?
        
        init(
            transactionType: String,
            from: Address?,
            to: Address?,
            price: UFix64?,
            timestamp: UFix64,
            transactionHash: String?
        ) {
            self.transactionType = transactionType
            self.from = from
            self.to = to
            self.price = price
            self.timestamp = timestamp
            self.transactionHash = transactionHash
        }
    }
    
    // NFT Collection Resource
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let physicalAddress: String
        pub let squareFootage: UInt32
        pub let price: UFix64
        pub let owner: Address
        pub let isListed: Bool
        pub let createdAt: UFix64
        pub let imageURL: String?
        
        // Enhanced property attributes
        pub let bedrooms: UInt32?
        pub let bathrooms: UInt32?
        pub let yearBuilt: UInt32?
        pub let propertyType: String
        pub let features: [String]
        pub let amenities: [String]
        pub let location: LocationData
        pub let transactionHistory: [TransactionRecord]
        pub let isVerified: Bool
        pub let verificationDate: UFix64?
        pub let lastUpdated: UFix64
        
        init(
            id: UInt64,
            name: String,
            description: String,
            physicalAddress: String,
            squareFootage: UInt32,
            price: UFix64,
            owner: Address,
            imageURL: String?,
            bedrooms: UInt32?,
            bathrooms: UInt32?,
            yearBuilt: UInt32?,
            propertyType: String,
            features: [String],
            amenities: [String],
            location: LocationData
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.physicalAddress = physicalAddress
            self.squareFootage = squareFootage
            self.price = price
            self.owner = owner
            self.isListed = false
            self.createdAt = getCurrentBlock().timestamp
            self.imageURL = imageURL
            self.bedrooms = bedrooms
            self.bathrooms = bathrooms
            self.yearBuilt = yearBuilt
            self.propertyType = propertyType
            self.features = features
            self.amenities = amenities
            self.location = location
            self.transactionHistory = []
            self.isVerified = false
            self.verificationDate = nil
            self.lastUpdated = getCurrentBlock().timestamp
        }
        
        // Metadata Views
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Traits>(),
                Type<MetadataViews.Media>(),
                Type<MetadataViews.File>()
            ]
        }
        
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: self.imageURL != nil ? MetadataViews.Media(
                            file: MetadataViews.File(
                                url: self.imageURL!,
                                mediaType: "image/jpeg"
                            ),
                            mediaType: "image/jpeg"
                        ) : nil
                    )
                case Type<MetadataViews.Traits>():
                    var traits: [MetadataViews.Trait] = [
                        MetadataViews.Trait(
                            name: "Physical Address",
                            value: self.physicalAddress
                        ),
                        MetadataViews.Trait(
                            name: "Square Footage",
                            value: self.squareFootage
                        ),
                        MetadataViews.Trait(
                            name: "Price (FLOW)",
                            value: self.price
                        ),
                        MetadataViews.Trait(
                            name: "Owner",
                            value: self.owner
                        ),
                        MetadataViews.Trait(
                            name: "Is Listed",
                            value: self.isListed
                        ),
                        MetadataViews.Trait(
                            name: "Created At",
                            value: self.createdAt
                        ),
                        MetadataViews.Trait(
                            name: "Property Type",
                            value: self.propertyType
                        ),
                        MetadataViews.Trait(
                            name: "City",
                            value: self.location.city
                        ),
                        MetadataViews.Trait(
                            name: "State",
                            value: self.location.state
                        ),
                        MetadataViews.Trait(
                            name: "Country",
                            value: self.location.country
                        ),
                        MetadataViews.Trait(
                            name: "Is Verified",
                            value: self.isVerified
                        )
                    ]
                    
                    if self.bedrooms != nil {
                        traits.append(MetadataViews.Trait(
                            name: "Bedrooms",
                            value: self.bedrooms!
                        ))
                    }
                    
                    if self.bathrooms != nil {
                        traits.append(MetadataViews.Trait(
                            name: "Bathrooms",
                            value: self.bathrooms!
                        ))
                    }
                    
                    if self.yearBuilt != nil {
                        traits.append(MetadataViews.Trait(
                            name: "Year Built",
                            value: self.yearBuilt!
                        ))
                    }
                    
                    if self.location.coordinates != nil {
                        traits.append(MetadataViews.Trait(
                            name: "Latitude",
                            value: self.location.coordinates!.latitude
                        ))
                        traits.append(MetadataViews.Trait(
                            name: "Longitude",
                            value: self.location.coordinates!.longitude
                        ))
                    }
                    
                    return traits
                case Type<MetadataViews.Media>():
                    if self.imageURL != nil {
                        return [
                            MetadataViews.Media(
                                file: MetadataViews.File(
                                    url: self.imageURL!,
                                    mediaType: "image/jpeg"
                                ),
                                mediaType: "image/jpeg"
                            )
                        ]
                    }
                    return []
                case Type<MetadataViews.File>():
                    if self.imageURL != nil {
                        return [
                            MetadataViews.File(
                                url: self.imageURL!,
                                mediaType: "image/jpeg"
                            )
                        ]
                    }
                    return []
                default:
                    return nil
            }
        }
    }
    
    // Collection Resource
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}
        
        init() {
            self.ownedNFTs <- {}
        }
        
        destroy() {
            destroy self.ownedNFTs
        }
        
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let nft <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("NFT not found in collection")
            return <-nft
        }
        
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let nft <- token as! @NFT
            let id = nft.id
            let oldToken <- self.ownedNFTs[id] <- nft
            destroy oldToken
        }
        
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
        
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }
        
        pub fun borrowPropertyNFT(id: UInt64): &NFT {
            return &self.ownedNFTs[id] as &NFT
        }
        
        pub fun getIDsCount(): UInt32 {
            return self.ownedNFTs.length
        }
        
        pub fun getViewResolver(id: UInt64): &MetadataViews.Resolver {
            return &self.ownedNFTs[id] as &MetadataViews.Resolver
        }
        
        // Enhanced property management functions
        pub fun updatePropertyPrice(id: UInt64, newPrice: UFix64) {
            if let nft = &self.ownedNFTs[id] as &NFT {
                // This would require a mutable reference, which isn't available in Cadence
                // In a real implementation, you'd need to restructure the contract
                // For now, we'll add this as a placeholder for future enhancement
            }
        }
        
        pub fun getPropertyDetails(id: UInt64): &NFT? {
            return &self.ownedNFTs[id] as &NFT?
        }
        
        pub fun searchPropertiesByType(propertyType: String): [UInt64] {
            let matchingIDs: [UInt64] = []
            for id in self.ownedNFTs.keys {
                if let nft = &self.ownedNFTs[id] as &NFT {
                    if nft.propertyType == propertyType {
                        matchingIDs.append(id)
                    }
                }
            }
            return matchingIDs
        }
        
        pub fun searchPropertiesByLocation(city: String): [UInt64] {
            let matchingIDs: [UInt64] = []
            for id in self.ownedNFTs.keys {
                if let nft = &self.ownedNFTs[id] as &NFT {
                    if nft.location.city == city {
                        matchingIDs.append(id)
                    }
                }
            }
            return matchingIDs
        }
    }
    
    // Collection Factory
    pub fun createEmptyCollection(): @Collection {
        return <-create Collection()
    }
    
    // Global Variables
    pub var totalSupply: UInt64
    pub var nextTokenID: UInt64
    pub var collection: &Collection?
    
    init() {
        self.totalSupply = 0
        self.nextTokenID = 1
        
        let collection <- create Collection()
        self.collection = &collection as &Collection
    }
    
    // Enhanced Mint Function
    pub fun mintProperty(
        name: String,
        description: String,
        physicalAddress: String,
        squareFootage: UInt32,
        price: UFix64,
        owner: Address,
        imageURL: String?,
        bedrooms: UInt32?,
        bathrooms: UInt32?,
        yearBuilt: UInt32?,
        propertyType: String,
        features: [String],
        amenities: [String],
        location: LocationData
    ): @NFT {
        let nft <- create NFT(
            id: self.nextTokenID,
            name: name,
            description: description,
            physicalAddress: physicalAddress,
            squareFootage: squareFootage,
            price: price,
            owner: owner,
            imageURL: imageURL,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            yearBuilt: yearBuilt,
            propertyType: propertyType,
            features: features,
            amenities: amenities,
            location: location
        )
        
        self.nextTokenID = self.nextTokenID + 1
        self.totalSupply = self.totalSupply + 1
        
        emit PropertyMinted(
            id: nft.id,
            name: name,
            owner: owner,
            propertyType: propertyType,
            location: location
        )
        
        return <-nft
    }
    
    // Verification function (admin only)
    pub fun verifyProperty(propertyID: UInt64, verifier: Address) {
        // In a real implementation, you'd need admin controls
        // This is a placeholder for property verification functionality
        emit PropertyVerified(propertyID: propertyID, verifier: verifier)
    }
    
    // Search functions
    pub fun searchProperties(
        propertyType: String?,
        city: String?,
        minPrice: UFix64?,
        maxPrice: UFix64?,
        minSquareFootage: UInt32?,
        maxSquareFootage: UInt32?
    ): [UInt64] {
        let matchingIDs: [UInt64] = []
        
        for id in self.collection!.ownedNFTs.keys {
            if let nft = &self.collection!.ownedNFTs[id] as &NFT {
                var matches = true
                
                if propertyType != nil && nft.propertyType != propertyType! {
                    matches = false
                }
                
                if city != nil && nft.location.city != city! {
                    matches = false
                }
                
                if minPrice != nil && nft.price < minPrice! {
                    matches = false
                }
                
                if maxPrice != nil && nft.price > maxPrice! {
                    matches = false
                }
                
                if minSquareFootage != nil && nft.squareFootage < minSquareFootage! {
                    matches = false
                }
                
                if maxSquareFootage != nil && nft.squareFootage > maxSquareFootage! {
                    matches = false
                }
                
                if matches {
                    matchingIDs.append(id)
                }
            }
        }
        
        return matchingIDs
    }
    
    // Get Total Supply
    pub fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }
    
    // Get Collection
    pub fun getCollection(): &Collection {
        return self.collection ?? panic("Collection not initialized")
    }
    
    // Events
    pub event PropertyMinted(
        id: UInt64,
        name: String,
        owner: Address,
        propertyType: String,
        location: LocationData
    )
    
    pub event PropertyVerified(
        propertyID: UInt64,
        verifier: Address
    )
    
    pub event PropertyUpdated(
        propertyID: UInt64,
        field: String,
        oldValue: String,
        newValue: String
    )
}
