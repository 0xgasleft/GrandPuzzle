


const SHARD_COUNT = 3;

const generateSignature = async (deployer, recipient, supply) => {
  const message = ethers.solidityPackedKeccak256(
    ["string", "uint256", "string", "address"],
    ["Token ID: ", supply, "Recipient: ", recipient]
  );

  console.log(`Keccak hash: ${message}`);

  const signature = await deployer.signMessage(ethers.getBytes(message));

  return signature;
}

const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


task("all", "Try everything related to theme2")
  .setAction(async (args, hre) => {

    const [deployer, minter1, minter2, minter3, minter4, minter5, minter6, minter7, minter8, minter9] = await hre.ethers.getSigners();
    console.log(`🔐Using deployer: ${deployer.address}`);
    console.log(`🔐Using minters: ${minter1.address}, ${minter2.address}, ${minter3.address}`);

    const ShardBurner = await hre.ethers.getContractFactory("ShardBurner");

    console.log(`📍Deploying ShardBurner..`);

    const shardBurner = await ShardBurner.deploy();
    await shardBurner.waitForDeployment();

    console.log(`✅ ShardBurner deployed to: ${await shardBurner.getAddress()}`);


    console.log(`📍Deploying PuzzleShard instances..`);
    const shards = [];

    for (let i = 0; i < SHARD_COUNT; i++) {
      const NAME = makeid(10);
      const SYMBOL = makeid(4); 
      const BASE_URI = "https://google.com";

      const PuzzleShard = await hre.ethers.getContractFactory("PuzzleShard");
      const shard = await PuzzleShard.deploy(NAME, SYMBOL, BASE_URI, await shardBurner.getAddress());
      await shard.waitForDeployment();
      console.log(`✅ PuzzleShard deployed to: ${await shard.getAddress()}`);
      console.log(`Initial: contract balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await shard.getAddress()))} MON`);
      shards.push(shard);
    }
    
    console.log(`Initial: shard burner: ${await shards[0].SHARD_BURNER()}`);
    console.log(`Initial: mint fee: ${await shards[0].getCurrentMintFee()}`);
    console.log(`Initial: block counter: ${await shards[0].block_counter()}`);
    

    console.log(`📍Enabling minting on all shards...`);

    for (const shard of shards) {
      const tx = await shard.setStatus(1);
      await tx.wait();
      console.log(`✅ Minting enabled on shard: ${await shard.getAddress()}`);
    }

    console.log(`After enabled: mint fee: ${await shards[0].getCurrentMintFee()}`);
    console.log(`After enabled: block counter: ${await shards[0].block_counter()}`);

    console.log(`📍Minting on all shards at day1..`);
    let mint_fee = await shards[0].getCurrentMintFee();
    console.log(`Mint fee: ${ethers.formatEther(mint_fee)} MON`);
    let counter = 0;
    for(const shard of shards) {
      let supply = 0;
      for (const minter of [minter1, minter2, minter3]) {
        console.log(`Minting on shard ${counter}: ${await shard.getAddress()} by: ${minter.address}`);
        const sig = await generateSignature(deployer, minter.address, supply);
        const tx = await shard.connect(minter).mintPuzzleShard(minter.address, sig, {value: mint_fee});
        await tx.wait();
        console.log(`✅ Minted on shard: ${await shard.getAddress()}`);
        console.log(`Holdings (token IDs) of ${minter.address}: ${await shard.getHoldings(minter.address)}`);
        supply++;
      }
      counter++;
    }

    console.log(`📍Minting on all shards at day7..`);
    /*for(let i = 0; i < 1_209_600; i++) {
      await hre.network.provider.send("evm_mine");
    }
    console.log(`After 7 days: block counter: ${await shards[0].block_counter()}`);*/
    mint_fee = await shards[0].getCurrentMintFee();
    console.log(`Mint fee: ${ethers.formatEther(mint_fee)} MON`);
    counter = 0;
    for(const shard of shards) {
      let supply = 3;
      for (const minter of [minter4, minter5, minter6]) {
        console.log(`Minting on shard ${counter}: ${await shard.getAddress()} by: ${minter.address}`);
        const sig = await generateSignature(deployer, minter.address, supply);
        const tx = await shard.connect(minter).mintPuzzleShard(minter.address, sig, {value: mint_fee});
        await tx.wait();
        console.log(`✅ Minted on shard: ${await shard.getAddress()}`);
        supply++;
      }
      counter++;
    }

    console.log(`📍Minting on all shards at day14..`);
    /*for(let i = 0; i < 1_209_600; i++) {
      await hre.network.provider.send("evm_mine");
    }
    console.log(`After 14 days: block counter: ${await shards[0].block_counter()}`);*/
    mint_fee = await shards[0].getCurrentMintFee();
    console.log(`Mint fee: ${ethers.formatEther(mint_fee)} MON`);
    counter = 0;
    for(const shard of shards) {
      let supply = 6;
      for (const minter of [minter7, minter8, minter9]) {
        console.log(`Minting on shard ${counter}: ${await shard.getAddress()} by: ${minter.address}`);
        const sig = await generateSignature(deployer, minter.address, supply);
        const tx = await shard.connect(minter).mintPuzzleShard(minter.address, sig, {value: mint_fee});
        await tx.wait();
        console.log(`✅ Minted on shard: ${await shard.getAddress()}`);
        supply++;
      }
      counter++;
    }


    console.log(`📍Transfering holdings of ${minter3.address} and ${minter2.address} to ${minter1.address}`);
    for (const shard of shards) {
      console.log(`Shard: ${await shard.getAddress()})`);
      const tx = await shard.connect(minter3).transferFrom(minter3.address, minter1.address, 2);
      await tx.wait();
      console.log(`✅ Transferred token ID 2 from ${minter3.address} to ${minter1.address}`);
      const tx2 = await shard.connect(minter2).transferFrom(minter2.address, minter1.address, 1);
      await tx2.wait();
      console.log(`✅ Transferred token ID 1 from ${minter2.address} to ${minter1.address}`);
    }

    for(const shard of shards) {
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter1.address}: ${await shard.getHoldings(minter1.address)}`);
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter2.address}: ${await shard.getHoldings(minter2.address)}`);
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter3.address}: ${await shard.getHoldings(minter3.address)}`);
    }


    console.log(`📍Withdrawing balances...`);
    console.log(`Current: Balance of deployer: ${ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} MON`);
    for (const shard of shards) {
      console.log(`Current: Shard (${await shard.getAddress()}) balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await shard.getAddress()))} MON`);
      try {
        const failingtx= await shard.connect(minter1).withdraw();
        await failingtx.wait();
      }
      catch (e) {
        console.log("Failed to withdraw with non-owner, as expected");
      }
      const tx = await shard.withdraw(deployer.address);
      await tx.wait();
      console.log(`✅ Withdrawn balance!`);
      console.log(`After withdraw: Shard (${await shard.getAddress()}) balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await shard.getAddress()))} MON`);
    }

    console.log(`After withdraw: Balance of deployer: ${ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} MON`);
    
    console.log(`📍Burning shards via impersonating..`);
    const shardBurnerSigner = await hre.ethers.getImpersonatedSigner(await shardBurner.getAddress());
    await hre.network.provider.send("hardhat_setBalance", [
      shardBurnerSigner.address,
      "0x1000000000000000000",
    ]);
    for (const shard of shards) {
      console.log("--------------------------------------------------------------");
      const holdings = await shard.getHoldings(minter1.address);
      console.log(`Before burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter1.address}: ${holdings}`);
      
      for(const tokenId of holdings) {
        console.log(`Burning token ID ${tokenId} on shard: ${await shard.getAddress()}`);
        try {
          const tx = await shard.connect(minter1).burn(minter1.address, tokenId);
          await tx.wait();
        }
        catch (e) {
          console.log("Failed to burn with non-shard-burner, as expected");
        }
        const tx = await shard.connect(shardBurnerSigner).burn(minter1.address, tokenId);
        await tx.wait();
        
        console.log(`✅ Burned token ID ${tokenId} on shard: ${await shard.getAddress()}`);
      }
      console.log(`After burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter1.address}: ${await shard.getHoldings(minter1.address)}`);
    }

    console.log(`📍Transfering holdings of ${minter6.address} and ${minter5.address} to ${minter4.address}`);
    for (const shard of shards) {
      console.log(`Shard: ${await shard.getAddress()})`);
      const tx = await shard.connect(minter6).transferFrom(minter6.address, minter4.address, 5);
      await tx.wait();
      console.log(`✅ Transferred token ID 2 from ${minter6.address} to ${minter4.address}`);
      const tx2 = await shard.connect(minter5).transferFrom(minter5.address, minter4.address, 4);
      await tx2.wait();
      console.log(`✅ Transferred token ID 1 from ${minter5.address} to ${minter4.address}`);
    }

    for(const shard of shards) {
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter4.address}: ${await shard.getHoldings(minter4.address)}`);
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter5.address}: ${await shard.getHoldings(minter5.address)}`);
      console.log(`Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter6.address}: ${await shard.getHoldings(minter6.address)}`);
    }

    console.log(`📍Batch burning via shard burner..`);
    
    console.log("Trying with burner disabled!");
    try {
      const tx = await shardBurner.connect(minter4).batchBurn();
      await tx.wait();
    }
    catch (e) {
      console.log("Failed to burn with disabled shard-burner, as expected");
      console.log(`Error: ${e}`);
    }

    console.log("Enabling shard burner...");
    const tx2 = await shardBurner.setStatus(1);
    await tx2.wait();
    console.log(`✅ Shard burner enabled!`);

    console.log("Trying with non-registered signer on burner!");
    try {
      const tx = await shardBurner.connect(minter4).batchBurn();
      await tx.wait();
    }
    catch (e) {
      console.log("Failed to burn with disabled shard-burner, as expected");
      console.log(`Error: ${e}`);
    }

    console.log(`Register for burn..`);
    const registertx = await shardBurner.connect(minter4).registerForBurn();
    await registertx.wait();
    console.log(`✅ Registered for burn on burner!`);
    

    console.log("Trying with no required shard set on burner!");
    try {
      const tx = await shardBurner.connect(minter4).batchBurn();
      await tx.wait();
    }
    catch (e) {
      console.log("Failed to burn with disabled shard-burner, as expected");
      console.log(`Error: ${e}`);
    }

    console.log(`Setting required shards in shard burner..`);
    const tx = await shardBurner.setRequiredShards(await Promise.all(shards.map(async (shard) => await shard.getAddress())));
    await tx.wait();
    console.log(`✅ Required shards set in shard burner: ${await shardBurner.getRequiredShards()}`);

    for(const shard of shards) {
      console.log("--------------------------------------------------------------");
      console.log(`Before batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter4.address}: ${await shard.getHoldings(minter4.address)}`);
      console.log(`Before batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter5.address}: ${await shard.getHoldings(minter5.address)}`);
      console.log(`Before batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter6.address}: ${await shard.getHoldings(minter6.address)}`);
    }
    console.log("--------------------------------------------------------------");
    console.log(`Before batch burn: Minter: ${minter4.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter4.address)}`);
    console.log(`Before batch burn: Minter: ${minter5.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter5.address)}`);
    console.log(`Before batch burn: Minter: ${minter6.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter6.address)}`);

    const burningtx = await shardBurner.connect(minter4).batchBurn();
    await burningtx.wait();
    console.log(`✅ Batch burn completed!`);

    for(const shard of shards) {
      console.log("--------------------------------------------------------------");
      console.log(`After batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter4.address}: ${await shard.getHoldings(minter4.address)}`);
      console.log(`After batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter5.address}: ${await shard.getHoldings(minter5.address)}`);
      console.log(`After batch burn: Shard: ${await shard.getAddress()}, Holdings (token IDs) of ${minter6.address}: ${await shard.getHoldings(minter6.address)}`);
    }

    console.log("--------------------------------------------------------------");
    console.log(`After batch burn: Minter: ${minter4.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter4.address)}`);
    console.log(`After batch burn: Minter: ${minter5.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter5.address)}`);
    console.log(`After batch burn: Minter: ${minter6.address} has completed burn: ${await shardBurner.hasCompletedBurn(minter6.address)}`);
    

    console.log("End of all tasks.");
      
    
  });