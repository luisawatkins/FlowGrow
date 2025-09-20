import { ethers } from 'ethers'

// Contract ABIs
export const PROPERTY_NFT_ABI = [
  "function mintProperty(string memory name, string memory description, string memory physicalAddress, uint256 squareFootage, uint256 price, string memory tokenURI) public returns (uint256)",
  "function listProperty(uint256 tokenId, uint256 price) public",
  "function delistProperty(uint256 tokenId) public",
  "function getProperty(uint256 tokenId) public view returns (tuple(string name, string description, string physicalAddress, uint256 squareFootage, uint256 price, address owner, bool isListed, uint256 createdAt))",
  "function getOwnerProperties(address owner) public view returns (uint256[] memory)",
  "function getTotalSupply() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function approve(address to, uint256 tokenId) public",
  "function setApprovalForAll(address operator, bool approved) public",
  "function getApproved(uint256 tokenId) public view returns (address)",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event PropertyMinted(uint256 indexed tokenId, string name, address indexed owner, uint256 price)",
  "event PropertyListed(uint256 indexed tokenId, address indexed owner, uint256 price)",
  "event PropertyDelisted(uint256 indexed tokenId, address indexed owner)"
]

export const MARKETPLACE_ABI = [
  "function listProperty(uint256 tokenId, uint256 price) public payable",
  "function buyProperty(uint256 tokenId) public payable",
  "function cancelListing(uint256 tokenId) public",
  "function getActiveListings() public view returns (uint256[] memory)",
  "function getListing(uint256 tokenId) public view returns (tuple(uint256 tokenId, address seller, uint256 price, bool isActive, uint256 createdAt))",
  "function getSellerListings(address seller) public view returns (uint256[] memory)",
  "function getActiveListingsCount() public view returns (uint256)",
  "function listingFee() public view returns (uint256)",
  "function platformFeePercent() public view returns (uint256)",
  "event PropertyListed(uint256 indexed tokenId, address indexed seller, uint256 price, uint256 listingId)",
  "event PropertySold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 platformFee)",
  "event ListingCancelled(uint256 indexed tokenId, address indexed seller)"
]

// Contract addresses (these would be set after deployment)
export const CONTRACT_ADDRESSES = {
  PROPERTY_NFT: process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS || '',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
}

// Contract interaction functions
export class ContractService {
  private provider: ethers.BrowserProvider
  private signer: ethers.JsonRpcSigner

  constructor(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) {
    this.provider = provider
    this.signer = signer
  }

  // Property NFT contract
  getPropertyNFTContract() {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.PROPERTY_NFT,
      PROPERTY_NFT_ABI,
      this.signer
    )
  }

  // Marketplace contract
  getMarketplaceContract() {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.MARKETPLACE,
      MARKETPLACE_ABI,
      this.signer
    )
  }

  // Mint a new property NFT
  async mintProperty(
    name: string,
    description: string,
    physicalAddress: string,
    squareFootage: number,
    price: string,
    tokenURI: string
  ) {
    const contract = this.getPropertyNFTContract()
    const priceWei = ethers.parseEther(price)
    
    const tx = await contract.mintProperty(
      name,
      description,
      physicalAddress,
      squareFootage,
      priceWei,
      tokenURI
    )
    
    return await tx.wait()
  }

  // List a property for sale
  async listProperty(tokenId: string, price: string) {
    const contract = this.getPropertyNFTContract()
    const marketplaceContract = this.getMarketplaceContract()
    
    // First approve the marketplace to transfer the NFT
    const approveTx = await contract.approve(CONTRACT_ADDRESSES.MARKETPLACE, tokenId)
    await approveTx.wait()
    
    // Then list the property
    const priceWei = ethers.parseEther(price)
    const listingFee = await marketplaceContract.listingFee()
    
    const tx = await marketplaceContract.listProperty(tokenId, priceWei, {
      value: listingFee
    })
    
    return await tx.wait()
  }

  // Buy a property
  async buyProperty(tokenId: string, price: string) {
    const contract = this.getMarketplaceContract()
    const priceWei = ethers.parseEther(price)
    
    const tx = await contract.buyProperty(tokenId, {
      value: priceWei
    })
    
    return await tx.wait()
  }

  // Cancel a listing
  async cancelListing(tokenId: string) {
    const contract = this.getMarketplaceContract()
    
    const tx = await contract.cancelListing(tokenId)
    return await tx.wait()
  }

  // Get property details
  async getProperty(tokenId: string) {
    const contract = this.getPropertyNFTContract()
    return await contract.getProperty(tokenId)
  }

  // Get active listings
  async getActiveListings() {
    const contract = this.getMarketplaceContract()
    return await contract.getActiveListings()
  }

  // Get listing details
  async getListing(tokenId: string) {
    const contract = this.getMarketplaceContract()
    return await contract.getListing(tokenId)
  }

  // Get owner's properties
  async getOwnerProperties(owner: string) {
    const contract = this.getPropertyNFTContract()
    return await contract.getOwnerProperties(owner)
  }
}

// Utility functions
export function formatEther(value: bigint): string {
  return ethers.formatEther(value)
}

export function parseEther(value: string): bigint {
  return ethers.parseEther(value)
}

export function getFlowExplorerUrl(txHash: string): string {
  return `https://testnet.flowscan.org/tx/${txHash}`
}

export function getFlowExplorerAddressUrl(address: string): string {
  return `https://testnet.flowscan.org/address/${address}`
}
