"use client";

import { useEffect, useState } from "react";
import { type Address, erc20Abi, isAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTokenMetadata } from "@/lib/hooks/use-token-metadata";
import { getTokenInfo, isETH, TOKEN_LIST, type TokenInfo } from "@/lib/tokens";

type TokenSelectorProps = {
  value: Address | string;
  onChange: (address: Address | string) => void;
  label?: string;
  disabled?: boolean;
};

type CustomTokenInfoProps = {
  canUseCustomToken: boolean;
  customTokenBalance: bigint | undefined;
  customTokenInfo: { symbol: string; name?: string };
  customTokenIsETH: boolean;
  address: `0x${string}` | undefined;
  hasCustomTokenBalance: boolean;
  isCustomTokenValid: boolean;
  isLoadingCustomToken: boolean;
};

function CustomTokenInfo({
  canUseCustomToken,
  customTokenBalance,
  customTokenInfo,
  customTokenIsETH,
  address,
  hasCustomTokenBalance,
  isCustomTokenValid,
  isLoadingCustomToken,
}: CustomTokenInfoProps) {
  const getBalanceText = () => {
    if (customTokenBalance === undefined) {
      return "Checking...";
    }
    if (customTokenBalance > 0n) {
      return `${customTokenBalance.toString()} (${customTokenInfo.symbol})`;
    }
    return "0";
  };

  const getErrorMessage = () => {
    if (!isCustomTokenValid) {
      return "Invalid token address";
    }
    if (!address) {
      return "Connect wallet to verify balance";
    }
    if (!(hasCustomTokenBalance || customTokenIsETH)) {
      return "You don't have a balance for this token";
    }
    return "";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">{customTokenInfo.symbol}</span>
        {customTokenInfo.name && customTokenInfo.name !== "Unknown Token" && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{customTokenInfo.name}</span>
        )}
      </div>
      {!customTokenIsETH && <p className="text-xs text-zinc-500 dark:text-zinc-400">Balance: {getBalanceText()}</p>}
      {!(canUseCustomToken || isLoadingCustomToken) && (
        <p className="text-red-600 text-xs dark:text-red-400">{getErrorMessage()}</p>
      )}
    </div>
  );
}

export function TokenSelector({ value, onChange, label, disabled }: TokenSelectorProps) {
  const { address } = useAccount();
  const [customAddress, setCustomAddress] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [savedTokens, setSavedTokens] = useState<TokenInfo[]>([]);

  // Fetch saved tokens from API
  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => res.json())
      .then(
        (data: {
          success: boolean;
          data?: Array<{
            address: string;
            symbol: string;
            name: string;
            decimals: number;
            logoURI?: string;
          }>;
        }) => {
          if (data.success && data.data) {
            const tokens: TokenInfo[] = data.data.map((token) => ({
              address: token.address as Address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              logoURI: token.logoURI,
            }));
            setSavedTokens(tokens);
          }
        }
      )
      .catch(() => {
        // Silently fail - will just use hardcoded tokens
      });
  }, []);

  // Combine hardcoded tokens with saved tokens (avoid duplicates)
  const allTokens = (() => {
    const tokenMap = new Map<string, TokenInfo>();

    // Add hardcoded tokens first
    for (const token of TOKEN_LIST) {
      tokenMap.set(token.address.toLowerCase(), token);
    }

    // Add saved tokens (they will override hardcoded ones if same address)
    for (const token of savedTokens) {
      tokenMap.set(token.address.toLowerCase(), token);
    }

    return Array.from(tokenMap.values());
  })();

  const selectedValue = value && isAddress(value) ? value.toLowerCase() : "";

  // Check if selected value is in the token list
  const isCustomToken = selectedValue && !allTokens.some((token) => token.address.toLowerCase() === selectedValue);

  // Fetch token metadata for selected custom token (if already selected)
  const { tokenInfo: selectedTokenInfo } = useTokenMetadata(isCustomToken && selectedValue ? selectedValue : "");

  // Get token info - use fetched metadata for custom tokens, otherwise use getTokenInfo
  const selectedToken = isCustomToken && selectedTokenInfo ? selectedTokenInfo : getTokenInfo(value);

  // Fetch token metadata for custom address
  const isValidCustomAddress = isAddress(customAddress);
  const customTokenIsETH = isValidCustomAddress && isETH(customAddress);
  const { tokenInfo: customTokenInfo, isLoading: isLoadingCustomToken } = useTokenMetadata(
    isValidCustomAddress ? customAddress : ""
  );

  // Check balance for custom token
  const { data: customTokenBalance } = useReadContract({
    address: isValidCustomAddress && !customTokenIsETH ? (customAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isValidCustomAddress && !customTokenIsETH && !!address,
    },
  });

  // Determine if custom token is valid and user has balance
  const isCustomTokenValid = Boolean(isValidCustomAddress && customTokenInfo && customTokenInfo.symbol !== "UNKNOWN");

  const hasCustomTokenBalance = (() => {
    if (customTokenIsETH) {
      return true; // ETH is always valid (we don't check balance here, but ETH is a known token)
    }
    if (!address) {
      return false; // If not connected, can't verify balance
    }
    return customTokenBalance !== undefined && customTokenBalance > 0n;
  })();

  const canUseCustomToken = Boolean(isCustomTokenValid && hasCustomTokenBalance);

  const handleSelectToken = (tokenAddress: string) => {
    if (tokenAddress === "custom-input") {
      setShowCustomInput(true);
      return;
    }
    onChange(tokenAddress);
    setShowCustomInput(false);
    setCustomAddress("");
  };

  const handleCustomAddress = () => {
    if (isAddress(customAddress) && canUseCustomToken && customTokenInfo) {
      // Add token to saved tokens list if it's not already there
      if (!allTokens.some((token) => token.address.toLowerCase() === customAddress.toLowerCase())) {
        setSavedTokens((prev) => {
          // Check if already in list
          if (prev.some((token) => token.address.toLowerCase() === customAddress.toLowerCase())) {
            return prev;
          }
          return [
            ...prev,
            {
              address: customAddress as Address,
              symbol: customTokenInfo.symbol,
              name: customTokenInfo.name,
              decimals: customTokenInfo.decimals,
              logoURI: customTokenInfo.logoURI,
            },
          ];
        });
      }
      onChange(customAddress);
      setShowCustomInput(false);
      setCustomAddress("");
    }
  };

  return (
    <div className="relative">
      {label && <Label htmlFor={label ? `token-selector-${label}` : undefined}>{label}</Label>}
      <div className="space-y-2">
        <Select disabled={disabled} onValueChange={handleSelectToken} value={selectedValue || undefined}>
          <SelectTrigger className="w-full" id={label ? `token-selector-${label}` : undefined}>
            <SelectValue>
              <span className="flex items-center gap-2">
                <span className="font-medium">
                  {(() => {
                    if (selectedToken?.symbol && selectedToken.symbol !== "UNKNOWN") {
                      return selectedToken.symbol;
                    }
                    if (isCustomToken && !selectedTokenInfo) {
                      return "Loading...";
                    }
                    return "Select token";
                  })()}
                </span>
                {selectedToken && selectedToken.symbol !== "UNKNOWN" && selectedToken.name && (
                  <span className="text-muted-foreground text-xs">{selectedToken.name}</span>
                )}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allTokens.map((token) => (
              <SelectItem key={token.address} value={token.address.toLowerCase()}>
                <div className="flex flex-col">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-muted-foreground text-xs">{token.name}</span>
                </div>
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value="custom-input">+ Custom address</SelectItem>
          </SelectContent>
        </Select>
        {showCustomInput && (
          <div className="space-y-2">
            <Input
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canUseCustomToken) {
                  handleCustomAddress();
                }
              }}
              placeholder="0x..."
              value={customAddress}
            />
            {isValidCustomAddress && (
              <div className="space-y-1">
                {isLoadingCustomToken && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading token info...</p>
                )}
                {!isLoadingCustomToken && customTokenInfo && (
                  <CustomTokenInfo
                    address={address}
                    canUseCustomToken={canUseCustomToken}
                    customTokenBalance={customTokenBalance}
                    customTokenInfo={customTokenInfo}
                    customTokenIsETH={customTokenIsETH}
                    hasCustomTokenBalance={hasCustomTokenBalance}
                    isCustomTokenValid={isCustomTokenValid}
                    isLoadingCustomToken={isLoadingCustomToken}
                  />
                )}
                {!(isLoadingCustomToken || customTokenInfo) && (
                  <p className="text-red-600 text-xs dark:text-red-400">Invalid token address</p>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!canUseCustomToken || isLoadingCustomToken}
                onClick={handleCustomAddress}
                size="sm"
              >
                {isLoadingCustomToken ? "Loading..." : "Use"}
              </Button>
              <Button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAddress("");
                }}
                size="sm"
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
