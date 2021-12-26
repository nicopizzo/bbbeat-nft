var base = require("../modules/ChesterBaseTests");

contract("ChesterNFT", async accounts => {
    it("should give 1 from owner to another user", async () => {
      var chester = await base.createContract();
      var user = accounts[5];
  
      await chester.give(user, 1);
  
      var bal = await chester.balanceOf(user)
      assert.equal(bal.words[0], 1);
    });
  
    it("should not give, not owner", async () =>{
      var chester = await base.createContract();
      var user = accounts[2];
  
      try{
        await chester.give(user, 1, {from: user});
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await chester.balanceOf(user)
      assert.equal(bal.words[0], 0);
    });
  
    it("should not give, invalid mint count", async () =>{
      var chester = await base.createContract();
      var user = accounts[2];
  
      try{
        await chester.give(user, 0);
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await chester.balanceOf(user)
      assert.equal(bal.words[0], 0);
    });

    it("should not deploy, give supply exceeds total supply", async () =>
    {
      try{
        await base.ChesterNFT.new(5, "100000000000000000", 3, 6, "test", { gas: 4712388, gasPrice: 100000000000 });
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
    });
  
    it("should not give, max give supply exceeded", async () =>{
      var chester = await base.createContract();
      var user = accounts[3];
  
      try{
        await chester.give(user, 3);
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await chester.balanceOf(user)
      assert.equal(bal.words[0], 0);
    });
  });