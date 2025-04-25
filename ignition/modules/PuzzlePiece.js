const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const MINT_FEE = ethers.parseEther("0.1");
const WHITELIST = [];

const DEPLOY_DATA = [
  ["MonadNomads", "MND", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Monadsters", "MSR", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Canz", "CNZ", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["MOP", "MOP", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Mutantgents", "MUTA", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Coronad", "CND", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"],
  ["Monadians", "MDN", MINT_FEE, WHITELIST, "https://arweave.net/O11hcWskT-1YPDTUIAK8mC0BJvIBFBizCPAxeGR3Ia8/"]
];

module.exports = buildModule("DeployPuzzlePieces", (m) => {
  const deployments = {};

  DEPLOY_DATA.forEach(([name, symbol, fee, whitelist, uri], index) => {
    const contractName = `GrandPuzzlePiece_${symbol}`;
    deployments[contractName] = m.contract("GrandPuzzlePiece", [name, symbol, fee, whitelist, uri], {id: contractName});
  });

  return deployments;
});
