# Guide d'Intégration Blockchain - SolEsTT

Ce guide explique comment intégrer les smart contracts avec le frontend et effectuer de vraies transactions à coût réduit.

## Vue d'ensemble

Nous allons déployer les smart contracts sur **Solana Devnet** et les tester avec de vraies micro-transactions (~0.50€ total).

### Budget nécessaire
- **0.5 SOL sur Devnet** (~10-15€ en valeur, mais GRATUIT via faucet)
- Coût par transaction: ~0.000005 SOL (~0.0001€)
- Coût total des tests: ~0.06 SOL (~1.50€)

## Étape 1: Installation des Outils

### Option A: WSL2 (Recommandé pour Windows)

```bash
# Installer WSL2
wsl --install

# Dans WSL Ubuntu, installer tout
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Option B: Windows Natif

Consultez **WINDOWS_SETUP.md** pour les instructions détaillées.

## Étape 2: Configuration Solana

```bash
# Configurer pour Devnet
solana config set --url https://api.devnet.solana.com

# Créer un wallet (si vous n'en avez pas)
solana-keygen new

# Obtenir des SOL gratuits sur Devnet
solana airdrop 2
solana balance  # Devrait afficher ~2 SOL
```

**Important**: Sauvegardez votre seed phrase!

## Étape 3: Build et Déploiement

### 3.1 Build les Smart Contracts

```bash
cd solana-realestate

# Nettoyer
anchor clean

# Builder
anchor build
```

Cela va créer les fichiers compilés dans `target/deploy/`.

### 3.2 Obtenir les Program IDs

```bash
anchor keys list
```

Vous verrez quelque chose comme:
```
property_tokenization: DpX7P...ABC123
rental_payment: FqY8Q...DEF456
```

**Copiez ces IDs**, vous en aurez besoin!

### 3.3 Mettre à Jour les Program IDs

#### a) Dans `Anchor.toml`:
```toml
[programs.devnet]
property_tokenization = "VOTRE_PROPERTY_ID"
rental_payment = "VOTRE_RENTAL_ID"
```

#### b) Dans `anchor/programs/property_tokenization/src/lib.rs` (ligne 4):
```rust
declare_id!("VOTRE_PROPERTY_ID");
```

#### c) Dans `anchor/programs/rental_payment/src/lib.rs` (ligne 4):
```rust
declare_id!("VOTRE_RENTAL_ID");
```

#### d) Dans `lib/solana/programs.ts`:
```typescript
export const PROPERTY_TOKENIZATION_PROGRAM_ID = new PublicKey(
  'VOTRE_PROPERTY_ID'
);

export const RENTAL_PAYMENT_PROGRAM_ID = new PublicKey(
  'VOTRE_RENTAL_ID'
);
```

### 3.4 Rebuild avec les bons IDs

```bash
anchor build
```

### 3.5 Déployer sur Devnet

```bash
# Option 1: Script automatisé (Recommandé)
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Option 2: Commande manuelle
anchor deploy --provider.cluster devnet
```

**Note**: Le déploiement coûte ~0.5-1 SOL. Si vous n'avez pas assez:
```bash
solana airdrop 2
```

## Étape 4: Tester avec de Vraies Transactions

### 4.1 Vérifier le Déploiement

```bash
# Vérifier que les programmes sont déployés
solana program show VOTRE_PROPERTY_ID --url devnet
solana program show VOTRE_RENTAL_ID --url devnet
```

### 4.2 Exécuter les Tests

```bash
# Exécuter le script de test
npm run test:blockchain
```

Ou avec Anchor:
```bash
anchor test --skip-local-validator
```

### 4.3 Tests Manuels avec le Frontend

1. **Démarrer le serveur dev**:
```bash
npm run dev
```

2. **Ouvrir http://localhost:3000**

3. **Connecter votre wallet Phantom/Solflare**
   - Assurez-vous d'être sur Devnet dans votre wallet
   - Connectez-vous au site

4. **Créer une propriété de test**:
   - Allez sur "Properties" > "List Property"
   - Utilisez ces valeurs de test:
     - Nom: "Studio Paris Test"
     - Prix: 0.1 SOL (~2-3€)
     - Parts: 100
     - Loyer: 0.01 SOL/mois

5. **Acheter des parts**:
   - Cliquez sur la propriété
   - Achetez 10 parts (~0.01 SOL = ~0.20-0.30€)
   - Confirmez la transaction dans votre wallet

## Étape 5: Vérifier les Transactions

Toutes vos transactions sont visibles sur Solana Explorer:

```
https://explorer.solana.com/address/VOTRE_WALLET?cluster=devnet
```

## Structure des Coûts (Tests Réels)

### Transactions de Test

| Opération | Coût (SOL) | Coût (€) | Description |
|-----------|-----------|----------|-------------|
| Créer propriété | ~0.002 | ~0.04€ | Une seule fois |
| Tokeniser propriété | ~0.002 | ~0.04€ | Une seule fois |
| Acheter 10 parts | ~0.01 | ~0.20€ | Prix des parts |
| Frais de transaction | ~0.000005 | ~0.0001€ | Par transaction |
| Créer accord location | ~0.002 | ~0.04€ | Une seule fois |
| Payer loyer | ~0.01 | ~0.20€ | Prix du loyer |

**Total pour tests complets: ~0.06 SOL (~1.50€)**

### Propriétés de Test Disponibles

Voir `lib/solana/testData.ts` pour les configurations:

1. **Studio Paris Test**: 0.1 SOL total, 100 parts
2. **Appartement Nice Test**: 0.5 SOL total, 500 parts
3. **Villa Bruxelles Test**: 1 SOL total, 1000 parts

## Étape 6: Intégration Frontend

### 6.1 Mettre à Jour les Hooks

Les hooks dans `lib/solana/hooks/` doivent être mis à jour pour utiliser les vrais Program IDs:

```typescript
// lib/solana/hooks/usePropertyTokenization.ts
import { PROPERTY_TOKENIZATION_PROGRAM_ID } from '../programs';

// Le hook utilisera automatiquement le bon program ID
```

### 6.2 Remplacer Mock Data

Une fois les tests réussis, remplacez les mock data par les vraies données on-chain:

```typescript
// Au lieu de:
import { getAllProperties } from '@/lib/solana/mockData';

// Utilisez:
import { usePropertyList } from '@/lib/solana/hooks/usePropertyTokenization';

function Properties() {
  const { properties, loading } = usePropertyList();
  // ...
}
```

## Dépannage

### "Program failed to complete"

```bash
# Vérifier les logs
solana logs --url devnet
```

### "Insufficient funds"

```bash
# Demander plus de SOL
solana airdrop 2
```

### "Invalid program ID"

Vérifiez que vous avez mis à jour TOUS les endroits avec les bons Program IDs (voir Étape 3.3).

### "Account not found"

La propriété n'existe pas encore. Créez-la d'abord avec le frontend ou le script de test.

## Tests Unitaires Anchor

Créez des tests dans `anchor/tests/`:

```typescript
// anchor/tests/property_tokenization.ts
import * as anchor from '@coral-xyz/anchor';
import { assert } from 'chai';

describe('property_tokenization', () => {
  it('Creates a property', async () => {
    // Test code here
  });

  it('Buys shares', async () => {
    // Test code here
  });
});
```

Exécutez avec:
```bash
anchor test
```

## Prochaines Étapes

1. ✅ Déployer les contracts sur Devnet
2. ✅ Tester avec de vraies transactions
3. ⬜ Créer des propriétés réelles avec metadata sur Arweave/IPFS
4. ⬜ Implémenter le frontend complet avec les vraies données
5. ⬜ Ajouter la gestion USDC pour les loyers
6. ⬜ Déployer sur Mainnet (après tests complets)

## Ressources

- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Faucet](https://faucet.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [SPL Token Documentation](https://spl.solana.com/token)

## Support

Questions? Problèmes?
1. Vérifiez les logs: `solana logs --url devnet`
2. Consultez le README.md
3. Rejoignez le Discord Solana

---

**🎉 Bon testing!** Vous êtes maintenant prêt à tester avec de vraies transactions blockchain!
