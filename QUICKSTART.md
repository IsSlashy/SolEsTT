# 🚀 Quick Start - Intégration Blockchain en 10 Minutes

Guide rapide pour déployer et tester avec de vraies micro-transactions sur Solana Devnet.

## Prérequis ✅

- Windows 10/11 avec WSL2 OU Linux/Mac
- 30 minutes de temps
- Aucun coût (SOL gratuits sur Devnet)

## Étape 1: Installation (5 min)

### WSL2 sur Windows (Recommandé)

```bash
# Dans PowerShell (Admin)
wsl --install

# Redémarrer, puis dans WSL Ubuntu:
sudo apt update && sudo apt upgrade -y

# Installer Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Installer Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Installer Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## Étape 2: Configuration (2 min)

```bash
# Naviguer vers le projet (dans WSL)
cd /mnt/p/C.I.S/solana-realestate

# Configurer Solana pour Devnet
npm run solana:config

# Créer un wallet
solana-keygen new

# Obtenir des SOL gratuits
npm run solana:airdrop
npm run solana:balance  # Devrait afficher ~2 SOL
```

## Étape 3: Build & Deploy (3 min)

```bash
# Builder les smart contracts
npm run anchor:build

# Obtenir les Program IDs
anchor keys list
```

**📝 IMPORTANT**: Notez vos Program IDs!

```
property_tokenization: DpX7P...ABC123
rental_payment: FqY8Q...DEF456
```

### Mettre à jour les IDs

**1. Dans `Anchor.toml` (ligne 7-8)**:
```toml
[programs.devnet]
property_tokenization = "VOTRE_PROPERTY_ID_ICI"
rental_payment = "VOTRE_RENTAL_ID_ICI"
```

**2. Dans `lib/solana/programs.ts`**:
```typescript
export const PROPERTY_TOKENIZATION_PROGRAM_ID = new PublicKey('VOTRE_PROPERTY_ID_ICI');
export const RENTAL_PAYMENT_PROGRAM_ID = new PublicKey('VOTRE_RENTAL_ID_ICI');
```

**3. Dans `anchor/programs/property_tokenization/src/lib.rs` (ligne 4)**:
```rust
declare_id!("VOTRE_PROPERTY_ID_ICI");
```

**4. Dans `anchor/programs/rental_payment/src/lib.rs` (ligne 4)**:
```rust
declare_id!("VOTRE_RENTAL_ID_ICI");
```

### Rebuild & Deploy

```bash
# Rebuild avec les bons IDs
npm run anchor:build

# Déployer sur Devnet
npm run anchor:deploy
```

Si vous n'avez pas assez de SOL:
```bash
npm run solana:airdrop
```

## Étape 4: Tester! (5 min)

### Option A: Frontend

```bash
# Démarrer le serveur
npm run dev
```

1. Ouvrir http://localhost:3000
2. Connecter votre wallet Phantom (configuré sur Devnet)
3. Importer votre wallet créé:
   - Dans Phantom: Settings > Import Private Key
   - Utiliser la clé privée de `~/.config/solana/id.json`
4. Créer une propriété de test:
   - Nom: "Studio Test"
   - Prix: 0.1 SOL
   - Parts: 100
5. Acheter 10 parts (~0.01 SOL = ~0.20€)

### Option B: Script de Test

```bash
npm run test:blockchain
```

Ce script va automatiquement:
- ✅ Créer une propriété (0.002 SOL)
- ✅ La tokeniser (0.002 SOL)
- ✅ Acheter des parts (0.01 SOL)
- ✅ Créer un accord de location (0.002 SOL)

**Total: ~0.02 SOL (~0.50€)**

## Vérifier les Résultats 🔍

### Voir vos transactions

```bash
# Obtenir votre adresse wallet
solana address
```

Puis allez sur:
```
https://explorer.solana.com/address/VOTRE_ADRESSE?cluster=devnet
```

### Voir vos programmes déployés

```
https://explorer.solana.com/address/VOTRE_PROPERTY_ID?cluster=devnet
https://explorer.solana.com/address/VOTRE_RENTAL_ID?cluster=devnet
```

## Coûts des Tests 💰

| Opération | Coût | Équivalent |
|-----------|------|------------|
| Créer propriété | 0.002 SOL | ~0.04€ |
| Tokeniser | 0.002 SOL | ~0.04€ |
| Acheter 10 parts | 0.01 SOL | ~0.20€ |
| Frais de tx | 0.000005 SOL | ~0.0001€ |
| **TOTAL** | **~0.02 SOL** | **~0.50€** |

## Dépannage 🔧

### Erreur: "command not found"

```bash
# Recharger le PATH
source ~/.bashrc
# ou
source ~/.zshrc
```

### Erreur: "Insufficient funds"

```bash
npm run solana:airdrop
```

### Erreur: "Invalid program ID"

Vérifiez que vous avez mis à jour les 4 fichiers (Anchor.toml, programs.ts, et les 2 lib.rs).

### Erreur: "Program failed to complete"

```bash
# Voir les logs en temps réel
solana logs --url devnet
```

## Commandes Utiles 📝

```bash
# Voir le solde
npm run solana:balance

# Builder les contracts
npm run anchor:build

# Déployer
npm run anchor:deploy

# Tester
npm run anchor:test

# Voir les logs
solana logs --url devnet

# Info sur un programme
solana program show PROGRAM_ID --url devnet
```

## Prochaines Étapes 🎯

1. ✅ Créer plusieurs propriétés de test
2. ✅ Tester l'achat/vente de parts
3. ✅ Tester les paiements de loyer
4. ⬜ Ajouter des metadata riches (images, descriptions)
5. ⬜ Implémenter USDC pour les loyers
6. ⬜ Préparer pour Mainnet

## Besoin d'Aide? 🆘

- **Guide détaillé**: Voir `INTEGRATION_GUIDE.md`
- **Setup Windows**: Voir `WINDOWS_SETUP.md`
- **Déploiement**: Voir `DEPLOYMENT_GUIDE.md`
- **Smart Contracts**: Voir `anchor/programs/*/src/lib.rs`

## Support

- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchorlang)
- [Stack Overflow - Solana Tag](https://stackoverflow.com/questions/tagged/solana)

---

**🎉 C'est tout!** Vous avez maintenant un projet de tokenisation immobilière fonctionnel sur Solana!

**💡 Astuce**: Utilisez `solana logs --url devnet` dans un terminal séparé pour voir toutes les transactions en temps réel pendant vos tests.
