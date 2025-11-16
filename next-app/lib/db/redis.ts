import Redis from "ioredis";

let redisClient: Redis | null = null;

/**
 * Get or create Redis client singleton
 */
export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn("REDIS_URL not set, Redis operations will be disabled");
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redisClient.on("error", (err) => {
      console.error("Redis client error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected");
    });

    return redisClient;
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    return null;
  }
}

/**
 * Ensure Redis connection is established
 */
export async function ensureRedisConnection(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    if (client.status !== "ready") {
      await client.connect();
    }
    return true;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    return false;
  }
}

/**
 * Close Redis connection (useful for cleanup)
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
