"use client";

import { useEffect, useMemo, useState } from "react";
import { type Address, erc20Abi, isAddress } from "viem";
import { useReadContract } from "wagmi";
import { getTokenInfo, type TokenInfo } from "../tokens";

type UseTokenMetadataResult = {
  tokenInfo: TokenInfo | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * Hook to fetch token metadata (decimals, name, symbol) from the chain
 * Checks Redis cache first, then falls back to chain and cached token info
 */
export function useTokenMetadata(tokenAddress: Address | string): UseTokenMetadataResult {
  const isValidAddress = Boolean(tokenAddress && isAddress(tokenAddress));
  const isETH = tokenAddress === "0x0000000000000000000000000000000000000000" || !tokenAddress;
  const shouldFetch = isValidAddress && !isETH;

  // Memoize cached token info to prevent unnecessary recalculations
  const cachedInfo = useMemo(() => getTokenInfo(tokenAddress), [tokenAddress]);

  // Check Redis cache via API
  const [cachedTokenInfo, setCachedTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoadingCache, setIsLoadingCache] = useState(false);

  useEffect(() => {
    if (!(shouldFetch && isValidAddress)) {
      return;
    }

    // Try to fetch from Redis cache
    setIsLoadingCache(true);
    fetch(`/api/tokens/${tokenAddress}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCachedTokenInfo({
            address: data.data.address,
            symbol: data.data.symbol,
            name: data.data.name,
            decimals: data.data.decimals,
            logoURI: data.data.logoURI,
          });
        }
      })
      .catch(() => {
        // Silently fail - will fall back to chain fetch
      })
      .finally(() => {
        setIsLoadingCache(false);
      });
  }, [tokenAddress, shouldFetch, isValidAddress]);

  // Fetch decimals
  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract({
    address: shouldFetch ? (tokenAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: shouldFetch,
    },
  });

  // Fetch symbol
  const { data: symbol, isLoading: isLoadingSymbol } = useReadContract({
    address: shouldFetch ? (tokenAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: shouldFetch,
    },
  });

  // Fetch name
  const { data: name, isLoading: isLoadingName } = useReadContract({
    address: shouldFetch ? (tokenAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: "name",
    query: {
      enabled: shouldFetch,
    },
  });

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(cachedInfo);

  useEffect(() => {
    // If ETH or invalid address, use cached info
    if (isETH || !isValidAddress) {
      setTokenInfo((prev) => {
        if (prev?.address === cachedInfo?.address) {
          return prev;
        }
        return cachedInfo;
      });
      return;
    }

    // Prefer Redis cache if available
    if (cachedTokenInfo) {
      setTokenInfo((prev) => {
        if (
          prev?.address === cachedTokenInfo.address &&
          prev?.symbol === cachedTokenInfo.symbol &&
          prev?.decimals === cachedTokenInfo.decimals
        ) {
          return prev;
        }
        return cachedTokenInfo;
      });
      return;
    }

    // If we have cached info and it's not UNKNOWN, use it
    if (cachedInfo && cachedInfo.symbol !== "UNKNOWN") {
      setTokenInfo((prev) => {
        if (prev?.address === cachedInfo.address && prev?.symbol === cachedInfo.symbol) {
          return prev;
        }
        return cachedInfo;
      });
      return;
    }

    // If we've fetched all the data from chain, create token info and cache it
    if (decimals !== undefined && symbol && name) {
      const newTokenInfo: TokenInfo = {
        address: tokenAddress as Address,
        symbol: symbol as string,
        name: name as string,
        decimals: Number(decimals),
      };

      setTokenInfo((prev) => {
        // Only update if the info has changed
        if (
          prev?.address === newTokenInfo.address &&
          prev?.symbol === newTokenInfo.symbol &&
          prev?.decimals === newTokenInfo.decimals
        ) {
          return prev;
        }
        return newTokenInfo;
      });

      // Save to Redis cache
      fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: tokenAddress,
          symbol: symbol as string,
          name: name as string,
          decimals: Number(decimals),
        }),
      }).catch(() => {
        // Silently fail - caching is optional
      });
    } else if (cachedInfo) {
      // Use cached info as fallback
      setTokenInfo((prev) => {
        if (prev?.address === cachedInfo.address) {
          return prev;
        }
        return cachedInfo;
      });
    }
  }, [decimals, symbol, name, tokenAddress, isValidAddress, isETH, cachedInfo, cachedTokenInfo]);

  const isLoading = shouldFetch && (isLoadingCache || isLoadingDecimals || isLoadingSymbol || isLoadingName);

  return {
    tokenInfo,
    isLoading: isLoading ?? false,
    error: null,
  };
}
