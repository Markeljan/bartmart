# bartmart

AI SDK compatible tools for creating and fetching on-chain orders on BartMart, a decentralized intent market built on Base.

## Installation

```bash
npm install bartmart
# or
bun add bartmart
# or
yarn add bartmart
```

## Prerequisites

- Node.js 18+ or Bun
- An `ACCOUNT_PK` environment variable containing a private key (for creating orders)
- Optional: `BASE_RPC_URL` environment variable (defaults to a public Base RPC endpoint)

## Environment Variables

- `ACCOUNT_PK` (required for creating orders): Private key with `0x` prefix for signing transactions
- `BASE_RPC_URL` (optional): Custom Base network RPC URL (defaults to public endpoint)

## Usage

### With AI SDK

```typescript
import { bartmartTools } from "bartmart";
import { generateText } from "ai";

const result = await generateText({
  model: yourModel,
  tools: {
    ...bartmartTools,
  },
  // ... other config
});
```

### Direct Usage

```typescript
import { createOrderTool, fetchOrdersTool } from "bartmart";

// Create an order
const result = await createOrderTool.execute({
  inputToken: "0x0", // ETH
  inputAmount: "1000000000000000000", // 1 ETH (in wei)
  outputToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  outputAmount: "3000000000", // 3000 USDC (6 decimals)
});

console.log(result);
// {
//   success: true,
//   orderId: "123",
//   transactionHash: "0x...",
//   blockNumber: "12345678"
// }

// Fetch a specific order
const order = await fetchOrdersTool.execute({
  orderId: 123,
});

console.log(order);
// {
//   success: true,
//   orders: [{
//     orderId: "123",
//     creator: "0x...",
//     inputToken: "0x0000000000000000000000000000000000000000",
//     inputAmount: "1000000000000000000",
//     outputToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//     outputAmount: "3000000000",
//     fulfilled: false,
//     cancelled: false
//   }]
// }

// Fetch recent orders
const recentOrders = await fetchOrdersTool.execute({
  limit: 10,
});
```

## API Reference

### `createOrderTool`

Creates a new swap order on BartMart.

**Parameters:**
- `inputToken` (string): Input token address. Use `"0x0"` or `"eth"` for ETH.
- `inputAmount` (string): Input amount as a string (e.g., `"1000000000000000000"` for 1 ETH).
- `outputToken` (string): Output token address. Use `"0x0"` or `"eth"` for ETH.
- `outputAmount` (string): Output amount as a string.

**Returns:**
```typescript
{
  success: boolean;
  orderId?: string;
  transactionHash?: string;
  blockNumber?: string;
  error?: string;
}
```

### `fetchOrdersTool`

Fetches order(s) from BartMart.

**Parameters:**
- `orderId` (number, optional): Specific order ID to fetch.
- `limit` (number, optional): Maximum number of orders to fetch when `orderId` is not provided (default: 10, max: 100).

**Returns:**
```typescript
{
  success: boolean;
  orders?: Array<{
    orderId: string;
    creator: string;
    inputToken: string;
    inputAmount: string;
    outputToken: string;
    outputAmount: string;
    fulfilled: boolean;
    cancelled: boolean;
  }>;
  error?: string;
}
```

## Token Addresses

- **ETH**: Use `"0x0"` or `"eth"` (case-insensitive)
- **USDC on Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Amount Format

Amounts should be provided as strings representing the smallest unit:
- ETH: Use wei (1 ETH = `"1000000000000000000"`)
- USDC: Use smallest unit (1 USDC = `"1000000"` for 6 decimals)

## Contract Details

- **Contract Address**: `0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C`
- **Network**: Base (Chain ID: 8453)
- **Explorer**: [Basescan](https://basescan.org/address/0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C)

## Security

⚠️ **Never commit your private key to version control!**

Always use environment variables or secure secret management systems for `ACCOUNT_PK`.

## License

MIT
