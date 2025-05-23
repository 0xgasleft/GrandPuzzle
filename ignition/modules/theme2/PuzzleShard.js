const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");


const SHARD_BURNER = "";
const BASE_URI = "";

const DEPLOY_DATA = [
  ["", "", BASE_URI, SHARD_BURNER]
];

module.exports = buildModule("DeployPuzzleShards", (m) => {
  const deployments = {};

  DEPLOY_DATA.forEach(([name, symbol, uri, shard_burner], index) => {
    const contractName = `PuzzleShard_${symbol}`;
    deployments[contractName] = m.contract("PuzzleShard", [name, symbol, uri, shard_burner], {id: contractName});
  });

  return deployments;
});
