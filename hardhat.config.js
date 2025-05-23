require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path: __dirname + '/.env' });
//require("./tasks/theme1/puzzle_piece");
//require("./tasks/theme1/puzzle_certificate");
require("./tasks/theme2/puzzle_all");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com"
  },
  etherscan: {
    enabled: false
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MONAD_TESTNET_RPC
      }
    },
    monadtestnet: {
      url: process.env.MONAD_TESTNET_RPC,
      accounts: [process.env.SOURCE_PK]
    }
  }
};
