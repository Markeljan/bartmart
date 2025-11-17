"use client";

import { useEffect, useState } from "react";
import { type Address, erc20Abi, isAddress, maxUint256 } from "viem";
import { useAccount, useBalance, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { ETH_ADDRESS, isETH } from "@/lib/tokens";
import { formatAmount, formatErrorMessage, parseAmountWithTokenInfo } from "@/lib/utils";
import { bartMartAddress, useWriteBartMartCreateOrder } from "@/lib/wagmi/generated";
import { TokenSelector } from "./token-selector";

export function Swap() {
  const { address } = useAccount();
  const [inputToken, setInputToken] = useState<Address | string>(ETH_ADDRESS);
  const [inputAmount, setInputAmount] = useState("");
  const [outputToken, setOutputToken] = useState<Address | string>("");
  const [outputAmount, setOutputAmount] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [sliderPercentage, setSliderPercentage] = useState(0);

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
      setSliderPercentage(0);
    }
  }, [isCreated, createHash, address]);

  const handleSwapTokens = () => {
    const tempToken = inputToken;
    const tempAmount = inputAmount;
    setInputToken(outputToken);
    setInputAmount(outputAmount);
    setOutputToken(tempToken);
    setOutputAmount(tempAmount);
    setSliderPercentage(0);
  };

  const handleMaxInput = () => {
    if (inputIsETH && ethBalance) {
      setInputAmount(formatAmount(ethBalance.value, ETH_ADDRESS));
      setSliderPercentage(100);
    } else if (tokenBalance && inputTokenInfo) {
      setInputAmount(formatAmount(tokenBalance, inputToken, inputTokenInfo.decimals));
      setSliderPercentage(100);
    }
  };

  const handleSliderChange = (percentage: number) => {
    setSliderPercentage(percentage);
    if (percentage === 0) {
      setInputAmount("");
      return;
    }

    const balanceBigInt = inputIsETH ? (ethBalance?.value ?? 0n) : (tokenBalance ?? 0n);

    if (balanceBigInt === 0n || !inputTokenInfo) {
      return;
    }

    // Calculate amount based on percentage
    const percentageAmount = (balanceBigInt * BigInt(percentage)) / 100n;
    setInputAmount(formatAmount(percentageAmount, inputToken, inputTokenInfo.decimals));
  };

  // Calculate percentage from input amount
  useEffect(() => {
    if (!(inputAmount && inputTokenInfo)) {
      setSliderPercentage(0);
      return;
    }

    const balanceBigInt = inputIsETH ? (ethBalance?.value ?? 0n) : (tokenBalance ?? 0n);

    if (balanceBigInt === 0n) {
      setSliderPercentage(0);
      return;
    }

    try {
      const amountBigInt = parseAmountWithTokenInfo(inputAmount, inputTokenInfo);
      if (amountBigInt === 0n) {
        setSliderPercentage(0);
        return;
      }

      const percentage = Number((amountBigInt * 100n) / balanceBigInt);
      setSliderPercentage(Math.min(100, Math.max(0, percentage)));
    } catch {
      // If parsing fails, don't update slider
    }
  }, [inputAmount, inputTokenInfo, inputIsETH, ethBalance, tokenBalance]);

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

  const inputBalance = (() => {
    if (inputIsETH) {
      return ethBalance ? formatAmount(ethBalance.value, ETH_ADDRESS) : "0";
    }
    if (tokenBalance && inputTokenInfo) {
      return formatAmount(tokenBalance, inputToken, inputTokenInfo.decimals);
    }
    return "0";
  })();

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">Swap</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create an order to exchange tokens</p>
          </div>

          {/* Input Token Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-sm" htmlFor="input-amount">
                From
              </Label>
              {address && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Balance: {inputBalance} {inputTokenInfo?.symbol || (isLoadingInputToken ? "Loading..." : "Token")}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex w-24 items-center gap-2">
                      <Slider
                        className="flex-1"
                        disabled={isCreating || isConfirming || !inputTokenInfo}
                        max={100}
                        min={0}
                        onValueChange={(values) => handleSliderChange(values[0] ?? 0)}
                        step={1}
                        value={[sliderPercentage]}
                      />
                      <span className="w-8 text-right text-xs text-zinc-500 dark:text-zinc-400">
                        {sliderPercentage}%
                      </span>
                    </div>
                    <Button
                      className="h-6 px-2 text-xs"
                      disabled={isCreating || isConfirming}
                      onClick={handleMaxInput}
                      size="sm"
                      variant="secondary"
                    >
                      Max
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <TokenSelector
                disabled={isCreating || isConfirming}
                label=""
                onChange={setInputToken}
                value={inputToken}
              />
              <div className="relative">
                <Input
                  className="h-16 font-semibold text-2xl"
                  disabled={isCreating || isConfirming}
                  id="input-amount"
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="0.0"
                  type="text"
                  value={inputAmount}
                />
                {!hasSufficientBalance && inputAmount && address && (
                  <p className="mt-1 text-red-600 text-xs dark:text-red-400">Insufficient balance</p>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="-my-2 relative z-10 flex justify-center">
            <Button
              aria-label="Swap tokens"
              className="h-10 w-10 rounded-full border-4 border-background bg-card hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={isCreating || isConfirming || !inputToken || !outputToken}
              onClick={handleSwapTokens}
              size="icon"
              variant="secondary"
            >
              <svg
                aria-label="Swap tokens"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Swap tokens</title>
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
              </svg>
            </Button>
          </div>

          {/* Output Token Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-medium text-sm" htmlFor="output-amount">
                To
              </Label>
            </div>
            <div className="space-y-2">
              <TokenSelector
                disabled={isCreating || isConfirming}
                label=""
                onChange={setOutputToken}
                value={outputToken}
              />
              <div className="relative">
                <Input
                  className="h-16 font-semibold text-2xl"
                  disabled={isCreating || isConfirming}
                  id="output-amount"
                  onChange={(e) => setOutputAmount(e.target.value)}
                  placeholder="0.0"
                  type="text"
                  value={outputAmount}
                />
                {outputTokenInfo && (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{outputTokenInfo.symbol}</p>
                )}
              </div>
            </div>
          </div>

          {/* Approval Button */}
          {needsApproval && !approveSuccess && (
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isApproving || !hasSufficientBalance}
                onClick={handleApprove}
              >
                {isApproving ? "Approving..." : `Approve ${inputTokenInfo?.symbol || "Token"}`}
              </Button>
              {approveError && (
                <p className="text-red-600 text-xs dark:text-red-400">
                  {formatErrorMessage(approveError) || "Approval failed"}
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {createError && (
            <p className="text-red-600 text-sm dark:text-red-400">
              {formatErrorMessage(createError) || "Failed to create order"}
            </p>
          )}

          {/* Create Order Button */}
          <Button
            className="h-14 w-full bg-green-600 font-semibold text-lg hover:bg-green-700"
            disabled={!isValid || isCreating || isConfirming}
            onClick={handleCreateOrder}
          >
            {isCreating || isConfirming ? "Creating Order..." : "Create Order"}
          </Button>

          {!address && (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Connect your wallet to create an order
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
