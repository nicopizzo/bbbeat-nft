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

    // max number of nfts we are able to mint
    uint256 private _maxSupply;

    // cost to mint a nft
    uint256 private _mintCost;

    // max number of nfts a user can mint
    uint256 private _maxMintPerUser;

    // base uri for hosting the images/ metadata
    string private _baseTokenURI;

    constructor(uint256 maxSupply, 
                uint256 mintCost,
                uint256 maxMintPerUser, 
                string memory baseUri) ERC721("ChesterNFT", "HAM") {
        _maxSupply = maxSupply;
        _mintCost = mintCost;
        _maxMintPerUser = maxMintPerUser;
        _baseTokenURI = baseUri;
    }

    // external function to mint an nft with a given hash
    function mintNFT(address to, uint256 mintCount)
        external payable
    {  
        require(mintCount > 0, "Mint count must be greater than 0");
        require(msg.value >= _mintCost * mintCount, "Not enough eth sent to mint");
        require(balanceOf(to) + mintCount <= _maxMintPerUser, "Max mints exceeded");

        for(uint256 i = 0; i < mintCount; i++){
            _mintNFT(to);
        }
    }

    // ability to move contract funds to owner
    function withdraw() 
        external onlyOwner 
    {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function _mintNFT(address to)
        internal
        returns (uint256)
    {      
        // intentionally allowing a way to mint more that the mint per user
        require(_tokenIds.current() != _maxSupply, "Max number of nfts created");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);

        return newItemId;
    }
    
    function _baseURI() 
        internal view override 
        returns (string memory)
    {
        return _baseTokenURI;
    }
}