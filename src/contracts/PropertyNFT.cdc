import NonFungibleToken from 0x1d7e57aa558c48ec
import MetadataViews from 0x1d7e57aa558c48ec
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowEstate Property NFT Contract
/// This contract manages property NFTs on Flow blockchain
pub contract PropertyNFT: NonFungibleToken, MetadataViews.Resolver {
    
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
        
        init(
            id: UInt64,
            name: String,
            description: String,
            physicalAddress: String,
            squareFootage: UInt32,
            price: UFix64,
            owner: Address,
            imageURL: String?
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
                    return [
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
                        )
                    ]
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
    
    // Mint Function
    pub fun mintProperty(
        name: String,
        description: String,
        physicalAddress: String,
        squareFootage: UInt32,
        price: UFix64,
        owner: Address,
        imageURL: String?
    ): @NFT {
        let nft <- create NFT(
            id: self.nextTokenID,
            name: name,
            description: description,
            physicalAddress: physicalAddress,
            squareFootage: squareFootage,
            price: price,
            owner: owner,
            imageURL: imageURL
        )
        
        self.nextTokenID = self.nextTokenID + 1
        self.totalSupply = self.totalSupply + 1
        
        return <-nft
    }
    
    // Get Total Supply
    pub fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }
    
    // Get Collection
    pub fun getCollection(): &Collection {
        return self.collection ?? panic("Collection not initialized")
    }
}
