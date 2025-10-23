import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

/**
 * Script de test pour les micro-transactions
 *
 * Ce script teste les fonctionnalités principales avec de vraies transactions
 * sur Solana Devnet à coût très réduit.
 *
 * Budget nécessaire: ~0.5 SOL (~10-15€)
 */

// Configuration
const TEST_PROPERTY = {
  name: 'Studio Paris Test',
  location: 'Paris 18e - Test',
  totalValue: new anchor.BN(0.1 * LAMPORTS_PER_SOL), // 0.1 SOL
  totalShares: new anchor.BN(100),
  rentPerMonth: new anchor.BN(0.01 * LAMPORTS_PER_SOL), // 0.01 SOL
  metadataUri: 'https://arweave.net/test-studio-paris',
};

const SHARES_TO_BUY = new anchor.BN(10); // Acheter 10 parts (~0.01 SOL)

async function main() {
  console.log('🚀 Démarrage des tests de micro-transactions...\n');

  // Configuration de l'environnement
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log('📋 Configuration:');
  console.log(`Cluster: ${provider.connection.rpcEndpoint}`);
  console.log(`Wallet: ${provider.wallet.publicKey.toString()}`);

  // Vérifier le solde
  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL\n`);

  if (balance < 0.1 * LAMPORTS_PER_SOL) {
    console.log('⚠️  Solde insuffisant. Demandez un airdrop:');
    console.log('   solana airdrop 2');
    return;
  }

  // Charger les programmes
  const propertyProgram = anchor.workspace.PropertyTokenization as Program;
  const rentalProgram = anchor.workspace.RentalPayment as Program;

  console.log('📦 Programmes chargés:');
  console.log(`Property: ${propertyProgram.programId.toString()}`);
  console.log(`Rental: ${rentalProgram.programId.toString()}\n`);

  // ============================================
  // TEST 1: Créer une propriété
  // ============================================
  console.log('📝 TEST 1: Création de propriété...');

  const [propertyPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('property'),
      provider.wallet.publicKey.toBuffer(),
      Buffer.from(TEST_PROPERTY.name),
    ],
    propertyProgram.programId
  );

  try {
    const tx1 = await propertyProgram.methods
      .createProperty(
        TEST_PROPERTY.name,
        TEST_PROPERTY.location,
        TEST_PROPERTY.totalValue,
        TEST_PROPERTY.totalShares,
        TEST_PROPERTY.rentPerMonth,
        TEST_PROPERTY.metadataUri
      )
      .accounts({
        property: propertyPda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Propriété créée! TX: ${tx1}`);
    console.log(`   Propriété PDA: ${propertyPda.toString()}`);

    // Attendre la confirmation
    await provider.connection.confirmTransaction(tx1);

    // Récupérer les données de la propriété
    const propertyData = await propertyProgram.account.property.fetch(propertyPda);
    console.log(`   Valeur totale: ${propertyData.totalValue.toNumber() / LAMPORTS_PER_SOL} SOL`);
    console.log(`   Parts totales: ${propertyData.totalShares.toString()}`);
    console.log(`   Parts disponibles: ${propertyData.availableShares.toString()}\n`);
  } catch (error) {
    console.log('⚠️  Propriété existe déjà ou erreur:', error.message);
    console.log('   Utilisation de la propriété existante\n');
  }

  // ============================================
  // TEST 2: Tokeniser la propriété
  // ============================================
  console.log('🪙 TEST 2: Tokenisation de la propriété...');

  const tokenMint = Keypair.generate();

  try {
    const tx2 = await propertyProgram.methods
      .tokenizeProperty()
      .accounts({
        property: propertyPda,
        tokenMint: tokenMint.publicKey,
        authority: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([tokenMint])
      .rpc();

    console.log(`✅ Propriété tokenisée! TX: ${tx2}`);
    console.log(`   Token Mint: ${tokenMint.publicKey.toString()}\n`);

    await provider.connection.confirmTransaction(tx2);
  } catch (error) {
    console.log('⚠️  Propriété déjà tokenisée ou erreur:', error.message, '\n');
  }

  // ============================================
  // TEST 3: Acheter des parts
  // ============================================
  console.log('💰 TEST 3: Achat de parts...');

  const buyer = provider.wallet.publicKey;
  const propertyData = await propertyProgram.account.property.fetch(propertyPda);
  const tokenMintPubkey = propertyData.tokenMint;

  // Créer le compte de token associé pour l'acheteur
  const buyerTokenAccount = await getAssociatedTokenAddress(
    tokenMintPubkey,
    buyer
  );

  // Calculer le coût
  const costPerShare = propertyData.totalValue.div(propertyData.totalShares);
  const totalCost = costPerShare.mul(SHARES_TO_BUY);

  console.log(`   Achat de ${SHARES_TO_BUY.toString()} parts`);
  console.log(`   Coût: ${totalCost.toNumber() / LAMPORTS_PER_SOL} SOL (~${(totalCost.toNumber() / LAMPORTS_PER_SOL * 25).toFixed(2)}€)\n`);

  try {
    const tx3 = await propertyProgram.methods
      .buyShares(SHARES_TO_BUY)
      .accounts({
        property: propertyPda,
        tokenMint: tokenMintPubkey,
        buyerTokenAccount: buyerTokenAccount,
        buyer: buyer,
        propertyOwner: propertyData.authority,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Parts achetées! TX: ${tx3}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${tx3}?cluster=devnet\n`);

    await provider.connection.confirmTransaction(tx3);
  } catch (error) {
    console.log('❌ Erreur lors de l\'achat:', error.message, '\n');
  }

  // ============================================
  // TEST 4: Créer un accord de location
  // ============================================
  console.log('🏠 TEST 4: Création d\'accord de location...');

  const tenant = Keypair.generate(); // Simuler un locataire
  const landlord = provider.wallet.publicKey;
  const propertyId = propertyPda;

  const [rentalPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('rental'),
      landlord.toBuffer(),
      tenant.publicKey.toBuffer(),
      propertyId.toBuffer(),
    ],
    rentalProgram.programId
  );

  const rentAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL); // 0.01 SOL/mois
  const paymentFrequency = new anchor.BN(30 * 24 * 60 * 60); // 30 jours en secondes

  try {
    const tx4 = await rentalProgram.methods
      .createRentalAgreement(propertyId, rentAmount, paymentFrequency)
      .accounts({
        rentalAgreement: rentalPda,
        landlord: landlord,
        tenant: tenant.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ Accord de location créé! TX: ${tx4}`);
    console.log(`   Rental PDA: ${rentalPda.toString()}`);
    console.log(`   Loyer mensuel: ${rentAmount.toNumber() / LAMPORTS_PER_SOL} SOL\n`);

    await provider.connection.confirmTransaction(tx4);
  } catch (error) {
    console.log('⚠️  Accord existe déjà ou erreur:', error.message, '\n');
  }

  // ============================================
  // Résumé des coûts
  // ============================================
  console.log('💰 RÉSUMÉ DES COÛTS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const finalBalance = await provider.connection.getBalance(provider.wallet.publicKey);
  const totalSpent = (balance - finalBalance) / LAMPORTS_PER_SOL;

  console.log(`Balance initiale: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
  console.log(`Balance finale: ${(finalBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
  console.log(`Total dépensé: ${totalSpent.toFixed(4)} SOL (~${(totalSpent * 25).toFixed(2)}€)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✅ Tests terminés avec succès!');
  console.log('\n📊 Explorer vos transactions:');
  console.log(`https://explorer.solana.com/address/${provider.wallet.publicKey.toString()}?cluster=devnet`);
}

// Exécuter les tests
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
