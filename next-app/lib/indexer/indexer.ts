import { type Address, createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Keys } from "@/lib/db/keys";
import { saveOrder, updateOrderStatus } from "@/lib/db/orders";
import { ensureRedisConnection, getRedisClient } from "@/lib/db/redis";
import { saveTransaction } from "@/lib/db/transactions";
import type { Order } from "@/lib/db/types";
import { saveUserActivity } from "@/lib/db/users";
import { bartMartAbi, bartMartAddress } from "@/lib/wagmi/generated";

const RPC_URL = process.env.RPC_URL || "https://base-mainnet.g.alchemy.com/v2/uO_tPEMd7YY8g49_xLGGFp-8GMRxGcs8";

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

/**
 * Get last processed block from Redis
 */
async function getLastProcessedBlock(): Promise<number | null> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return null;
  }

  try {
    const lastBlock = await client.get(Keys.indexerLastBlock());
    return lastBlock ? Number.parseInt(lastBlock, 10) : null;
  } catch (error) {
    console.error("Error getting last processed block:", error);
    return null;
  }
}

/**
 * Save last processed block to Redis
 */
async function saveLastProcessedBlock(blockNumber: number): Promise<void> {
  const client = getRedisClient();
  if (!(client && (await ensureRedisConnection()))) {
    return;
  }

  try {
    await client.set(Keys.indexerLastBlock(), blockNumber.toString());
  } catch (error) {
    console.error("Error saving last processed block:", error);
  }
}

type EventLog = {
  args?: {
    orderId?: bigint;
    creator?: string;
    inputToken?: string;
    inputAmount?: bigint;
    outputToken?: string;
    outputAmount?: bigint;
    fulfiller?: string;
  };
  blockNumber: bigint;
  transactionHash: string;
};

type Block = {
  number: bigint;
  timestamp: bigint;
};

type Transaction = {
  hash: string;
};

/**
 * Process OrderCreated event
 */
async function processOrderCreated(log: EventLog, block: Block, tx: Transaction): Promise<void> {
  try {
    const orderId = log.args?.orderId?.toString() || "0";
    const creator = log.args?.creator as Address;
    const inputToken = log.args?.inputToken as Address;
    const inputAmount = log.args?.inputAmount?.toString() || "0";
    const outputToken = log.args?.outputToken as Address;
    const outputAmount = log.args?.outputAmount?.toString() || "0";

    const order: Order = {
      orderId,
      creator,
      inputToken,
      inputAmount,
      outputToken,
      outputAmount,
      fulfilled: false,
      cancelled: false,
      createdAt: Number(block.timestamp),
      blockNumber: Number(block.number),
      transactionHash: tx.hash,
    };

    await saveOrder(order);

    // Save transaction
    await saveTransaction({
      hash: tx.hash,
      from: creator,
      type: "create",
      orderId,
      blockNumber: Number(block.number),
      timestamp: Number(block.timestamp),
      status: "confirmed",
    });

    // Save user activity
    await saveUserActivity(creator, {
      orderCreated: orderId,
    });
  } catch (error) {
    console.error("Error processing OrderCreated event:", error);
  }
}

/**
 * Process OrderFulfilled event
 */
async function processOrderFulfilled(log: EventLog, block: Block, tx: Transaction): Promise<void> {
  try {
    const orderId = log.args?.orderId?.toString() || "0";
    const fulfiller = log.args?.fulfiller as Address;
    const creator = log.args?.creator as Address;

    await updateOrderStatus(orderId, { fulfilled: true });

    // Save transaction
    await saveTransaction({
      hash: tx.hash,
      from: fulfiller,
      to: creator,
      type: "fulfill",
      orderId,
      blockNumber: Number(block.number),
      timestamp: Number(block.timestamp),
      status: "confirmed",
    });

    // Save user activity
    await saveUserActivity(fulfiller, {
      orderFulfilled: orderId,
    });
  } catch (error) {
    console.error("Error processing OrderFulfilled event:", error);
  }
}

/**
 * Process OrderCancelled event
 */
async function processOrderCancelled(log: EventLog, block: Block, tx: Transaction): Promise<void> {
  try {
    const orderId = log.args?.orderId?.toString() || "0";
    const creator = log.args?.creator as Address;

    await updateOrderStatus(orderId, { cancelled: true });

    // Save transaction
    await saveTransaction({
      hash: tx.hash,
      from: creator,
      type: "cancel",
      orderId,
      blockNumber: Number(block.number),
      timestamp: Number(block.timestamp),
      status: "confirmed",
    });

    // Save user activity
    await saveUserActivity(creator, {
      orderCancelled: orderId,
    });
  } catch (error) {
    console.error("Error processing OrderCancelled event:", error);
  }
}

/**
 * Index events from a block range
 */
export async function indexBlockRange(fromBlock: bigint, toBlock: bigint): Promise<number> {
  try {
    console.log(`Indexing blocks ${fromBlock} to ${toBlock}`);

    // Get all events in the range using the ABI
    const orderCreatedEvent = bartMartAbi.find((item) => item.type === "event" && item.name === "OrderCreated");
    const orderFulfilledEvent = bartMartAbi.find((item) => item.type === "event" && item.name === "OrderFulfilled");
    const orderCancelledEvent = bartMartAbi.find((item) => item.type === "event" && item.name === "OrderCancelled");

    const [createdLogs, fulfilledLogs, cancelledLogs] = await Promise.all([
      orderCreatedEvent
        ? publicClient.getLogs({
            address: bartMartAddress,
            event: orderCreatedEvent,
            fromBlock,
            toBlock,
          })
        : Promise.resolve([]),
      orderFulfilledEvent
        ? publicClient.getLogs({
            address: bartMartAddress,
            event: orderFulfilledEvent,
            fromBlock,
            toBlock,
          })
        : Promise.resolve([]),
      orderCancelledEvent
        ? publicClient.getLogs({
            address: bartMartAddress,
            event: orderCancelledEvent,
            fromBlock,
            toBlock,
          })
        : Promise.resolve([]),
    ]);

    // Get block and transaction details for each event
    const processedBlocks = new Set<string>();
    const blockPromises: Promise<Block>[] = [];
    const txPromises: Promise<Transaction>[] = [];

    for (const log of [...createdLogs, ...fulfilledLogs, ...cancelledLogs]) {
      const blockKey = log.blockNumber.toString();
      if (!processedBlocks.has(blockKey)) {
        processedBlocks.add(blockKey);
        blockPromises.push(publicClient.getBlock({ blockNumber: log.blockNumber }));
      }
      txPromises.push(publicClient.getTransaction({ hash: log.transactionHash }));
    }

    const blocks = await Promise.all(blockPromises);
    const txs = await Promise.all(txPromises);

    const blockMap = new Map(blocks.map((b) => [b.number.toString(), b]));
    const txMap = new Map(txs.map((t) => [t.hash, t]));

    // Process events
    for (const log of createdLogs) {
      const block = blockMap.get(log.blockNumber.toString());
      const tx = txMap.get(log.transactionHash);
      if (block && tx) {
        await processOrderCreated(log, block, tx);
      }
    }

    for (const log of fulfilledLogs) {
      const block = blockMap.get(log.blockNumber.toString());
      const tx = txMap.get(log.transactionHash);
      if (block && tx) {
        await processOrderFulfilled(log, block, tx);
      }
    }

    for (const log of cancelledLogs) {
      const block = blockMap.get(log.blockNumber.toString());
      const tx = txMap.get(log.transactionHash);
      if (block && tx) {
        await processOrderCancelled(log, block, tx);
      }
    }

    const processedCount = createdLogs.length + fulfilledLogs.length + cancelledLogs.length;
    console.log(`Processed ${processedCount} events from blocks ${fromBlock} to ${toBlock}`);
    return processedCount;
  } catch (error) {
    console.error("Error indexing block range:", error);
    throw error;
  }
}

/**
 * Index new blocks since last run
 */
export async function indexNewBlocks(): Promise<number> {
  try {
    const currentBlock = await publicClient.getBlockNumber();
    const lastBlock = await getLastProcessedBlock();

    if (lastBlock === null) {
      // First run - start from contract deployment or recent block
      // For now, start from 1000 blocks ago to avoid indexing too much history
      const startBlock = currentBlock - 1000n;
      await indexBlockRange(startBlock, currentBlock);
      await saveLastProcessedBlock(Number(currentBlock));
      return Number(currentBlock - startBlock);
    }

    if (lastBlock >= Number(currentBlock)) {
      return 0; // Already up to date
    }

    const fromBlock = BigInt(lastBlock + 1);
    const processed = await indexBlockRange(fromBlock, currentBlock);
    await saveLastProcessedBlock(Number(currentBlock));
    return processed;
  } catch (error) {
    console.error("Error indexing new blocks:", error);
    throw error;
  }
}
