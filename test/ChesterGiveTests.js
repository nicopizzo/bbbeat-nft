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
  
    // give bad mint count
  
    // give max supply exceeded
  
    //
  });