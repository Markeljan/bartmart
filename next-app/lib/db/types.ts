import type { Address } from "viem";

export type Order = {
  orderId: string; // BigInt as string for JSON serialization
  creator: Address;
  inputToken: Address;
  inputAmount: string; // BigInt as string
  outputToken: Address;
  outputAmount: string; // BigInt as string
  fulfilled: boolean;
  cancelled: boolean;
  createdAt?: number; // Unix timestamp
  fulfilledAt?: number; // Unix timestamp
  cancelledAt?: number; // Unix timestamp
  blockNumber?: number;
  transactionHash?: string;
};

export type Transaction = {
  hash: string;
  from: Address;
  to?: Address;
  type: "create" | "fulfill" | "cancel" | "approve";
  orderId?: string;
  tokenAddress?: Address;
  amount?: string;
  blockNumber?: number;
  timestamp?: number;
  status: "pending" | "confirmed" | "failed";
};

export type TokenMetadata = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  lastUpdated?: number; // Unix timestamp
};

export type UserStats = {
  address: Address;
  ordersCreated: number;
  ordersFulfilled: number;
  ordersCancelled: number;
  totalVolume?: string; // Total volume in native token
  firstSeen?: number; // Unix timestamp
  lastSeen?: number; // Unix timestamp
};

export type OrderFilters = {
  status?: "live" | "completed";
  creator?: Address;
  inputToken?: Address;
  outputToken?: Address;
  limit?: number;
  offset?: number;
};
