
const generateSignature = async (deployer, recipient, supply) => {
  const message = ethers.solidityPackedKeccak256(
    ["string", "uint256", "string", "address"],
    ["Token ID: ", supply, "Recipient: ", recipient]
  );

  const signature = await deployer.signMessage(ethers.getBytes(message));

  return signature;
}

task("set-mint-fee", "Sets the mint fee on GrandPuzzlePiece")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("fee", "The new mint fee to set")
  .setAction(async ({ address, fee }, hre) => {

    const [deployer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    console.log(`Using signer: ${deployer.address}`);
    console.log(`Setting mint fee to: ${fee}`);

    console.log(`Current mint fee: ${ethers.formatEther(await contract.mint_fee())}`);
    const tx = await contract.setMintFee(ethers.parseEther(fee));
    await tx.wait();

    console.log(`New mint fee: ${ethers.formatEther(await contract.mint_fee())}`);

  });

task("set-base-uri", "Sets and reads base URI on GrandPuzzlePiece")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("uri", "The new baseTokenURI to set")
  .setAction(async ({ address, uri }, hre) => {

    const [deployer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    console.log(`🔐 Using signer: ${deployer.address}`);
    console.log(`📍 Setting base URI to: ${uri}`);

    const tx = await contract.setBaseURI(uri);
    await tx.wait();

    const baseUri = await contract.baseTokenURI();
    console.log(`✅ Base URI is now: ${baseUri}`);
    
  });

task("set-phase", "Sets the minting phase on GrandPuzzlePiece")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("phase", "The new minting phase to set (DISABLED, WHITELISTED, PUBLIC)")
  .setAction(async ({ address, phase }, hre) => {

    const MissionStatus = Object.freeze({
      DISABLED: 0,
      WHITELISTED: 1,
      PUBLIC: 2
    });

    if(!Object.keys(MissionStatus).includes(phase)) {
      console.error(`Invalid phase: ${phase}. Must be one of: ${Object.keys(MissionStatus).join(", ")}`);
      return;
    }

    const [deployer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    console.log(`Using signer: ${deployer.address}`);
    console.log(`Setting minting phase to: ${phase}`);

    const tx = await contract.setStatus(MissionStatus[phase]);
    await tx.wait();

    const status = await contract.status();
    console.log(`Minting phase is now: ${Object.keys(MissionStatus).find(key => MissionStatus[key] == status)}`);

  });

task("public-mint", "Mints a new GrandPuzzlePiece NFT")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .setAction(async ({ address }, hre) => {

    const [deployer, minter1, minter2, minter3] = await hre.ethers.getSigners();

    const contractForMinter1 = await hre.ethers.getContractAt("GrandPuzzlePiece", address, minter1);

    console.log(`Using signer: ${deployer.address}`);

    const supply1 = await contractForMinter1.totalSupply();
    console.log(`Current supply: ${Number(supply1)}`);
    const signature1 = await generateSignature(deployer, minter1.address, Number(supply1));
    console.log(`Signature: ${signature1}`);

    console.log(`Minting NFT to: ${minter1.address}`);

    const tx1 = await contractForMinter1.publicMintPuzzlePiece(minter1.address, signature1, { value: ethers.parseEther("0.1") });
    await tx1.wait();

    console.log(`Minted NFT to: ${minter1.address}`);

    console.log("--------------------------------------------------------------------------");

    const contractForMinter2 = await hre.ethers.getContractAt("GrandPuzzlePiece", address, minter2);

    console.log(`Using signer: ${deployer.address}`);

    const supply2 = await contractForMinter2.totalSupply();
    console.log(`Current supply: ${Number(supply2)}`);
    const signature2 = await generateSignature(deployer, minter2.address, Number(supply2));
    console.log(`Signature: ${signature2}`);

    console.log(`Minting NFT to: ${minter2.address}`);

    const tx2 = await contractForMinter2.publicMintPuzzlePiece(minter2.address, signature2, { value: ethers.parseEther("0.1") });
    await tx2.wait();

    console.log(`Minted NFT to: ${minter2.address}`);

    console.log("--------------------------------------------------------------------------");

    const contractForMinter3 = await hre.ethers.getContractAt("GrandPuzzlePiece", address, minter3);

    console.log(`Using signer: ${deployer.address}`);

    const supply3 = await contractForMinter3.totalSupply();
    console.log(`Current supply: ${Number(supply3)}`);
    const signature3 = await generateSignature(deployer, minter3.address, Number(supply3));
    console.log(`Signature: ${signature3}`);

    console.log(`Minting NFT to: ${minter2.address}`);

    const tx3 = await contractForMinter3.publicMintPuzzlePiece(minter3.address, signature3, { value: ethers.parseEther("0.1") });
    await tx3.wait();

    console.log(`Minted NFT to: ${minter3.address}`);

  });

task("whitelist-mint", "Mints a new GrandPuzzlePiece NFT for a whitelisted address")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .setAction(async ({ address }, hre) => {

    const [deployer, minter1] = await hre.ethers.getSigners();

    const contractForMinter1 = await hre.ethers.getContractAt("GrandPuzzlePiece", address, minter1);

    console.log(`Using signer: ${deployer.address}`);

    console.log(`Minting NFT to: ${minter1.address}`);

    const supply = await contractForMinter1.totalSupply();
    console.log(`Current supply: ${Number(supply)}`);
    const signature = await generateSignature(deployer, minter1.address, Number(supply));
    console.log(`Signature: ${signature}`);

    const tx =  await contractForMinter1.whitelistMintPuzzlePiece(minter1.address, signature, { value: ethers.parseEther("0.1") });
    await tx.wait();

    console.log(`Minted NFT to: ${minter1.address}`);

  });

task("add-to-whitelist", "Adds an address to the whitelist")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("whitelistable", "The address to add to the whitelist")
  .setAction(async ({ address, whitelistable }, hre) => {

    const [deployer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    console.log(`Using signer: ${deployer.address}`);
    console.log(`Adding to whitelist: ${whitelistable}`);

    const tx = await contract.addToWhitelist([whitelistable]);
    await tx.wait();

    const isWhitelisted = await contract.isWhitelisted(whitelistable);
    console.log(`Is whitelisted: ${isWhitelisted}`);

  });

task("remove-from-whitelist", "Removes an address from the whitelist")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("removable", "The address to remove from the whitelist")
  .setAction(async ({ address, removable }, hre) => {

    const [deployer] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    console.log(`Using signer: ${deployer.address}`);
    console.log(`Removing from whitelist: ${removable}`);

    const tx = await contract.removeFromWhitelist([removable]);
    await tx.wait();

    const isWhitelisted = await contract.isWhitelisted(removable);
    console.log(`Is whitelisted: ${isWhitelisted}`);

  });

task("withdraw", "Withdraws the contract balance")
  .addParam("address", "The deployed GrandPuzzlePiece contract address")
  .addParam("recipient", "The address to withdraw to")
  .setAction(async ({ address, recipient }, hre) => {

    const [deployer, minter1] = await hre.ethers.getSigners();

    const contract = await hre.ethers.getContractAt("GrandPuzzlePiece", address);

    const balanceOfContract = await hre.ethers.provider.getBalance(address);
    console.log(`Contract balance: ${ethers.formatEther(balanceOfContract)}`);

    console.log(`Using signer: ${deployer.address}`);
    console.log(`Withdrawing to: ${recipient}`);

    const tx = await contract.withdraw(minter1.address);
    await tx.wait();

    const balance = await hre.ethers.provider.getBalance(recipient);
    console.log(`Balance of recipient: ${ethers.formatEther(balance)}`);

  });