import { PublicKey } from '@solana/web3.js';

/**
 * Test Data for Micro-Transactions
 *
 * Ces propriétés ont des valeurs très basses pour permettre
 * des tests avec de vraies transactions à coût réduit.
 *
 * Prix en SOL (1 SOL ≈ 20-30€):
 * - Petite propriété: 0.1 SOL (~2-3€)
 * - Moyenne propriété: 0.5 SOL (~10-15€)
 * - Grande propriété: 1 SOL (~20-30€)
 */

export interface TestProperty {
  name: string;
  location: string;
  totalValue: number; // en lamports (1 SOL = 1_000_000_000 lamports)
  totalShares: number;
  rentPerMonth: number; // en lamports
  metadataUri: string;
}

// Conversion: 1 SOL = 1_000_000_000 lamports
const LAMPORTS_PER_SOL = 1_000_000_000;

export const TEST_PROPERTIES: TestProperty[] = [
  {
    name: 'Studio Paris Test',
    location: 'Paris 18e - Test',
    totalValue: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL (~2-3€)
    totalShares: 100, // 100 parts = 0.001 SOL par part (~0.02-0.03€)
    rentPerMonth: 0.01 * LAMPORTS_PER_SOL, // 0.01 SOL/mois
    metadataUri: 'https://arweave.net/test-studio-paris',
  },
  {
    name: 'Appartement Nice Test',
    location: 'Nice - Test',
    totalValue: 0.5 * LAMPORTS_PER_SOL, // 0.5 SOL (~10-15€)
    totalShares: 500, // 500 parts = 0.001 SOL par part
    rentPerMonth: 0.05 * LAMPORTS_PER_SOL, // 0.05 SOL/mois
    metadataUri: 'https://arweave.net/test-appart-nice',
  },
  {
    name: 'Villa Bruxelles Test',
    location: 'Bruxelles - Test',
    totalValue: 1 * LAMPORTS_PER_SOL, // 1 SOL (~20-30€)
    totalShares: 1000, // 1000 parts = 0.001 SOL par part
    rentPerMonth: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL/mois
    metadataUri: 'https://arweave.net/test-villa-bruxelles',
  },
];

/**
 * Calcule le coût pour acheter X parts d'une propriété
 * @param property La propriété
 * @param shares Nombre de parts à acheter
 * @returns Coût en lamports
 */
export function calculateSharesCost(property: TestProperty, shares: number): number {
  return Math.floor((property.totalValue * shares) / property.totalShares);
}

/**
 * Convertit des lamports en SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Convertit des SOL en lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Exemples de coûts pour référence:
 *
 * Studio Paris (0.1 SOL total):
 * - 1 part = 0.001 SOL (~0.02-0.03€)
 * - 10 parts = 0.01 SOL (~0.20-0.30€)
 * - 50 parts = 0.05 SOL (~1-1.50€)
 *
 * Appartement Nice (0.5 SOL total):
 * - 1 part = 0.001 SOL (~0.02-0.03€)
 * - 10 parts = 0.01 SOL (~0.20-0.30€)
 * - 50 parts = 0.05 SOL (~1-1.50€)
 *
 * Villa Bruxelles (1 SOL total):
 * - 1 part = 0.001 SOL (~0.02-0.03€)
 * - 10 parts = 0.01 SOL (~0.20-0.30€)
 * - 50 parts = 0.05 SOL (~1-1.50€)
 */

// Configuration de test recommandée
export const TEST_CONFIG = {
  // Achats recommandés pour testing (très bas coût)
  RECOMMENDED_SHARES_TO_BUY: 10, // ~0.01 SOL (~0.20-0.30€)
  MIN_SHARES_TO_BUY: 1, // ~0.001 SOL (~0.02-0.03€)

  // Pour les tests de location (USDC)
  MONTHLY_RENT_TEST: solToLamports(0.01), // 0.01 SOL en USDC

  // Frais de transaction Solana (très bas)
  EXPECTED_TX_FEE: 0.000005 * LAMPORTS_PER_SOL, // ~0.000005 SOL (~0.0001€)

  // Budget total recommandé pour testing complet
  TOTAL_BUDGET_NEEDED: 0.5 * LAMPORTS_PER_SOL, // 0.5 SOL (~10-15€)
};

/**
 * Plan de test suggéré avec 0.5 SOL (~10-15€):
 *
 * 1. Créer une propriété: ~0.01 SOL
 * 2. Tokeniser la propriété: ~0.01 SOL
 * 3. Acheter 10 parts: ~0.01 SOL
 * 4. Créer un accord de location: ~0.01 SOL
 * 5. Payer un loyer: ~0.01 SOL
 * 6. Tester le marketplace: ~0.01 SOL
 * 7. Buffer pour frais: ~0.44 SOL
 *
 * Total: ~0.5 SOL
 */
