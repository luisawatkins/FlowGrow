import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'

// Configure Flow client
fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'FlowEstate',
  'app.detail.icon': 'https://flowestate.com/icon.png',
})

// Contract addresses (these would be set after deployment)
const CONTRACTS = {
  PropertyNFT: '0x1234567890abcdef',
  PropertyMarketplace: '0xabcdef1234567890',
  NonFungibleToken: '0x1d7e57aa558c48ec',
  MetadataViews: '0x1d7e57aa558c48ec',
  FlowToken: '0x7e60df042a9c0868',
}

// Cadence scripts and transactions
const CADENCE = {
  // Scripts
  getTotalSupply: `
    import PropertyNFT from ${CONTRACTS.PropertyNFT}
    
    pub fun main(): UInt64 {
      return PropertyNFT.getTotalSupply()
    }
  `,
  
  getProperty: `
    import PropertyNFT from ${CONTRACTS.PropertyNFT}
    import MetadataViews from ${CONTRACTS.MetadataViews}
    
    pub fun main(propertyID: UInt64): PropertyNFT.NFT? {
      let collection = PropertyNFT.getCollection()
      return collection.borrowPropertyNFT(id: propertyID)
    }
  `,
  
  getActiveListings: `
    import PropertyMarketplace from ${CONTRACTS.PropertyMarketplace}
    
    pub fun main(): [UInt64] {
      return PropertyMarketplace.getActiveListings()
    }
  `,
  
  // Transactions
  mintProperty: `
    import PropertyNFT from ${CONTRACTS.PropertyNFT}
    import NonFungibleToken from ${CONTRACTS.NonFungibleToken}
    
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
  
  listProperty: `
    import PropertyNFT from ${CONTRACTS.PropertyNFT}
    import PropertyMarketplace from ${CONTRACTS.PropertyMarketplace}
    import NonFungibleToken from ${CONTRACTS.NonFungibleToken}
    
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
  
  buyProperty: `
    import PropertyNFT from ${CONTRACTS.PropertyNFT}
    import PropertyMarketplace from ${CONTRACTS.PropertyMarketplace}
    import NonFungibleToken from ${CONTRACTS.NonFungibleToken}
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from ${CONTRACTS.FlowToken}
    
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
}

// Flow client service
export class FlowClient {
  private user: any = null
  
  constructor() {
    this.initialize()
  }
  
  private async initialize() {
    // Initialize Flow client
    await fcl.authenticate()
    this.user = await fcl.currentUser()
  }
  
  // Authentication
  async authenticate() {
    await fcl.authenticate()
    this.user = await fcl.currentUser()
    return this.user
  }
  
  async unauthenticate() {
    await fcl.unauthenticate()
    this.user = null
  }
  
  async getCurrentUser() {
    return await fcl.currentUser()
  }
  
  // Scripts
  async getTotalSupply(): Promise<number> {
    const result = await fcl.query({
      cadence: CADENCE.getTotalSupply,
    })
    return parseInt(result)
  }
  
  async getProperty(propertyID: number): Promise<any> {
    const result = await fcl.query({
      cadence: CADENCE.getProperty,
      args: (arg, t) => [arg(propertyID, t.UInt64)],
    })
    return result
  }
  
  async getActiveListings(): Promise<number[]> {
    const result = await fcl.query({
      cadence: CADENCE.getActiveListings,
    })
    return result
  }
  
  // Transactions
  async mintProperty(
    name: string,
    description: string,
    physicalAddress: string,
    squareFootage: number,
    price: number,
    imageURL?: string
  ): Promise<string> {
    const transactionId = await fcl.mutate({
      cadence: CADENCE.mintProperty,
      args: (arg, t) => [
        arg(name, t.String),
        arg(description, t.String),
        arg(physicalAddress, t.String),
        arg(squareFootage, t.UInt32),
        arg(price, t.UFix64),
        arg(imageURL || null, t.Optional(t.String)),
      ],
    })
    
    await fcl.tx(transactionId).onceSealed()
    return transactionId
  }
  
  async listProperty(propertyID: number, price: number): Promise<string> {
    const transactionId = await fcl.mutate({
      cadence: CADENCE.listProperty,
      args: (arg, t) => [
        arg(propertyID, t.UInt64),
        arg(price, t.UFix64),
      ],
    })
    
    await fcl.tx(transactionId).onceSealed()
    return transactionId
  }
  
  async buyProperty(listingID: number, sellerAddress: string): Promise<string> {
    const transactionId = await fcl.mutate({
      cadence: CADENCE.buyProperty,
      args: (arg, t) => [
        arg(listingID, t.UInt64),
        arg(sellerAddress, t.Address),
      ],
    })
    
    await fcl.tx(transactionId).onceSealed()
    return transactionId
  }
  
  // Utility functions
  async getTransactionStatus(transactionId: string): Promise<string> {
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction.status
  }
  
  async getTransactionResult(transactionId: string): Promise<any> {
    const transaction = await fcl.tx(transactionId).onceSealed()
    return transaction.result
  }
  
  // Get FlowScan URL
  getFlowScanUrl(transactionId: string): string {
    return `https://testnet.flowscan.org/transaction/${transactionId}`
  }
  
  // Get account URL
  getAccountUrl(address: string): string {
    return `https://testnet.flowscan.org/account/${address}`
  }
}

// Export singleton instance
export const flowClient = new FlowClient()
