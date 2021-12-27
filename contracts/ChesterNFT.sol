// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ChesterNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _giveCount;

    // max number of nfts we are able to mint
    uint256 private _maxSupply;

    // max number of the supply availible to give
    uint256 private _maxGiveSupply;

    // cost to mint a nft
    uint256 private _mintCost;

    // max number of nfts a user can mint
    uint256 private _maxMintPerUser;

    // base uri for hosting the images/ metadata
    string private _baseTokenURI;

    // determine if public minting is live
    bool public isLive = false;

    // hash to determine integrity of collection
    string public provenanceHash;

    // index in which we are starting the distribution
    uint256 public startingIndex;

    constructor(uint256 maxSupply, 
                uint256 mintCost,
                uint256 maxMintPerUser, 
                uint256 maxGiveSupply,
                string memory provenancehash) ERC721("ChesterNFT", "HAM") 
    {
        require(maxSupply > maxGiveSupply, "Give supply exceeds total supply");

        _maxSupply = maxSupply;
        _mintCost = mintCost;
        _maxMintPerUser = maxMintPerUser;
        _maxGiveSupply = maxGiveSupply;
        provenanceHash = provenancehash;
        startingIndex = block.number % maxSupply;
    }

    modifier checkMintSupply(uint mintCount) {
        require(mintCount > 0, "Mint count must be greater than 0");   
        require(_tokenIds.current() + mintCount <= _maxSupply, "Max number of nfts created");
        _;
    }

    // external function to mint an nft with a given hash
    function mint(address to, uint256 mintCount)
        external payable checkMintSupply(mintCount)
    {  
        require(isLive, "Minting is not live");
        require(msg.value >= _mintCost * mintCount, "Not enough eth sent to mint");
        require(balanceOf(to) + mintCount <= _maxMintPerUser, "Max mints for account exceeded");

        for(uint256 i = 0; i < mintCount; i++){
            _mint(to);
        }
    }

    // ability to give token to an address for free
    // has ability to give prior to go live
    function give(address to, uint256 mintCount)
        external onlyOwner checkMintSupply(mintCount) 
    {
        require(_giveCount.current() + mintCount <= _maxGiveSupply, "Max give supply exceeded");
        for(uint256 i = 0; i < mintCount; i++){
            _mint(to);
            _giveCount.increment();
        }
    }

    // ability to move contract funds to owner
    function withdraw() 
        external onlyOwner 
    {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // ability so that we will go live, can not stop going live after this is called
    function goLive()
        external onlyOwner
    {
        isLive = true;
    }

    // ability to set base uri. this should be done after minting is completed.
    function setBaseUri(string memory uri)
        external onlyOwner
    {
        _baseTokenURI = uri;
    }

    function _mint(address to)
        internal
    {      
        uint256 currentId = _tokenIds.current() + startingIndex;

        if(currentId >= _maxSupply){
            currentId = currentId - _maxSupply;
        }

        _safeMint(to, currentId);
        _tokenIds.increment();
    }
    
    function _baseURI() 
        internal view override 
        returns (string memory)
    {
        return _baseTokenURI;
    }
}