var base = require("../modules/BBBeastBaseTests");

const mintCost = "40000000000000000";
var BN = web3.utils.BN;

contract("BBBeastNFT", async accounts => {
    it("should not mint in private sale, sale not started", async () => {
        var bb = await base.createContract();
        var user = accounts[0];

        try{
            await bb.privateSaleMint(1, { value: mintCost });
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
        
        var numberOwned = await bb.balanceOf(user);
        
        assert.equal(numberOwned, 0);
      });

      it("should not start private sale, not owner", async () => {
        var bb = await base.createContract();
        var user = accounts[1];

        try{
            await bb.goPresaleLive({ from: user });
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
        
        var isPrivateLive = await bb.privateSaleLive();
        
        assert(!isPrivateLive);
      });

      it("should start private sale", async () => {
        var bb = await base.createContract();

        await bb.goPresaleLive();
        var isPrivateLive = await bb.privateSaleLive();
        
        assert(isPrivateLive);
      });
      
      it("should whitelist for private sale", async () => {
        var bb = await base.createContract();

        await bb.addToPrivateSaleWhitelist([accounts[1], accounts[2]]);
        
        var whitelist = await bb.privateSaleWhiteList(accounts[1]);
        assert(whitelist);
        whitelist = await bb.privateSaleWhiteList(accounts[2]);
        assert(whitelist);
        whitelist = await bb.privateSaleWhiteList(accounts[3]);
        assert(!whitelist);
      });

      it("should not whitelist for private sale, not owner", async () => {
        var bb = await base.createContract();
        var user = accounts[4];

        try{
            await bb.addToPrivateSaleWhitelist([user], {from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var whitelist = await bb.privateSaleWhiteList(user);
        assert(!whitelist);
      });

      it("should not mint in private sale, not on whitelist", async () => {
        var bb = await base.createContract();
        var user = accounts[4];

        try{
            await bb.privateSaleMint(1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should mint in private sale", async () => {
        var bb = await base.createContract();
        var user = accounts[1];

        await bb.privateSaleMint(3, {value: new BN(mintCost).mul(new BN(3)), from: user});
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 3);
      });

      it("should not mint in private sale, not on enough eth sent", async () => {
        var bb = await base.createContract();
        var user = accounts[2];

        try{
            await bb.privateSaleMint(1, {value: "1000", from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should not mint in public sale, public not started", async () => {
        var bb = await base.createContract();
        var user = accounts[4];

        try{
            await bb.mint(1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should not mint in private sale, exceeds max count", async () => {
        var bb = await base.createContract();
        var user = accounts[2];

        try{
            await bb.privateSaleMint(3, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should remove from whitelist for private sale", async () => {
        var bb = await base.createContract();

        await bb.removeFromPrivateSaleWhitelist([accounts[2]]);
        
        var whitelist = await bb.privateSaleWhiteList(accounts[1]);
        assert(whitelist);
        whitelist = await bb.privateSaleWhiteList(accounts[2]);
        assert(!whitelist);
        whitelist = await bb.privateSaleWhiteList(accounts[3]);
        assert(!whitelist);
      });

      it("should not remove from whitelist for private sale, not owner", async () => {
        var bb = await base.createContract();
        var user = accounts[4];

        try{
            await bb.removeFromPrivateSaleWhitelist([accounts[1]], {from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var whitelist = await bb.privateSaleWhiteList(accounts[1]);
        assert(whitelist);
      });

      it("should not mint for private sale, removed from whitelist", async () => {
        var bb = await base.createContract();
        var user = accounts[2];

        try{
            await bb.privateSaleMint(1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await bb.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should mint from public sale after private sale", async () => {
        var bb = await base.createContract();

        await bb.goLive();

        var user = accounts[4];
        await bb.mint(1, {value: new BN(mintCost).mul(new BN(2)).mul(new BN(3)), from: user});
        
        var count = await bb.balanceOf(user);
        assert.equal(count, 1);
      });
});