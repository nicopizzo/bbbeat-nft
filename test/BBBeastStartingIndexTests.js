// var base = require("../modules/BBBeastBaseTests");

// const mintCost = "100000000000000000";
// var BN = web3.utils.BN;

// contract("BBBeastNFT", async accounts => {
//     var startIndex;
//     var maxSupply;
//     it("should mint with starting index is random", async () => {
//         var bb = await base.createContract();
//         var user = accounts[0];
//         startIndex = await bb.startingIndex(); 
//         maxSupply = await bb.maxSupply();
        
//         await bb.goLive();
//         await bb.mint(1, { value: mintCost });
        
//         var tokenOwnedBy = await bb.ownerOf(startIndex);
        
//         assert.equal(tokenOwnedBy, user);
//       });

//       it("should mint the next 3", async () => {
//         var bb = await base.createContract();
//         var user = accounts[6];

//         await bb.mint(3, { value: new BN(mintCost).mul(new BN(3)).toString() , from: user });
        
//         var tokenOwnedBy = await bb.ownerOf(base.getNewIndex(startIndex, 1, maxSupply));
//         assert.equal(tokenOwnedBy, user);

//         tokenOwnedBy = await bb.ownerOf(base.getNewIndex(startIndex, 2, maxSupply));
//         assert.equal(tokenOwnedBy, user);

//         tokenOwnedBy = await bb.ownerOf(base.getNewIndex(startIndex, 3, maxSupply));
//         assert.equal(tokenOwnedBy, user);
//       });

//       it("should mint final, new user", async () => {
//         var bb = await base.createContract();
//         var user = accounts[7];

//         await bb.mint(1, { value: mintCost , from: user });
        
//         var tokenOwnedBy = await bb.ownerOf(base.getNewIndex(startIndex, 4, maxSupply));
//         assert.equal(tokenOwnedBy, user);
//       });
// });