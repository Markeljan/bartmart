"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Address } from "viem";
import {
  useReadBartMartOrderCounter,
  useReadBartMartOrders,
  useWatchBartMartOrderCancelledEvent,
  useWatchBartMartOrderCreatedEvent,
  useWatchBartMartOrderFulfilledEvent,
} from "@/lib/wagmi/generated";
import { OrderCard } from "./order-card";
import { Card, CardContent } from "@/components/ui/card";

type OrderStatus = "live" | "completed";

type OrderListProps = {
  statusFilter?: OrderStatus;
};

type OrderData = {
  orderId: bigint;
  creator: Address;
  inputToken: Address;
  inputAmount: bigint;
  outputToken: Address;
  outputAmount: bigint;
  fulfilled: boolean;
  cancelled: boolean;
};

// Component to fetch a single order
function OrderFetcher({
  orderId,
  onData,
  refreshKey,
}: {
  orderId: bigint;
  onData: (order: OrderData | null) => void;
  refreshKey?: number;
}) {
  const { data, refetch } = useReadBartMartOrders({ args: [orderId] });

  // Refetch when refreshKey changes
  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) {
      refetch();
    }
  }, [refreshKey, refetch]);

  useEffect(() => {
    if (!data) {
      // Don't call onData yet - wait for data to load
      return;
    }
    const [creator, inputToken, inputAmount, outputToken, outputAmount, fulfilled, cancelled] = data;

    // Check if order exists (creator is not zero address)
    if (creator === "0x0000000000000000000000000000000000000000") {
      // Order doesn't exist yet, mark as loaded but don't add to map
      onData(null);
      return;
    }

    const orderData: OrderData = {
      orderId,
      creator: creator as Address,
      inputToken: inputToken as Address,
      inputAmount: inputAmount as bigint,
      outputToken: outputToken as Address,
      outputAmount: outputAmount as bigint,
      fulfilled: fulfilled as boolean,
      cancelled: cancelled as boolean,
    };

    onData(orderData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, orderId, onData]); // onData is stable due to useCallback, but we exclude it to be safe

  return null;
}

export function OrderList({ statusFilter = "live" }: OrderListProps) {
  const { data: orderCount, isLoading: isLoadingCount, refetch: refetchOrderCount } = useReadBartMartOrderCounter();

  // Store orders in state
  const [ordersMap, setOrdersMap] = useState<Map<bigint, OrderData>>(new Map());
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadedOrderIds, setLoadedOrderIds] = useState<Set<bigint>>(new Set());

  // Create array of order IDs to fetch
  const orderIds = useMemo(() => {
    if (!orderCount || orderCount === 0n) {
      return [];
    }
    const count = Number(orderCount);
    return Array.from({ length: count }, (_, i) => BigInt(i));
  }, [orderCount]);

  // Watch for new orders
  useWatchBartMartOrderCreatedEvent({
    onLogs: () => {
      refetchOrderCount();
    },
  });

  // Watch for fulfilled orders
  useWatchBartMartOrderFulfilledEvent({
    onLogs: () => {
      // Trigger refresh
      setRefreshKey((prev) => prev + 1);
    },
  });

  // Watch for cancelled orders
  useWatchBartMartOrderCancelledEvent({
    onLogs: () => {
      // Trigger refresh
      setRefreshKey((prev) => prev + 1);
    },
  });

  // Memoize callbacks per orderId to prevent infinite loops
  const orderCallbacksRef = useMemo(() => new Map<bigint, (order: OrderData | null) => void>(), []);

  const getOrderCallback = useCallback(
    (orderId: bigint) => {
      if (!orderCallbacksRef.has(orderId)) {
        orderCallbacksRef.set(orderId, (order: OrderData | null) => {
          // Mark as loaded first
          setLoadedOrderIds((prevIds) => {
            if (prevIds.has(orderId)) {
              return prevIds; // Already marked as loaded
            }
            return new Set(prevIds).add(orderId);
          });

          // Update orders map
          setOrdersMap((prev) => {
            const next = new Map(prev);
            if (order) {
              const existing = next.get(orderId);
              // Only update if the order data has actually changed
              if (
                !existing ||
                existing.creator !== order.creator ||
                existing.inputToken !== order.inputToken ||
                existing.inputAmount !== order.inputAmount ||
                existing.outputToken !== order.outputToken ||
                existing.outputAmount !== order.outputAmount ||
                existing.fulfilled !== order.fulfilled ||
                existing.cancelled !== order.cancelled
              ) {
                next.set(orderId, order);
                return next;
              }
              return prev;
            }
            // If order is null, remove it from map (but keep it marked as loaded)
            if (next.has(orderId)) {
              next.delete(orderId);
              return next;
            }
            return prev;
          });
        });
      }
      const callback = orderCallbacksRef.get(orderId);
      if (!callback) {
        throw new Error(`Callback not found for orderId ${orderId}`);
      }
      return callback;
    },
    [orderCallbacksRef]
  );

  const orders = useMemo(() => {
    const allOrders = Array.from(ordersMap.values());

    // Filter by status
    return allOrders
      .filter((order) => {
        if (statusFilter === "live") {
          // Live orders: not fulfilled and not cancelled
          return !(order.fulfilled || order.cancelled);
        }
        if (statusFilter === "completed") {
          // Completed orders: fulfilled or cancelled
          return order.fulfilled || order.cancelled;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by orderId descending (newest first)
        if (a.orderId > b.orderId) {
          return -1;
        }
        if (a.orderId < b.orderId) {
          return 1;
        }
        return 0;
      });
  }, [ordersMap, statusFilter]);

  // Consider loading complete when we've attempted to load all order IDs
  // or when we have data for all existing orders (non-zero creators)
  const isLoading = isLoadingCount || loadedOrderIds.size < orderIds.length;

  function getEmptyMessage(): string {
    if (orderCount === 0n) {
      return "No orders yet. Create the first one!";
    }
    if (statusFilter === "live") {
      return "No live orders found.";
    }
    return "No completed orders found.";
  }

  function renderContent() {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="mb-4 h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">{getEmptyMessage()}</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.orderId.toString()} order={order} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Render fetchers for all orders */}
      {orderIds.map((orderId) => (
        <OrderFetcher
          key={orderId.toString()}
          onData={getOrderCallback(orderId)}
          orderId={orderId}
          refreshKey={refreshKey}
        />
      ))}
      {renderContent()}
    </>
  );
}
