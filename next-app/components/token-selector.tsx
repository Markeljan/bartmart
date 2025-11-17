"use client";

import { useState } from "react";
import { type Address, isAddress } from "viem";
import { getTokenInfo, TOKEN_LIST } from "@/lib/tokens";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TokenSelectorProps = {
  value: Address | string;
  onChange: (address: Address | string) => void;
  label?: string;
  disabled?: boolean;
};

export function TokenSelector({ value, onChange, label, disabled }: TokenSelectorProps) {
  const [customAddress, setCustomAddress] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedToken = getTokenInfo(value);
  const selectedValue = value && isAddress(value) ? value.toLowerCase() : "";

  // Check if selected value is in the token list
  const isCustomToken = selectedValue && !TOKEN_LIST.some((token) => token.address.toLowerCase() === selectedValue);

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
    if (isAddress(customAddress)) {
      onChange(customAddress);
      setShowCustomInput(false);
      setCustomAddress("");
    }
  };

  return (
    <div className="relative">
      {label && <Label htmlFor={label ? `token-selector-${label}` : undefined}>{label}</Label>}
      <div className="space-y-2">
        <Select
          value={isCustomToken ? undefined : selectedValue || undefined}
          onValueChange={handleSelectToken}
          disabled={disabled}
        >
          <SelectTrigger
            id={label ? `token-selector-${label}` : undefined}
            className="w-full"
          >
            <SelectValue>
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedToken?.symbol || "Select token"}</span>
                {selectedToken && selectedToken.symbol !== "UNKNOWN" && (
                  <span className="text-xs text-muted-foreground">{selectedToken.name}</span>
                )}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TOKEN_LIST.map((token) => (
              <SelectItem key={token.address} value={token.address.toLowerCase()}>
                <div className="flex flex-col">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">{token.name}</span>
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
              placeholder="0x..."
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isAddress(customAddress)) {
                  handleCustomAddress();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                disabled={!isAddress(customAddress)}
                onClick={handleCustomAddress}
              >
                Use
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAddress("");
                }}
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
