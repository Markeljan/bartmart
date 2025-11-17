"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { CancelOrderButton } from "@/components/cancel-order-button";
import { FulfillOrderButton } from "@/components/fulfill-order-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { formatAddress, formatAmount } from "@/lib/utils";
import { useReadBartMartGetOrder } from "@/lib/wagmi/generated";

export default function OrderDetailPage() {
  const params = useParams();
  const { address } = useAccount();
  const orderId = params.id ? BigInt(params.id as string) : undefined;

  const { data, isLoading, error } = useReadBartMartGetOrder({
    args: orderId !== undefined ? [orderId] : undefined,
    query: {
      enabled: orderId !== undefined,
    },
  });

  // Extract order data early, before conditional returns
  const [
    creator,
    inputToken,
    inputAmount,
    outputToken,
    outputAmount,
    fulfilled,
    cancelled,
  ] = data || [];

  const order =
    data && orderId !== undefined
      ? {
        orderId,
        creator: creator as Address,
        inputToken: inputToken as Address,
        inputAmount: inputAmount as bigint,
        outputToken: outputToken as Address,
        outputAmount: outputAmount as bigint,
        fulfilled: fulfilled as boolean,
        cancelled: cancelled as boolean,
      }
      : null;

  // Hooks must be called unconditionally, before any early returns
  const { tokenInfo: inputTokenInfo } = useTokenMetadata(
    order?.inputToken || "0x0",
  );
  const { tokenInfo: outputTokenInfo } = useTokenMetadata(
    order?.outputToken || "0x0",
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <Card className="animate-pulse">
            <CardContent className="pt-6">
              <div className="mb-6 h-8 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-4">
                <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data || orderId === undefined || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 dark:text-red-400">Order not found</p>
              <Button variant="link" asChild className="mt-4">
                <Link href="/">Back to orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isCreator = address?.toLowerCase() === order.creator.toLowerCase();
  const isActive = !(order.fulfilled || order.cancelled);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <svg
              aria-label="Back arrow"
              className="h-5 w-5"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Back to orders
          </Link>
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
                Order #{order.orderId.toString()}
              </h1>
              <div className="flex gap-2">
                {order.fulfilled && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                    Fulfilled
                  </Badge>
                )}
                {order.cancelled && (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
                    Cancelled
                  </Badge>
                )}
                {isActive && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                    Active
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-2 font-medium text-sm text-zinc-500 dark:text-zinc-400">
                  Creator
                </h2>
                <p className="font-mono text-zinc-900 dark:text-zinc-50">
                  {formatAddress(order.creator)}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-linear-to-r from-blue-50 to-purple-50 p-6 dark:border-blue-800 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-medium text-blue-600 text-xs uppercase tracking-wide dark:text-blue-400">
                      Barter Market Order
                    </p>
                    <p className="mb-4 font-semibold text-base text-zinc-900 dark:text-zinc-50">
                      Creator wants to{" "}
                      <span className="text-green-600 dark:text-green-400">
                        BUY
                      </span>{" "}
                      {formatAmount(
                        order.outputAmount,
                        order.outputToken,
                        outputTokenInfo?.decimals,
                      )}{" "}
                      {outputTokenInfo?.symbol || "TOKEN"}
                    </p>
                  </div>

                  <div className="border-blue-200 border-t pt-4 dark:border-blue-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="mb-2 font-medium text-sm text-zinc-500 dark:text-zinc-400">
                          Paying
                        </h3>
                        <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                          {formatAmount(
                            order.inputAmount,
                            order.inputToken,
                            inputTokenInfo?.decimals,
                          )}{" "}
                          {inputTokenInfo?.symbol || "TOKEN"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {inputTokenInfo?.name ||
                            formatAddress(order.inputToken)}
                        </p>
                      </div>

                      <div className="text-right">
                        <h3 className="mb-2 font-medium text-sm text-zinc-500 dark:text-zinc-400">
                          Receiving
                        </h3>
                        <p className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
                          {formatAmount(
                            order.outputAmount,
                            order.outputToken,
                            outputTokenInfo?.decimals,
                          )}{" "}
                          {outputTokenInfo?.symbol || "TOKEN"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {outputTokenInfo?.name ||
                            formatAddress(order.outputToken)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {isActive && (
            <CardFooter className="border-t pt-6">
              {isCreator ? (
                <CancelOrderButton orderId={order.orderId} />
              ) : (
                <FulfillOrderButton order={order} />
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
