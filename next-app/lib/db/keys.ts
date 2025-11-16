import type { Address } from "viem";

/**
 * Redis key naming conventions and helpers
 */

export const Keys = {
  // Orders
  order: (orderId: string | bigint) => `order:${orderId.toString()}`,
  ordersActive: () => "orders:active",
  ordersFulfilled: () => "orders:fulfilled",
  ordersCancelled: () => "orders:cancelled",
  ordersByCreator: (address: Address) => `orders:by:creator:${address.toLowerCase()}`,
  ordersByToken: (address: Address) => `orders:by:token:${address.toLowerCase()}`,
  orderCounter: () => "orders:counter",

  // Transactions
  transaction: (hash: string) => `tx:${hash}`,
  userTransactions: (address: Address) => `tx:user:${address.toLowerCase()}`,
  orderTransactions: (orderId: string | bigint) => `tx:order:${orderId.toString()}`,

  // Tokens
  token: (address: Address) => `token:${address.toLowerCase()}`,
  tokensList: () => "tokens:list",

  // Users
  user: (address: Address) => `user:${address.toLowerCase()}`,
  userOrdersCreated: (address: Address) => `user:${address.toLowerCase()}:orders:created`,
  userOrdersFulfilled: (address: Address) => `user:${address.toLowerCase()}:orders:fulfilled`,

  // Indexer state
  indexerLastBlock: () => "indexer:lastBlock",
  indexerState: () => "indexer:state",
};
