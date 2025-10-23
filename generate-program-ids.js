const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const programs = ['mortgage_credit', 'rwa_collateral', 'property_diligence', 'loyalty_rewards'];

const deployDir = path.join(__dirname, 'target', 'deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

console.log('🔑 Generated Program IDs:\n');
programs.forEach(name => {
  const kp = Keypair.generate();
  const keypairPath = path.join(deployDir, `${name}-keypair.json`);
  fs.writeFileSync(keypairPath, JSON.stringify(Array.from(kp.secretKey)));
  console.log(`${name}: ${kp.publicKey.toBase58()}`);
});
