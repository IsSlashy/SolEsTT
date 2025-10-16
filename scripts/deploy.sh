#!/bin/bash

# SolEsTT Deployment Script
# This script automates the deployment of smart contracts to Solana Devnet

set -e

echo "🚀 SolEsTT Smart Contract Deployment Script"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI is not installed${NC}"
    echo "Install it from: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI is not installed${NC}"
    echo "Install it with: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites installed${NC}"

# Check Solana configuration
echo -e "\n${YELLOW}Checking Solana configuration...${NC}"
CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
echo "Current cluster: $CLUSTER"

if [[ $CLUSTER != *"devnet"* ]]; then
    echo -e "${YELLOW}⚠ Not configured for Devnet. Switching...${NC}"
    solana config set --url https://api.devnet.solana.com
fi

# Check wallet balance
echo -e "\n${YELLOW}Checking wallet balance...${NC}"
BALANCE=$(solana balance | awk '{print $1}')
echo "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo -e "${YELLOW}⚠ Low balance. Requesting airdrop...${NC}"
    solana airdrop 2
    sleep 5
fi

# Build the programs
echo -e "\n${YELLOW}Building Anchor programs...${NC}"
anchor build

# Get program IDs
echo -e "\n${YELLOW}Program IDs:${NC}"
anchor keys list

# Ask user if they want to continue
echo -e "\n${YELLOW}Do you want to deploy to Devnet? (y/n)${NC}"
read -r response

if [[ "$response" != "y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy
echo -e "\n${YELLOW}Deploying to Devnet...${NC}"
anchor deploy

# Verify deployment
echo -e "\n${YELLOW}Verifying deployment...${NC}"
PROPERTY_PROGRAM_ID=$(anchor keys list | grep "property_tokenization" | awk '{print $2}')
RENTAL_PROGRAM_ID=$(anchor keys list | grep "rental_payment" | awk '{print $2}')

solana program show $PROPERTY_PROGRAM_ID
solana program show $RENTAL_PROGRAM_ID

echo -e "\n${GREEN}✅ Deployment successful!${NC}"
echo -e "\n${YELLOW}Program IDs:${NC}"
echo "Property Tokenization: $PROPERTY_PROGRAM_ID"
echo "Rental Payment: $RENTAL_PROGRAM_ID"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Update lib/solana/programs.ts with these program IDs"
echo "2. Update Anchor.toml [programs.devnet] section"
echo "3. Update declare_id!() in both Rust program files"
echo "4. Rebuild: anchor build"
echo "5. Test the integration from the frontend"

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
