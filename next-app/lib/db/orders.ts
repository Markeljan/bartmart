import type { Address } from "viem";
import { Keys } from "./keys";
import { ensureRedisConnection, getRedisClient } from "./redis";
import type { Order, OrderFilters } from "./types";

/**
 * Save order to Redis
 */
export async function saveOrder(order: Order): Promise<boolean> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return false;
  }

  try {
    const orderId = order.orderId.toString();
    const pipeline = client.pipeline();

    // Save order hash
    pipeline.hset(Keys.order(orderId), {
      orderId: order.orderId,
      creator: order.creator.toLowerCase(),
      inputToken: order.inputToken.toLowerCase(),
      inputAmount: order.inputAmount,
      outputToken: order.outputToken.toLowerCase(),
      outputAmount: order.outputAmount,
      fulfilled: order.fulfilled ? "1" : "0",
      cancelled: order.cancelled ? "1" : "0",
      createdAt: order.createdAt?.toString() || Date.now().toString(),
      fulfilledAt: order.fulfilledAt?.toString() || "",
      cancelledAt: order.cancelledAt?.toString() || "",
      blockNumber: order.blockNumber?.toString() || "",
      transactionHash: order.transactionHash || "",
    });

    // Add to status sets
    if (order.fulfilled) {
      pipeline.sadd(Keys.ordersFulfilled(), orderId);
      pipeline.srem(Keys.ordersActive(), orderId);
      pipeline.srem(Keys.ordersCancelled(), orderId);
    } else if (order.cancelled) {
      pipeline.sadd(Keys.ordersCancelled(), orderId);
      pipeline.srem(Keys.ordersActive(), orderId);
      pipeline.srem(Keys.ordersFulfilled(), orderId);
    } else {
      pipeline.sadd(Keys.ordersActive(), orderId);
      pipeline.srem(Keys.ordersFulfilled(), orderId);
      pipeline.srem(Keys.ordersCancelled(), orderId);
    }

    // Index by creator
    pipeline.sadd(Keys.ordersByCreator(order.creator as Address), orderId);

    // Index by tokens
    pipeline.sadd(Keys.ordersByToken(order.inputToken as Address), orderId);
    pipeline.sadd(Keys.ordersByToken(order.outputToken as Address), orderId);

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error("Error saving order to Redis:", error);
    return false;
  }
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string | bigint): Promise<Order | null> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return null;
  }

  try {
    const id = orderId.toString();
    const data = await client.hgetall(Keys.order(id));
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    return {
      orderId: data.orderId || id,
      creator: data.creator as Address,
      inputToken: data.inputToken as Address,
      inputAmount: data.inputAmount,
      outputToken: data.outputToken as Address,
      outputAmount: data.outputAmount,
      fulfilled: data.fulfilled === "1",
      cancelled: data.cancelled === "1",
      createdAt: data.createdAt ? Number.parseInt(data.createdAt, 10) : undefined,
      fulfilledAt: data.fulfilledAt ? Number.parseInt(data.fulfilledAt, 10) : undefined,
      cancelledAt: data.cancelledAt ? Number.parseInt(data.cancelledAt, 10) : undefined,
      blockNumber: data.blockNumber ? Number.parseInt(data.blockNumber, 10) : undefined,
      transactionHash: data.transactionHash || undefined,
    };
  } catch (error) {
    console.error("Error getting order from Redis:", error);
    return null;
  }
}

/**
 * Get orders with filters
 */
export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return [];
  }

  try {
    let orderIds: string[] = [];

    // Determine which set to query
    if (filters.status === "live") {
      // Live orders: active orders (not fulfilled and not cancelled)
      orderIds = await client.smembers(Keys.ordersActive());
    } else if (filters.status === "completed") {
      // Completed orders: fulfilled or cancelled
      const [fulfilled, cancelled] = await Promise.all([
        client.smembers(Keys.ordersFulfilled()),
        client.smembers(Keys.ordersCancelled()),
      ]);
      orderIds = [...new Set([...fulfilled, ...cancelled])];
    } else {
      // No filter or unknown status: get all orders
      const [active, fulfilled, cancelled] = await Promise.all([
        client.smembers(Keys.ordersActive()),
        client.smembers(Keys.ordersFulfilled()),
        client.smembers(Keys.ordersCancelled()),
      ]);
      orderIds = [...new Set([...active, ...fulfilled, ...cancelled])];
    }

    // Filter by creator if specified
    if (filters.creator) {
      const creatorOrders = await client.smembers(Keys.ordersByCreator(filters.creator));
      orderIds = orderIds.filter((id) => creatorOrders.includes(id));
    }

    // Filter by tokens if specified
    if (filters.inputToken) {
      const tokenOrders = await client.smembers(Keys.ordersByToken(filters.inputToken));
      orderIds = orderIds.filter((id) => tokenOrders.includes(id));
    }

    if (filters.outputToken) {
      const tokenOrders = await client.smembers(Keys.ordersByToken(filters.outputToken));
      orderIds = orderIds.filter((id) => tokenOrders.includes(id));
    }

    // Fetch order data
    const orders: Order[] = [];
    for (const orderId of orderIds) {
      const order = await getOrder(orderId);
      if (order) {
        orders.push(order);
      }
    }

    // Sort by orderId descending (newest first)
    orders.sort((a, b) => {
      const aId = BigInt(a.orderId);
      const bId = BigInt(b.orderId);
      if (aId > bId) {
        return -1;
      }
      if (aId < bId) {
        return 1;
      }
      return 0;
    });

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;
    return orders.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error getting orders from Redis:", error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string | bigint,
  status: { fulfilled?: boolean; cancelled?: boolean }
): Promise<boolean> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return false;
  }

  try {
    const id = orderId.toString();
    const order = await getOrder(id);
    if (!order) {
      return false;
    }

    const updated: Order = {
      ...order,
      fulfilled: status.fulfilled ?? order.fulfilled,
      cancelled: status.cancelled ?? order.cancelled,
      fulfilledAt: status.fulfilled ? Date.now() : order.fulfilledAt,
      cancelledAt: status.cancelled ? Date.now() : order.cancelledAt,
    };

    return await saveOrder(updated);
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}
