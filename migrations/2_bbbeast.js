var BBBeastNFT = artifacts.require("BBBeastNFT");

var testParams = {
  maxTokens: 5,
  maxMintPerUser: 3,
  maxGiveSupply: 3,
  preMintUri: "https://premint/",
  provHash: "2E99758548972A8E8822AD47FA1017FF72F06F3FF6A016851F45C398732BC50C"
};

var publicTestParams = {
  maxTokens: 50,
  maxMintPerUser: 5,
  maxGiveSupply: 10,
  preMintUri: "ipfs://QmT5WZpYe1wF6MmtdgzBqanngHxBEeZN1DQv5GmSiRCQvu/",
  provHash: "4f25f4ce0e507037260d6b301f6b0a0f5d8ca9ce80a7ec2817198d982fcbc7b8"
};

var deploy = function(d,p){
  d.deploy(BBBeastNFT,
    p.maxTokens,
    p.maxGiveSupply,
    p.maxMintPerUser,
    p.preMintUri,
    p.provHash);
};

module.exports = function(deployer) {
  deploy(deployer, testParams);
  //deploy(deployer, publicTestParams);
};