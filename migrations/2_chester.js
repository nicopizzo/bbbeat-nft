var ChesterNFT = artifacts.require("ChesterNFT");

var testParams = {
  maxTokens: 5,
  mintCost: "100000000000000000",
  maxMintPerUser: 3,
  maxGiveSupply: 3,
  privateMintCost: "50000000000000000",
  privateMintPerUser: 2,
  preMintUri: "https://premint/",
  provHash: "2E99758548972A8E8822AD47FA1017FF72F06F3FF6A016851F45C398732BC50C"
};

var publicTestParams = {
  maxTokens: 5,
  mintCost: "10000000000000000",
  maxMintPerUser: 1,
  maxGiveSupply: 4,
  privateMintCost: "5000000000000000",
  privateMintPerUser: 1,
  preMintUri: "https://gateway.pinata.cloud/ipfs/QmcfhnwDvQYxv5BSLCx7GGZqJxCT1rxiWmUCJJQK7LDDBd/",
  provHash: "ce35cec7d507b6ac395ffbde47e8521384be4bbae368e2e1423ca44254c6cc59"
};

module.exports = function(deployer) {
  // for unit tests use parameters below
  // deployer.deploy(ChesterNFT, 
  //   testParams.maxTokens, 
  //   testParams.mintCost, 
  //   testParams.maxMintPerUser, 
  //   testParams.maxGiveSupply, 
  //   testParams.privateMintCost, 
  //   testParams.privateMintPerUser, 
  //   testParams.preMintUri,
  //   testParams.provHash);

  // for ropsten
  deployer.deploy(ChesterNFT, 
    publicTestParams.maxTokens, 
    publicTestParams.mintCost, 
    publicTestParams.maxMintPerUser, 
    publicTestParams.maxGiveSupply, 
    publicTestParams.privateMintCost, 
    publicTestParams.privateMintPerUser, 
    publicTestParams.preMintUri,
    publicTestParams.provHash);
};