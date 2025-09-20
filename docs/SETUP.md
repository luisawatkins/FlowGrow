# FlowEstate Setup Guide

This guide will help you set up and run FlowEstate locally.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask wallet
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flowestate
```

2. Install dependencies:
```bash
npm install
```

3. Install Hardhat for smart contract development:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

## Environment Setup

1. Copy the environment example file:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your configuration:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Contract Addresses (set after deployment)
NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=your_property_nft_contract_address
NEXT_PUBLIC_MARKETPLACE_ADDRESS=your_marketplace_contract_address

# Flow EVM Testnet Configuration
NEXT_PUBLIC_FLOW_RPC_URL=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_FLOW_CHAIN_ID=0x1f91a3
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create the following tables in your Supabase database:

```sql
-- Properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  square_footage INTEGER NOT NULL,
  price TEXT NOT NULL,
  owner TEXT NOT NULL,
  token_id TEXT,
  contract_address TEXT,
  image_url TEXT,
  is_listed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  seller TEXT NOT NULL,
  price TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  value TEXT NOT NULL,
  gas_used TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Smart Contract Deployment

1. Set up your private key in `.env.local`:
```env
PRIVATE_KEY=your_private_key_here
```

2. Deploy contracts to Flow EVM Testnet:
```bash
npx hardhat run scripts/deploy-contracts.js --network flowTestnet
```

3. Update your `.env.local` with the deployed contract addresses.

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MetaMask Setup

1. Install MetaMask browser extension
2. Add Flow EVM Testnet network:
   - Network Name: Flow EVM Testnet
   - RPC URL: https://testnet.evm.nodes.onflow.org
   - Chain ID: 2076538
   - Currency Symbol: FLOW
   - Block Explorer: https://testnet.flowscan.org

3. Get testnet FLOW tokens from the [Flow Testnet Faucet](https://testnet.flowscan.org/faucet)

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **MetaMask not connecting**: Ensure you're on the Flow EVM Testnet
2. **Transaction failures**: Check you have enough FLOW tokens for gas
3. **Contract not found**: Verify contract addresses in `.env.local`
4. **Supabase errors**: Check your Supabase configuration and table setup

### Getting Help

- Check the [Flow documentation](https://docs.onflow.org/)
- Visit [Flow Discord](https://discord.gg/flow) for community support
- Review [Supabase documentation](https://supabase.com/docs) for database issues
