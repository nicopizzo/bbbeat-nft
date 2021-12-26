var ChesterNFT = artifacts.require("ChesterNFT");

const maxTokens = 5;
const mintCost = "100000000000000000";
const maxMintPerUser = 3;
const maxGiveSupply = 3;

module.exports = function(deployer) {
  deployer.deploy(ChesterNFT, maxTokens, mintCost, maxMintPerUser, maxGiveSupply, "https://gateway.pinata.cloud/ipfs/QmZ2a29sVd7pNz9QGtb76aR99UKBzqcyoXnETDfDXBDXyv/");
};