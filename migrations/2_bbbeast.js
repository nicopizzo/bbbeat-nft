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
  preMintUri: "ipfs://QmSUhLdcY6ZQvVaWwRX6esaScS5HkBiVeftHfRkkZnPJwy/",
  provHash: "2a69ca99cdd3b85c8804a0cad8964670d1aa1fc9bc8b4dcdb295955fe285ff8a"
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