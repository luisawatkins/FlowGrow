// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyNFT.sol";

contract PropertyMarketplace is ReentrancyGuard, Ownable {
    PropertyNFT public propertyNFT;
    
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public sellerListings;
    uint256[] public activeListings;
    
    uint256 public listingFee = 0.01 ether; // 0.01 FLOW listing fee
    uint256 public platformFeePercent = 2; // 2% platform fee
    
    event PropertyListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 listingId
    );
    
    event PropertySold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 platformFee
    );
    
    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller
    );
    
    event ListingFeeUpdated(uint256 newFee);
    event PlatformFeeUpdated(uint256 newFeePercent);
    
    constructor(address _propertyNFT) {
        propertyNFT = PropertyNFT(_propertyNFT);
    }
    
    function listProperty(
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(propertyNFT.getApproved(tokenId) == address(this) || 
                propertyNFT.isApprovedForAll(msg.sender, address(this)), 
                "Marketplace not approved");
        require(price > 0, "Price must be greater than 0");
        require(msg.value >= listingFee, "Insufficient listing fee");
        require(!listings[tokenId].isActive, "Property already listed");
        
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            createdAt: block.timestamp
        });
        
        sellerListings[msg.sender].push(tokenId);
        activeListings.push(tokenId);
        
        emit PropertyListed(tokenId, msg.sender, price, tokenId);
    }
    
    function buyProperty(uint256 tokenId) public payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Property not for sale");
        require(msg.sender != listing.seller, "Cannot buy your own property");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (listing.price * platformFeePercent) / 100;
        uint256 sellerAmount = listing.price - platformFee;
        
        // Transfer NFT to buyer
        propertyNFT.safeTransferFrom(listing.seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);
        
        // Transfer platform fee to contract owner
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        // Update listing
        listing.isActive = false;
        
        // Remove from active listings
        _removeFromActiveListings(tokenId);
        
        emit PropertySold(tokenId, listing.seller, msg.sender, listing.price, platformFee);
    }
    
    function cancelListing(uint256 tokenId) public {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Property not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.isActive = false;
        _removeFromActiveListings(tokenId);
        
        emit ListingCancelled(tokenId, msg.sender);
    }
    
    function getActiveListings() public view returns (uint256[] memory) {
        return activeListings;
    }
    
    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }
    
    function getSellerListings(address seller) public view returns (uint256[] memory) {
        return sellerListings[seller];
    }
    
    function getActiveListingsCount() public view returns (uint256) {
        return activeListings.length;
    }
    
    function _removeFromActiveListings(uint256 tokenId) internal {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }
    
    // Admin functions
    function setListingFee(uint256 _listingFee) public onlyOwner {
        listingFee = _listingFee;
        emit ListingFeeUpdated(_listingFee);
    }
    
    function setPlatformFee(uint256 _platformFeePercent) public onlyOwner {
        require(_platformFeePercent <= 10, "Platform fee cannot exceed 10%");
        platformFeePercent = _platformFeePercent;
        emit PlatformFeeUpdated(_platformFeePercent);
    }
    
    function withdrawFees() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Emergency functions
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function pauseContract() public onlyOwner {
        // Implementation for pausing contract if needed
    }
    
    function unpauseContract() public onlyOwner {
        // Implementation for unpausing contract if needed
    }
}
