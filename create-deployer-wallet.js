const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Generate new keypair
const keypair = Keypair.generate();

// Create wallet directory
const walletDir = path.join(process.env.USERPROFILE || process.env.HOME, '.config', 'solana');
if (!fs.existsSync(walletDir)) {
  fs.mkdirSync(walletDir, { recursive: true });
}

// Save to file
const walletPath = path.join(walletDir, 'deployer.json');
fs.writeFileSync(walletPath, JSON.stringify(Array.from(keypair.secretKey)));

console.log('✅ Nouveau wallet de déploiement créé!');
console.log('📁 Fichier:', walletPath);
console.log('📍 Adresse:', keypair.publicKey.toBase58());
console.log('\n🔥 IMPORTANT:');
console.log(`Transférez ${process.argv[2] || '2.5'} SOL depuis Phantom vers cette adresse:`);
console.log(keypair.publicKey.toBase58());
console.log('\n💡 Ensuite, je vais mettre à jour Anchor.toml pour utiliser ce wallet.');
