require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // Add other networks as needed
    sepolia: {
      url: process.env.INFURA_API_KEY
        ? `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
        : process.env.ALCHEMY_API_KEY
          ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
          : "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.INFURA_API_KEY
        ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : process.env.ALCHEMY_API_KEY
          ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
          : "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
}
