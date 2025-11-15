# BartMart

A decentralized swap marketplace contract that enables peer-to-peer token swaps on Base. BartMart supports:
- **ETH → Token** swaps
- **Token → ETH** swaps  
- **Token → Token** swaps

## Features

- Intent-based order system: Create orders specifying what you want to swap and what you want in return
- No AMM required: Direct peer-to-peer swaps without liquidity pools
- Flexible: Support for any ERC20 token and ETH
- Secure: Orders can be cancelled by creators, preventing stuck orders

## Contract Overview

The `BartMart` contract allows users to:
1. **Create Orders**: Deposit tokens/ETH and specify desired output
2. **Fulfill Orders**: Provide the requested output and receive the input
3. **Cancel Orders**: Cancel your own orders and receive refunds

### Order Structure

```solidity
struct Order {
    address creator;        // Order creator address
    address inputToken;     // Input token (address(0) for ETH)
    uint256 inputAmount;    // Amount of input tokens/ETH
    address outputToken;   // Output token (address(0) for ETH)
    uint256 outputAmount;  // Amount of output tokens/ETH desired
    bool fulfilled;        // Whether order is fulfilled
    bool cancelled;        // Whether order is cancelled
}
```

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- A Base-compatible wallet with ETH for gas fees
- An RPC URL for Base mainnet (see [Getting an RPC URL](#getting-an-rpc-url))

## Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd foundry
   ```

2. **Install dependencies**:
   ```bash
   bun i
   ```

3. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```bash
   # Edit .env and add your values
   PRIVATE_KEY=your_private_key_here
   BASE_MAINNET_RPC_URL=https://mainnet.base.org
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

   ⚠️ **Security Warning**: Never commit your `.env` file or private keys to version control!

## Getting an RPC URL

You'll need an RPC URL to deploy and interact with Base. Free options include:

- **Alchemy**: https://www.alchemy.com/ (recommended)
- **Infura**: https://www.infura.io/
- **QuickNode**: https://www.quicknode.com/
- **Public RPC**: `https://mainnet.base.org` (may be rate-limited)

## Development

### Build

```bash
forge build
```

### Test

```bash
forge test
```

Run with verbosity:
```bash
forge test -vvv
```

### Format

```bash
forge fmt
```

### Gas Snapshots

```bash
forge snapshot
```

## Deployment

### Deploy to Base Mainnet

#### Option 1: Using the Deployment Script (Recommended)

1. **Ensure your `.env` file is configured** with:
   - `PRIVATE_KEY`: Your deployer wallet's private key
   - `BASE_MAINNET_RPC_URL`: Your Base mainnet RPC URL
   - `BASESCAN_API_KEY`: Your Basescan API key (for verification)

2. **Fund your deployer wallet**:
   - Send ETH to your deployer address on Base mainnet
   - You'll need ETH for gas fees (typically 0.01-0.1 ETH is sufficient)

3. **Deploy using the script**:
   ```bash
   ./deploy.sh
   ```

   The script will automatically:
   - Check for required environment variables
   - Deploy the contract
   - Verify the contract on Basescan (if API key is provided)

#### Option 2: Manual Deployment

1. **Ensure your `.env` file is configured** (same as above)

2. **Fund your deployer wallet** (same as above)

3. **Deploy the contract manually**:
   ```bash
   source .env
   forge script script/BartMart.s.sol:BartMartScript \
     --rpc-url $BASE_MAINNET_RPC_URL \
     --private-key $PRIVATE_KEY \
     --broadcast \
     --verify \
     --etherscan-api-key $BASESCAN_API_KEY \
     -vvvv
   ```

4. **Verify deployment**:
   - The contract address will be displayed in the terminal
   - Check it on [Basescan](https://basescan.org/)
   - The `--verify` flag will automatically verify the contract

## Contract Usage

### Creating an Order (ETH → Token)

```solidity
// Swap 1 ETH for 100 TOKEN
bartMart.createOrder{value: 1 ether}(
    address(0),              // inputToken: ETH
    1 ether,                 // inputAmount
    tokenAddress,            // outputToken
    100 ether                // outputAmount
);
```

### Creating an Order (Token → ETH)

```solidity
// First approve the contract
token.approve(address(bartMart), 100 ether);

// Swap 100 TOKEN for 1 ETH
bartMart.createOrder(
    tokenAddress,            // inputToken
    100 ether,               // inputAmount
    address(0),              // outputToken: ETH
    1 ether                  // outputAmount
);
```

### Creating an Order (Token → Token)

```solidity
// First approve the contract
token1.approve(address(bartMart), 100 ether);

// Swap 100 TOKEN1 for 200 TOKEN2
bartMart.createOrder(
    token1Address,           // inputToken
    100 ether,               // inputAmount
    token2Address,           // outputToken
    200 ether                // outputAmount
);
```

### Fulfilling an Order

```solidity
// For token output orders, approve first
token.approve(address(bartMart), amount);

// For ETH output orders, send ETH with the call
bartMart.fulfilOrder{value: ethAmount}(orderId);
```

### Cancelling an Order

```solidity
bartMart.cancelOrder(orderId);
```

## Security Considerations

- ⚠️ **Never share your private key** or commit it to version control
- ✅ Use hardware wallets for production deployments
- ✅ Test thoroughly on testnets before mainnet deployment
- ✅ Review the contract code and understand the risks
- ✅ Consider getting a security audit before mainnet deployment

## Gas Costs

Approximate gas costs (as of deployment):
- `createOrder`: ~100,000 - 150,000 gas
- `fulfilOrder`: ~150,000 - 200,000 gas
- `cancelOrder`: ~50,000 - 80,000 gas

Actual gas costs may vary based on network conditions.

## License

MIT

## Support

For issues or questions:
- Check the contract code in `src/BartMart.sol`
- Review test cases in `test/BartMart.t.sol`
- Open an issue on the repository

## Additional Resources

- [Base Documentation](https://docs.base.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Basescan Explorer](https://basescan.org/)
- [Base Bridge](https://bridge.base.org/)
