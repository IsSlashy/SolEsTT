# SolEsTT - Deployment Guide

This guide will help you deploy the smart contracts to Solana Devnet.

## Prerequisites

You need to install the following tools:

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Install Solana CLI
```bash
# For Linux/Mac
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# For Windows (use WSL or PowerShell)
# Download from: https://github.com/solana-labs/solana/releases
```

### 3. Install Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## Configuration

### 1. Configure Solana CLI for Devnet
```bash
solana config set --url https://api.devnet.solana.com
```

### 2. Create a Wallet (if you don't have one)
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

### 3. Get Devnet SOL (Airdrop)
```bash
solana airdrop 2
```

You can request multiple airdrops if needed (up to 5 SOL per request).

## Building the Programs

### 1. Navigate to the project directory
```bash
cd solana-realestate
```

### 2. Build the Anchor programs
```bash
anchor build
```

This will compile both smart contracts:
- `property_tokenization`
- `rental_payment`

### 3. Get Program IDs
```bash
anchor keys list
```

This will show you the program IDs for both contracts. Copy these IDs.

### 4. Update Program IDs

Update the following files with your program IDs:

**Anchor.toml**:
```toml
[programs.devnet]
property_tokenization = "YOUR_PROPERTY_PROGRAM_ID"
rental_payment = "YOUR_RENTAL_PROGRAM_ID"
```

**lib/solana/programs.ts**:
```typescript
export const PROPERTY_TOKENIZATION_PROGRAM_ID = new PublicKey(
  'YOUR_PROPERTY_PROGRAM_ID'
);

export const RENTAL_PAYMENT_PROGRAM_ID = new PublicKey(
  'YOUR_RENTAL_PROGRAM_ID'
);
```

**anchor/programs/property_tokenization/src/lib.rs** (line 6):
```rust
declare_id!("YOUR_PROPERTY_PROGRAM_ID");
```

**anchor/programs/rental_payment/src/lib.rs** (line 6):
```rust
declare_id!("YOUR_RENTAL_PROGRAM_ID");
```

### 5. Rebuild with correct IDs
```bash
anchor build
```

## Deploying to Devnet

### 1. Deploy both programs
```bash
anchor deploy
```

This will deploy both programs to Devnet. Make sure you have enough SOL in your wallet (at least 2-3 SOL).

### 2. Verify Deployment
```bash
solana program show YOUR_PROPERTY_PROGRAM_ID
solana program show YOUR_RENTAL_PROGRAM_ID
```

## Testing the Deployment

### 1. Run Anchor tests
```bash
anchor test --skip-local-validator
```

### 2. Test from Frontend

Once deployed, you can test the integration from the frontend:

1. Start the Next.js development server:
```bash
npm run dev
```

2. Connect your wallet (Phantom or Solflare)

3. Try creating a property from the "Create Property" page

4. Try buying shares from the property details page

5. Test rental payment functionality from the "Rentals" page

## Troubleshooting

### "Insufficient funds" error
- Request more SOL airdrops: `solana airdrop 2`
- Check your balance: `solana balance`

### "Program account not found" error
- Make sure you updated all program IDs correctly
- Rebuild after updating IDs: `anchor build`
- Redeploy: `anchor deploy`

### RPC errors
- The Devnet RPC might be rate-limited or slow
- Try using a different RPC endpoint or wait a few minutes

### Build errors
- Make sure Rust is up to date: `rustup update`
- Clean and rebuild: `anchor clean && anchor build`

## Alternative: Using Pre-deployed Programs

If you don't want to deploy your own contracts, you can use already deployed versions:

1. Search for existing real estate tokenization programs on Solana Devnet
2. Update the program IDs in your configuration files
3. Make sure the program interface matches your instruction builders

## Production Deployment (Mainnet)

⚠️ **WARNING**: Deploying to mainnet requires real SOL and thorough testing.

1. Configure for mainnet:
```bash
solana config set --url https://api.mainnet-beta.solana.com
```

2. Fund your wallet with real SOL

3. Follow the same deployment steps as Devnet

4. Always test extensively on Devnet before deploying to mainnet!

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
