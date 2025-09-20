// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PropertyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Property {
        string name;
        string description;
        string physicalAddress;
        uint256 squareFootage;
        uint256 price;
        address owner;
        bool isListed;
        uint256 createdAt;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public ownerProperties;
    
    event PropertyMinted(
        uint256 indexed tokenId,
        string name,
        address indexed owner,
        uint256 price
    );
    
    event PropertyListed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 price
    );
    
    event PropertyDelisted(
        uint256 indexed tokenId,
        address indexed owner
    );
    
    constructor() ERC721("FlowEstate Property", "FEP") Ownable() {}
    
    function mintProperty(
        string memory name,
        string memory description,
        string memory physicalAddress,
        uint256 squareFootage,
        uint256 price,
        string memory tokenURI
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        properties[tokenId] = Property({
            name: name,
            description: description,
            physicalAddress: physicalAddress,
            squareFootage: squareFootage,
            price: price,
            owner: msg.sender,
            isListed: false,
            createdAt: block.timestamp
        });
        
        ownerProperties[msg.sender].push(tokenId);
        
        emit PropertyMinted(tokenId, name, msg.sender, price);
        
        return tokenId;
    }
    
    function listProperty(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "Property does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        properties[tokenId].price = price;
        properties[tokenId].isListed = true;
        
        emit PropertyListed(tokenId, msg.sender, price);
    }
    
    function delistProperty(uint256 tokenId) public {
        require(_exists(tokenId), "Property does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        properties[tokenId].isListed = false;
        
        emit PropertyDelisted(tokenId, msg.sender);
    }
    
    function getProperty(uint256 tokenId) public view returns (Property memory) {
        require(_exists(tokenId), "Property does not exist");
        return properties[tokenId];
    }
    
    function getOwnerProperties(address owner) public view returns (uint256[] memory) {
        return ownerProperties[owner];
    }
    
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Update property owner when transferred
        if (from != address(0) && to != address(0)) {
            properties[tokenId].owner = to;
            properties[tokenId].isListed = false; // Delist when transferred
        }
    }
    
    // The following functions are overrides required by Solidity.
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
