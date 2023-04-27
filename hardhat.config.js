require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

const ARBITRUM_MAINNET_RPC_URL = process.env.ARBITRUM_MAINNET_RPC_URL;
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL;

const ARBITRUM_WALLET_PRIVATE_KEY = process.env.ARBITRUM_WALLET_PRIVATE_KEY;
const ETHERSCAN_ARBITRUM_API_KEY = process.env.ETHERSCAN_ARBITRUM_API_KEY;

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }

});

module.exports = {
  mocha: {
    timeout: 10000000000,
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: ETHERSCAN_ARBITRUM_API_KEY,
      arbitrumOne: ETHERSCAN_ARBITRUM_API_KEY

    },
    timeout: 60000  // increase timeout to 1 minute (default is 20000ms)
  },
  networks: {
    arbitrumGoerli: {
      url: ARBITRUM_TESTNET_RPC_URL, 
      accounts: [ARBITRUM_WALLET_PRIVATE_KEY],
      chainId: 421613,
    },
    arbitrumOne: {
      url: ARBITRUM_MAINNET_RPC_URL, 
      accounts: [ARBITRUM_WALLET_PRIVATE_KEY],
      chainId: 42161,
    },
    
  },

};
