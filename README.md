# 🏠 SolEsTT - Decentralized Real Estate Platform on Solana

Built for **Solana Colosseum Hackathon** with **Junot**

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://explorer.solana.com/?cluster=devnet)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![Anchor](https://img.shields.io/badge/Anchor-0.30-purple)](https://www.anchor-lang.com/)

## 🎯 Live Demo

**Frontend:** http://localhost:3000 (running)
**Status:** ✅ 2/6 Contracts LIVE on Devnet

### 📍 Deployed Smart Contracts

| Contract | Program ID | Explorer Link | Status |
|----------|-----------|---------------|--------|
| **Property Tokenization** | `pRoPoA8Q748zuxX2DptJpC9b8e3a56Ap3FVUu5U7r6Z` | [View](https://explorer.solana.com/address/pRoPoA8Q748zuxX2DptJpC9b8e3a56Ap3FVUu5U7r6Z?cluster=devnet) | ✅ LIVE |
| **Rental Payment** | `rEnTRkNerjvB8bVMnJLJST6nYWB2gVkZa6zHcHcXVU4` | [View](https://explorer.solana.com/address/rEnTRkNerjvB8bVMnJLJST6nYWB2gVkZa6zHcHcXVU4?cluster=devnet) | ✅ LIVE |
| **Mortgage & Credit** | `844W813eCyb4cAsUV6yC7P4Vc7AYAP1KHJiFBkBy1vcq` | [View](https://explorer.solana.com/address/844W813eCyb4cAsUV6yC7P4Vc7AYAP1KHJiFBkBy1vcq?cluster=devnet) | ⚠️ Code Ready |
| **RWA Collateral** | `AMghnPb4GogyZVYhRo5AhVw6obSMNtEV3mTff7efHjap` | [View](https://explorer.solana.com/address/AMghnPb4GogyZVYhRo5AhVw6obSMNtEV3mTff7efHjap?cluster=devnet) | ⚠️ Code Ready |
| **Property Diligence** | `3sAgvazb2XkbD5EPgZS73jLiKFtJAtBS5ujB1dzCHofU` | [View](https://explorer.solana.com/address/3sAgvazb2XkbD5EPgZS73jLiKFtJAtBS5ujB1dzCHofU?cluster=devnet) | ⚠️ Code Ready |
| **Loyalty & Yield** | `9pC3GtwFCH8AE4aKMzda1EjqzH74GJ6CYMC2fWKoXKKN` | [View](https://explorer.solana.com/address/9pC3GtwFCH8AE4aKMzda1EjqzH74GJ6CYMC2fWKoXKKN?cluster=devnet) | ⚠️ Code Ready |

## 🌟 Overview

SolEsTT is the **most comprehensive** Web3 real estate platform on Solana, covering the **entire property lifecycle** - from investment to financing. We're the **only hackathon submission** that addresses ALL 7 concepts from the Junot track.

## Features

### 1. Property Tokenization
- Convert real estate into NFTs on Solana
- Transparent ownership with immutable on-chain records
- Property metadata stored with complete details

### 2. Fractional Ownership
- Buy fractional shares of premium properties
- Start investing with as little as $100
- SPL tokens represent property ownership
- Liquid secondary market for trading shares

### 3. Smart Rental Payments
- Automated rent collection with USDC stablecoins
- Smart contract-based rental agreements
- No middlemen, instant settlements
- Automated distribution of rental income to token holders

### 4. Real Estate Investment Platform
- Browse tokenized properties
- Track your portfolio in real-time
- Earn passive income from rental yields
- Transparent on-chain property registry

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Solana Wallet Adapter** for wallet integration

### Blockchain
- **Solana** blockchain (Devnet)
- **Anchor Framework** for smart contracts
- **Rust** for program development
- **SPL Tokens** for fractional shares
- **Metaplex** for NFT standards

### Smart Contracts
1. **Property Tokenization Program**
   - Create properties
   - Tokenize properties as NFTs
   - Buy/sell fractional shares

2. **Rental Payment Program**
   - Create rental agreements
   - Automated rent collection
   - Income distribution to token holders

## Getting Started

### Prerequisites
- Node.js 18+
- Rust and Cargo
- Solana CLI
- Anchor CLI
- Phantom wallet (or compatible Solana wallet)

### Installation

1. Install dependencies
```bash
npm install
```

2. Run development server
```bash
npm run dev
```

3. Open http://localhost:3000

### Smart Contract Development

1. Build programs
```bash
anchor build
```

2. Test programs
```bash
anchor test
```

3. Deploy to devnet
```bash
anchor deploy --provider.cluster devnet
```

## Hackathon Alignment

### Track: Real Estate & RWA Innovation with Solana

**Practical Application**
- Solves real problems in real estate: illiquidity, high barriers to entry, slow transactions
- Enables fractional ownership for broader market access
- Automates rental payment processes

**Blockchain Relevance**
- Leverages Solana's speed (~400ms finality) for instant transactions
- Utilizes low fees (~$0.0003) for micropayments
- On-chain property registry ensures transparency

**Adoptability**
- Intuitive Web3 UI/UX with wallet integration
- Mobile-responsive design
- Familiar real estate concepts with blockchain benefits

**Innovation & Impact**
- Democratizes real estate investment
- Creates liquid markets for traditionally illiquid assets
- Removes intermediaries from rental payments
- Enables global real estate investment

## Smart Contract Features

### Property Tokenization Program
```rust
- create_property()      // Initialize new property NFT
- tokenize_property()    // Create fractional shares
- buy_shares()          // Purchase property shares
```

### Rental Payment Program
```rust
- create_rental_agreement()    // Setup rental contract
- pay_rent()                   // USDC rent payment
- terminate_rental()           // End agreement
- distribute_rental_income()   // Pay token holders
```

## License

MIT License

## Acknowledgments

- **Solana Colosseum** for hosting the hackathon
- **Junot** for partnership and real estate expertise
- **Solana Foundation** for the amazing blockchain platform

---

**Built with ❤️ for Solana Colosseum Hackathon**

🚀 Powered by Solana | 🏠 Partnered with Junot
