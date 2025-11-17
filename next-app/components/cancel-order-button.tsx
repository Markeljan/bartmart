"use client";

import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/utils";
import { useWriteBartMartCancelOrder } from "@/lib/wagmi/generated";

type CancelOrderButtonProps = {
  orderId: bigint;
};

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { address } = useAccount();

  const { writeContract, data: hash, isPending: isWriting, error: writeError } = useWriteBartMartCancelOrder();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Save transaction to Redis on success
  useEffect(() => {
    if (isSuccess && hash && address) {
      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash,
          from: address,
          type: "cancel",
          orderId: orderId.toString(),
          status: "confirmed",
        }),
      }).catch(() => {
        // Silently fail - transaction saving is optional
      });
    }
  }, [isSuccess, hash, address, orderId]);

  const handleCancel = () => {
    if (!address) {
      return;
    }
    writeContract({
      args: [orderId],
    });
  };

  if (isSuccess) {
    return (
      <Badge
        className="border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
        variant="outline"
      >
        Order cancelled
      </Badge>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button className="flex-1" disabled={isWriting || isConfirming} onClick={handleCancel} variant="destructive">
          {isWriting || isConfirming ? "Cancelling..." : "Confirm Cancel"}
        </Button>
        <Button disabled={isWriting || isConfirming} onClick={() => setShowConfirm(false)} variant="secondary">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        className="flex-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        onClick={() => setShowConfirm(true)}
      >
        Cancel Order
      </Button>
      {writeError && (
        <p className="mt-1 text-red-600 text-xs dark:text-red-400">
          {formatErrorMessage(writeError) || "Transaction failed"}
        </p>
      )}
    </>
  );
}
