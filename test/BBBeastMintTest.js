var base = require("../modules/BBBeastBaseTests");

var mintCost = "60000000000000000";
var BN = web3.utils.BN;

contract("BBBeastNFT", async accounts => {
  it("should not mint, minting not live", async () => {
    var bb = await base.createContract();
    try{
      await bb.mint(1, { value: mintCost });
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
    
    var isLive = await bb.isLive();
    assert(!isLive);
  });

  it("should not toggle minting to live, not owner", async () => {
    var bb = await base.createContract();
    try{
      await bb.goLive({from: accounts[1]});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var isLive = await bb.isLive();
    assert(!isLive);
  });

  it("should toggle minting to live", async () => {
    var bb = await base.createContract();
    await bb.goLive();

    var isLive = await bb.isLive();
    assert(isLive);
  });

  it("should not private minting, public minting is already live", async () => {
    var bb = await base.createContract();
    try{
      await bb.privateSaleMint(1, {value: mintCost, from: accounts[1]});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var count = await bb.privateMintCount();
    assert.equal(count, 0);
  });

  it("should mint 1 from contract owner to contract owner", async () => {
    var bb = await base.createContract();
    var user = accounts[0];
    await bb.mint(1, { value: mintCost });

    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 1);
  });

  it("should 1 mint by user", async () => {
    var bb = await base.createContract();
    var user = accounts[1];
    await bb.mint(1, { value: mintCost, from: user });

    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 1);
  });

  it("should 2 mint by user", async () => {
    var bb = await base.createContract();
    var user = accounts[1];
    await bb.mint(2, { value: new BN(mintCost).mul(new BN(2)).toString(), from: user });

    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 3);
  });

  it("should not mint, max supply exceeded", async () => {
    var bb = await base.createContract();
    var user = accounts[2];
    try{
      await bb.mint(2, { value: new BN(mintCost).mul(new BN(2)).toString(), from: user });
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
    
    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 0);
  });

  it("should not mint, user exceeded max mint", async () => {
    var bb = await base.createContract();
    var user = accounts[1];
    try{
      await bb.mint(1, { value: mintCost, from: user });
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
    
    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 3);
  });

  // token id tests
  it("should get token id by owner", async () => {
    var bb = await base.createContract();
    //var startIndex = await bb.startingIndex();
    //var maxSupply = await bb.maxSupply();
    var result = await bb.tokenOfOwnerByIndex(accounts[1], 0);

    //var tokenId = base.getNewIndex(startIndex, 1, maxSupply);

    assert.equal(result.words[0], 1);
  });

  it("should get pre-minted token uri for id, not set", async () => {
    var bb = await base.createContract();
    var firstMinted = await bb.tokenOfOwnerByIndex(accounts[0], 0);
    var result = await bb.tokenURI(firstMinted);

    assert.equal(result, "https://premint/" + firstMinted);
  });

  it("should not be able to set token uri, not owner", async () => {
    var bb = await base.createContract();
    try
    {
      await bb.setBaseUri('https://testing/', {from: accounts[1]});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
  });

  it("should set token uri", async () => {
    var bb = await base.createContract();
    var firstMinted = await bb.tokenOfOwnerByIndex(accounts[0], 0);
    await bb.setBaseUri('https://testing/');
    var result = await bb.tokenURI(firstMinted);

    assert.equal(result, "https://testing/" + firstMinted);
  }); 

  // withdraw tests
  it("should not be able to withdraw, not owner", async () => {
    var bb = await base.createContract();

    try{
      await bb.withdraw({from: accounts[1]});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
  });

  it("should withdraw contract to owner", async () => {   
    var bb = await base.createContract();

    var contractBal = await web3.eth.getBalance(bb.address);
    var accountStartBal = await web3.eth.getBalance(accounts[0]);
    await bb.withdraw();
    var accountEndBal = await web3.eth.getBalance(accounts[0]);

    assert(new BN(accountEndBal).gt(new BN(accountStartBal)).toString());
    contractBal = await web3.eth.getBalance(bb.address);
    assert.equal(contractBal, 0);
  });

  // negative tests
  it("should not mint 2, not enough eth sent, enough for just 1", async () => {
    var bb = await base.createContract();
    var user = accounts[2];

    try{
      await bb.mint(2, {value: mintCost, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 0);
  });

  it("should not mint, invalid mint count", async () => {
    var bb = await base.createContract();
    var user = accounts[2];

    try{
      await bb.mint(0, {value: mintCost, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await bb.balanceOf(user);
    assert.equal(bal.words[0], 0);
  });
});