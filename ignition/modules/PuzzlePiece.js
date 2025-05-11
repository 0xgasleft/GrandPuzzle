const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const MINT_FEE = ethers.parseEther("0.1");
const WHITELIST = [];

const DEPLOY_DATA = [
  ["MonadioBabies", "MBB", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Monadoon", "MDO", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["RugRumble", "RRB", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Mintpad", "MPD", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["LootGO", "LGO", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Salmoheroo", "SHRO", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Llamao", "LAO", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
];

module.exports = buildModule("DeployPuzzlePieces", (m) => {
  const deployments = {};

  DEPLOY_DATA.forEach(([name, symbol, fee, whitelist, uri], index) => {
    const contractName = `GrandPuzzlePiece_${symbol}`;
    deployments[contractName] = m.contract("GrandPuzzlePiece", [name, symbol, fee, whitelist, uri], {id: contractName});
  });

  return deployments;
});
