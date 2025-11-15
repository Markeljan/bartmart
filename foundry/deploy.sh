#!/bin/bash

# BartMart Deployment Script for Base Mainnet
# Usage: ./deploy.sh

set -e

if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

source .env

RPC_URL=${BASE_MAINNET_RPC_URL:-https://mainnet.base.org}
ETHERSCAN_API_KEY=${BASESCAN_API_KEY}

echo "🚀 Deploying to Base Mainnet..."

if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" == "your_private_key_here" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo "❌ Error: RPC URL not set in .env file"
    exit 1
fi

echo "📝 Deploying BartMart contract..."
echo "🔗 RPC URL: $RPC_URL"

forge script script/BartMart.s.sol:BartMartScript \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    ${ETHERSCAN_API_KEY:+--verify --etherscan-api-key "$ETHERSCAN_API_KEY"} \
    -vvvv

echo "✅ Deployment complete!"
