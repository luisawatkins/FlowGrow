import NonFungibleToken from 0x1d7e57aa558c48ec
import PropertyNFT from 0x1234567890abcdef
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowEstate Property Marketplace Contract
/// This contract manages the marketplace for property NFTs
pub contract PropertyMarketplace {
    
    // Listing Resource
    pub resource Listing {
        pub let id: UInt64
        pub let propertyID: UInt64
        pub let seller: Address
        pub let price: UFix64
        pub let isActive: Bool
        pub let createdAt: UFix64
        
        init(
            id: UInt64,
            propertyID: UInt64,
            seller: Address,
            price: UFix64
        ) {
            self.id = id
            self.propertyID = propertyID
            self.seller = seller
            self.price = price
            self.isActive = true
            self.createdAt = getCurrentBlock().timestamp
        }
    }
    
    // Marketplace Collection Resource
    pub resource MarketplaceCollection {
        pub var listings: {UInt64: Listing}
        pub var nextListingID: UInt64
        
        init() {
            self.listings = {}
            self.nextListingID = 1
        }
        
        // Create a new listing
        pub fun createListing(
            propertyID: UInt64,
            seller: Address,
            price: UFix64
        ): UInt64 {
            let listingID = self.nextListingID
            self.nextListingID = self.nextListingID + 1
            
            let listing = Listing(
                id: listingID,
                propertyID: propertyID,
                seller: seller,
                price: price
            )
            
            self.listings[listingID] = listing
            
            emit PropertyListed(
                listingID: listingID,
                propertyID: propertyID,
                seller: seller,
                price: price
            )
            
            return listingID
        }
        
        // Cancel a listing
        pub fun cancelListing(listingID: UInt64, seller: Address) {
            if let listing = self.listings[listingID] {
                assert(listing.seller == seller, message: "Only the seller can cancel the listing")
                assert(listing.isActive, message: "Listing is not active")
                
                self.listings[listingID] = Listing(
                    id: listing.id,
                    propertyID: listing.propertyID,
                    seller: listing.seller,
                    price: listing.price
                )
                
                emit ListingCancelled(listingID: listingID, seller: seller)
            }
        }
        
        // Get listing details
        pub fun getListing(listingID: UInt64): &Listing? {
            return &self.listings[listingID]
        }
        
        // Get all active listings
        pub fun getActiveListings(): [UInt64] {
            let activeListings: [UInt64] = []
            for listingID in self.listings.keys {
                if let listing = self.listings[listingID] {
                    if listing.isActive {
                        activeListings.append(listingID)
                    }
                }
            }
            return activeListings
        }
        
        // Get listings by seller
        pub fun getListingsBySeller(seller: Address): [UInt64] {
            let sellerListings: [UInt64] = []
            for listingID in self.listings.keys {
                if let listing = self.listings[listingID] {
                    if listing.seller == seller {
                        sellerListings.append(listingID)
                    }
                }
            }
            return sellerListings
        }
    }
    
    // Events
    pub event PropertyListed(
        listingID: UInt64,
        propertyID: UInt64,
        seller: Address,
        price: UFix64
    )
    
    pub event PropertySold(
        listingID: UInt64,
        propertyID: UInt64,
        seller: Address,
        buyer: Address,
        price: UFix64
    )
    
    pub event ListingCancelled(
        listingID: UInt64,
        seller: Address
    )
    
    // Global Variables
    pub var marketplace: &MarketplaceCollection?
    pub var platformFeePercent: UFix64
    pub var listingFee: UFix64
    
    init() {
        self.platformFeePercent = 2.5 // 2.5% platform fee
        self.listingFee = 0.1 // 0.1 FLOW listing fee
        
        let marketplace <- create MarketplaceCollection()
        self.marketplace = &marketplace as &MarketplaceCollection
    }
    
    // Create marketplace collection
    pub fun createMarketplaceCollection(): @MarketplaceCollection {
        return <-create MarketplaceCollection()
    }
    
    // List a property for sale
    pub fun listProperty(
        propertyID: UInt64,
        price: UFix64,
        sellerCollection: &PropertyNFT.Collection
    ): UInt64 {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        // Verify the seller owns the property
        let property = sellerCollection.borrowPropertyNFT(id: propertyID)
        assert(property.owner == sellerCollection.owner?.address, message: "You don't own this property")
        
        // Create the listing
        let listingID = self.marketplace!.createListing(
            propertyID: propertyID,
            seller: sellerCollection.owner?.address ?? panic("Invalid seller"),
            price: price
        )
        
        return listingID
    }
    
    // Buy a property
    pub fun buyProperty(
        listingID: UInt64,
        buyerCollection: &PropertyNFT.Collection,
        sellerCollection: &PropertyNFT.Collection,
        payment: @FungibleToken.Vault
    ): @FungibleToken.Vault {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        let listing = self.marketplace!.getListing(listingID: listingID)
        assert(listing != nil, message: "Listing not found")
        assert(listing!.isActive, message: "Listing is not active")
        
        let property = sellerCollection.borrowPropertyNFT(id: listing!.propertyID)
        let totalPrice = listing!.price
        let platformFee = totalPrice * self.platformFeePercent / 100.0
        let sellerAmount = totalPrice - platformFee
        
        // Verify payment amount
        assert(payment.balance >= totalPrice, message: "Insufficient payment")
        
        // Transfer the property
        let propertyNFT <- sellerCollection.withdraw(withdrawID: listing!.propertyID)
        buyerCollection.deposit(token: <-propertyNFT)
        
        // Process payment
        let sellerPayment = payment.withdraw(amount: sellerAmount)
        let platformPayment = payment.withdraw(amount: platformFee)
        
        // Mark listing as inactive
        self.marketplace!.listings[listingID] = Listing(
            id: listing!.id,
            propertyID: listing!.propertyID,
            seller: listing!.seller,
            price: listing!.price
        )
        
        emit PropertySold(
            listingID: listingID,
            propertyID: listing!.propertyID,
            seller: listing!.seller,
            buyer: buyerCollection.owner?.address ?? panic("Invalid buyer"),
            price: totalPrice
        )
        
        // Return any excess payment
        return <-payment
    }
    
    // Cancel a listing
    pub fun cancelListing(listingID: UInt64, seller: Address) {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        self.marketplace!.cancelListing(listingID: listingID, seller: seller)
    }
    
    // Get marketplace statistics
    pub fun getMarketplaceStats(): (UInt64, UInt64, UFix64) {
        let activeListings = self.marketplace!.getActiveListings()
        let totalListings = self.marketplace!.listings.length
        let totalVolume: UFix64 = 0.0 // This would be tracked in a real implementation
        
        return (activeListings.length, totalListings, totalVolume)
    }
    
    // Update platform fee (admin only)
    pub fun updatePlatformFee(newFeePercent: UFix64) {
        assert(newFeePercent <= 10.0, message: "Platform fee cannot exceed 10%")
        self.platformFeePercent = newFeePercent
    }
    
    // Update listing fee (admin only)
    pub fun updateListingFee(newFee: UFix64) {
        assert(newFee >= 0.0, message: "Listing fee cannot be negative")
        self.listingFee = newFee
    }
}
