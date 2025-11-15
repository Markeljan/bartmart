# BartMart

A decentralized swap marketplace that enables peer-to-peer token swaps on Base. BartMart supports intent-based orders for ETH and ERC20 token swaps without requiring AMM liquidity pools.

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

