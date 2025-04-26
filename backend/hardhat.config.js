require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  },
  networks: {
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      chainId: 1287,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};