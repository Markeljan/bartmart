"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { type ReactNode, useState } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi/config";

export const Web3Provider = ({ children, cookies }: { children: ReactNode; cookies: string | null }) => {
  const [queryClient] = useState(() => new QueryClient());

  const initialState = cookieToInitialState(wagmiConfig, cookies);
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="midnight">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
