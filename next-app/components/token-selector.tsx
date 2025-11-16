"use client";

import { useState } from "react";
import { type Address, isAddress } from "viem";
import { getTokenInfo, TOKEN_LIST } from "@/lib/tokens";

type TokenSelectorProps = {
  value: Address | string;
  onChange: (address: Address | string) => void;
  label?: string;
  disabled?: boolean;
};

export function TokenSelector({ value, onChange, label, disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedToken = getTokenInfo(value);

  const handleSelectToken = (tokenAddress: Address | string) => {
    onChange(tokenAddress);
    setIsOpen(false);
    setShowCustomInput(false);
    setCustomAddress("");
  };

  const handleCustomAddress = () => {
    if (isAddress(customAddress)) {
      handleSelectToken(customAddress);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label
          className="mb-1 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
          htmlFor={`token-selector-${label}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-left hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          disabled={disabled}
          id={label ? `token-selector-${label}` : undefined}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {selectedToken?.symbol || "Select token"}
            </span>
            {selectedToken && selectedToken.symbol !== "UNKNOWN" && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{selectedToken.name}</span>
            )}
          </span>
          <svg
            aria-label="Dropdown arrow"
            className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            role="img"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>

        {isOpen && (
          <>
            <button
              aria-label="Close dropdown"
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
              type="button"
            />
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {TOKEN_LIST.map((token) => (
                <button
                  className={`flex w-full items-center justify-between px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    value.toLowerCase() === token.address.toLowerCase() ? "bg-zinc-100 dark:bg-zinc-800" : ""
                  }`}
                  key={token.address}
                  onClick={() => handleSelectToken(token.address)}
                  type="button"
                >
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">{token.symbol}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{token.name}</div>
                  </div>
                  {value.toLowerCase() === token.address.toLowerCase() && (
                    <svg
                      aria-label="Selected"
                      className="h-4 w-4 text-zinc-500"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                  )}
                </button>
              ))}
              {showCustomInput ? (
                <div className="border-zinc-300 border-t p-4 dark:border-zinc-700">
                  <input
                    className="w-full rounded border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="0x..."
                    type="text"
                    value={customAddress}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      className="flex-1 rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      disabled={!isAddress(customAddress)}
                      onClick={handleCustomAddress}
                      type="button"
                    >
                      Use
                    </button>
                    <button
                      className="rounded bg-zinc-200 px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomAddress("");
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full border-zinc-300 border-t px-4 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onClick={() => setShowCustomInput(true)}
                  type="button"
                >
                  + Custom address
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
