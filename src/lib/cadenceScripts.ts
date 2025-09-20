// Cadence Scripts for FlowEstate
// These scripts can be used to interact with the Flow blockchain

export const CADENCE_SCRIPTS = {
  // Get total supply of properties
  getTotalSupply: `
    import PropertyNFT from 0x1234567890abcdef
    
    pub fun main(): UInt64 {
      return PropertyNFT.getTotalSupply()
    }
  `,
  
  // Get property details by ID
  getProperty: `
    import PropertyNFT from 0x1234567890abcdef
    import MetadataViews from 0x1d7e57aa558c48ec
    
    pub fun main(propertyID: UInt64): PropertyNFT.NFT? {
      let collection = PropertyNFT.getCollection()
      return collection.borrowPropertyNFT(id: propertyID)
    }
  `,
  
  // Get all active listings
  getActiveListings: `
    import PropertyMarketplace from 0xabcdef1234567890
    
    pub fun main(): [UInt64] {
      return PropertyMarketplace.getActiveListings()
    }
  `,
  
  // Get marketplace statistics
  getMarketplaceStats: `
    import PropertyMarketplace from 0xabcdef1234567890
    
    pub fun main(): (UInt64, UInt64, UFix64) {
      return PropertyMarketplace.getMarketplaceStats()
    }
  `,
  
  // Get user's property collection
  getUserProperties: `
    import PropertyNFT from 0x1234567890abcdef
    import NonFungibleToken from 0x1d7e57aa558c48ec
    
    pub fun main(userAddress: Address): [UInt64] {
      let account = getAccount(userAddress)
      let collection = account.getCapability<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath)
        .borrow() ?? panic("Could not borrow collection")
      
      return collection.getIDs()
    }
  `,
  
  // Get listing details
  getListing: `
    import PropertyMarketplace from 0xabcdef1234567890
    
    pub fun main(listingID: UInt64): PropertyMarketplace.Listing? {
      return PropertyMarketplace.getListing(listingID: listingID)
    }
  `,
  
  // Get listings by seller
  getListingsBySeller: `
    import PropertyMarketplace from 0xabcdef1234567890
    
    pub fun main(sellerAddress: Address): [UInt64] {
      return PropertyMarketplace.getListingsBySeller(seller: sellerAddress)
    }
  `,
}

export const CADENCE_TRANSACTIONS = {
  // Mint a new property NFT
  mintProperty: `
    import PropertyNFT from 0x1234567890abcdef
    import NonFungibleToken from 0x1d7e57aa558c48ec
    
    transaction(
      name: String,
      description: String,
      physicalAddress: String,
      squareFootage: UInt32,
      price: UFix64,
      imageURL: String?
    ) {
      let collection: &PropertyNFT.Collection{NonFungibleToken.CollectionPublic}
      
      prepare(acct: AuthAccount) {
        self.collection = acct.getCapability<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow collection")
      }
      
      execute {
        let nft <- PropertyNFT.mintProperty(
          name: name,
          description: description,
          physicalAddress: physicalAddress,
          squareFootage: squareFootage,
          price: price,
          owner: self.collection.owner?.address ?? panic("Invalid owner"),
          imageURL: imageURL
        )
        
        self.collection.deposit(token: <-nft)
      }
    }
  `,
  
  // List a property for sale
  listProperty: `
    import PropertyNFT from 0x1234567890abcdef
    import PropertyMarketplace from 0xabcdef1234567890
    import NonFungibleToken from 0x1d7e57aa558c48ec
    
    transaction(propertyID: UInt64, price: UFix64) {
      let collection: &PropertyNFT.Collection{NonFungibleToken.CollectionPublic}
      
      prepare(acct: AuthAccount) {
        self.collection = acct.getCapability<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow collection")
      }
      
      execute {
        PropertyMarketplace.listProperty(
          propertyID: propertyID,
          price: price,
          sellerCollection: self.collection
        )
      }
    }
  `,
  
  // Buy a property
  buyProperty: `
    import PropertyNFT from 0x1234567890abcdef
    import PropertyMarketplace from 0xabcdef1234567890
    import NonFungibleToken from 0x1d7e57aa558c48ec
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    
    transaction(listingID: UInt64, sellerAddress: Address) {
      let buyerCollection: &PropertyNFT.Collection{NonFungibleToken.CollectionPublic}
      let sellerCollection: &PropertyNFT.Collection{NonFungibleToken.CollectionPublic}
      let payment: @FungibleToken.Vault
      
      prepare(acct: AuthAccount) {
        self.buyerCollection = acct.getCapability<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow buyer collection")
        
        self.sellerCollection = getAccount(sellerAddress)
          .getCapability<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow seller collection")
        
        let vault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(FlowToken.ReceiverPath)
          .borrow() ?? panic("Could not borrow Flow token vault")
        self.payment = vault
      }
      
      execute {
        let excess <- PropertyMarketplace.buyProperty(
          listingID: listingID,
          buyerCollection: self.buyerCollection,
          sellerCollection: self.sellerCollection,
          payment: <-self.payment
        )
        
        // Return excess payment to buyer
        if excess.balance > 0.0 {
          let vault = self.buyerCollection.owner?.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(FlowToken.ReceiverPath)
            .borrow() ?? panic("Could not borrow Flow token vault")
          vault.deposit(from: <-excess)
        }
      }
    }
  `,
  
  // Cancel a listing
  cancelListing: `
    import PropertyMarketplace from 0xabcdef1234567890
    
    transaction(listingID: UInt64) {
      prepare(acct: AuthAccount) {
        PropertyMarketplace.cancelListing(listingID: listingID, seller: acct.address)
      }
    }
  `,
  
  // Setup user account for PropertyNFT
  setupAccount: `
    import PropertyNFT from 0x1234567890abcdef
    import NonFungibleToken from 0x1d7e57aa558c48ec
    
    transaction {
      prepare(acct: AuthAccount) {
        if acct.borrow<&PropertyNFT.Collection>(from: PropertyNFT.CollectionStoragePath) == nil {
          let collection <- PropertyNFT.createEmptyCollection()
          acct.save(<-collection, to: PropertyNFT.CollectionStoragePath)
          acct.link<&PropertyNFT.Collection{NonFungibleToken.CollectionPublic}>(PropertyNFT.CollectionPublicPath, target: PropertyNFT.CollectionStoragePath)
        }
      }
    }
  `,
}

// Contract addresses (these would be set after deployment)
export const CONTRACT_ADDRESSES = {
  PropertyNFT: '0x1234567890abcdef',
  PropertyMarketplace: '0xabcdef1234567890',
  NonFungibleToken: '0x1d7e57aa558c48ec',
  MetadataViews: '0x1d7e57aa558c48ec',
  FlowToken: '0x7e60df042a9c0868',
}

// Flow network configuration
export const FLOW_CONFIG = {
  testnet: {
    accessNode: 'https://rest-testnet.onflow.org',
    discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
    flowScan: 'https://testnet.flowscan.org',
  },
  mainnet: {
    accessNode: 'https://rest-mainnet.onflow.org',
    discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
    flowScan: 'https://flowscan.org',
  },
}
