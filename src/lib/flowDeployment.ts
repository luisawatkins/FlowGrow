// Flow Deployment Configuration and Scripts
// This file contains deployment configuration for Flow blockchain

export const FLOW_DEPLOYMENT_CONFIG = {
  // Network configurations
  networks: {
    testnet: {
      accessNode: 'https://rest-testnet.onflow.org',
      discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
      flowScan: 'https://testnet.flowscan.org',
      chainId: 'testnet',
    },
    mainnet: {
      accessNode: 'https://rest-mainnet.onflow.org',
      discoveryWallet: 'https://fcl-discovery.onflow.org/mainnet/authn',
      flowScan: 'https://flowscan.org',
      chainId: 'mainnet',
    },
  },
  
  // Contract deployment order
  deploymentOrder: [
    'PropertyNFT',
    'PropertyMarketplace',
  ],
  
  // Contract configurations
  contracts: {
    PropertyNFT: {
      name: 'PropertyNFT',
      path: './src/contracts/PropertyNFT.cdc',
      dependencies: [
        'NonFungibleToken',
        'MetadataViews',
      ],
      constructorArgs: [],
    },
    PropertyMarketplace: {
      name: 'PropertyMarketplace',
      path: './src/contracts/PropertyMarketplace.cdc',
      dependencies: [
        'PropertyNFT',
        'NonFungibleToken',
        'FungibleToken',
        'FlowToken',
      ],
      constructorArgs: ['PropertyNFT'],
    },
  },
}

// Deployment scripts for Flow CLI
export const DEPLOYMENT_SCRIPTS = {
  // Deploy PropertyNFT contract
  deployPropertyNFT: `
    #!/bin/bash
    # Deploy PropertyNFT contract to Flow testnet
    
    echo "Deploying PropertyNFT contract..."
    
    # Deploy the contract
    flow accounts create-contract PropertyNFT \\
      --contract-name PropertyNFT \\
      --contract-path ./src/contracts/PropertyNFT.cdc \\
      --signer testnet-account \\
      --network testnet
    
    echo "PropertyNFT contract deployed successfully!"
    echo "Contract address: \$(flow accounts get-contract PropertyNFT --network testnet)"
  `,
  
  // Deploy PropertyMarketplace contract
  deployPropertyMarketplace: `
    #!/bin/bash
    # Deploy PropertyMarketplace contract to Flow testnet
    
    echo "Deploying PropertyMarketplace contract..."
    
    # Get PropertyNFT contract address
    PROPERTY_NFT_ADDRESS=\$(flow accounts get-contract PropertyNFT --network testnet)
    
    # Deploy the contract
    flow accounts create-contract PropertyMarketplace \\
      --contract-name PropertyMarketplace \\
      --contract-path ./src/contracts/PropertyMarketplace.cdc \\
      --signer testnet-account \\
      --network testnet \\
      --args PropertyNFT:${PROPERTY_NFT_ADDRESS}
    
    echo "PropertyMarketplace contract deployed successfully!"
    echo "Contract address: \$(flow accounts get-contract PropertyMarketplace --network testnet)"
  `,
  
  // Verify contracts
  verifyContracts: `
    #!/bin/bash
    # Verify deployed contracts
    
    echo "Verifying contracts..."
    
    # Verify PropertyNFT
    flow accounts verify-contract PropertyNFT \\
      --contract-name PropertyNFT \\
      --contract-path ./src/contracts/PropertyNFT.cdc \\
      --network testnet
    
    # Verify PropertyMarketplace
    flow accounts verify-contract PropertyMarketplace \\
      --contract-name PropertyMarketplace \\
      --contract-path ./src/contracts/PropertyMarketplace.cdc \\
      --network testnet
    
    echo "All contracts verified successfully!"
  `,
  
  // Setup test account
  setupTestAccount: `
    #!/bin/bash
    # Setup test account for PropertyNFT
    
    echo "Setting up test account..."
    
    # Create test account
    flow accounts create \\
      --key 0x$(flow keys generate --seed "test-seed" --key-type ecdsa-secp256k1) \\
      --network testnet
    
    # Setup account for PropertyNFT
    flow transactions send \\
      --transaction ./src/transactions/setupAccount.cdc \\
      --signer testnet-account \\
      --network testnet
    
    echo "Test account setup complete!"
  `,
}

// Flow CLI commands for contract interaction
export const FLOW_CLI_COMMANDS = {
  // Get contract address
  getContractAddress: (contractName: string, network: string = 'testnet') => 
    `flow accounts get-contract ${contractName} --network ${network}`,
  
  // Deploy contract
  deployContract: (contractName: string, contractPath: string, network: string = 'testnet') => 
    `flow accounts create-contract ${contractName} --contract-path ${contractPath} --network ${network}`,
  
  // Verify contract
  verifyContract: (contractName: string, contractPath: string, network: string = 'testnet') => 
    `flow accounts verify-contract ${contractName} --contract-path ${contractPath} --network ${network}`,
  
  // Execute transaction
  executeTransaction: (transactionPath: string, network: string = 'testnet') => 
    `flow transactions send --transaction ${transactionPath} --network ${network}`,
  
  // Execute script
  executeScript: (scriptPath: string, network: string = 'testnet') => 
    `flow scripts execute --script ${scriptPath} --network ${network}`,
}

// Contract verification configuration
export const VERIFICATION_CONFIG = {
  // Contract verification settings
  settings: {
    timeout: 300000, // 5 minutes
    retries: 3,
    delay: 1000, // 1 second
  },
  
  // Verification endpoints
  endpoints: {
    testnet: 'https://testnet.flowscan.org/api',
    mainnet: 'https://flowscan.org/api',
  },
  
  // Required contract information
  requiredInfo: [
    'contractName',
    'contractPath',
    'contractAddress',
    'deploymentTxHash',
    'deploymentBlockHeight',
  ],
}

// Environment variables for deployment
export const DEPLOYMENT_ENV_VARS = {
  // Required environment variables
  required: [
    'FLOW_PRIVATE_KEY',
    'FLOW_ACCOUNT_ADDRESS',
    'FLOW_NETWORK',
  ],
  
  // Optional environment variables
  optional: [
    'FLOW_ACCESS_NODE',
    'FLOW_DISCOVERY_WALLET',
    'FLOW_FLOWSCAN_API_KEY',
  ],
  
  // Environment variable descriptions
  descriptions: {
    FLOW_PRIVATE_KEY: 'Private key for the deployment account',
    FLOW_ACCOUNT_ADDRESS: 'Address of the deployment account',
    FLOW_NETWORK: 'Flow network to deploy to (testnet/mainnet)',
    FLOW_ACCESS_NODE: 'Custom access node URL',
    FLOW_DISCOVERY_WALLET: 'Custom discovery wallet URL',
    FLOW_FLOWSCAN_API_KEY: 'API key for FlowScan verification',
  },
}

// Deployment validation
export const DEPLOYMENT_VALIDATION = {
  // Validate deployment configuration
  validateConfig: (config: any) => {
    const errors: string[] = []
    
    if (!config.networks) {
      errors.push('Networks configuration is required')
    }
    
    if (!config.contracts) {
      errors.push('Contracts configuration is required')
    }
    
    if (!config.deploymentOrder) {
      errors.push('Deployment order is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  },
  
  // Validate contract configuration
  validateContract: (contract: any) => {
    const errors: string[] = []
    
    if (!contract.name) {
      errors.push('Contract name is required')
    }
    
    if (!contract.path) {
      errors.push('Contract path is required')
    }
    
    if (!contract.dependencies) {
      errors.push('Contract dependencies are required')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}

// Export deployment utilities
export const DEPLOYMENT_UTILS = {
  // Generate deployment script
  generateDeploymentScript: (contractName: string, network: string = 'testnet') => {
    const config = FLOW_DEPLOYMENT_CONFIG.contracts[contractName as keyof typeof FLOW_DEPLOYMENT_CONFIG.contracts]
    if (!config) {
      throw new Error(`Contract ${contractName} not found in configuration`)
    }
    
    return `flow accounts create-contract ${contractName} --contract-path ${config.path} --network ${network}`
  },
  
  // Generate verification script
  generateVerificationScript: (contractName: string, network: string = 'testnet') => {
    const config = FLOW_DEPLOYMENT_CONFIG.contracts[contractName as keyof typeof FLOW_DEPLOYMENT_CONFIG.contracts]
    if (!config) {
      throw new Error(`Contract ${contractName} not found in configuration`)
    }
    
    return `flow accounts verify-contract ${contractName} --contract-path ${config.path} --network ${network}`
  },
  
  // Get contract address
  getContractAddressCommand: (contractName: string, network: string = 'testnet') => {
    return `flow accounts get-contract ${contractName} --network ${network}`
  },
}
