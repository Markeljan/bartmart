"use client";

import { useEffect, useState } from "react";
import { type Address, erc20Abi, isAddress, maxUint256 } from "viem";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { ETH_ADDRESS, isETH } from "@/lib/tokens";
import { formatAmount, formatErrorMessage, parseAmountWithTokenInfo } from "@/lib/utils";
import { bartMartAddress, useWriteBartMartCreateOrder } from "@/lib/wagmi/generated";
import { TokenSelector } from "./token-selector";

type CreateOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const { address } = useAccount();
  const [inputToken, setInputToken] = useState<Address | string>(ETH_ADDRESS);
  const [inputAmount, setInputAmount] = useState("");
  const [outputToken, setOutputToken] = useState<Address | string>("");
  const [outputAmount, setOutputAmount] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const inputIsETH = isETH(inputToken);

  // Fetch token metadata for input token
  const { tokenInfo: inputTokenInfo, isLoading: isLoadingInputToken } = useTokenMetadata(inputToken);

  // Fetch token metadata for output token
  const { tokenInfo: outputTokenInfo, isLoading: isLoadingOutputToken } = useTokenMetadata(outputToken);

  // Get balances
  const { data: ethBalance } = useBalance({
    address,
    query: {
      enabled: inputIsETH && !!address,
    },
  });

  const { data: tokenBalance } = useReadContract({
    address: inputIsETH ? undefined : (inputToken as Address),
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !inputIsETH && !!address && isAddress(inputToken),
    },
  });

  // Check allowance for ERC20 tokens
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: inputIsETH ? undefined : (inputToken as Address),
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, bartMartAddress] : undefined,
    query: {
      enabled: !inputIsETH && !!address && isAddress(inputToken),
    },
  });

  // Check if approval is needed
  useEffect(() => {
    if (inputIsETH || !inputAmount || !inputTokenInfo) {
      setNeedsApproval(false);
      return;
    }

    try {
      const amount = parseAmountWithTokenInfo(inputAmount, inputTokenInfo);
      if (allowance !== undefined && amount) {
        setNeedsApproval(allowance < amount);
      }
    } catch {
      setNeedsApproval(false);
    }
  }, [allowance, inputAmount, inputTokenInfo, inputIsETH]);

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

  // Create order transaction
  const {
    writeContract: createOrder,
    data: createHash,
    isPending: isCreating,
    error: createError,
  } = useWriteBartMartCreateOrder();

  const { isLoading: isConfirming, isSuccess: isCreated } = useWaitForTransactionReceipt({
    hash: createHash,
  });

  // Reset form on success and save transaction
  useEffect(() => {
    if (isCreated && createHash) {
      // Save transaction to Redis
      fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: createHash,
          from: address,
          type: "create",
          status: "confirmed",
        }),
      }).catch(() => {
        // Silently fail - transaction saving is optional
      });

      setInputToken(ETH_ADDRESS);
      setInputAmount("");
      setOutputToken("");
      setOutputAmount("");
      onSuccess?.();
      onClose();
    }
  }, [isCreated, createHash, address, onSuccess, onClose]);

  const handleApprove = () => {
    if (inputIsETH || !address || !inputToken) {
      return;
    }
    try {
      // Approve max amount so user doesn't need to approve again
      approveToken({
        address: inputToken as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [bartMartAddress, maxUint256],
      });
    } catch (error) {
      console.error("Error approving token:", error);
    }
  };

  const handleCreateOrder = () => {
    if (
      !(
        address &&
        inputAmount &&
        outputAmount &&
        isAddress(inputToken) &&
        isAddress(outputToken) &&
        inputTokenInfo &&
        outputTokenInfo
      )
    ) {
      return;
    }

    try {
      const inputAmt = parseAmountWithTokenInfo(inputAmount, inputTokenInfo);
      const outputAmt = parseAmountWithTokenInfo(outputAmount, outputTokenInfo);

      if (inputAmt === 0n || outputAmt === 0n) {
        return;
      }

      createOrder({
        args: [inputToken as Address, inputAmt, outputToken as Address, outputAmt],
        value: inputIsETH ? inputAmt : undefined,
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Validation
  const inputAmountBigInt = inputAmount && inputTokenInfo ? parseAmountWithTokenInfo(inputAmount, inputTokenInfo) : 0n;
  const outputAmountBigInt =
    outputAmount && outputTokenInfo ? parseAmountWithTokenInfo(outputAmount, outputTokenInfo) : 0n;

  const hasSufficientBalance = inputIsETH
    ? ethBalance && ethBalance.value >= inputAmountBigInt
    : tokenBalance && tokenBalance >= inputAmountBigInt;

  const isValid =
    inputAmount &&
    outputAmount &&
    isAddress(inputToken) &&
    isAddress(outputToken) &&
    inputToken.toLowerCase() !== outputToken.toLowerCase() &&
    inputTokenInfo &&
    outputTokenInfo &&
    !isLoadingInputToken &&
    !isLoadingOutputToken &&
    inputAmountBigInt > 0n &&
    outputAmountBigInt > 0n &&
    hasSufficientBalance &&
    (!needsApproval || approveSuccess);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Close modal"
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
        type="button"
      />
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">Create Order</h2>
          <button
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-label="Close"
              className="h-6 w-6"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <TokenSelector
              disabled={isCreating || isConfirming}
              label="Input Token"
              onChange={setInputToken}
              value={inputToken}
            />
            <div className="mt-2">
              <input
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                disabled={isCreating || isConfirming}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.0"
                type="text"
                value={inputAmount}
              />
              <div className="mt-1 flex justify-between">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Balance: {(() => {
                    if (inputIsETH) {
                      return ethBalance ? formatAmount(ethBalance.value, ETH_ADDRESS) : "0";
                    }
                    if (tokenBalance && inputTokenInfo) {
                      return formatAmount(tokenBalance, inputToken, inputTokenInfo.decimals);
                    }
                    return "0";
                  })()} {inputTokenInfo?.symbol || (isLoadingInputToken ? "Loading..." : "Token")}
                </p>
                {!hasSufficientBalance && inputAmount && (
                  <p className="text-red-600 text-xs dark:text-red-400">Insufficient balance</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <TokenSelector
              disabled={isCreating || isConfirming}
              label="Output Token"
              onChange={setOutputToken}
              value={outputToken}
            />
            <div className="mt-2">
              <input
                className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                disabled={isCreating || isConfirming}
                onChange={(e) => setOutputAmount(e.target.value)}
                placeholder="0.0"
                type="text"
                value={outputAmount}
              />
              <div className="mt-1 flex justify-between">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {outputTokenInfo?.symbol || (isLoadingOutputToken ? "Loading..." : "Select token")}
                </p>
              </div>
            </div>
          </div>

          {needsApproval && !approveSuccess && (
            <div>
              <button
                className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isApproving || !hasSufficientBalance}
                onClick={handleApprove}
                type="button"
              >
                {isApproving ? "Approving..." : `Approve ${inputTokenInfo?.symbol || "Token"}`}
              </button>
              {approveError && (
                <p className="mt-1 text-red-600 text-xs dark:text-red-400">
                  {formatErrorMessage(approveError) || "Approval failed"}
                </p>
              )}
            </div>
          )}

          {createError && (
            <p className="text-red-600 text-sm dark:text-red-400">
              {formatErrorMessage(createError) || "Failed to create order"}
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <button
              className="flex-1 rounded bg-zinc-200 px-4 py-2 font-medium text-sm text-zinc-700 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              disabled={isCreating || isConfirming}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isValid || isCreating || isConfirming}
              onClick={handleCreateOrder}
              type="button"
            >
              {isCreating || isConfirming ? "Creating..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
