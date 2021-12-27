var ChesterNFT = artifacts.require("ChesterNFT");

const maxTokens = 5;
const mintCost = "100000000000000000";
const maxMintPerUser = 3;
const maxGiveSupply = 3;
const provHash = "2E99758548972A8E8822AD47FA1017FF72F06F3FF6A016851F45C398732BC50C";

module.exports = function(deployer) {
  deployer.deploy(ChesterNFT, maxTokens, mintCost, maxMintPerUser, maxGiveSupply, provHash);
};