"use client";

import { useEffect, useState } from "react";
import { type Address, erc20Abi, isAddress, maxUint256 } from "viem";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { ETH_ADDRESS, isETH } from "@/lib/tokens";
import { formatAmount, formatErrorMessage, parseAmountWithTokenInfo } from "@/lib/utils";
import { bartMartAddress, useWriteBartMartCreateOrder } from "@/lib/wagmi/generated";
import { TokenSelector } from "./token-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>
            Create a new intent market order to exchange tokens.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <TokenSelector
              disabled={isCreating || isConfirming}
              label="Input Token"
              onChange={setInputToken}
              value={inputToken}
            />
            <div className="mt-2">
              <Label htmlFor="input-amount">Amount</Label>
              <Input
                id="input-amount"
                disabled={isCreating || isConfirming}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.0"
                type="text"
                value={inputAmount}
                className="mt-1"
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
              <Label htmlFor="output-amount">Amount</Label>
              <Input
                id="output-amount"
                disabled={isCreating || isConfirming}
                onChange={(e) => setOutputAmount(e.target.value)}
                placeholder="0.0"
                type="text"
                value={outputAmount}
                className="mt-1"
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
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isApproving || !hasSufficientBalance}
                onClick={handleApprove}
              >
                {isApproving ? "Approving..." : `Approve ${inputTokenInfo?.symbol || "Token"}`}
              </Button>
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
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            disabled={isCreating || isConfirming}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            disabled={!isValid || isCreating || isConfirming}
            onClick={handleCreateOrder}
          >
            {isCreating || isConfirming ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
