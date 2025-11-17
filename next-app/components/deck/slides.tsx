"use client";

import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slide } from "./presentation";

export function TitleSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-6">
          <Image
            alt="BartMart Logo"
            className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36"
            height={128}
            src="/bartmart_512.png"
            width={128}
          />
          <h1 className="font-bold text-7xl text-foreground md:text-8xl lg:text-9xl">BartMart</h1>
        </div>
        <p className="font-semibold text-2xl text-foreground md:text-3xl lg:text-4xl">
          OTC intent marketplace for humans and agents
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image alt="soko.eth" className="rounded-full" height={32} src="/soko_avatar.png" width={32} />
            <p className="font-bold text-card-foreground text-lg">Built by soko.eth</p>
          </div>
          <p className="font-semibold text-foreground text-lg">at The Vault Buenos Aires</p>
          <div className="mt-4">
            <Image
              alt="Eigen Vault"
              className="h-auto w-auto max-w-full"
              height={200}
              src="/eigen_vault_banner.webp"
              width={600}
            />
          </div>
        </div>
      </div>
    </Slide>
  );
}

export function ProblemSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-5xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-5xl md:text-6xl">The Problem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg md:text-xl">
            <div className="space-y-4">
              <p className="font-semibold">AI agents are limited by difficult SDK integrations to trade onchain</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Must manage Uniswap V3, V4, Aerodrome, and dozens of other protocols</li>
                <li>Each protocol requires separate SDK integration and maintenance</li>
                <li>New protocols constantly emerge, requiring constant updates</li>
                <li>Significant time spent on integration and maintenance</li>
                <li>TEE deployment updates require users to trust/verify a new deployment</li>
              </ul>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="font-bold text-foreground text-lg">Human Traders Face:</p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-base text-foreground">
                  <li>High slippage on AMMs</li>
                  <li>Limited OTC options</li>
                  <li>Complex protocol integrations</li>
                </ul>
              </div>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="font-bold text-foreground text-lg">Cost of Maintenance:</p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-base text-foreground">
                  <li>Significant developer time required</li>
                  <li>Breaking changes in SDKs</li>
                  <li>Testing across multiple protocols</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-base border-4 border-foreground bg-secondary-background/80 p-6">
              <Image alt="Eigen Cloud" className="h-8 w-auto" height={32} src="/eigencloud-logo-blue.png" width={120} />
              <p className="font-bold text-foreground">
                Especially problematic for TEE environments like Eigen Compute where frequent deployments hurt user
                trust and verifiability
              </p>
            </div>
            {/* Chat Conversation */}
            <div className="mt-6">
              <p className="mb-4 font-bold text-foreground text-xl">Real-World Example:</p>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-6">
                <div className="space-y-4">
                  {/* Agent message - left */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <Image
                        alt="Agent"
                        className="h-12 w-12 rounded-full object-cover"
                        height={48}
                        src="/bot.png"
                        width={48}
                      />
                    </div>
                    <div className="flex-1 rounded-lg rounded-tl-none border-2 border-foreground bg-main/20 p-4">
                      <p className="text-base text-foreground">What token would you like me to swap?</p>
                    </div>
                  </div>
                  {/* User message - right */}
                  <div className="flex items-start justify-end gap-4">
                    <div className="flex-1 rounded-lg rounded-tr-none border-2 border-foreground bg-main/20 p-4 text-right">
                      <p className="text-base text-foreground">swap x420 token, new token on UniswapV5!</p>
                    </div>
                    <div className="shrink-0">
                      <Image
                        alt="User"
                        className="h-12 w-12 rounded-full object-cover"
                        height={48}
                        src="/user.png"
                        width={48}
                      />
                    </div>
                  </div>
                  {/* Agent error message - left */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <Image
                        alt="Agent"
                        className="h-12 w-12 rounded-full object-cover"
                        height={48}
                        src="/bot.png"
                        width={48}
                      />
                    </div>
                    <div className="flex-1 rounded-lg rounded-tl-none border-2 border-red-500 bg-red-500/20 p-4">
                      <p className="font-semibold text-base text-red-600 dark:text-red-400">
                        error! unsupported token. This dex is not supported
                      </p>
                    </div>
                  </div>
                  {/* User message - right */}
                  <div className="flex items-start justify-end gap-4">
                    <div className="flex-1 rounded-lg rounded-tr-none border-2 border-foreground bg-main/20 p-4 text-right">
                      <p className="text-base text-foreground">
                        wow this agent <span className="font-bold">NGMI</span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Image
                        alt="User"
                        className="h-12 w-12 rounded-full object-cover"
                        height={48}
                        src="/user.png"
                        width={48}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function SolutionSlide() {
  const orderStruct = `struct Order {
    address creator;
    address inputToken;  // address(0) for ETH
    uint256 inputAmount;
    address outputToken; // address(0) for ETH
    uint256 outputAmount;
    bool fulfilled;
    bool cancelled;
}`;

  const createOrderSnippet = `function createOrder(
    address inputToken,
    uint256 inputAmount,
    address outputToken,
    uint256 outputAmount
) external payable returns (uint256 orderId) {
    // Validates: amounts > 0, token pair != same
    // ETH: requires msg.value == inputAmount
    // ERC20: transfers from creator to contract
    // Stores order & emits OrderCreated
    return orderId;
}`;

  const fulfilOrderSnippet = `function fulfilOrder(uint256 orderId) 
    external payable {
    // Validates: order exists, not fulfilled/cancelled
    // Receives output token/ETH from fulfiller
    // Sends input token/ETH to fulfiller
    // Sends output token/ETH to creator
    // Marks order.fulfilled = true
}`;

  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl">The Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-xl md:text-2xl">BartMart.sol: Onchain Barter Market Contract</p>
                <div className="mt-3 rounded-base border-4 border-foreground bg-main p-4">
                  <p className="font-bold font-mono text-lg text-main-foreground">BartMart.sol</p>
                  <p className="mt-2 text-main-foreground text-sm">Deployed on Base</p>
                  <a
                    className="mt-2 text-main-foreground text-xs hover:underline"
                    href="https://basescan.org/address/0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-base border-4 border-foreground bg-main p-5">
                <p className="mb-3 font-bold text-lg text-main-foreground">Universal Token Swaps</p>
                <p className="mb-3 text-main-foreground text-sm">
                  BartMart.sol supports swapping to and from any ERC20 token + ETH:
                </p>
                <div className="grid gap-2 text-main-foreground text-sm md:grid-cols-3">
                  <div className="rounded-base border-2 border-main-foreground/30 bg-main-foreground/10 p-3 text-center">
                    <p className="font-semibold">ETH → ERC20</p>
                  </div>
                  <div className="rounded-base border-2 border-main-foreground/30 bg-main-foreground/10 p-3 text-center">
                    <p className="font-semibold">ERC20 → ERC20</p>
                  </div>
                  <div className="rounded-base border-2 border-main-foreground/30 bg-main-foreground/10 p-3 text-center">
                    <p className="font-semibold">ERC20 → ETH</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-base">
                <p className="font-semibold">How It Works:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Agents/users declare intent: tokens and amounts to buy/sell</li>
                  <li>Orders stored onchain in BartMart.sol contract</li>
                  <li>Market fulfills orders when conditions are favorable</li>
                </ul>
              </div>

              <div className="mt-4 rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="mb-2 font-semibold text-base text-foreground">Key Benefits</p>
                <ul className="ml-6 list-disc space-y-1 text-foreground text-sm">
                  <li>Single contract replaces dozens of protocol SDKs</li>
                  <li>Gas efficient: One contract call vs multiple protocol calls</li>
                  <li>No AMM pools needed - direct peer-to-peer swaps</li>
                  <li>Simple, auditable contract logic</li>
                </ul>
              </div>

              <div className="mt-6 border-foreground border-t-2 pt-6">
                <p className="mb-4 font-semibold text-lg">Contract Flow</p>

                <div className="mb-4">
                  <p className="mb-2 font-semibold text-base">Order Structure</p>
                  <div className="overflow-hidden rounded-lg border-2 border-foreground">
                    <SyntaxHighlighter
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.5rem",
                      }}
                      language="solidity"
                      style={vscDarkPlus}
                    >
                      {orderStruct}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 font-semibold">1. Create Order</p>
                    <div className="overflow-hidden rounded-lg border-2 border-foreground">
                      <SyntaxHighlighter
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.5rem",
                        }}
                        language="solidity"
                        style={vscDarkPlus}
                      >
                        {createOrderSnippet}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold">2. Fulfill Order</p>
                    <div className="overflow-hidden rounded-lg border-2 border-foreground">
                      <SyntaxHighlighter
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.5rem",
                        }}
                        language="solidity"
                        style={vscDarkPlus}
                      >
                        {fulfilOrderSnippet}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function IntegrationsSlide() {
  const installSnippet = `npm install bartmart
# or
bun add bartmart
# or
yarn add bartmart`;

  const aiSdkUsage = `import { bartmartTools } from "bartmart";
import { generateText } from "ai";

const result = await generateText({
  model: yourModel,
  tools: {
    ...bartmartTools,
  },
});`;

  const directUsage = `import { createOrderTool, fetchOrdersTool } from "bartmart";

// Create an order
const result = await createOrderTool.execute({
  inputToken: "0x0", // ETH
  inputAmount: "1000000000000000000", // 1 ETH
  outputToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
  outputAmount: "3000000000", // 3000 USDC
});

// Fetch orders
const orders = await fetchOrdersTool.execute({
  orderId: 123, // or { limit: 10 } for recent orders
});`;

  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle className="text-4xl md:text-5xl">Integrations</CardTitle>
              <Image alt="npm" className="h-8 w-auto" height={32} src="/npm_logo.png" width={80} />
            </div>
            <p className="mt-2 text-lg text-muted-foreground">Eigen Compute TEE UI + TypeScript AI SDK</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <a
                className="text-base text-primary hover:underline"
                href="https://bartmart.xyz"
                rel="noopener noreferrer"
                target="_blank"
              >
                bartmart.xyz
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                className="text-base text-primary hover:underline"
                href="https://www.npmjs.com/package/bartmart"
                rel="noopener noreferrer"
                target="_blank"
              >
                npm: bartmart
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="space-y-6">
              {/* Integration Components */}
              <div className="space-y-4">
                <p className="font-bold text-xl md:text-2xl">Integration Options</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-base border-4 border-foreground bg-main p-5">
                    <p className="mb-2 font-bold text-lg text-main-foreground">Web UI</p>
                    <p className="mb-3 text-main-foreground text-sm">
                      <a
                        className="font-semibold text-main-foreground hover:underline"
                        href="https://bartmart.xyz"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        bartmart.xyz
                      </a>
                    </p>
                    <p className="text-main-foreground text-xs">
                      Frontend interface for creating and fulfilling orders
                    </p>
                    <div className="mt-4 flex items-center gap-3 rounded-base border-2 border-main-foreground/30 bg-main-foreground/10 p-3">
                      <Image
                        alt="Eigen Cloud"
                        className="h-6 w-auto"
                        height={24}
                        src="/eigencloud-logo-blue.png"
                        width={90}
                      />
                      <p className="text-main-foreground text-xs">Deployed verifiably on Eigen Compute TEE</p>
                    </div>
                  </div>
                  <div className="rounded-base border-4 border-foreground bg-main p-5">
                    <p className="mb-2 font-bold text-lg text-main-foreground">TypeScript AI SDK</p>
                    <p className="mb-3 text-main-foreground text-sm">
                      <a
                        className="font-semibold text-main-foreground hover:underline"
                        href="https://www.npmjs.com/package/bartmart"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        npm: bartmart
                      </a>
                    </p>
                    <p className="text-main-foreground text-xs">
                      TypeScript package with AI SDK tools for agent integration
                    </p>
                    <p className="mt-2 text-main-foreground text-xs">Works out of the box with AI SDK</p>
                  </div>
                </div>
              </div>

              {/* SDK Usage Section */}
              <div className="border-foreground border-t-4 pt-6">
                <p className="mb-4 font-bold text-xl md:text-2xl">TypeScript AI SDK Usage</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 font-semibold text-lg">Installation</p>
                      <div className="overflow-hidden rounded-lg border-2 border-foreground">
                        <SyntaxHighlighter
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            fontSize: "0.875rem",
                            borderRadius: "0.5rem",
                          }}
                          language="bash"
                          style={vscDarkPlus}
                        >
                          {installSnippet}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 font-semibold text-lg">With AI SDK</p>
                      <div className="overflow-hidden rounded-lg border-2 border-foreground">
                        <SyntaxHighlighter
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            fontSize: "0.75rem",
                            borderRadius: "0.5rem",
                          }}
                          language="typescript"
                          style={vscDarkPlus}
                        >
                          {aiSdkUsage}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 font-semibold text-lg">Direct Usage</p>
                      <div className="overflow-hidden rounded-lg border-2 border-foreground">
                        <SyntaxHighlighter
                          customStyle={{
                            margin: 0,
                            padding: "1rem",
                            fontSize: "0.75rem",
                            borderRadius: "0.5rem",
                          }}
                          language="typescript"
                          style={vscDarkPlus}
                        >
                          {directUsage}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                      <p className="mb-2 font-semibold text-base text-foreground">Key Features</p>
                      <ul className="ml-6 list-disc space-y-1 text-foreground text-sm">
                        <li>AI SDK compatible out of the box</li>
                        <li>No need to manage multiple protocol SDKs</li>
                        <li>Stable, verifiable agent implementations</li>
                        <li>Works with any token onchain</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function CompetitiveSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl">Why BartMart?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-4 border-foreground">
                    <th className="border-4 border-foreground bg-secondary-background/80 p-3 text-left font-bold text-foreground">
                      Feature
                    </th>
                    <th className="border-4 border-foreground bg-main p-3 text-left font-bold text-main-foreground">
                      BartMart
                    </th>
                    <th className="border-4 border-foreground bg-secondary-background/80 p-3 text-left font-bold text-foreground">
                      Uniswap SDK
                    </th>
                    <th className="border-4 border-foreground bg-secondary-background/80 p-3 text-left font-bold text-foreground">
                      1inch API
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Integration Complexity
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Single contract</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Multiple SDKs
                    </td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      API + SDK
                    </td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Protocol Updates
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Future-proof</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Constant updates
                    </td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      API changes
                    </td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Verifiability
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Fully onchain</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Onchain
                    </td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Offchain routing
                    </td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Agent-Friendly
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Built for agents</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Human-focused
                    </td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      Human-focused
                    </td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      OTC Support
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Native</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      AMM only
                    </td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">
                      AMM only
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-base border-4 border-foreground bg-main p-4">
              <p className="font-bold text-lg text-main-foreground">Key Differentiator</p>
              <p className="mt-2 text-main-foreground text-sm">
                BartMart is the only solution built specifically for AI agents, prioritizing stability and verifiability
                over protocol diversity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function UseCasesSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl">Use Cases & Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">
            {/* Use Cases Section */}
            <div className="space-y-4">
              <p className="font-bold text-xl md:text-2xl">Use Cases</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">Eigen Compute Agents</p>
                  <p className="text-foreground text-xs">
                    Stable, verifiable trading interface for TEE-deployed agents
                  </p>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">AI Agents</p>
                  <p className="text-foreground text-xs">npm package eliminates complex DeFi SDK integrations</p>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">Trading Bots</p>
                  <p className="text-foreground text-xs">Fulfill orders at favorable rates, earn spreads</p>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">Human Traders</p>
                  <p className="text-foreground text-xs">OTC swaps without slippage for large trades</p>
                </div>
              </div>

              {/* Why BartMart Comparison */}
              <div className="mt-6 border-foreground border-t-4 pt-6">
                <p className="mb-4 font-bold text-xl md:text-2xl">Why BartMart?</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-4 border-foreground">
                        <th className="border-4 border-foreground bg-secondary-background/80 p-2 text-left font-bold text-foreground text-xs">
                          Feature
                        </th>
                        <th className="border-4 border-foreground bg-main p-2 text-left font-bold text-main-foreground text-xs">
                          BartMart
                        </th>
                        <th className="border-4 border-foreground bg-secondary-background/80 p-2 text-left font-bold text-foreground text-xs">
                          Uniswap SDK
                        </th>
                        <th className="border-4 border-foreground bg-secondary-background/80 p-2 text-left font-bold text-foreground text-xs">
                          1inch API
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-4 border-foreground">
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 font-semibold text-foreground text-xs">
                          Integration
                        </td>
                        <td className="border-4 border-foreground bg-main p-2 text-main-foreground text-xs">
                          Single contract
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Multiple SDKs
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          API + SDK
                        </td>
                      </tr>
                      <tr className="border-4 border-foreground">
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 font-semibold text-foreground text-xs">
                          Updates
                        </td>
                        <td className="border-4 border-foreground bg-main p-2 text-main-foreground text-xs">
                          Future-proof
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Constant updates
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          API changes
                        </td>
                      </tr>
                      <tr className="border-4 border-foreground">
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 font-semibold text-foreground text-xs">
                          Verifiability
                        </td>
                        <td className="border-4 border-foreground bg-main p-2 text-main-foreground text-xs">
                          Fully onchain
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Onchain
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Offchain routing
                        </td>
                      </tr>
                      <tr className="border-4 border-foreground">
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 font-semibold text-foreground text-xs">
                          Agent-Friendly
                        </td>
                        <td className="border-4 border-foreground bg-main p-2 text-main-foreground text-xs">
                          Built for agents
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Human-focused
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          Human-focused
                        </td>
                      </tr>
                      <tr className="border-4 border-foreground">
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 font-semibold text-foreground text-xs">
                          OTC Support
                        </td>
                        <td className="border-4 border-foreground bg-main p-2 text-main-foreground text-xs">Native</td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          AMM only
                        </td>
                        <td className="border-4 border-foreground bg-secondary-background/80 p-2 text-foreground text-xs">
                          AMM only
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-base border-4 border-foreground bg-main p-3">
                  <p className="font-bold text-main-foreground text-sm">Key Differentiator</p>
                  <p className="mt-1 text-main-foreground text-xs">
                    BartMart is the only solution built specifically for AI agents, prioritizing stability and
                    verifiability over protocol diversity.
                  </p>
                </div>
              </div>
            </div>

            {/* Roadmap Section */}
            <div className="border-foreground border-t-4 pt-6">
              <p className="mb-4 font-bold text-xl md:text-2xl">Roadmap</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">Near Term</p>
                  <ul className="ml-4 list-disc space-y-1 text-foreground text-xs">
                    <li>Open source trading agent</li>
                    <li>Eigen Compute examples</li>
                    <li>Enhanced docs</li>
                  </ul>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-2 font-bold text-foreground text-lg">Future</p>
                  <ul className="ml-4 list-disc space-y-1 text-foreground text-xs">
                    <li>Multi-chain expansion</li>
                    <li>Advanced order types</li>
                    <li>Community features</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 rounded-base border-4 border-foreground bg-main p-4">
                <Image
                  alt="Eigen Cloud"
                  className="h-8 w-auto"
                  height={32}
                  src="/eigencloud-logo-blue.png"
                  width={120}
                />
                <p className="font-bold text-main-foreground text-sm">Next: Open source agent on Eigen Compute</p>
              </div>
            </div>

            {/* Get Involved Section */}
            <div className="border-foreground border-t-4 pt-6">
              <p className="mb-4 font-bold text-xl md:text-2xl">Get Involved</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-3 font-bold text-foreground text-lg">Developers</p>
                  <ul className="ml-4 space-y-1 text-foreground text-xs">
                    <li>
                      <a
                        className="text-primary hover:underline"
                        href="https://www.npmjs.com/package/bartmart"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        npm install bartmart
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-primary hover:underline"
                        href="https://github.com"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Contribute on GitHub
                      </a>
                    </li>
                    <li>Build integrations</li>
                  </ul>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                  <p className="mb-3 font-bold text-foreground text-lg">Traders</p>
                  <ul className="ml-4 space-y-1 text-foreground text-xs">
                    <li>Create OTC orders</li>
                    <li>Fulfill for spreads</li>
                    <li>No slippage</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-base border-4 border-foreground bg-main p-4">
                <p className="font-bold text-main-foreground text-sm">
                  Partnerships: Integrate BartMart into your platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function ResultSlide() {
  const installSnippet = `npm install bartmart
# or
bun add bartmart
# or
yarn add bartmart`;

  const aiSdkUsage = `import { bartmartTools } from "bartmart";
import { generateText } from "ai";

const result = await generateText({
  model: yourModel,
  tools: {
    ...bartmartTools,
  },
});`;

  const directUsage = `import { createOrderTool, fetchOrdersTool } from "bartmart";

// Create an order
const result = await createOrderTool.execute({
  inputToken: "0x0", // ETH
  inputAmount: "1000000000000000000", // 1 ETH
  outputToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
  outputAmount: "3000000000", // 3000 USDC
});

// Fetch orders
const orders = await fetchOrdersTool.execute({
  orderId: 123, // or { limit: 10 } for recent orders
});`;

  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <div className="flex items-center gap-4">
              <CardTitle className="text-4xl md:text-5xl">The Result</CardTitle>
              <Image alt="npm" className="h-8 w-auto" height={32} src="/npm_logo.png" width={80} />
            </div>
            <p className="mt-2 text-lg text-muted-foreground">Agents deployed to TEEs with one simple trading tool</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <a
                className="text-base text-primary hover:underline"
                href="https://www.npmjs.com/package/bartmart"
                rel="noopener noreferrer"
                target="_blank"
              >
                npmjs.com/package/bartmart
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                className="text-base text-primary hover:underline"
                href="https://basescan.org/address/0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contract: 0x0373...FC94C
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">
            <div className="space-y-6">
              <div className="rounded-base border-4 border-foreground bg-main p-4">
                <p className="font-bold font-mono text-base text-main-foreground">
                  Single contract integration: BartMart.sol
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold text-lg">Benefits</p>
                    <ul className="ml-6 list-disc space-y-2 text-base">
                      <li>No need to manage multiple protocol SDKs</li>
                      <li>Stable, verifiable agent implementations</li>
                      <li>Works with any token onchain</li>
                      <li>Trust through onchain verifiability</li>
                      <li>AI SDK compatible out of the box</li>
                    </ul>
                  </div>
                  <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                    <p className="mb-2 font-semibold text-base text-foreground">Performance</p>
                    <ul className="ml-6 list-disc space-y-1 text-foreground text-sm">
                      <li>Single contract call vs multiple protocol calls</li>
                      <li>Lower gas costs for OTC swaps</li>
                      <li>No slippage on fulfilled orders</li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-lg">Installation</p>
                    <div className="overflow-hidden rounded-lg border-2 border-foreground">
                      <SyntaxHighlighter
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.5rem",
                        }}
                        language="bash"
                        style={vscDarkPlus}
                      >
                        {installSnippet}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-semibold text-lg">With AI SDK</p>
                    <div className="overflow-hidden rounded-lg border-2 border-foreground">
                      <SyntaxHighlighter
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.5rem",
                        }}
                        language="typescript"
                        style={vscDarkPlus}
                      >
                        {aiSdkUsage}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-lg">Direct Usage</p>
                    <div className="overflow-hidden rounded-lg border-2 border-foreground">
                      <SyntaxHighlighter
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.5rem",
                        }}
                        language="typescript"
                        style={vscDarkPlus}
                      >
                        {directUsage}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function RoadmapSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-6xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl">Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                  <p className="mb-2 font-bold text-foreground text-xl">Near Term</p>
                  <ul className="ml-4 list-disc space-y-2 text-foreground text-sm">
                    <li>Open source trading agent showcase</li>
                    <li>Eigen Compute integration examples</li>
                    <li>Enhanced documentation</li>
                  </ul>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                  <p className="mb-2 font-bold text-foreground text-xl">Future</p>
                  <ul className="ml-4 list-disc space-y-2 text-foreground text-sm">
                    <li>Multi-chain expansion</li>
                    <li>Advanced order types</li>
                    <li>Community-driven features</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 rounded-base border-4 border-foreground bg-main p-6">
                <Image
                  alt="Eigen Cloud"
                  className="h-8 w-auto"
                  height={32}
                  src="/eigencloud-logo-blue.png"
                  width={120}
                />
                <p className="font-bold text-main-foreground">
                  Next milestone: Open source trading agent deployed verifiably with Eigen Compute
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function CallToActionSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-5xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl">Get Involved</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                  <p className="mb-3 font-bold text-foreground text-xl">For Developers</p>
                  <ul className="ml-4 space-y-2 text-foreground text-sm">
                    <li>
                      <a
                        className="text-primary hover:underline"
                        href="https://www.npmjs.com/package/bartmart"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Install: npm install bartmart
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-primary hover:underline"
                        href="https://github.com"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        GitHub: Contribute & star
                      </a>
                    </li>
                    <li>Read the docs</li>
                    <li>Build agent integrations</li>
                  </ul>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                  <p className="mb-3 font-bold text-foreground text-xl">For Traders</p>
                  <ul className="ml-4 space-y-2 text-foreground text-sm">
                    <li>Create OTC orders</li>
                    <li>Fulfill orders for spreads</li>
                    <li>No slippage on fulfilled orders</li>
                    <li>Trade any token pair</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 rounded-base border-4 border-foreground bg-main p-6">
                <p className="mb-3 font-bold text-main-foreground text-xl">Partnership Opportunities</p>
                <p className="text-main-foreground text-sm">
                  Interested in integrating BartMart into your agent platform, DeFi protocol, or trading infrastructure?
                  Let's collaborate!
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg">Join the future of agent-driven DeFi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function NextStepsSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 w-full max-w-5xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-5xl md:text-6xl">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-lg md:text-xl">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-bold text-2xl">Open Source Trading Agent</p>
                <p className="font-semibold">
                  Showcase an open source X trading agent with BartMart across various DEX platforms
                </p>
                <div className="mt-4 flex items-center gap-4 rounded-base border-4 border-foreground bg-main p-6">
                  <Image
                    alt="Eigen Cloud"
                    className="h-8 w-auto"
                    height={32}
                    src="/eigencloud-logo-blue.png"
                    width={120}
                  />
                  <p className="font-bold text-main-foreground">Deployed verifiably with Eigen Compute</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function ClosingSlide() {
  return (
    <Slide className="bg-background">
      <div
        className="-z-10 absolute inset-0 bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="z-10 flex flex-col items-center gap-8 text-center">
        <div className="mb-4">
          <p className="font-bold text-3xl text-foreground md:text-4xl lg:text-5xl">Thank You</p>
        </div>
        <div className="flex items-center gap-6">
          <Image
            alt="BartMart Logo"
            className="h-24 w-24 md:h-32 md:w-32 lg:h-36 lg:w-36"
            height={128}
            src="/bartmart_512.png"
            width={128}
          />
          <h1 className="font-bold text-7xl text-foreground md:text-8xl lg:text-9xl">BartMart</h1>
        </div>
        <p className="font-semibold text-2xl text-foreground md:text-3xl lg:text-4xl">
          OTC intent marketplace for humans and agents
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              className="rounded-base border-4 border-foreground bg-main px-6 py-3 font-bold text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
              href="https://bartmart.xyz"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit bartmart.xyz
            </a>
            <a
              className="rounded-base border-4 border-foreground bg-main px-6 py-3 font-bold text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
              href="https://basescan.org/address/0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C"
              rel="noopener noreferrer"
              target="_blank"
            >
              Explore Contract
            </a>
            <a
              className="rounded-base border-4 border-foreground bg-main px-6 py-3 font-bold text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
              href="https://www.npmjs.com/package/bartmart"
              rel="noopener noreferrer"
              target="_blank"
            >
              Install SDK
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Image alt="soko.eth" className="rounded-full" height={32} src="/soko_avatar.png" width={32} />
            <p className="font-bold text-card-foreground text-lg">Built by soko.eth</p>
          </div>
          <p className="font-semibold text-foreground text-lg">at The Vault Buenos Aires</p>
          <div className="mt-4">
            <Image
              alt="Eigen Vault"
              className="h-auto w-auto max-w-full"
              height={200}
              src="/eigen_vault_banner.webp"
              width={600}
            />
          </div>
        </div>
      </div>
    </Slide>
  );
}
