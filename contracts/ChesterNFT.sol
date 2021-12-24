// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ChesterNFT is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private _maxNumberNFTs;
    uint256 private _mintCost;
    mapping(string => uint8) private hashes;

    constructor(uint256 maxTokens, uint256 mintCost) ERC721("ChesterNFT", "CHT") {
        _maxNumberNFTs = maxTokens;
        _mintCost = mintCost;
    }

    function mintNFT(address recipient, string memory tokenHash)
        public payable
        returns (uint256)
    {  
        require(msg.value >= _mintCost, "Not enough eth sent to mint");
        return _mintNFT(recipient, tokenHash);
    }

    function withdraw() 
        public onlyOwner 
    {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function _mintNFT(address recipient, string memory tokenHash)
        internal
        returns (uint256)
    {      
        require(_tokenIds.current() != _maxNumberNFTs, "Max number of nfts created");
        require(hashes[tokenHash] != 1, "Hash already exists");

        hashes[tokenHash] = 1;
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenHash);

        return newItemId;
    }

    function _baseURI()
        internal view virtual override 
        returns (string memory) 
    {
        return "ipfs://";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) 
        internal override(ERC721, ERC721URIStorage) 
    {
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}