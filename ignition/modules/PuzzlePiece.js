// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const PIECE_NAME = "Molandaks";
const PIECE_SYMBOL = "MLDK";
const MINT_FEE = "0.1";
const WHITELIST = [];


module.exports = buildModule("DeployPuzzlePiece", (m) => {

  const puzzlePiece = m.contract("GrandPuzzlePiece", [PIECE_NAME, PIECE_SYMBOL, ethers.parseEther(MINT_FEE), WHITELIST]);

  return { puzzlePiece };
});
