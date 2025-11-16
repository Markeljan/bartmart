import { type Address, isAddress, zeroAddress } from "viem";

export const ETH_ADDRESS = zeroAddress;

export type TokenInfo = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
};

// Common Base mainnet tokens
export const BASE_TOKENS: Record<string, TokenInfo> = {
  ETH: {
    address: ETH_ADDRESS,
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
  },
  DAI: {
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
  },
};

export const TOKEN_LIST = Object.values(BASE_TOKENS);

export function getTokenInfo(address: Address | string): TokenInfo | null {
  if (!(address && isAddress(address))) {
    return null;
  }

  const addr = address.toLowerCase() as Address;

  // Check if it's ETH
  if (addr === ETH_ADDRESS.toLowerCase()) {
    return BASE_TOKENS.ETH;
  }

  // Check common tokens
  for (const token of TOKEN_LIST) {
    if (token.address.toLowerCase() === addr) {
      return token;
    }
  }

  // Unknown token - return basic info
  return {
    address: addr,
    symbol: "UNKNOWN",
    name: "Unknown Token",
    decimals: 18, // Default to 18, will need to fetch from contract
  };
}

export function isETH(address: Address | string): boolean {
  if (!address) {
    return false;
  }
  return address.toLowerCase() === ETH_ADDRESS.toLowerCase();
}

export function formatTokenAddress(address: Address | string): string {
  if (isETH(address)) {
    return "ETH";
  }
  if (!isAddress(address)) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
