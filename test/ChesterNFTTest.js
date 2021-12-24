const ChesterNFT = artifacts.require("ChesterNFT");
const mintCost = "100000000000000000";

contract("ChesterNFT", async accounts => {
  it("should mint from contract owner to contract owner", async () => {
    var chester = await ChesterNFT.deployed();
    var uri = "owner";
    await chester.mintNFT(accounts[0], uri, {value: mintCost});

    var bal = await chester.balanceOf(accounts[0]);
    assert.equal(bal.words[0], 1);
  });

  it("should mint by user", async () => {
    var chester = await ChesterNFT.deployed();
    var uri = "user";
    var user = accounts[1];
    await chester.mintNFT(user, uri, {value: mintCost, from: user});

    var bal = await chester.balanceOf(accounts[1]);
    assert.equal(bal.words[0], 1);
  });

  it("should get token by owner", async () => {
    var chester = await ChesterNFT.deployed();
    var result = await chester.tokenOfOwnerByIndex(accounts[1], 0);

    assert.equal(result.words[0], 2);
  });

  it("should error, not enough eth sent", async () => {
    var chester = await ChesterNFT.deployed();
    var uri = "user2";
    var user = accounts[2];

    try{
      await chester.mintNFT(user, uri, {value: 100, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await chester.balanceOf(accounts[2]);
    assert.equal(bal.words[0], 0);
  });

  it("should error, same hash already sent", async () => {
    var chester = await ChesterNFT.deployed();
    var uri = "user";
    var user = accounts[2];

    try{
      await chester.mintNFT(user, uri, {value: mintCost, from: user});
      assert.fail("The transaction should have thrown an error.");
    }
    catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    var bal = await chester.balanceOf(accounts[2]);
    assert.equal(bal.words[0], 0);
  });
});
