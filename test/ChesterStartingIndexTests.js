var base = require("../modules/ChesterBaseTests");

const mintCost = "100000000000000000";
var BN = web3.utils.BN;

contract("ChesterNFT", async accounts => {
    var startIndex;
    var maxSupply;
    it("should mint with starting index is random", async () => {
        var chester = await base.createContract();
        var user = accounts[0];
        startIndex = await chester.startingIndex(); 
        maxSupply = await chester.maxSupply();
        
        await chester.goLive();
        await chester.mint(user, 1, { value: mintCost });
        
        var tokenOwnedBy = await chester.ownerOf(startIndex);
        
        assert.equal(tokenOwnedBy, user);
      });

      it("should mint the next 3", async () => {
        var chester = await base.createContract();
        var user = accounts[6];

        await chester.mint(user, 3, { value: new BN(mintCost).mul(new BN(3)).toString() , from: user });
        
        var tokenOwnedBy = await chester.ownerOf(base.getNewIndex(startIndex, 1, maxSupply));
        assert.equal(tokenOwnedBy, user);

        tokenOwnedBy = await chester.ownerOf(base.getNewIndex(startIndex, 2, maxSupply));
        assert.equal(tokenOwnedBy, user);

        tokenOwnedBy = await chester.ownerOf(base.getNewIndex(startIndex, 3, maxSupply));
        assert.equal(tokenOwnedBy, user);
      });

      it("should mint final, new user", async () => {
        var chester = await base.createContract();
        var user = accounts[7];

        await chester.mint(user, 1, { value: mintCost , from: user });
        
        var tokenOwnedBy = await chester.ownerOf(base.getNewIndex(startIndex, 4, maxSupply));
        assert.equal(tokenOwnedBy, user);
      });
});