"use client";

import Link from "next/link";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { formatAddress, formatAmount } from "@/lib/utils";
import { CancelOrderButton } from "./cancel-order-button";
import { FulfillOrderButton } from "./fulfill-order-button";

type Order = {
  orderId: bigint;
  creator: Address;
  inputToken: Address;
  inputAmount: bigint;
  outputToken: Address;
  outputAmount: bigint;
  fulfilled: boolean;
  cancelled: boolean;
};

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const { address } = useAccount();
  const isCreator = address?.toLowerCase() === order.creator.toLowerCase();
  const isActive = !(order.fulfilled || order.cancelled);

  const { tokenInfo: inputTokenInfo } = useTokenMetadata(order.inputToken);
  const { tokenInfo: outputTokenInfo } = useTokenMetadata(order.outputToken);

  const inputAmountFormatted = formatAmount(order.inputAmount, order.inputToken, inputTokenInfo?.decimals);
  const outputAmountFormatted = formatAmount(order.outputAmount, order.outputToken, outputTokenInfo?.decimals);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              className="font-semibold text-lg text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-400"
              href={`/orders/${order.orderId.toString()}`}
            >
              Order #{order.orderId.toString()}
            </Link>
            {order.fulfilled && (
              <span className="rounded bg-green-100 px-2 py-0.5 font-medium text-green-800 text-xs dark:bg-green-900 dark:text-green-200">
                Fulfilled
              </span>
            )}
            {order.cancelled && (
              <span className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-800 text-xs dark:bg-red-900 dark:text-red-200">
                Cancelled
              </span>
            )}
            {isActive && (
              <span className="rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-800 text-xs dark:bg-blue-900 dark:text-blue-200">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Creator: {formatAddress(order.creator)}</p>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:border-blue-800 dark:from-blue-950/30 dark:to-purple-950/30">
          <p className="mb-2 font-medium text-blue-600 text-xs uppercase tracking-wide dark:text-blue-400">
            Intent Market Order
          </p>
          <p className="mb-3 font-semibold text-sm text-zinc-900 dark:text-zinc-50">
            Wants to <span className="text-green-600 dark:text-green-400">BUY</span> {outputAmountFormatted}{" "}
            {outputTokenInfo?.symbol || "TOKEN"}
          </p>
          <div className="flex items-center justify-between border-blue-200 border-t pt-3 dark:border-blue-800">
            <div>
              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Paying</p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                {inputAmountFormatted} {inputTokenInfo?.symbol || "TOKEN"}
              </p>
            </div>
            <div className="px-2 text-zinc-400 dark:text-zinc-600">
              <svg
                aria-label="Arrow"
                className="h-4 w-4"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Receiving</p>
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                {outputAmountFormatted} {outputTokenInfo?.symbol || "TOKEN"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="flex gap-2 border-zinc-200 border-t pt-4 dark:border-zinc-800">
          {isCreator ? <CancelOrderButton orderId={order.orderId} /> : <FulfillOrderButton order={order} />}
        </div>
      )}
    </div>
  );
}
