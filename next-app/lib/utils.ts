import { type Address, formatUnits, parseUnits } from "viem";
import { getTokenInfo, isETH } from "./tokens";

// Regex patterns for error message cleaning (defined at top level for performance)
const ERROR_PREFIX_REGEX = /^Error:\s*/i;
const CONTRACT_CALL_REGEX = /^Contract Call:.*$/m;
const REQUEST_ARGS_REGEX = /^Request Arguments:.*$/m;
const DOCS_REGEX = /^Docs:.*$/m;
const DETAILS_REGEX = /^Details:.*$/m;
const VERSION_REGEX = /^Version:.*$/m;
const ADDRESS_PATTERN_REGEX = /address:\s*0x[a-fA-F0-9]{40}/gi;
const FROM_PATTERN_REGEX = /from:\s*0x[a-fA-F0-9]{40}/gi;
const TO_PATTERN_REGEX = /to:\s*0x[a-fA-F0-9]{40}/gi;
const DATA_PATTERN_REGEX = /data:\s*0x[a-fA-F0-9]+/gi;
const FUNCTION_PATTERN_REGEX = /function:\s*\w+\([^)]*\)/gi;
const ARGS_PATTERN_REGEX = /args:\s*\([^)]*\)/gi;
const SENDER_PATTERN_REGEX = /sender:\s*0x[a-fA-F0-9]{40}/gi;
const ETH_ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/;

export function formatAmount(amount: bigint | string, tokenAddress: Address | string, decimals?: number): string {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount;

  if (decimals !== undefined) {
    return formatUnits(amountBigInt, decimals);
  }

  const tokenInfo = getTokenInfo(tokenAddress);
  const tokenDecimals = tokenInfo?.decimals ?? 18;

  return formatUnits(amountBigInt, tokenDecimals);
}

export function parseAmount(amount: string, tokenAddress: Address | string, decimals?: number): bigint {
  // If decimals provided, use them directly
  if (decimals !== undefined) {
    try {
      return parseUnits(amount, decimals);
    } catch {
      return 0n;
    }
  }

  // Otherwise, try to get from token info
  const tokenInfo = getTokenInfo(tokenAddress);
  const tokenDecimals = tokenInfo?.decimals ?? 18;

  try {
    return parseUnits(amount, tokenDecimals);
  } catch {
    return 0n;
  }
}

/**
 * Parse amount with explicit token info (for use with useTokenMetadata hook)
 */
export function parseAmountWithTokenInfo(amount: string, tokenInfo: { decimals: number } | null | undefined): bigint {
  const decimals = tokenInfo?.decimals ?? 18;
  try {
    return parseUnits(amount, decimals);
  } catch {
    return 0n;
  }
}

export function formatAddress(address: Address | string): string {
  if (!address) {
    return "";
  }
  if (isETH(address)) {
    return "ETH";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function shortenAddress(address: Address | string, chars = 4): string {
  if (!address) {
    return "";
  }
  if (isETH(address)) {
    return "ETH";
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

function checkUserRejected(message: string): string | null {
  if (message.includes("User rejected") || message.includes("user rejected")) {
    return "Transaction was cancelled";
  }
  return null;
}

function checkInsufficientFunds(message: string): string | null {
  if (
    message.includes("insufficient funds") ||
    message.includes("Insufficient") ||
    message.includes("insufficient balance")
  ) {
    return "Insufficient balance";
  }
  return null;
}

function checkNetworkError(message: string): string | null {
  if (
    message.includes("network") ||
    message.includes("Network") ||
    message.includes("RPC") ||
    message.includes("timeout")
  ) {
    return "Network error. Please try again";
  }
  return null;
}

function checkGasError(message: string): string | null {
  if (message.includes("gas") || message.includes("Gas")) {
    return "Transaction failed. Please try again";
  }
  return null;
}

function checkContractError(message: string): string | null {
  if (message.includes("revert") || message.includes("execution reverted")) {
    return "Transaction failed. Please check your inputs and try again";
  }
  return null;
}

function cleanErrorMessage(message: string): string {
  const lines = message.split("\n");
  const firstLine = lines[0] || message;

  return firstLine
    .replace(ERROR_PREFIX_REGEX, "")
    .replace(CONTRACT_CALL_REGEX, "")
    .replace(REQUEST_ARGS_REGEX, "")
    .replace(DOCS_REGEX, "")
    .replace(DETAILS_REGEX, "")
    .replace(VERSION_REGEX, "")
    .replace(ADDRESS_PATTERN_REGEX, "")
    .replace(FROM_PATTERN_REGEX, "")
    .replace(TO_PATTERN_REGEX, "")
    .replace(DATA_PATTERN_REGEX, "")
    .replace(FUNCTION_PATTERN_REGEX, "")
    .replace(ARGS_PATTERN_REGEX, "")
    .replace(SENDER_PATTERN_REGEX, "")
    .trim();
}

/**
 * Format error messages to be user-friendly
 */
export function formatErrorMessage(error: Error | null | undefined): string | null {
  if (!error) {
    return null;
  }

  const message = error.message || String(error);

  // Check for specific error types
  const userRejected = checkUserRejected(message);
  if (userRejected) {
    return userRejected;
  }

  const insufficientFunds = checkInsufficientFunds(message);
  if (insufficientFunds) {
    return insufficientFunds;
  }

  const networkError = checkNetworkError(message);
  if (networkError) {
    return networkError;
  }

  const gasError = checkGasError(message);
  if (gasError) {
    return gasError;
  }

  const contractError = checkContractError(message);
  if (contractError) {
    return contractError;
  }

  // Generic fallback - show first line only and remove technical details
  const cleaned = cleanErrorMessage(message);

  // If cleaned message is still too long, contains addresses, or is mostly technical details, show generic message
  if (
    cleaned.length > 100 ||
    ETH_ADDRESS_REGEX.test(cleaned) ||
    cleaned.length < 10 ||
    cleaned === message // If nothing was cleaned, it's probably all technical
  ) {
    return "Transaction failed. Please try again";
  }

  return cleaned || "Transaction failed. Please try again";
}
