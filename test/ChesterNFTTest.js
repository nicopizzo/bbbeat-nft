const ChesterNFT = artifacts.require("ChesterNFT");
var mintCost = "100000000000000000";
var BN = web3.utils.BN;
var testContract = "0x00F77b302AF61eE999Bacb4dCFeAF54EdC678434";

async function createContract(){
  if(testContract) return ChesterNFT.at(testContract);
  return ChesterNFT.deployed();
}

contract("ChesterNFT", async accounts => {
  // mint tests
  it("should mint 1 from contract owner to contract owner", async () => {
    var chester = await createContract();
    var user = accounts[0];
    await chester.mintNFT(user, 1, { value: mintCost });

    var bal = await chester.balanceOf(user);
    assert.equal(bal.words[0], 1);
  });

  it("should 1 mint by user", async () => {
    var chester = await createContract();
    var user = accounts[1];
    await chester.mintNFT(user, 1, { value: mintCost, from: user });

    var bal = await chester.balanceOf(user);
    assert.equal(bal.words[0], 1);
  });

  it("should 2 mint by user", async () => {
    var chester = await createContract();
    var user = accounts[1];
    await chester.mintNFT(user, 2, { value: new BN(mintCost).mul(new BN(2)).toString(), from: user });

    var bal = await chester.balanceOf(user);
    assert.equal(bal.words[0], 3);
  });

  it("should not mint, max supply exceeded", async () => {
    var chester = await createContract();
    var user = accounts[2];
    try{
      await chester.mintNFT(user, 2, { value: new BN(mintCost).mul(new BN(2)).toString(), from: user });
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
    
    var bal = await chester.balanceOf(user);
    assert.equal(bal.words[0], 0);
  });

  it("should not mint, user exceeded max mint", async () => {
    var chester = await createContract();
    var user = accounts[1];
    try{
      await chester.mintNFT(user, 1, { value: mintCost, from: user });
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
    
    var bal = await chester.balanceOf(user);
    assert.equal(bal.words[0], 3);
  });

  // token id tests
  it("should get token id by owner", async () => {
    var chester = await createContract();
    var result = await chester.tokenOfOwnerByIndex(accounts[1], 0);

    assert.equal(result.words[0], 2);
  });

  it("should get token uri for id 2", async () => {
    var chester = await createContract();
    var result = await chester.tokenURI(2);

    assert.equal(result, "https://gateway.pinata.cloud/ipfs/QmZ2a29sVd7pNz9QGtb76aR99UKBzqcyoXnETDfDXBDXyv/2");
  });

  // withdraw tests
  it("should not be able to withdraw, not owner", async () => {
    var chester = await createContract();

    try{
      await chester.withdraw({from: accounts[1]});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
  });

  it("should withdraw contract to owner", async () => {   
    var chester = await createContract();

    var contractBal = await web3.eth.getBalance(chester.address);
    var accountStartBal = await web3.eth.getBalance(accounts[0]);
    await chester.withdraw();
    var accountEndBal = await web3.eth.getBalance(accounts[0]);

    assert(new BN(accountEndBal).gt(new BN(accountStartBal)).toString());
    contractBal = await web3.eth.getBalance(chester.address);
    assert.equal(contractBal, 0);
  });

  // negative tests
  it("should not mint 2, not enough eth sent, enough for just 1", async () => {
    var chester = await createContract();
    var user = accounts[2];

    try{
      await chester.mintNFT(user, 2, {value: mintCost, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await chester.balanceOf(accounts[2]);
    assert.equal(bal.words[0], 0);
  });

  it("should not mint, invalid mint count", async () => {
    var chester = await createContract();
    var user = accounts[2];

    try{
      await chester.mintNFT(user, 0, {value: mintCost, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await chester.balanceOf(accounts[2]);
    assert.equal(bal.words[0], 0);
  });
});
