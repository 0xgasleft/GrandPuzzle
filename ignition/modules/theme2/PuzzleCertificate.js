const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");




const NAME = "GrandPuzzle_Infra";
const SYMBOL = "GPIF"; 
const MINT_FEE = ethers.parseEther("2");
const SHARD_BURNER = "";

module.exports = buildModule("DeployPuzzleCertificate", (m) => {

    const deployment = m.contract("PuzzleCertificate", [NAME, SYMBOL, MINT_FEE, SHARD_BURNER]);
  
    return deployment;
});
