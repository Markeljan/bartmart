"use client";

import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
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
      <div className="rounded bg-green-50 px-4 py-2 text-green-600 text-sm dark:bg-green-900/20 dark:text-green-400">
        Order cancelled
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <button
          className="flex-1 rounded bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isWriting || isConfirming}
          onClick={handleCancel}
          type="button"
        >
          {isWriting || isConfirming ? "Cancelling..." : "Confirm Cancel"}
        </button>
        <button
          className="rounded bg-zinc-200 px-4 py-2 font-medium text-sm text-zinc-700 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          disabled={isWriting || isConfirming}
          onClick={() => setShowConfirm(false)}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        className="flex-1 rounded border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 text-sm hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        onClick={() => setShowConfirm(true)}
        type="button"
      >
        Cancel Order
      </button>
      {writeError && (
        <p className="mt-1 text-red-600 text-xs dark:text-red-400">
          {formatErrorMessage(writeError) || "Transaction failed"}
        </p>
      )}
    </>
  );
}
