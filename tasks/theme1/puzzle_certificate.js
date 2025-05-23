


task("test-with-fork", "Test certificate minting")
  .setAction(async (args, hre) => {

    const REQUIRED_PIECES = [
      "0x32c25465e9f4b198163F474942007AFcE9ceeff9",
      "0xdB2164F3e8A842C27580FD0188c04ae150318F36",
      "0xDbD9C74F496281E4bb30AB257ba735073F808E7a",
      "0xD09327D736249e786220673a8df0aE2F38270735",
      "0xebFF4b706ebB7aa1a6695dbcd67dF2642C803c7C",
      "0xB45a50C8744C9a1b683360CE7e60e11e31D127aC",
      "0x565325eF8a36B5e0Aa9A92c69F93A425938382CC",
      "0x554D87217F6818C8A47a3C0Ec348c6d888CE5985",
      "0x8794498a491A74b6f2Dbf73E5F5542A054c89653",
      "0x137bf4DcF9b562345001D2b4F3e0F2ed0070Ef4D",
      "0xBB347c44c7cf878e12D6fD559AaA302Af4e8fb3D",
      "0x2A4aef44845777BF9ebef9F4B4BBB264d9585339",
      "0x76C249a8C363C8bA6Ae9d27372c1709A66e668F7",
      "0xD0036D99457d3Ce3a8a2f8416ECF69Ca3bE92Bb7",
      "0xcB8a648074C1Fea3FFC26dfb10BbCec5E7d3Db1e",
      "0xB3aa50F3E543E0A848b4d983F6Fa9F2155b957CE",
      "0x0c0c4dCE614e36335255bF54Dcc9279b19BA06B6",
      "0x7f7DfeAc59ED41c1c261B6A331Fc3fCA604f4f07"
    ]
    const SHARDS = [
      ["0x32c25465e9f4b198163F474942007AFcE9ceeff9", 3732],
      ["0xdB2164F3e8A842C27580FD0188c04ae150318F36", 3266],
      ["0xDbD9C74F496281E4bb30AB257ba735073F808E7a", 3080],
      ["0xD09327D736249e786220673a8df0aE2F38270735", 2895],
      ["0xebFF4b706ebB7aa1a6695dbcd67dF2642C803c7C", 2669],
      ["0xB45a50C8744C9a1b683360CE7e60e11e31D127aC", 2603],
      ["0x565325eF8a36B5e0Aa9A92c69F93A425938382CC", 2076],
      ["0x554D87217F6818C8A47a3C0Ec348c6d888CE5985", 1805],
      ["0x8794498a491A74b6f2Dbf73E5F5542A054c89653", 1760],
      ["0x137bf4DcF9b562345001D2b4F3e0F2ed0070Ef4D", 1699],
      ["0xBB347c44c7cf878e12D6fD559AaA302Af4e8fb3D", 1491],
      ["0x2A4aef44845777BF9ebef9F4B4BBB264d9585339", 1229],
      ["0x76C249a8C363C8bA6Ae9d27372c1709A66e668F7", 923],
      ["0xD0036D99457d3Ce3a8a2f8416ECF69Ca3bE92Bb7", 712],
      ["0xcB8a648074C1Fea3FFC26dfb10BbCec5E7d3Db1e", 0],
      ["0xB3aa50F3E543E0A848b4d983F6Fa9F2155b957CE", 0],
      ["0x0c0c4dCE614e36335255bF54Dcc9279b19BA06B6", 0],
      ["0x7f7DfeAc59ED41c1c261B6A331Fc3fCA604f4f07", 0]
    ]
    const NAME = "GrandPuzzle_ArtCulture";
    const SYMBOL = "GPAC"; 
    const MINT_FEE = ethers.parseEther("2");

    const [deployer] = await hre.ethers.getSigners();

    const GrandPuzzleCertificate = await hre.ethers.getContractFactory("GrandPuzzleCertificate");
    
    console.log(`🔐Using signer: ${deployer.address}`);

    console.log(`📍Deploying GrandPuzzleCertificate..`);

    const instance = await GrandPuzzleCertificate.deploy(
      NAME, SYMBOL, MINT_FEE, REQUIRED_PIECES
    );
    await instance.waitForDeployment();

    console.log(`✅ GrandPuzzleCertificate deployed to: ${await instance.getAddress()}`);


    console.log(`Setting base URI to: https://grandpuzzle.art/`);
    const tx = await instance.setBaseURI("https://grandpuzzle.art/");

    await tx.wait();

    console.log(`✅ Base URI set to: ${await instance.baseTokenURI()}`);

    console.log(`Current mint fee: ${ethers.formatEther(await instance.mint_fee())} MON`);

    console.log(`Setting mint fee to: 2.1 MON`);

    const tx2 = await instance.setMintFee(ethers.parseEther("2.1"));

    await tx2.wait();

    console.log(`✅ Mint fee set to: ${ethers.formatEther(await instance.mint_fee())} MON`);


    const MINTER_PK = process.env.MINTER_PK;
    const minter = new ethers.Wallet(MINTER_PK, hre.ethers.provider);

    console.log(`🔐Using minter: ${minter.address}`);
    
    console.log(`Contract balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await instance.getAddress()))} MON`);
    console.log(`Minter balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await minter.address))} MON`);
    console.log(`Deployer balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await deployer.address))} MON`);


    try {
      console.log(`Minting certificate while minting disabled...`);

      const tx3 = await instance.connect(minter).mint(minter.address, SHARDS, {
        value: ethers.parseEther("2")
      });
      await tx3.wait();

    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }
    
    console.log(`Enabling minting...`);

    const tx4 = await instance.setStatus(1);

    await tx4.wait();

    console.log(`✅ Minting enabled: ${await instance.status()}`);

    try {
      console.log(`Minting certificate with low mint fee...`);

      const tx5 = await instance.connect(minter).mint(minter.address, SHARDS, {
        value: ethers.parseEther("2")
      });
      await tx5.wait();
    }

    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }

    try {
      console.log(`Minting certificate to address not owning shards...`);

      const tx6 = await instance.connect(minter).mint(deployer.address, SHARDS, {
        value: ethers.parseEther("2.1")

      });
      await tx6.wait();
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }

    try {
      console.log(`Minting certificate to user missing shard...`);

      const MISSING_SHARDS = SHARDS.slice(1, SHARDS.length);
      const tx6 = await instance.connect(minter).mint(minter.address, MISSING_SHARDS, {
        value: ethers.parseEther("2.1")

      });
      await tx6.wait();
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }

    try {
      console.log(`Minting certificate with bad shard list...`);

      const BAD_SHARDS = JSON.parse(JSON.stringify(SHARDS));
      BAD_SHARDS[0][0] = ethers.ZeroAddress;
      const tx6 = await instance.connect(minter).mint(minter.address, BAD_SHARDS, {
        value: ethers.parseEther("2.1")

      });
      await tx6.wait();
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }


    let tx7;
    try {
      console.log(`Minting certificate correctly...`);
      tx7 = await instance.connect(minter).mint(minter.address, SHARDS, {
        value: ethers.parseEther("2.1")
      });
      await tx7.wait();
      
      console.log(`✅ Minted certificate at: ${tx7.hash}`);
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }

    try {
      console.log(`Minting certificate to user already minted...`);

      const tx7 = await instance.connect(minter).mint(minter.address, SHARDS, {
        value: ethers.parseEther("2.1")
      });
      await tx7.wait();
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }


    console.log("Transfering used shards to another user...");
    for(const shard of SHARDS) {
      const shardInstance = await hre.ethers.getContractAt("GrandPuzzlePiece", shard[0], minter);

      const tx = await shardInstance.transferFrom(
        minter.address,
        deployer.address,
        shard[1]
      );
      await tx.wait();
    }

    console.log("✅ Shards transfered successfully");

    try {
      console.log(`Minting certificate to user that received already used shards...`);

      const tx7 = await instance.connect(minter).mint(deployer.address, SHARDS, {
        value: ethers.parseEther("2.1")
      });
      await tx7.wait();
    }
    catch (error) {
      console.error(`❌ Error minting certificate: ${error}`);
    }

    console.log(`After mint: Contract balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await instance.getAddress()))} MON`);
    console.log(`After mint: Minter balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await minter.address))} MON`);
    console.log(`After mint: Deployer balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await deployer.address))} MON`);

    try {
      
      console.log(`Withdrawing funds with unauthorized user...`);
      const tx8 = await instance.connect(minter).withdraw(minter.address);
      await tx8.wait();

    }
    catch (error) {
      console.error(`❌ Error withdrawing funds: ${error}`);
    }

    try {
      
      console.log(`Withdrawing funds correctly...`);
      const tx8 = await instance.withdraw(minter.address);
      await tx8.wait();

    }
    catch (error) {
      console.error(`❌ Error withdrawing funds: ${error}`);
    }

    console.log(`After withdraw: Contract balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await instance.getAddress()))} MON`);
    console.log(`After withdraw: Minter balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await minter.address))} MON`);
    console.log(`After withdraw: Deployer balance: ${ethers.formatEther(await hre.ethers.provider.getBalance(await deployer.address))} MON`);
    
    console.log("End of tests");

  });

