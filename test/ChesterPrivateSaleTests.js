var base = require("../modules/ChesterBaseTests");

const mintCost = "50000000000000000";
var BN = web3.utils.BN;

contract("ChesterNFT", async accounts => {
    it("should not mint in private sale, sale not started", async () => {
        var chester = await base.createContract();
        var user = accounts[0];

        try{
            await chester.privateSaleMint(user, 1, { value: mintCost });
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
        
        var numberOwned = await chester.balanceOf(user);
        
        assert.equal(numberOwned, 0);
      });

      it("should not start private sale, not owner", async () => {
        var chester = await base.createContract();
        var user = accounts[1];

        try{
            await chester.goPresaleLive({ from: user });
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
        
        var isPrivateLive = await chester.privateSaleLive();
        
        assert(!isPrivateLive);
      });

      it("should start private sale", async () => {
        var chester = await base.createContract();

        await chester.goPresaleLive();
        var isPrivateLive = await chester.privateSaleLive();
        
        assert(isPrivateLive);
      });
      
      it("should whitelist for private sale", async () => {
        var chester = await base.createContract();

        await chester.addToPrivateSaleWhitelist([accounts[1], accounts[2]]);
        
        var whitelist = await chester.getPrivateSaleWhitelist(accounts[1]);
        assert(whitelist);
        whitelist = await chester.getPrivateSaleWhitelist(accounts[2]);
        assert(whitelist);
        whitelist = await chester.getPrivateSaleWhitelist(accounts[3]);
        assert(!whitelist);
      });

      it("should not whitelist for private sale, not owner", async () => {
        var chester = await base.createContract();
        var user = accounts[4];

        try{
            await chester.addToPrivateSaleWhitelist([user], {from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var whitelist = await chester.getPrivateSaleWhitelist(user);
        assert(!whitelist);
      });

      it("should not mint in private sale, not on whitelist", async () => {
        var chester = await base.createContract();
        var user = accounts[4];

        try{
            await chester.privateSaleMint(user, 1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should mint in private sale", async () => {
        var chester = await base.createContract();
        var user = accounts[1];

        await chester.privateSaleMint(user, 2, {value: new BN(mintCost).mul(new BN(2)), from: user});
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 2);
      });

      it("should not mint in private sale, not on enough eth sent", async () => {
        var chester = await base.createContract();
        var user = accounts[2];

        try{
            await chester.privateSaleMint(user, 1, {value: "1000", from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should not mint in public sale, public not started", async () => {
        var chester = await base.createContract();
        var user = accounts[4];

        try{
            await chester.mint(user, 1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should not mint in private sale, exceeds max private count", async () => {
        var chester = await base.createContract();
        var user = accounts[1];

        try{
            await chester.privateSaleMint(user, 1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 2);
      });

      it("should remove from whitelist for private sale", async () => {
        var chester = await base.createContract();

        await chester.removeFromPrivateSaleWhitelist([accounts[2]]);
        
        var whitelist = await chester.getPrivateSaleWhitelist(accounts[1]);
        assert(whitelist);
        whitelist = await chester.getPrivateSaleWhitelist(accounts[2]);
        assert(!whitelist);
        whitelist = await chester.getPrivateSaleWhitelist(accounts[3]);
        assert(!whitelist);
      });

      it("should not remove from whitelist for private sale, not owner", async () => {
        var chester = await base.createContract();
        var user = accounts[4];

        try{
            await chester.removeFromPrivateSaleWhitelist([accounts[1]], {from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var whitelist = await chester.getPrivateSaleWhitelist(accounts[1]);
        assert(whitelist);
      });

      it("should mint for private sale, removed from whitelist", async () => {
        var chester = await base.createContract();
        var user = accounts[2];

        try{
            await chester.privateSaleMint(user, 1, {value: mintCost, from: user});
            assert.fail("The transaction should have thrown an error.");
          }
          catch(err){
            assert.include(err.message, "revert", "The error message should contain 'revert'");
          }
             
        var count = await chester.balanceOf(user);
        assert.equal(count, 0);
      });

      it("should mint from public sale after private sale", async () => {
        var chester = await base.createContract();

        await chester.goLive();

        var user = accounts[1];
        await chester.mint(user, 3, {value: new BN(mintCost).mul(new BN(2)).mul(new BN(3)), from: user});
        
        var count = await chester.balanceOf(user);
        assert.equal(count, 5);
      });
});