# BartMart

<div align="center">
  <img src="next-app/public/logo_512.png" alt="BartMart Logo" width="128" height="128" />
</div>

An OTC intent marketplace for humans and agents to trade any tokens onchain. BartMart enables intent-based orders for ETH and ERC20 token swaps without requiring AMM liquidity pools or complex SDK integrations.

**Built by <img src="next-app/public/soko_avatar.png" alt="soko.eth" width="20" height="20" style="vertical-align: middle; border-radius: 50%;" /> soko.eth**

## The Problem

AI agents that want to swap tokens require difficult to maintain SDK integrations and don't support new protocols. They must manage Uniswap V3, V4, Aerodrome, etc. This is especially problematic for agents deployed to TEE environments like <img src="next-app/public/eigencloud-logo-blue.png" alt="Eigen Cloud" width="100" height="26" style="vertical-align: middle;" /> Eigen Compute where updating the agent implementation frequently is not desirable for user trust and verifiability.

## The Solution

Intent-based OTC market onchain via `BartMart.sol`. Agents/users provide tokens and amounts they want to buy/sell, and the market fulfills orders when conditions are favorable.

## The Result

Agents can be deployed to TEEs with one simple trading tool - using the `BartMart.sol` contract deployed onchain. No need to manage multiple protocol SDKs, enabling stable and verifiable agent implementations.

## 🏗️ Monorepo Structure

This repository is organized as a monorepo with two main components:

### 📦 `foundry/` - Smart Contracts

Contains the Solidity smart contracts for BartMart's intent-based swap system. This directory includes:

- **Smart Contracts**: The `BartMart.sol` contract that handles order creation, fulfillment, and cancellation
- **Deployment Scripts**: Scripts for deploying to Base mainnet
- **Tests**: Comprehensive test suite for the contracts
- **CI/CD**: GitHub Actions workflow for automated testing

For detailed information about the contracts, deployment, and usage, see the [Foundry README](./foundry/README.md).

**Key Features:**
- Intent-based order system
- Support for ETH → Token, Token → ETH, and Token → Token swaps
- Secure order cancellation by creators
- No AMM required - direct peer-to-peer swaps

### 🎨 `next-app/` - Frontend Application

The main Next.js application for interacting with BartMart contracts. This is the user-facing interface where users can:

- Create swap orders
- Browse available orders
- Fulfill orders
- Manage their own orders

**Tech Stack:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Biome (linting & formatting)

**Pitch Deck:**
- Interactive presentation available at `/deck` route
- Showcases BartMart's purpose, problem, solution, and result
- Navigate with arrow keys, spacebar, or click navigation controls

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) - for smart contract development
- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- Node.js 20+ (if not using Bun)
- A Base-compatible wallet with ETH for gas fees

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd x420-agent
   ```

2. **Install dependencies**:

   For smart contracts:
   ```bash
   cd foundry
   bun install
   ```

   For the frontend app:
   ```bash
   cd ../next-app
   bun install
   ```

3. **Configure environment variables**:

   In `foundry/`:
   ```bash
   cp foundry/.env.example foundry/.env
   # Edit foundry/.env with your values
   ```

   In `next-app/` (when needed):
   ```bash
   cp next-app/.env.example next-app/.env
   # Edit next-app/.env with your values
   ```

## 📚 Documentation

- **[Foundry README](./foundry/README.md)** - Complete documentation for smart contracts, deployment, and contract usage
- **[Next.js App README](./next-app/README.md)** - Frontend application documentation (when available)

## 🛠️ Development

### Smart Contracts

```bash
cd foundry

# Build contracts
forge build

# Run tests
forge test

# Format code
forge fmt

# Deploy to Base mainnet
./deploy.sh
```

### Frontend Application

```bash
cd next-app

# Start development server
bun dev

# Build for production
bun build

# Run linter
bun lint

# Format code
bun format
```

### Pitch Deck

The pitch deck is available as a route in the Next.js application:

```bash
cd next-app

# Start development server
bun dev

# Navigate to http://localhost:3000/deck
```

**Navigation:**
- Use arrow keys (← →) or spacebar to navigate between slides
- Click the navigation dots at the bottom to jump to specific slides
- Use Home/End keys to jump to first/last slide

## 🏛️ Architecture

```
x420-agent/
├── foundry/          # Smart contracts (Solidity + Foundry)
│   ├── src/         # Contract source code
│   ├── test/        # Contract tests
│   ├── script/      # Deployment scripts
│   └── README.md    # Contract documentation
│
└── next-app/        # Frontend application (Next.js)
    ├── app/         # Next.js app directory
    ├── public/      # Static assets
    └── README.md    # App documentation
```

## 🔐 Security

- ⚠️ **Never commit private keys or `.env` files** to version control
- ✅ Use hardware wallets for production deployments
- ✅ Test thoroughly on testnets before mainnet deployment
- ✅ Review contract code and understand the risks
- ✅ Consider getting a security audit before mainnet deployment

## 📝 License

MIT

## 🔗 Additional Resources

- [Base Documentation](https://docs.base.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Basescan Explorer](https://basescan.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📧 Support

For issues or questions:
- Check the [Foundry README](./foundry/README.md) for contract-related questions
- Review test cases in `foundry/test/`
- Open an issue on the repository

