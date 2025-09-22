import NonFungibleToken from 0x1d7e57aa558c48ec
import PropertyNFT from 0x1234567890abcdef
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

/// FlowEstate Property Marketplace Contract
/// This contract manages the marketplace for property NFTs
pub contract PropertyMarketplace {
    
    // Offer Resource for property offers
    pub resource Offer {
        pub let id: UInt64
        pub let listingID: UInt64
        pub let buyer: Address
        pub let amount: UFix64
        pub let isActive: Bool
        pub let createdAt: UFix64
        pub let expiresAt: UFix64?
        
        init(
            id: UInt64,
            listingID: UInt64,
            buyer: Address,
            amount: UFix64,
            expiresAt: UFix64?
        ) {
            self.id = id
            self.listingID = listingID
            self.buyer = buyer
            self.amount = amount
            self.isActive = true
            self.createdAt = getCurrentBlock().timestamp
            self.expiresAt = expiresAt
        }
    }
    
    // Auction Resource for property auctions
    pub resource Auction {
        pub let id: UInt64
        pub let propertyID: UInt64
        pub let seller: Address
        pub let startingPrice: UFix64
        pub let reservePrice: UFix64?
        pub let currentBid: UFix64
        pub let currentBidder: Address?
        pub let isActive: Bool
        pub let startTime: UFix64
        pub let endTime: UFix64
        pub let bidIncrement: UFix64
        
        init(
            id: UInt64,
            propertyID: UInt64,
            seller: Address,
            startingPrice: UFix64,
            reservePrice: UFix64?,
            endTime: UFix64,
            bidIncrement: UFix64
        ) {
            self.id = id
            self.propertyID = propertyID
            self.seller = seller
            self.startingPrice = startingPrice
            self.reservePrice = reservePrice
            self.currentBid = startingPrice
            self.currentBidder = nil
            self.isActive = true
            self.startTime = getCurrentBlock().timestamp
            self.endTime = endTime
            self.bidIncrement = bidIncrement
        }
    }
    
    // Analytics Data Structure
    pub struct PropertyAnalytics {
        pub let propertyID: UInt64
        pub let viewCount: UInt64
        pub let offerCount: UInt64
        pub let lastViewed: UFix64
        pub let priceHistory: [PricePoint]
        pub let averageTimeOnMarket: UFix64
        
        init(propertyID: UInt64) {
            self.propertyID = propertyID
            self.viewCount = 0
            self.offerCount = 0
            self.lastViewed = getCurrentBlock().timestamp
            self.priceHistory = []
            self.averageTimeOnMarket = 0.0
        }
    }
    
    // Price Point Structure
    pub struct PricePoint {
        pub let price: UFix64
        pub let timestamp: UFix64
        pub let event: String
        
        init(price: UFix64, timestamp: UFix64, event: String) {
            self.price = price
            self.timestamp = timestamp
            self.event = event
        }
    }
    
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
        pub var offers: {UInt64: Offer}
        pub var auctions: {UInt64: Auction}
        pub var analytics: {UInt64: PropertyAnalytics}
        pub var nextListingID: UInt64
        pub var nextOfferID: UInt64
        pub var nextAuctionID: UInt64
        
        init() {
            self.listings = {}
            self.offers = {}
            self.auctions = {}
            self.analytics = {}
            self.nextListingID = 1
            self.nextOfferID = 1
            self.nextAuctionID = 1
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
        
        // Create an offer for a property
        pub fun createOffer(
            listingID: UInt64,
            buyer: Address,
            amount: UFix64,
            expiresAt: UFix64?
        ): UInt64 {
            let offerID = self.nextOfferID
            self.nextOfferID = self.nextOfferID + 1
            
            let offer = Offer(
                id: offerID,
                listingID: listingID,
                buyer: buyer,
                amount: amount,
                expiresAt: expiresAt
            )
            
            self.offers[offerID] = offer
            
            // Update analytics
            if let listing = self.listings[listingID] {
                if self.analytics[listing.propertyID] == nil {
                    self.analytics[listing.propertyID] = PropertyAnalytics(propertyID: listing.propertyID)
                }
                self.analytics[listing.propertyID]!.offerCount = self.analytics[listing.propertyID]!.offerCount + 1
            }
            
            emit OfferCreated(
                offerID: offerID,
                listingID: listingID,
                buyer: buyer,
                amount: amount
            )
            
            return offerID
        }
        
        // Accept an offer
        pub fun acceptOffer(offerID: UInt64, seller: Address) {
            if let offer = self.offers[offerID] {
                if let listing = self.listings[offer.listingID] {
                    assert(listing.seller == seller, message: "Only the seller can accept offers")
                    assert(listing.isActive, message: "Listing is not active")
                    assert(offer.isActive, message: "Offer is not active")
                    
                    // Check if offer has expired
                    if offer.expiresAt != nil && getCurrentBlock().timestamp > offer.expiresAt! {
                        panic("Offer has expired")
                    }
                    
                    // Mark offer as inactive
                    self.offers[offerID] = Offer(
                        id: offer.id,
                        listingID: offer.listingID,
                        buyer: offer.buyer,
                        amount: offer.amount,
                        expiresAt: offer.expiresAt
                    )
                    
                    // Mark listing as inactive
                    self.listings[offer.listingID] = Listing(
                        id: listing.id,
                        propertyID: listing.propertyID,
                        seller: listing.seller,
                        price: offer.amount
                    )
                    
                    emit OfferAccepted(
                        offerID: offerID,
                        listingID: offer.listingID,
                        buyer: offer.buyer,
                        seller: seller,
                        amount: offer.amount
                    )
                }
            }
        }
        
        // Create an auction
        pub fun createAuction(
            propertyID: UInt64,
            seller: Address,
            startingPrice: UFix64,
            reservePrice: UFix64?,
            duration: UFix64,
            bidIncrement: UFix64
        ): UInt64 {
            let auctionID = self.nextAuctionID
            self.nextAuctionID = self.nextAuctionID + 1
            
            let endTime = getCurrentBlock().timestamp + duration
            
            let auction = Auction(
                id: auctionID,
                propertyID: propertyID,
                seller: seller,
                startingPrice: startingPrice,
                reservePrice: reservePrice,
                endTime: endTime,
                bidIncrement: bidIncrement
            )
            
            self.auctions[auctionID] = auction
            
            emit AuctionCreated(
                auctionID: auctionID,
                propertyID: propertyID,
                seller: seller,
                startingPrice: startingPrice,
                endTime: endTime
            )
            
            return auctionID
        }
        
        // Place a bid in an auction
        pub fun placeBid(auctionID: UInt64, bidder: Address, bidAmount: UFix64) {
            if let auction = self.auctions[auctionID] {
                assert(auction.isActive, message: "Auction is not active")
                assert(getCurrentBlock().timestamp < auction.endTime, message: "Auction has ended")
                assert(bidAmount >= auction.currentBid + auction.bidIncrement, message: "Bid must be at least the current bid plus increment")
                
                // Update auction with new bid
                self.auctions[auctionID] = Auction(
                    id: auction.id,
                    propertyID: auction.propertyID,
                    seller: auction.seller,
                    startingPrice: auction.startingPrice,
                    reservePrice: auction.reservePrice,
                    currentBid: bidAmount,
                    currentBidder: bidder,
                    isActive: auction.isActive,
                    startTime: auction.startTime,
                    endTime: auction.endTime,
                    bidIncrement: auction.bidIncrement
                )
                
                emit BidPlaced(
                    auctionID: auctionID,
                    bidder: bidder,
                    amount: bidAmount
                )
            }
        }
        
        // End an auction
        pub fun endAuction(auctionID: UInt64): (Address?, UFix64) {
            if let auction = self.auctions[auctionID] {
                assert(auction.isActive, message: "Auction is not active")
                assert(getCurrentBlock().timestamp >= auction.endTime, message: "Auction has not ended yet")
                
                // Mark auction as inactive
                self.auctions[auctionID] = Auction(
                    id: auction.id,
                    propertyID: auction.propertyID,
                    seller: auction.seller,
                    startingPrice: auction.startingPrice,
                    reservePrice: auction.reservePrice,
                    currentBid: auction.currentBid,
                    currentBidder: auction.currentBidder,
                    isActive: false,
                    startTime: auction.startTime,
                    endTime: auction.endTime,
                    bidIncrement: auction.bidIncrement
                )
                
                emit AuctionEnded(
                    auctionID: auctionID,
                    winner: auction.currentBidder,
                    finalBid: auction.currentBid
                )
                
                return (auction.currentBidder, auction.currentBid)
            }
            return (nil, 0.0)
        }
        
        // Track property view
        pub fun trackPropertyView(propertyID: UInt64) {
            if self.analytics[propertyID] == nil {
                self.analytics[propertyID] = PropertyAnalytics(propertyID: propertyID)
            }
            
            self.analytics[propertyID]!.viewCount = self.analytics[propertyID]!.viewCount + 1
            self.analytics[propertyID]!.lastViewed = getCurrentBlock().timestamp
            
            emit PropertyViewed(propertyID: propertyID)
        }
        
        // Get property analytics
        pub fun getPropertyAnalytics(propertyID: UInt64): PropertyAnalytics? {
            return self.analytics[propertyID]
        }
        
        // Get active auctions
        pub fun getActiveAuctions(): [UInt64] {
            let activeAuctions: [UInt64] = []
            for auctionID in self.auctions.keys {
                if let auction = self.auctions[auctionID] {
                    if auction.isActive && getCurrentBlock().timestamp < auction.endTime {
                        activeAuctions.append(auctionID)
                    }
                }
            }
            return activeAuctions
        }
        
        // Get offers for a listing
        pub fun getOffersForListing(listingID: UInt64): [UInt64] {
            let listingOffers: [UInt64] = []
            for offerID in self.offers.keys {
                if let offer = self.offers[offerID] {
                    if offer.listingID == listingID && offer.isActive {
                        listingOffers.append(offerID)
                    }
                }
            }
            return listingOffers
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
    
    pub event OfferCreated(
        offerID: UInt64,
        listingID: UInt64,
        buyer: Address,
        amount: UFix64
    )
    
    pub event OfferAccepted(
        offerID: UInt64,
        listingID: UInt64,
        buyer: Address,
        seller: Address,
        amount: UFix64
    )
    
    pub event AuctionCreated(
        auctionID: UInt64,
        propertyID: UInt64,
        seller: Address,
        startingPrice: UFix64,
        endTime: UFix64
    )
    
    pub event BidPlaced(
        auctionID: UInt64,
        bidder: Address,
        amount: UFix64
    )
    
    pub event AuctionEnded(
        auctionID: UInt64,
        winner: Address?,
        finalBid: UFix64
    )
    
    pub event PropertyViewed(
        propertyID: UInt64
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
    
    // Create an offer for a property
    pub fun createOffer(
        listingID: UInt64,
        buyer: Address,
        amount: UFix64,
        expiresAt: UFix64?
    ): UInt64 {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        return self.marketplace!.createOffer(
            listingID: listingID,
            buyer: buyer,
            amount: amount,
            expiresAt: expiresAt
        )
    }
    
    // Accept an offer
    pub fun acceptOffer(offerID: UInt64, seller: Address) {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        self.marketplace!.acceptOffer(offerID: offerID, seller: seller)
    }
    
    // Create an auction
    pub fun createAuction(
        propertyID: UInt64,
        seller: Address,
        startingPrice: UFix64,
        reservePrice: UFix64?,
        duration: UFix64,
        bidIncrement: UFix64
    ): UInt64 {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        return self.marketplace!.createAuction(
            propertyID: propertyID,
            seller: seller,
            startingPrice: startingPrice,
            reservePrice: reservePrice,
            duration: duration,
            bidIncrement: bidIncrement
        )
    }
    
    // Place a bid in an auction
    pub fun placeBid(auctionID: UInt64, bidder: Address, bidAmount: UFix64) {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        self.marketplace!.placeBid(auctionID: auctionID, bidder: bidder, bidAmount: bidAmount)
    }
    
    // Track property view
    pub fun trackPropertyView(propertyID: UInt64) {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        self.marketplace!.trackPropertyView(propertyID: propertyID)
    }
    
    // Get marketplace analytics
    pub fun getMarketplaceAnalytics(): (UInt64, UInt64, UInt64, UInt64) {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        let activeListings = self.marketplace!.getActiveListings()
        let activeAuctions = self.marketplace!.getActiveAuctions()
        let totalListings = self.marketplace!.listings.length
        let totalOffers = self.marketplace!.offers.length
        
        return (activeListings.length, activeAuctions.length, totalListings, totalOffers)
    }
    
    // Get property analytics
    pub fun getPropertyAnalytics(propertyID: UInt64): PropertyAnalytics? {
        pre {
            self.marketplace != nil: "Marketplace not initialized"
        }
        
        return self.marketplace!.getPropertyAnalytics(propertyID: propertyID)
    }
}
