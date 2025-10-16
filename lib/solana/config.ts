import { PublicKey } from '@solana/web3.js';

// Solana network configuration
export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Program IDs (will be updated after deployment)
export const PROPERTY_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
export const RENTAL_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// USDC Token Address on Devnet
export const USDC_MINT_ADDRESS = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

// Platform configuration
export const PLATFORM_FEE_PERCENTAGE = 2; // 2% platform fee
export const MIN_INVESTMENT_AMOUNT = 100; // Minimum $100 investment
