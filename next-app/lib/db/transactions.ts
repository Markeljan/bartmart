import type { Address } from "viem";
import { Keys } from "./keys";
import { ensureRedisConnection, getRedisClient } from "./redis";
import type { Transaction } from "./types";

/**
 * Save transaction to Redis
 */
export async function saveTransaction(tx: Transaction): Promise<boolean> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return false;
  }

  try {
    const pipeline = client.pipeline();

    // Save transaction hash
    pipeline.hset(Keys.transaction(tx.hash), {
      hash: tx.hash,
      from: tx.from.toLowerCase(),
      to: tx.to?.toLowerCase() || "",
      type: tx.type,
      orderId: tx.orderId || "",
      tokenAddress: tx.tokenAddress?.toLowerCase() || "",
      amount: tx.amount || "",
      blockNumber: tx.blockNumber?.toString() || "",
      timestamp: tx.timestamp?.toString() || Date.now().toString(),
      status: tx.status,
    });

    // Add to user transaction list
    pipeline.lpush(Keys.userTransactions(tx.from), tx.hash);
    pipeline.ltrim(Keys.userTransactions(tx.from), 0, 999); // Keep last 1000 transactions

    // Add to order transactions if applicable
    if (tx.orderId) {
      pipeline.sadd(Keys.orderTransactions(tx.orderId), tx.hash);
    }

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error("Error saving transaction to Redis:", error);
    return false;
  }
}

/**
 * Get transaction by hash
 */
export async function getTransaction(hash: string): Promise<Transaction | null> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return null;
  }

  try {
    const data = await client.hgetall(Keys.transaction(hash));
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      hash: data.hash || hash,
      from: data.from as Address,
      to: data.to ? (data.to as Address) : undefined,
      type: data.type as Transaction["type"],
      orderId: data.orderId || undefined,
      tokenAddress: data.tokenAddress ? (data.tokenAddress as Address) : undefined,
      amount: data.amount || undefined,
      blockNumber: data.blockNumber ? Number.parseInt(data.blockNumber, 10) : undefined,
      timestamp: data.timestamp ? Number.parseInt(data.timestamp, 10) : undefined,
      status: data.status as Transaction["status"],
    };
  } catch (error) {
    console.error("Error getting transaction from Redis:", error);
    return null;
  }
}

/**
 * Get user transactions
 */
export async function getUserTransactions(address: Address, limit = 100): Promise<Transaction[]> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return [];
  }

  try {
    const txHashes = await client.lrange(Keys.userTransactions(address), 0, limit - 1);

    const transactions: Transaction[] = [];
    for (const hash of txHashes) {
      const tx = await getTransaction(hash);
      if (tx) {
        transactions.push(tx);
      }
    }

    return transactions;
  } catch (error) {
    console.error("Error getting user transactions from Redis:", error);
    return [];
  }
}

/**
 * Get transactions for an order
 */
export async function getOrderTransactions(orderId: string | bigint): Promise<Transaction[]> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return [];
  }

  try {
    const txHashes = await client.smembers(Keys.orderTransactions(orderId));

    const transactions: Transaction[] = [];
    for (const hash of txHashes) {
      const tx = await getTransaction(hash);
      if (tx) {
        transactions.push(tx);
      }
    }

    // Sort by timestamp descending
    transactions.sort((a, b) => {
      const aTime = a.timestamp || 0;
      const bTime = b.timestamp || 0;
      return bTime - aTime;
    });

    return transactions;
  } catch (error) {
    console.error("Error getting order transactions from Redis:", error);
    return [];
  }
}
