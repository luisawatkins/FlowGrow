require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    flowTestnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      chainId: 2076538,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: 'flow-testnet', // Flow doesn't require API key
    },
    customChains: [
      {
        network: 'flowTestnet',
        chainId: 2076538,
        urls: {
          apiURL: 'https://testnet.flowscan.org/api',
          browserURL: 'https://testnet.flowscan.org',
        },
      },
    ],
  },
}
