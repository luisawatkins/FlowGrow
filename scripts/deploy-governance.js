const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Flow CLI configuration
const FLOW_ACCOUNT = process.env.FLOW_ACCOUNT || '0x1234567890abcdef';
const FLOW_PRIVATE_KEY = process.env.FLOW_PRIVATE_KEY || 'your-private-key';
const FLOW_NETWORK = process.env.FLOW_NETWORK || 'emulator';

// Contract addresses (these would be set after deployment)
const PROPERTY_NFT_ADDRESS = '0x1234567890abcdef';
const PROPERTY_MARKETPLACE_ADDRESS = '0x1234567890abcdef';

console.log('🚀 Starting FlowGrow Governance Contracts Deployment...\n');

// Function to deploy a contract
function deployContract(contractName, contractPath) {
    console.log(`📦 Deploying ${contractName}...`);
    
    try {
        // Update contract imports with actual addresses
        let contractContent = fs.readFileSync(contractPath, 'utf8');
        
        // Replace placeholder addresses with actual addresses
        contractContent = contractContent.replace(
            /import PropertyNFT from 0x1234567890abcdef/g,
            `import PropertyNFT from ${PROPERTY_NFT_ADDRESS}`
        );
        
        contractContent = contractContent.replace(
            /import PropertyMarketplace from 0x1234567890abcdef/g,
            `import PropertyMarketplace from ${PROPERTY_MARKETPLACE_ADDRESS}`
        );
        
        // Write updated contract to temporary file
        const tempPath = path.join(__dirname, '..', 'temp', `${contractName}.cdc`);
        fs.mkdirSync(path.dirname(tempPath), { recursive: true });
        fs.writeFileSync(tempPath, contractContent);
        
        // Deploy contract using Flow CLI
        const deployCommand = `flow accounts add-contract ${contractName} ${tempPath} --signer ${FLOW_ACCOUNT} --network ${FLOW_NETWORK}`;
        
        console.log(`   Executing: ${deployCommand}`);
        const result = execSync(deployCommand, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        console.log(`   ✅ ${contractName} deployed successfully!`);
        console.log(`   Result: ${result.trim()}\n`);
        
        // Clean up temporary file
        fs.unlinkSync(tempPath);
        
        return true;
    } catch (error) {
        console.error(`   ❌ Failed to deploy ${contractName}:`, error.message);
        return false;
    }
}

// Function to initialize contracts
function initializeContracts() {
    console.log('🔧 Initializing contracts...\n');
    
    try {
        // Initialize StakeholderRegistry
        console.log('📋 Initializing StakeholderRegistry...');
        const initRegistryScript = `
import StakeholderRegistry from ${FLOW_ACCOUNT}

transaction {
    prepare(acct: AuthAccount) {
        let registry <- StakeholderRegistry.createRegistryCollection()
        acct.save(<-registry, to: /storage/StakeholderRegistry)
        acct.link<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry, target: /storage/StakeholderRegistry)
    }
}`;
        
        const registryInitPath = path.join(__dirname, '..', 'temp', 'init-registry.cdc');
        fs.writeFileSync(registryInitPath, initRegistryScript);
        
        const initRegistryCommand = `flow transactions send ${registryInitPath} --signer ${FLOW_ACCOUNT} --network ${FLOW_NETWORK}`;
        execSync(initRegistryCommand, { encoding: 'utf8', stdio: 'pipe' });
        console.log('   ✅ StakeholderRegistry initialized!\n');
        
        // Initialize GovernanceContract
        console.log('🗳️ Initializing GovernanceContract...');
        const initGovernanceScript = `
import GovernanceContract from ${FLOW_ACCOUNT}

transaction {
    prepare(acct: AuthAccount) {
        let governance <- GovernanceContract.createGovernanceCollection()
        acct.save(<-governance, to: /storage/GovernanceContract)
        acct.link<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract, target: /storage/GovernanceContract)
    }
}`;
        
        const governanceInitPath = path.join(__dirname, '..', 'temp', 'init-governance.cdc');
        fs.writeFileSync(governanceInitPath, initGovernanceScript);
        
        const initGovernanceCommand = `flow transactions send ${governanceInitPath} --signer ${FLOW_ACCOUNT} --network ${FLOW_NETWORK}`;
        execSync(initGovernanceCommand, { encoding: 'utf8', stdio: 'pipe' });
        console.log('   ✅ GovernanceContract initialized!\n');
        
        // Clean up temporary files
        fs.unlinkSync(registryInitPath);
        fs.unlinkSync(governanceInitPath);
        
        return true;
    } catch (error) {
        console.error('   ❌ Failed to initialize contracts:', error.message);
        return false;
    }
}

// Function to verify deployment
function verifyDeployment() {
    console.log('🔍 Verifying deployment...\n');
    
    try {
        // Check if contracts are deployed
        const checkContractsScript = `
import StakeholderRegistry from ${FLOW_ACCOUNT}
import GovernanceContract from ${FLOW_ACCOUNT}

pub fun main(): {String: Bool} {
    return {
        "StakeholderRegistry": true,
        "GovernanceContract": true
    }
}`;
        
        const verifyPath = path.join(__dirname, '..', 'temp', 'verify-deployment.cdc');
        fs.writeFileSync(verifyPath, checkContractsScript);
        
        const verifyCommand = `flow scripts execute ${verifyPath} --network ${FLOW_NETWORK}`;
        const result = execSync(verifyCommand, { encoding: 'utf8', stdio: 'pipe' });
        
        console.log('   ✅ Deployment verification successful!');
        console.log(`   Result: ${result.trim()}\n`);
        
        // Clean up temporary file
        fs.unlinkSync(verifyPath);
        
        return true;
    } catch (error) {
        console.error('   ❌ Deployment verification failed:', error.message);
        return false;
    }
}

// Function to create test transactions
function createTestTransactions() {
    console.log('🧪 Creating test transactions...\n');
    
    try {
        // Test stakeholder registration
        console.log('👤 Testing stakeholder registration...');
        const testRegistrationScript = `
import StakeholderRegistry from ${FLOW_ACCOUNT}

transaction {
    prepare(acct: AuthAccount) {
        let registry = acct.getAccount(${FLOW_ACCOUNT}).getCapability<&StakeholderRegistry.RegistryCollection>(/public/StakeholderRegistry)
            .borrow() ?? panic("Could not borrow StakeholderRegistry")
        
        let success = registry.registerStakeholder(
            address: acct.address,
            name: "Test User",
            email: "test@example.com",
            organization: "Test Organization"
        )
        
        assert(success, message: "Failed to register stakeholder")
    }
}`;
        
        const testRegPath = path.join(__dirname, '..', 'temp', 'test-registration.cdc');
        fs.writeFileSync(testRegPath, testRegistrationScript);
        
        const testRegCommand = `flow transactions send ${testRegPath} --signer ${FLOW_ACCOUNT} --network ${FLOW_NETWORK}`;
        execSync(testRegCommand, { encoding: 'utf8', stdio: 'pipe' });
        console.log('   ✅ Stakeholder registration test passed!\n');
        
        // Test proposal creation
        console.log('📝 Testing proposal creation...');
        const testProposalScript = `
import GovernanceContract from ${FLOW_ACCOUNT}

transaction {
    prepare(acct: AuthAccount) {
        let governance = acct.getAccount(${FLOW_ACCOUNT}).getCapability<&GovernanceContract.GovernanceCollection>(/public/GovernanceContract)
            .borrow() ?? panic("Could not borrow GovernanceContract")
        
        let proposalID = governance.createProposal(
            title: "Test Proposal",
            description: "This is a test proposal for governance testing",
            proposer: acct.address,
            proposalType: GovernanceContract.ProposalType.PropertyRule,
            votingDuration: 86400.0, // 1 day
            quorumRequired: 10.0, // 10%
            executionData: nil,
            targetContract: nil
        )
        
        assert(proposalID > 0, message: "Failed to create proposal")
    }
}`;
        
        const testProposalPath = path.join(__dirname, '..', 'temp', 'test-proposal.cdc');
        fs.writeFileSync(testProposalPath, testProposalScript);
        
        const testProposalCommand = `flow transactions send ${testProposalPath} --signer ${FLOW_ACCOUNT} --network ${FLOW_NETWORK}`;
        execSync(testProposalCommand, { encoding: 'utf8', stdio: 'pipe' });
        console.log('   ✅ Proposal creation test passed!\n');
        
        // Clean up temporary files
        fs.unlinkSync(testRegPath);
        fs.unlinkSync(testProposalPath);
        
        return true;
    } catch (error) {
        console.error('   ❌ Test transactions failed:', error.message);
        return false;
    }
}

// Main deployment function
async function main() {
    console.log('🎯 FlowGrow Governance Contracts Deployment Script');
    console.log('================================================\n');
    
    // Check if Flow CLI is installed
    try {
        execSync('flow version', { stdio: 'pipe' });
        console.log('✅ Flow CLI is installed\n');
    } catch (error) {
        console.error('❌ Flow CLI is not installed. Please install it first.');
        process.exit(1);
    }
    
    // Create temp directory
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    let deploymentSuccess = true;
    
    // Deploy contracts
    console.log('📦 Deploying Contracts...');
    console.log('========================\n');
    
    const contracts = [
        { name: 'StakeholderRegistry', path: path.join(__dirname, '..', 'src', 'contracts', 'StakeholderRegistry.cdc') },
        { name: 'GovernanceContract', path: path.join(__dirname, '..', 'src', 'contracts', 'GovernanceContract.cdc') }
    ];
    
    for (const contract of contracts) {
        if (!deployContract(contract.name, contract.path)) {
            deploymentSuccess = false;
            break;
        }
    }
    
    if (!deploymentSuccess) {
        console.error('❌ Contract deployment failed. Aborting...');
        process.exit(1);
    }
    
    // Initialize contracts
    if (!initializeContracts()) {
        console.error('❌ Contract initialization failed. Aborting...');
        process.exit(1);
    }
    
    // Verify deployment
    if (!verifyDeployment()) {
        console.error('❌ Deployment verification failed. Aborting...');
        process.exit(1);
    }
    
    // Run test transactions
    if (!createTestTransactions()) {
        console.error('❌ Test transactions failed. Aborting...');
        process.exit(1);
    }
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log('🎉 Deployment completed successfully!');
    console.log('=====================================\n');
    console.log('📋 Deployment Summary:');
    console.log(`   • StakeholderRegistry: ${FLOW_ACCOUNT}`);
    console.log(`   • GovernanceContract: ${FLOW_ACCOUNT}`);
    console.log(`   • Network: ${FLOW_NETWORK}`);
    console.log(`   • Account: ${FLOW_ACCOUNT}\n`);
    
    console.log('🔗 Next Steps:');
    console.log('   1. Update your frontend to use the deployed contract addresses');
    console.log('   2. Test the governance functionality in your application');
    console.log('   3. Deploy to testnet/mainnet when ready');
    console.log('   4. Set up monitoring and analytics for governance activities\n');
    
    console.log('📚 Documentation:');
    console.log('   • Governance Contract: src/contracts/GovernanceContract.cdc');
    console.log('   • Stakeholder Registry: src/contracts/StakeholderRegistry.cdc');
    console.log('   • Deployment Script: scripts/deploy-governance.js\n');
}

// Run the deployment
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    deployContract,
    initializeContracts,
    verifyDeployment,
    createTestTransactions
};
