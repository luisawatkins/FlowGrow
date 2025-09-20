const { ethers } = require('hardhat')

async function main() {
  console.log('Deploying FlowEstate contracts to Flow EVM Testnet...')

  // Get the contract factories
  const PropertyNFT = await ethers.getContractFactory('PropertyNFT')
  const PropertyMarketplace = await ethers.getContractFactory('PropertyMarketplace')

  // Deploy PropertyNFT contract
  console.log('Deploying PropertyNFT contract...')
  const propertyNFT = await PropertyNFT.deploy()
  await propertyNFT.waitForDeployment()
  const propertyNFTAddress = await propertyNFT.getAddress()
  console.log('PropertyNFT deployed to:', propertyNFTAddress)

  // Deploy PropertyMarketplace contract
  console.log('Deploying PropertyMarketplace contract...')
  const marketplace = await PropertyMarketplace.deploy(propertyNFTAddress)
  await marketplace.waitForDeployment()
  const marketplaceAddress = await marketplace.getAddress()
  console.log('PropertyMarketplace deployed to:', marketplaceAddress)

  // Verify contracts on FlowScan
  console.log('\nVerifying contracts...')
  console.log('Please verify the contracts manually on FlowScan:')
  console.log(`PropertyNFT: https://testnet.flowscan.org/address/${propertyNFTAddress}`)
  console.log(`PropertyMarketplace: https://testnet.flowscan.org/address/${marketplaceAddress}`)

  // Save addresses to .env file
  const envContent = `
# Contract Addresses
NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=${propertyNFTAddress}
NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}
`

  console.log('\nAdd these to your .env.local file:')
  console.log(envContent)

  console.log('\nDeployment completed successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
