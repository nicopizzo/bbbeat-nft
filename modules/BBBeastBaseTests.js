const BBBeastNFT = artifacts.require("BBBeastNFT");
var testContract = "";

async function createContract(){
  if(testContract) return BBBeastNFT.at(testContract);
  return BBBeastNFT.deployed();
}

function getNewIndex(startIndex, increment, maxSupply){
  var newIndex = startIndex.words[0] + increment;
  if(newIndex >= maxSupply.words[0]){
      newIndex = newIndex - maxSupply.words[0];
  }
  return newIndex;
}

module.exports = {
    BBBeastNFT: BBBeastNFT,
    createContract: createContract,
    getNewIndex: getNewIndex
};