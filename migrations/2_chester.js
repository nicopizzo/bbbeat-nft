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

var ropstenParams = {
  maxTokens: 5,
  mintCost: "10000000000000000",
  maxMintPerUser: 1,
  maxGiveSupply: 1,
  privateMintCost: "5000000000000000",
  privateMintPerUser: 1,
  // TODO setup premint
  preMintUri: "https://premint/",
  // TODO, calculate prov for chester collection
  provHash: "2E99758548972A8E8822AD47FA1017FF72F06F3FF6A016851F45C398732BC50C"
};

module.exports = function(deployer) {
  // for unit tests use parameters below
  deployer.deploy(ChesterNFT, 
    testParams.maxTokens, 
    testParams.mintCost, 
    testParams.maxMintPerUser, 
    testParams.maxGiveSupply, 
    testParams.privateMintCost, 
    testParams.privateMintPerUser, 
    testParams.preMintUri,
    testParams.provHash);

  // for ropsten
  // deployer.deploy(ChesterNFT, 
  //   ropstenParams.maxTokens, 
  //   ropstenParams.mintCost, 
  //   ropstenParams.maxMintPerUser, 
  //   ropstenParams.maxGiveSupply, 
  //   ropstenParams.privateMintCost, 
  //   ropstenParams.privateMintPerUser, 
  //   ropstenParams.preMintUri,
  //   ropstenParams.provHash);
};