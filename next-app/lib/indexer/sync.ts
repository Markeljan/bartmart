import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { saveOrder } from "@/lib/db/orders";
import type { Order } from "@/lib/db/types";
import { bartMartAbi, bartMartAddress } from "@/lib/wagmi/generated";

const RPC_URL = process.env.RPC_URL || "https://base-mainnet.g.alchemy.com/v2/uO_tPEMd7YY8g49_xLGGFp-8GMRxGcs8";

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

/**
 * Sync all existing orders from the contract
 */
export async function syncAllOrders(): Promise<number> {
  try {
    // Get order counter
    const orderCounter = await publicClient.readContract({
      address: bartMartAddress,
      abi: bartMartAbi,
      functionName: "orderCounter",
    });

    const count = Number(orderCounter);
    console.log(`Syncing ${count} orders from contract`);

    let synced = 0;
    const batchSize = 50;

    // Process in batches
    for (let i = 0; i < count; i += batchSize) {
      const end = Math.min(i + batchSize, count);
      const promises: Promise<void>[] = [];

      for (let j = i; j < end; j++) {
        promises.push(
          (async () => {
            try {
              const orderData = await publicClient.readContract({
                address: bartMartAddress,
                abi: bartMartAbi,
                functionName: "orders",
                args: [BigInt(j)],
              });

              const [creator, inputToken, inputAmount, outputToken, outputAmount, fulfilled, cancelled] = orderData;

              const order: Order = {
                orderId: j.toString(),
                creator: creator as `0x${string}`,
                inputToken: inputToken as `0x${string}`,
                inputAmount: inputAmount.toString(),
                outputToken: outputToken as `0x${string}`,
                outputAmount: outputAmount.toString(),
                fulfilled: fulfilled as boolean,
                cancelled: cancelled as boolean,
              };

              await saveOrder(order);
              synced += 1;
            } catch (error) {
              console.error(`Error syncing order ${j}:`, error);
            }
          })()
        );
      }

      await Promise.all(promises);
      console.log(`Synced orders ${i} to ${end - 1}`);
    }

    console.log(`Synced ${synced} orders`);
    return synced;
  } catch (error) {
    console.error("Error syncing all orders:", error);
    throw error;
  }
}
