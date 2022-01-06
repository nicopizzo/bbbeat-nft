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
  maxTokens: 50,
  mintCost: "10000000000000000",
  maxMintPerUser: 5,
  maxGiveSupply: 10,
  privateMintCost: "5000000000000000",
  privateMintPerUser: 5,
  preMintUri: "ipfs://QmT5WZpYe1wF6MmtdgzBqanngHxBEeZN1DQv5GmSiRCQvu/",
  provHash: "4f25f4ce0e507037260d6b301f6b0a0f5d8ca9ce80a7ec2817198d982fcbc7b8"
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