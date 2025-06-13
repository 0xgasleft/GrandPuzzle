const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


const REQUIRED_SHARDS = [];



module.exports = buildModule("DeployShardBurner", (m) => {

    const deployment = m.contract("ShardBurner");
  
    return deployment;
});
