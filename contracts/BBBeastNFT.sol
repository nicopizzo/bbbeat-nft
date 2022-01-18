// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BBBeastNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    uint256 public constant MINT_COST = 0.06 ether;   
    uint256 public constant PRIVATE_MINT_COST = 0.04 ether;

    uint256 public maxSupply;
    uint256 public maxGiveSupply;
    uint256 public maxMintPerAddress;
    Counters.Counter public giveMintCount;
    Counters.Counter public privateMintCount;
    bool public isLive = false;
    string public provenanceHash;
    uint256 public startingIndex;
    bool public privateSaleLive = false;
    string public preMintMetadataUri;
    mapping(address => bool) public privateSaleWhiteList;

    string private _baseTokenURI;  
    Counters.Counter private _tokenIds;

    constructor(uint256 maxsupply,
                uint256 maxgivesupply,
                uint256 maxmintperaddress,
                string memory premintmetadatauri,
                string memory provenancehash) ERC721("BBBeast", "BBB") 
    {
        maxSupply = maxsupply;
        maxGiveSupply = maxgivesupply;
        maxMintPerAddress = maxmintperaddress;
        preMintMetadataUri = premintmetadatauri;
        provenanceHash = provenancehash; 
        startingIndex = (block.number + block.difficulty) % maxSupply;
    }

    /// @dev     Modifier to check global minting parameters
    /// @param   mintCount The number of tokens to mint
    modifier checkMintSupply(uint mintCount) {
        require(mintCount > 0, "INVALID_MINT_COUNT");   
        require(_tokenIds.current() + mintCount <= maxSupply, "MAX_MINT_SUPPLY_REACHED");
        require(ERC721.balanceOf(msg.sender) + mintCount <= maxMintPerAddress, "MAX_MINT_ADDRESS_REACHED");
        _;
    }

    /// @dev     Mint action
    /// @param   mintCount The number of tokens to mint
    function mint(uint256 mintCount)
        external payable checkMintSupply(mintCount)
    {  
        require(isLive, "MINTING_NOT_LIVE");
        require(msg.value >= MINT_COST * mintCount, "NOT_ENOUGH_ETH_SENT");

        for(uint256 i = 0; i < mintCount; i++){
            _mint(msg.sender);
        }
    }

    /// @dev     Private mint action
    /// @param   mintCount The number of tokens to mint
    function privateSaleMint(uint256 mintCount)
        external payable checkMintSupply(mintCount)
    {
        require(privateSaleLive, "PRIVATE_MINTING_NOT_LIVE");
        require(!isLive, "PUBLIC_MINT_LIVE");
        require(privateSaleWhiteList[msg.sender], "INVALID_ADDRESS");
        require(msg.value >= PRIVATE_MINT_COST * mintCount, "NOT_ENOUGH_ETH_SENT");
        
        for(uint256 i = 0; i < mintCount; i++)
        {
            _mint(msg.sender);
            privateMintCount.increment();
        }
    }

    /// @dev     Give mint action. Allows owner to perform givaways
    /// @param   to Address that will be given the tokens
    /// @param   mintCount The number of tokens to mint
    function give(address to, uint256 mintCount)
        external onlyOwner checkMintSupply(mintCount) 
    {
        require(giveMintCount.current() + mintCount <= maxGiveSupply, "MAX_GIVE_SUPPLY_REACHED");
        for(uint256 i = 0; i < mintCount; i++){
            _mint(to);
            giveMintCount.increment();
        }
    }

    /// @dev     Allows owner to add addresses to private mint whitelist
    /// @param   privateSaleAddresses The addresses to add to the whitelist
    function addToPrivateSaleWhitelist(address[] calldata privateSaleAddresses) 
        external onlyOwner 
    {
        for(uint256 i = 0; i < privateSaleAddresses.length; i++) {
            address addr = privateSaleAddresses[i];
            require(addr != address(0), "INVALID_ADDRESS");
            require(!privateSaleWhiteList[addr], "DUPLICATE_ADDRESS");
            privateSaleWhiteList[addr] = true;
        }   
    }

    /// @dev     Allows owner to remove addresses from private mint whitelist
    /// @param   privateSaleAddresses The addresses to remove from the whitelist
    function removeFromPrivateSaleWhitelist(address[] calldata privateSaleAddresses) 
        external onlyOwner 
    {
        for(uint256 i = 0; i < privateSaleAddresses.length; i++) {
            address addr = privateSaleAddresses[i];
            require(addr != address(0), "INVALID_ADDRESS");     
            privateSaleWhiteList[addr] = false;
        }
    }

    /// @dev     Withdraws balance to owner's address
    function withdraw() 
        external onlyOwner 
    {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /// @dev     Turns on public minting
    function goLive()
        external onlyOwner
    {
        isLive = true;
    }

    /// @dev     Turns on private minting
    function goPresaleLive()
        external onlyOwner
    {
        privateSaleLive = true;
    }


    /// @dev     Sets base uri used during reveal
    /// @param  uri Base uri that will be used for get tokenuri
    function setBaseUri(string memory uri)
        external onlyOwner
    {
        _baseTokenURI = uri;
    }

    /// @dev    Core minting logic
    /// @param  to Address that the token will be minted to.
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
    
    /// @dev    Get base uri override to return the premint uri if not revealed
    /// @return string Base uri of token
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