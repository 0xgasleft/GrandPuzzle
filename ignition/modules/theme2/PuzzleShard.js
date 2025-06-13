const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const SHARD_BURNER = "0xeD2edd39f6663a8b8bCC4dA9998bfa76f1D4277F";
const BASE_URI = "";

const DEPLOY_DATA = [
  ["StandardProtocol", "STND", BASE_URI, SHARD_BURNER],
  ["Rubic", "RBC", BASE_URI, SHARD_BURNER],
  ["iZumiFinance", "IZIF", BASE_URI, SHARD_BURNER],
  ["FolksFinance", "FOLKS", BASE_URI, SHARD_BURNER],
  ["CrystalExchange", "CRYSTAL", BASE_URI, SHARD_BURNER],
  ["MeowFinance", "MEOW", BASE_URI, SHARD_BURNER]
];

module.exports = buildModule("DeployPuzzleShards", (m) => {
  const deployments = {};

  DEPLOY_DATA.forEach(([name, symbol, uri, shard_burner], index) => {
    const contractName = `PuzzleShard_${symbol}`;
    deployments[contractName] = m.contract("PuzzleShard", [name, symbol, uri, shard_burner], {id: contractName});
  });

  return deployments;
});
