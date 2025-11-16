import type { Address } from "viem";
import { Keys } from "./keys";
import { ensureRedisConnection, getRedisClient } from "./redis";
import type { UserStats } from "./types";

/**
 * Save user activity
 */
export async function saveUserActivity(
  address: Address,
  activity: {
    orderCreated?: string; // orderId
    orderFulfilled?: string; // orderId
    orderCancelled?: string; // orderId
  }
): Promise<boolean> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return false;
  }

  try {
    const addr = address.toLowerCase();
    const pipeline = client.pipeline();

    // Update user stats
    const userKey = Keys.user(address as Address);
    const exists = await client.exists(userKey);
    if (exists) {
      pipeline.hset(userKey, "lastSeen", Date.now().toString());
    } else {
      pipeline.hset(userKey, {
        address: addr,
        ordersCreated: "0",
        ordersFulfilled: "0",
        ordersCancelled: "0",
        firstSeen: Date.now().toString(),
        lastSeen: Date.now().toString(),
      });
    }

    // Track order IDs
    if (activity.orderCreated) {
      pipeline.sadd(Keys.userOrdersCreated(address as Address), activity.orderCreated);
      pipeline.hincrby(userKey, "ordersCreated", 1);
    }

    if (activity.orderFulfilled) {
      pipeline.sadd(Keys.userOrdersFulfilled(address as Address), activity.orderFulfilled);
      pipeline.hincrby(userKey, "ordersFulfilled", 1);
    }

    if (activity.orderCancelled) {
      pipeline.hincrby(userKey, "ordersCancelled", 1);
    }

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error("Error saving user activity to Redis:", error);
    return false;
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(address: Address): Promise<UserStats | null> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return null;
  }

  try {
    const data = await client.hgetall(Keys.user(address));
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      address,
      ordersCreated: Number.parseInt(data.ordersCreated || "0", 10),
      ordersFulfilled: Number.parseInt(data.ordersFulfilled || "0", 10),
      ordersCancelled: Number.parseInt(data.ordersCancelled || "0", 10),
      totalVolume: data.totalVolume || undefined,
      firstSeen: data.firstSeen ? Number.parseInt(data.firstSeen, 10) : undefined,
      lastSeen: data.lastSeen ? Number.parseInt(data.lastSeen, 10) : undefined,
    };
  } catch (error) {
    console.error("Error getting user stats from Redis:", error);
    return null;
  }
}
