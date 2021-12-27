const ChesterNFT = artifacts.require("ChesterNFT");

//var testContract = "0x00F77b302AF61eE999Bacb4dCFeAF54EdC678434";
var testContract = "";

async function createContract(){
  if(testContract) return ChesterNFT.at(testContract);
  return ChesterNFT.deployed();
}

function getNewIndex(startIndex, increment, maxSupply){
  var newIndex = startIndex.words[0] + increment;
  if(newIndex >= maxSupply.words[0]){
      newIndex = newIndex - maxSupply.words[0];
  }
  return newIndex;
}

module.exports = {
    ChesterNFT: ChesterNFT,
    createContract: createContract,
    getNewIndex: getNewIndex
};