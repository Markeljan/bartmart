"use client";

import { useEffect, useState } from "react";
import { type Address, erc20Abi, maxUint256 } from "viem";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { isETH } from "@/lib/tokens";
import { formatAmount, formatErrorMessage } from "@/lib/utils";
import { bartMartAddress, useWriteBartMartFulfilOrder } from "@/lib/wagmi/generated";

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

type FulfillOrderButtonProps = {
  order: Order;
};

export function FulfillOrderButton({ order }: FulfillOrderButtonProps) {
  const { address } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const outputIsETH = isETH(order.outputToken);
  const { tokenInfo: outputTokenInfo } = useTokenMetadata(order.outputToken);

  // Check ERC20 allowance if output is a token
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: outputIsETH ? undefined : (order.outputToken as Address),
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, bartMartAddress] : undefined,
    query: {
      enabled: !outputIsETH && !!address,
    },
  });

  // Check ETH balance
  const { data: ethBalance } = useBalance({
    address,
    query: {
      enabled: outputIsETH && !!address,
    },
  });

  // Check ERC20 token balance
  const { data: tokenBalance, isLoading: isLoadingTokenBalance } = useReadContract({
    address: outputIsETH ? undefined : (order.outputToken as Address),
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !outputIsETH && !!address,
    },
  });

  // Check if approval is needed
  useEffect(() => {
    if (outputIsETH) {
      setNeedsApproval(false);
      return;
    }

    if (allowance !== undefined && order.outputAmount) {
      setNeedsApproval(allowance < order.outputAmount);
    }
  }, [allowance, order.outputAmount, outputIsETH]);

  // Approve transaction
  const {
    writeContract: approveToken,
    data: approveHash,
    isPending: isApprovingTx,
    isSuccess: approveSuccess,
    error: approveError,
  } = useWriteContract();

  const { isLoading: isApprovingConfirming } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  useEffect(() => {
    if (isApprovingTx || isApprovingConfirming) {
      setIsApproving(true);
    } else if (approveSuccess) {
      setIsApproving(false);
      refetchAllowance();
    }
  }, [isApprovingTx, isApprovingConfirming, approveSuccess, refetchAllowance]);

  // Fulfill order transaction
  const {
    writeContract: fulfillOrder,
    data: fulfillHash,
    isPending: isFulfilling,
    error: fulfillError,
  } = useWriteBartMartFulfilOrder();

  const { isLoading: isConfirming, isSuccess: isFulfilled } = useWaitForTransactionReceipt({
    hash: fulfillHash,
  });

  // Save transaction to Redis on success
  useEffect(() => {
    if (isFulfilled && fulfillHash && address) {
      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: fulfillHash,
          from: address,
          type: "fulfill",
          orderId: order.orderId.toString(),
          status: "confirmed",
        }),
      }).catch(() => {
        // Silently fail - transaction saving is optional
      });
    }
  }, [isFulfilled, fulfillHash, address, order.orderId]);

  const handleApprove = () => {
    if (outputIsETH || !address) {
      return;
    }
    // Approve max amount so user doesn't need to approve again
    approveToken({
      address: order.outputToken as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [bartMartAddress, maxUint256],
    });
  };

  const handleFulfill = () => {
    if (!address) {
      return;
    }
    fulfillOrder({
      args: [order.orderId],
      value: outputIsETH ? order.outputAmount : undefined,
    });
  };

  // Check if user has sufficient balance
  // For ETH: check if balance exists and is sufficient
  // For ERC20: only check if balance has loaded (not undefined) and is sufficient
  const hasSufficientBalance = outputIsETH
    ? ethBalance !== undefined && ethBalance.value >= order.outputAmount
    : !isLoadingTokenBalance && tokenBalance !== undefined && tokenBalance >= order.outputAmount;

  if (isFulfilled) {
    return (
      <div className="rounded bg-green-50 px-4 py-2 text-green-600 text-sm dark:bg-green-900/20 dark:text-green-400">
        Order fulfilled
      </div>
    );
  }

  if (needsApproval && !approveSuccess) {
    const approvalErrorMessage = formatErrorMessage(approveError);
    return (
      <div className="flex-1">
        <button
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isApproving || !hasSufficientBalance}
          onClick={handleApprove}
          type="button"
        >
          {isApproving ? "Approving..." : `Approve ${outputTokenInfo?.symbol || "Token"}`}
        </button>
        {approvalErrorMessage && <p className="mt-1 text-red-600 text-xs dark:text-red-400">{approvalErrorMessage}</p>}
        {!hasSufficientBalance && (
          <p className="mt-1 text-red-600 text-xs dark:text-red-400">
            Insufficient {outputTokenInfo?.symbol || "token"} balance
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <button
        className="w-full rounded bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isFulfilling || isConfirming || !hasSufficientBalance}
        onClick={handleFulfill}
        type="button"
      >
        {isFulfilling || isConfirming
          ? "Fulfilling..."
          : `Provide ${formatAmount(order.outputAmount, order.outputToken, outputTokenInfo?.decimals)} ${outputTokenInfo?.symbol || "TOKEN"}`}
      </button>
      {fulfillError && (
        <p className="mt-1 text-red-600 text-xs dark:text-red-400">
          {formatErrorMessage(fulfillError) || "Transaction failed"}
        </p>
      )}
      {!(hasSufficientBalance || isLoadingTokenBalance) && (
        <p className="mt-1 text-red-600 text-xs dark:text-red-400">
          Insufficient {outputTokenInfo?.symbol || "token"} balance. You need{" "}
          {formatAmount(order.outputAmount, order.outputToken, outputTokenInfo?.decimals)}{" "}
          {outputTokenInfo?.symbol || "TOKEN"} to fulfill this order.
        </p>
      )}
    </div>
  );
}
