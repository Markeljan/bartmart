"use client";

import { getDefaultConfig } from "connectkit";
import { base } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [base],
    transports: {
      [base.id]: http("https://base-mainnet.g.alchemy.com/v2/uO_tPEMd7YY8g49_xLGGFp-8GMRxGcs8"),
    },
    walletConnectProjectId: "e5475e4f5dccbd8e93cb4c9d89527842",
    appName: "BartMart",
    appDescription: "The simplest intent market",
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  })
);
