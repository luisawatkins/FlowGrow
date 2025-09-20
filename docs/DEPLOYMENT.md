# FlowEstate Deployment Guide

This guide covers deploying FlowEstate to production environments.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Vercel account (for frontend deployment)
- Supabase account
- Flow EVM Testnet access

## Frontend Deployment (Vercel)

### 1. Prepare the Application

1. Ensure all environment variables are configured in `.env.local`
2. Run the build command to check for errors:
   ```bash
   npm run build
   ```

### 2. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_PROPERTY_NFT_ADDRESS`
   - `NEXT_PUBLIC_MARKETPLACE_ADDRESS`
   - `NEXT_PUBLIC_FLOW_RPC_URL`
   - `NEXT_PUBLIC_FLOW_CHAIN_ID`

### 3. Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS records as instructed

## Smart Contract Deployment

### 1. Set Up Hardhat

1. Install dependencies:
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. Create a `.env` file with your private key:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```

### 2. Deploy Contracts

1. Compile contracts:
   ```bash
   npx hardhat compile
   ```

2. Deploy to Flow EVM Testnet:
   ```bash
   npx hardhat run scripts/deploy-contracts.js --network flowTestnet
   ```

3. Verify contracts on FlowScan:
   ```bash
   npx hardhat verify --network flowTestnet <CONTRACT_ADDRESS>
   ```

### 3. Update Environment Variables

Update your production environment variables with the deployed contract addresses.

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Set Up Database Schema

Run the following SQL in your Supabase SQL editor:

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

-- Create indexes for better performance
CREATE INDEX idx_properties_owner ON properties(owner);
CREATE INDEX idx_properties_is_listed ON properties(is_listed);
CREATE INDEX idx_listings_seller ON listings(seller);
CREATE INDEX idx_listings_is_active ON listings(is_active);
CREATE INDEX idx_transactions_hash ON transactions(hash);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);
CREATE INDEX idx_transactions_to_address ON transactions(to_address);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your use case)
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Properties are insertable by authenticated users" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Properties are updatable by owner" ON properties FOR UPDATE USING (true);

CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Listings are insertable by authenticated users" ON listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Listings are updatable by seller" ON listings FOR UPDATE USING (true);

CREATE POLICY "Transactions are viewable by everyone" ON transactions FOR SELECT USING (true);
CREATE POLICY "Transactions are insertable by authenticated users" ON transactions FOR INSERT WITH CHECK (true);
```

### 3. Configure Storage (Optional)

If you want to store property images in Supabase:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "property-images"
3. Configure public access if needed
4. Update your application to use Supabase storage

## Environment Variables

### Frontend (.env.local)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Contract Addresses
NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=your_property_nft_contract_address
NEXT_PUBLIC_MARKETPLACE_ADDRESS=your_marketplace_contract_address

# Flow EVM Testnet Configuration
NEXT_PUBLIC_FLOW_RPC_URL=https://testnet.evm.nodes.onflow.org
NEXT_PUBLIC_FLOW_CHAIN_ID=0x1f91a3

# IPFS Configuration (for metadata storage)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### Smart Contracts (.env)

```env
# Private key for deployment
PRIVATE_KEY=your_private_key_here

# Flow EVM Testnet RPC
FLOW_RPC_URL=https://testnet.evm.nodes.onflow.org
```

## Monitoring and Maintenance

### 1. Set Up Monitoring

- Use Vercel Analytics for frontend monitoring
- Set up Supabase monitoring for database performance
- Monitor smart contract events and transactions

### 2. Regular Maintenance

- Update dependencies regularly
- Monitor gas costs and optimize smart contracts
- Backup database regularly
- Monitor for security vulnerabilities

### 3. Scaling Considerations

- Use Supabase connection pooling for high traffic
- Consider CDN for static assets
- Implement caching strategies
- Monitor database query performance

## Security Considerations

### 1. Environment Variables

- Never commit private keys to version control
- Use environment-specific configurations
- Rotate keys regularly

### 2. Smart Contracts

- Audit smart contracts before deployment
- Use multi-signature wallets for contract upgrades
- Implement proper access controls

### 3. Database Security

- Use Row Level Security (RLS) policies
- Validate all inputs
- Implement rate limiting

## Troubleshooting

### Common Issues

1. **Build Failures**: Check for TypeScript errors and missing dependencies
2. **Contract Deployment Issues**: Verify network configuration and gas limits
3. **Database Connection Issues**: Check Supabase credentials and network access
4. **Transaction Failures**: Verify wallet connection and sufficient gas

### Getting Help

- Check the [Flow documentation](https://docs.onflow.org/)
- Visit [Supabase documentation](https://supabase.com/docs)
- Review [Vercel documentation](https://vercel.com/docs)
- Check project issues on GitHub

## Production Checklist

- [ ] All environment variables configured
- [ ] Smart contracts deployed and verified
- [ ] Database schema created
- [ ] Frontend deployed and accessible
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificates configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance testing completed
