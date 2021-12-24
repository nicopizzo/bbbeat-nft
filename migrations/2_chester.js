var ChesterNFT = artifacts.require("ChesterNFT");

const maxTokens = 5;
const mintCost = "100000000000000000";

module.exports = function(deployer) {
  deployer.deploy(ChesterNFT, maxTokens, mintCost);
};