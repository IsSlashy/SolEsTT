# 🚀 Prochaines Étapes - Installation Blockchain SolEsTT

## ✅ Ce qui est INSTALLÉ

### 1. Rust ✅
```bash
rustc --version  # rustc 1.90.0
cargo --version  # cargo 1.90.0
```

### 2. Anchor CLI ✅
```bash
anchor --version  # anchor-cli 0.32.1
```

## ⚠️ CE QU'IL FAUT INSTALLER MAINTENANT

### Solana CLI (2 minutes - Action Requise)

**IMPORTANT**: Vous devez installer Solana CLI manuellement pour continuer.

#### Méthode 1: PowerShell (Recommandée - 2 minutes)

1. **Ouvrir PowerShell EN TANT QU'ADMINISTRATEUR** (Clic droit > Exécuter en tant qu'administrateur)

2. **Coller et exécuter**:
```powershell
Invoke-WebRequest -Uri "https://release.solana.com/v1.18.22/solana-install-init-x86_64-pc-windows-msvc.exe" -OutFile "$env:TEMP\solana-install.exe"
& "$env:TEMP\solana-install.exe" v1.18.22
```

3. **Attendre la fin**, puis:
```powershell
$env:PATH += ";$env:USERPROFILE\.local\share\solana\install\active_release\bin"
[Environment]::SetEnvironmentVariable("Path", "$env:PATH", [EnvironmentVariableTarget]::User)
```

4. **FERMER PowerShell**, ouvrir un NOUVEAU Git Bash, et vérifier:
```bash
solana --version
```

Vous devriez voir: `solana-cli 1.18.22`

#### Méthode 2: Téléchargement Manuel

Si PowerShell ne fonctionne pas:

1. Téléchargez: https://github.com/solana-labs/solana/releases/download/v1.18.22/solana-install-init-x86_64-pc-windows-msvc.exe
2. Double-cliquez sur le fichier téléchargé
3. Suivez l'installeur
4. Redémarrez votre terminal

## 📝 APRÈS L'INSTALLATION DE SOLANA CLI

Une fois Solana CLI installé, exécutez ces commandes dans l'ordre:

### 1. Configuration Solana (1 minute)

```bash
cd P:/C.I.S/solana-realestate

# Configurer pour Devnet
solana config set --url https://api.devnet.solana.com

# Créer un wallet (SAUVEGARDEZ LA SEED PHRASE!)
solana-keygen new

# Demander des SOL gratuits
solana airdrop 2

# Vérifier le solde
solana balance
```

### 2. Build des Smart Contracts (2 minutes)

```bash
# Builder les contracts
anchor build

# Obtenir les Program IDs (NOTEZ-LES!)
anchor keys list
```

Vous verrez:
```
property_tokenization: AbCd...123
rental_payment: XyZ9...456
```

**📝 COPIEZ CES IDs QUELQUE PART!**

### 3. Mettre à Jour les Program IDs (3 minutes)

Vous devez mettre à jour **4 fichiers** avec vos Program IDs:

#### a) `Anchor.toml` (lignes 7-8)
```toml
[programs.devnet]
property_tokenization = "VOTRE_PROPERTY_ID"
rental_payment = "VOTRE_RENTAL_ID"
```

#### b) `lib/solana/programs.ts`
```typescript
export const PROPERTY_TOKENIZATION_PROGRAM_ID = new PublicKey('VOTRE_PROPERTY_ID');
export const RENTAL_PAYMENT_PROGRAM_ID = new PublicKey('VOTRE_RENTAL_ID');
```

#### c) `anchor/programs/property_tokenization/src/lib.rs` (ligne 4)
```rust
declare_id!("VOTRE_PROPERTY_ID");
```

#### d) `anchor/programs/rental_payment/src/lib.rs` (ligne 4)
```rust
declare_id!("VOTRE_RENTAL_ID");
```

### 4. Rebuild et Deploy (5 minutes)

```bash
# Rebuild avec les bons IDs
anchor build

# Vérifier qu'il y a assez de SOL
solana balance  # Devrait être ~2 SOL

# Si pas assez:
solana airdrop 2

# Déployer sur Devnet
anchor deploy
```

Le déploiement va prendre 2-3 minutes et coûter ~0.5-1 SOL (gratuit sur Devnet).

### 5. Tester! (5 minutes)

#### Option A: Frontend

```bash
# Démarrer le serveur (déjà en cours normalement)
npm run dev

# Ouvrir http://localhost:3000
# Connecter votre wallet Phantom/Solflare sur Devnet
# Tester les fonctionnalités
```

#### Option B: Script de Test

```bash
npm run test:blockchain
```

## 🎯 Résumé des Commandes

```bash
# 1. Après installation Solana CLI
cd P:/C.I.S/solana-realestate
solana config set --url https://api.devnet.solana.com
solana-keygen new
solana airdrop 2

# 2. Build
anchor build
anchor keys list  # NOTEZ LES IDs!

# 3. Mettre à jour les 4 fichiers avec les IDs
# (Anchor.toml, programs.ts, 2x lib.rs)

# 4. Rebuild & Deploy
anchor build
anchor deploy

# 5. Test
npm run test:blockchain
```

## 📊 Temps Total Estimé

- Installation Solana CLI: **2 minutes**
- Configuration + wallet: **2 minutes**
- Build initial: **3 minutes**
- Mise à jour IDs: **3 minutes**
- Rebuild + Deploy: **5 minutes**
- Tests: **5 minutes**

**TOTAL: ~20 minutes**

## 💰 Budget SOL Nécessaire (Devnet - GRATUIT)

- Déploiement: ~0.5-1 SOL
- Tests: ~0.05 SOL
- Total: ~1.5 SOL

**Obtenir via**: `solana airdrop 2` (gratuit, illimité sur Devnet)

## 🆘 Dépannage

### "solana: command not found"

1. Fermez TOUS les terminals
2. Ouvrez un NOUVEAU terminal
3. Réessayez

### "Insufficient funds"

```bash
solana airdrop 2
```

### "Program account not found"

Vérifiez que vous avez mis à jour les Program IDs dans LES 4 fichiers.

### Erreur de build

```bash
anchor clean
anchor build
```

## 📚 Guides Disponibles

- **QUICKSTART.md**: Guide complet en 10 minutes
- **INTEGRATION_GUIDE.md**: Guide détaillé d'intégration
- **WINDOWS_SETUP.md**: Installation WSL2 (alternative)
- **INSTALL_SOLANA_MANUAL.md**: Aide installation Solana
- **INSTALLATION_STATUS.md**: Statut actuel

## 🎯 Après le Déploiement

1. ✅ Tester avec de vraies micro-transactions (~0.50€)
2. ✅ Créer plusieurs propriétés de test
3. ✅ Tester achats/ventes de parts
4. ✅ Vérifier les transactions sur Solana Explorer
5. ⬜ Préparer la soumission hackathon

## 📞 Support

- Discord Solana: https://discord.gg/solana
- Discord Anchor: https://discord.gg/anchorlang
- Documentation: voir README.md

---

**🚀 Action Immédiate**: Installer Solana CLI maintenant avec PowerShell (admin)!

Une fois fait, suivez les étapes 1-5 ci-dessus dans l'ordre.
