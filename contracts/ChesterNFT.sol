// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ChesterNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // tracker for token ids that are being distributed
    Counters.Counter private _tokenIds;

    // tracker for the amount of nfts that where given
    Counters.Counter public giveMintCount;

    // tracker for the amount of nfts that were minted during private sale
    Counters.Counter public privateMintCount;

    // max number of nfts we are able to mint
    uint256 public maxSupply;

    // max number of the supply availible to give
    uint256 public maxGiveSupply;

    // cost to mint a nft
    uint256 public mintCost;

    // max number of nfts a user can mint
    uint256 public maxMintPerUser;

    // determine if public minting is live
    bool public isLive = false;

    // hash to determine integrity of collection
    string public provenanceHash;

    // index in which we are starting the distribution
    uint256 public startingIndex;

    // determine if private live
    bool public privateSaleLive = false;

    // cost to mint during private sale
    uint256 public privateSaleCost;

    // max number of nfts a user can mint in private sale
    uint256 public maxPrivateSaleMintPerUser;

    // uri used for minting prior to completion
    string public preMintMetadataUri;

    // used to track the amount of nfts minted by address in public sale
    mapping(address => Counters.Counter) private _mintCount;

    // used to track the amount of nfts minted by address in private sale
    mapping(address => Counters.Counter) private _privateSaleCount;

    // whitelist for early minting
    mapping(address => bool) private _privateSaleWhiteList;

    // base uri for hosting the images/ metadata
    // this will be set after minting is completed
    // provenance hash can be used to verify the integrity of the order and assets
    string private _baseTokenURI;  

    constructor(uint256 maxsupply, 
                uint256 mintcost,
                uint256 maxmintPerUser, 
                uint256 maxgiveSupply,
                uint256 privatesalecost,
                uint256 maxprivatesalemintPerUser,
                string memory premintmetadatauri,
                string memory provenancehash) ERC721("ChesterNFT", "HAM") 
    {
        require(maxsupply > maxgiveSupply, "Give supply exceeds total supply");

        maxSupply = maxsupply;
        mintCost = mintcost;
        maxMintPerUser = maxmintPerUser;
        maxGiveSupply = maxgiveSupply;
        privateSaleCost = privatesalecost;
        maxPrivateSaleMintPerUser = maxprivatesalemintPerUser;
        preMintMetadataUri = premintmetadatauri;
        provenanceHash = provenancehash; 
        startingIndex = (block.number + block.difficulty) % maxSupply;
    }

    modifier checkMintSupply(uint mintCount) {
        require(mintCount > 0, "Mint count must be greater than 0");   
        require(_tokenIds.current() + mintCount <= maxSupply, "Max number of nfts created");
        _;
    }

    // ability to mint a nft via public sale
    function mint(address to, uint256 mintCount)
        external payable checkMintSupply(mintCount)
    {  
        require(isLive, "Minting is not live");
        require(msg.value >= mintCost * mintCount, "Not enough eth sent to mint");
        require(_mintCount[to].current() + mintCount <= maxMintPerUser, "Max mints for account exceeded");

        for(uint256 i = 0; i < mintCount; i++){
            _mint(to);
            _mintCount[to].increment();
        }
    }

    // ability to mint a nft via the private sale
    function privateSaleMint(address to, uint256 mintCount)
        external payable checkMintSupply(mintCount)
    {
        require(privateSaleLive, "Private sale is not live");
        require(!isLive, "Public minting is already live");
        require(getPrivateSaleWhitelist(to), "Not on private sale whitelist");
        require(msg.value >= privateSaleCost * mintCount, "Not enough eth sent to mint");
        require(_privateSaleCount[to].current() + mintCount <= maxPrivateSaleMintPerUser, "Max mints for account exceeded in private sale");
        
        for(uint256 i = 0; i < mintCount; i++)
        {
            _mint(to);
            _privateSaleCount[to].increment();
            privateMintCount.increment();
        }
    }

    // ability to give token to an address for free
    // has ability to give prior to go live
    function give(address to, uint256 mintCount)
        external onlyOwner checkMintSupply(mintCount) 
    {
        require(giveMintCount.current() + mintCount <= maxGiveSupply, "Max give supply exceeded");
        for(uint256 i = 0; i < mintCount; i++){
            _mint(to);
            giveMintCount.increment();
        }
    }

    // allows owner to add addresses to the private sale whitelist
    function addToPrivateSaleWhitelist(address[] calldata privateSaleAddresses) 
        external onlyOwner 
    {
        for(uint256 i = 0; i < privateSaleAddresses.length; i++) {
            address addr = privateSaleAddresses[i];
            require(addr != address(0), "Zero address not allowed");
            require(!getPrivateSaleWhitelist(addr), "Address already added to private sale");
            _privateSaleWhiteList[addr] = true;
        }   
    }

    // allows owner to remove addresses from the private sale whitelist
    function removeFromPrivateSaleWhitelist(address[] calldata privateSaleAddresses) 
        external onlyOwner 
    {
        for(uint256 i = 0; i < privateSaleAddresses.length; i++) {
            address addr = privateSaleAddresses[i];
            require(addr != address(0), "Zero address not allowed");     
            _privateSaleWhiteList[addr] = false;
        }
    }

    // ability to move contract funds to owner
    function withdraw() 
        external onlyOwner 
    {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // ability so that we will go live, can not stop going live after this is called
    function goLive()
        external onlyOwner
    {
        isLive = true;
    }

    // ability so that we will go live for the private sale, can not stop going live after this is called
    function goPresaleLive()
        external onlyOwner
    {
        privateSaleLive = true;
    }

    // ability to set base uri. this should be done after minting is completed.
    function setBaseUri(string memory uri)
        external onlyOwner
    {
        _baseTokenURI = uri;
    }

    // ability to check if a account was added to the private sale whitelist
    function getPrivateSaleWhitelist(address addr)
        public view
        returns(bool)
    {
        return _privateSaleWhiteList[addr];
    }

    function _mint(address to)
        internal
    {      
        uint256 currentId = _tokenIds.current() + startingIndex;

        if(currentId >= maxSupply){
            currentId = currentId - maxSupply;
        }

        _safeMint(to, currentId);
        _tokenIds.increment();
    }
    
    function _baseURI() 
        internal view override 
        returns (string memory)
    {
        if(keccak256(abi.encodePacked(_baseTokenURI)) == keccak256(abi.encodePacked('')))
        {
            return preMintMetadataUri;
        }
        return _baseTokenURI;
    }
}