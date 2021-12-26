const ChesterNFT = artifacts.require("ChesterNFT");

//var testContract = "0x00F77b302AF61eE999Bacb4dCFeAF54EdC678434";
var testContract = "";

async function createContract(){
  if(testContract) return ChesterNFT.at(testContract);
  return ChesterNFT.deployed();
}

module.exports = {
    ChesterNFT: ChesterNFT,
    createContract: createContract
};