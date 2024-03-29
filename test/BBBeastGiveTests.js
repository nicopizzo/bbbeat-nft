var base = require("../modules/BBBeastBaseTests");

contract("BBBeastNFT", async accounts => {
    it("should give 1 from owner to another user", async () => {
      var bb = await base.createContract();
      var user = accounts[5];
  
      await bb.give(user, 1);
  
      var bal = await bb.balanceOf(user);
      assert.equal(bal.words[0], 1);
    });
  
    it("should not give, not owner", async () =>{
      var bb = await base.createContract();
      var user = accounts[2];
  
      try{
        await bb.give(user, 1, {from: user});
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await bb.balanceOf(user);
      assert.equal(bal.words[0], 0);
    });
  
    it("should not give, invalid mint count", async () =>{
      var bb = await base.createContract();
      var user = accounts[2];
  
      try{
        await bb.give(user, 0);
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await bb.balanceOf(user);
      assert.equal(bal.words[0], 0);
    });
  
    it("should not give, max give supply exceeded", async () =>{
      var bb = await base.createContract();
      var user = accounts[3];
  
      try{
        await bb.give(user, 3);
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
      var bal = await bb.balanceOf(user);
      assert.equal(bal.words[0], 0);
    });

    it("should approve user 6 to transfer", async () =>{
      var bb = await base.createContract();
      var user = accounts[6];
      var tokenid = await bb.tokenOfOwnerByIndex(accounts[5], 0);
      await bb.approve(user, tokenid, {from: accounts[5]});

      var approvedAccount = await bb.getApproved(tokenid);
      assert.equal(approvedAccount, user);
    });

    it("should not transfer, user 4 not approved", async () =>{
      var bb = await base.createContract();
      var user = accounts[4];

      try
      {
        await bb.safeTransferFrom(accounts[5], user, 1, {from: user});
        assert.fail("The transaction should have thrown an error.");
      }
      catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }

      var bal = await bb.balanceOf(user);
      assert.equal(bal, 0);
    });

    it("should transfer, user 6 approved", async () =>{
      var bb = await base.createContract();
      var user = accounts[6];
      var tokenid = await bb.tokenOfOwnerByIndex(accounts[5], 0);
      await bb.safeTransferFrom(accounts[5], user, tokenid, {from: user});

      var bal = await bb.balanceOf(user);
      assert.equal(bal, 1);
    });
  });