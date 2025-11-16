import type { Address } from "viem";
import { Keys } from "./keys";
import { ensureRedisConnection, getRedisClient } from "./redis";
import type { TokenMetadata } from "./types";

/**
 * Save token metadata to Redis
 */
export async function saveTokenMetadata(
  address: Address,
  metadata: Omit<TokenMetadata, "address" | "lastUpdated">
): Promise<boolean> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return false;
  }

  try {
    const addr = address.toLowerCase();
    const pipeline = client.pipeline();

    // Save token metadata
    pipeline.hset(Keys.token(address as Address), {
      address: addr,
      symbol: metadata.symbol,
      name: metadata.name,
      decimals: metadata.decimals.toString(),
      logoURI: metadata.logoURI || "",
      lastUpdated: Date.now().toString(),
    });

    // Add to tokens list
    pipeline.sadd(Keys.tokensList(), addr);

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error("Error saving token metadata to Redis:", error);
    return false;
  }
}

/**
 * Get token metadata
 */
export async function getTokenMetadata(address: Address): Promise<TokenMetadata | null> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return null;
  }

  try {
    const data = await client.hgetall(Keys.token(address));
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      address,
      symbol: data.symbol,
      name: data.name,
      decimals: Number.parseInt(data.decimals, 10),
      logoURI: data.logoURI || undefined,
      lastUpdated: data.lastUpdated ? Number.parseInt(data.lastUpdated, 10) : undefined,
    };
  } catch (error) {
    console.error("Error getting token metadata from Redis:", error);
    return null;
  }
}

/**
 * Get all tokens
 */
export async function getAllTokens(): Promise<TokenMetadata[]> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return [];
  }

  try {
    const addresses = await client.smembers(Keys.tokensList());
    const tokens: TokenMetadata[] = [];

    for (const addr of addresses) {
      const token = await getTokenMetadata(addr as Address);
      if (token) {
        tokens.push(token);
      }
    }

    return tokens;
  } catch (error) {
    console.error("Error getting all tokens from Redis:", error);
    return [];
  }
}
