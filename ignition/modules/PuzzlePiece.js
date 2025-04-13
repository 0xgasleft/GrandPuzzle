// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

const PIECE_NAME = "Piece1";
const PIECE_SYMBOL = "PC1";
const MINT_FEE = "0.001";
const WHITELIST = [];


module.exports = buildModule("DeployPuzzlePiece", (m) => {

  const puzzlePiece = m.contract("GrandPuzzlePiece", [PIECE_NAME, PIECE_SYMBOL, ethers.parseEther(MINT_FEE), WHITELIST]);

  return { puzzlePiece };
});
