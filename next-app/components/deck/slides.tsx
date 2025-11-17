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
          <p className="font-semibold text-foreground text-lg">Built at The Vault Buenos Aires</p>
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
              <p className="font-semibold">AI agents need difficult SDK integrations:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Must manage Uniswap V3, V4, Aerodrome, and dozens of other protocols</li>
                <li>Each protocol requires separate SDK integration and maintenance</li>
                <li>New protocols constantly emerge, requiring constant updates</li>
                <li>Significant time spent on integration and maintenance</li>
              </ul>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="font-bold text-lg text-foreground">Human Traders Face:</p>
                <ul className="ml-6 mt-2 list-disc space-y-1 text-base text-foreground">
                  <li>High slippage on AMMs</li>
                  <li>Limited OTC options</li>
                  <li>Complex protocol integrations</li>
                </ul>
              </div>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="font-bold text-lg text-foreground">Cost of Maintenance:</p>
                <ul className="ml-6 mt-2 list-disc space-y-1 text-base text-foreground">
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
                <p className="font-semibold text-xl md:text-2xl">Intent-based OTC market onchain</p>
                <div className="mt-3 rounded-base border-4 border-foreground bg-main p-4">
                  <p className="font-bold font-mono text-base text-main-foreground">@BartMart.sol</p>
                </div>
              </div>

              <div className="space-y-3 text-base">
                <p>Agents/users provide:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Tokens and amounts they want to buy/sell</li>
                  <li>Simple intent declaration</li>
                </ul>
                <p className="font-semibold">The market fulfills orders when conditions are favorable</p>
              </div>

              <div className="mt-4 rounded-base border-4 border-foreground bg-secondary-background/80 p-4">
                <p className="mb-2 font-semibold text-base text-foreground">Market Dynamics</p>
                <ul className="ml-6 list-disc space-y-1 text-sm text-foreground">
                  <li>Liquidity providers can fulfill orders at favorable rates</li>
                  <li>Market makers earn spreads by matching orders</li>
                  <li>Gas efficient: Single contract vs multiple protocol calls</li>
                  <li>No AMM pools needed - direct peer-to-peer swaps</li>
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

export function ArchitectureSlide() {
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
            <CardTitle className="text-4xl md:text-5xl">Architecture & Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4 text-center">
                  <p className="mb-2 font-bold text-lg text-foreground">1. Agent Creates Order</p>
                  <p className="text-sm text-foreground">Agent calls createOrder() with intent</p>
                  <p className="mt-2 text-xs text-muted-foreground">Input tokens locked in contract</p>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4 text-center">
                  <p className="mb-2 font-bold text-lg text-foreground">2. Order Listed</p>
                  <p className="text-sm text-foreground">Order visible onchain</p>
                  <p className="mt-2 text-xs text-muted-foreground">Anyone can fulfill</p>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-4 text-center">
                  <p className="mb-2 font-bold text-lg text-foreground">3. Fulfiller Matches</p>
                  <p className="text-sm text-foreground">Fulfiller provides output tokens</p>
                  <p className="mt-2 text-xs text-muted-foreground">Atomic swap completes</p>
                </div>
              </div>
              <div className="mt-6 rounded-base border-4 border-foreground bg-main p-6">
                <p className="mb-3 font-bold text-lg text-main-foreground">Key Components</p>
                <div className="grid gap-3 md:grid-cols-2 text-sm text-main-foreground">
                  <div>
                    <p className="font-semibold">On-Chain:</p>
                    <ul className="ml-4 mt-1 list-disc space-y-1 bg-main">
                      <li>BartMart.sol contract</li>
                      <li>Order storage & matching</li>
                      <li>Token transfers</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Off-Chain:</p>
                    <ul className="ml-4 mt-1 list-disc space-y-1 bg-main">
                      <li>npm package (bartmart)</li>
                      <li>Indexer for order discovery</li>
                      <li>Frontend UI</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold">Single contract integration replaces dozens of SDK dependencies</p>
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
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Multiple SDKs</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">API + SDK</td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Protocol Updates
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Future-proof</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Constant updates</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">API changes</td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Verifiability
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Fully onchain</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Onchain</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Offchain routing</td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      Agent-Friendly
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Built for agents</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Human-focused</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">Human-focused</td>
                  </tr>
                  <tr className="border-4 border-foreground">
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 font-semibold text-foreground">
                      OTC Support
                    </td>
                    <td className="border-4 border-foreground bg-main p-3 text-main-foreground">Native</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">AMM only</td>
                    <td className="border-4 border-foreground bg-secondary-background/80 p-3 text-foreground">AMM only</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-base border-4 border-foreground bg-main p-4">
              <p className="font-bold text-lg text-main-foreground">Key Differentiator</p>
              <p className="mt-2 text-sm text-main-foreground">
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
            <CardTitle className="text-4xl md:text-5xl">Use Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                <p className="mb-2 font-bold text-xl text-foreground">Eigen Compute Agents</p>
                <p className="text-sm text-foreground">
                  Verifiable agents deployed in TEE environments need stable, auditable trading interfaces. BartMart
                  provides a single contract that never changes.
                </p>
              </div>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                <p className="mb-2 font-bold text-xl text-foreground">General AI Agents</p>
                <p className="text-sm text-foreground">
                  AI agents can use BartMart tools via the npm package without managing complex DeFi integrations.
                </p>
              </div>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                <p className="mb-2 font-bold text-xl text-foreground">Automated Trading Bots</p>
                <p className="text-sm text-foreground">
                  Trading bots can fulfill orders at favorable rates, earning spreads while providing liquidity
                  to the market.
                </p>
              </div>
              <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                <p className="mb-2 font-bold text-xl text-foreground">Human Traders</p>
                <p className="text-sm text-foreground">
                  OTC swaps without slippage. Perfect for large trades or specific token pairs not
                  available on AMMs.
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
                    <ul className="ml-6 list-disc space-y-1 text-sm text-foreground">
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

export function TractionSlide() {
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
            <CardTitle className="text-4xl md:text-5xl">Traction & Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg">
            <div className="mt-6 rounded-base border-4 border-foreground bg-main p-6">
              <p className="mb-3 font-bold text-lg text-main-foreground">Current Status</p>
              <ul className="ml-4 space-y-2 text-sm text-main-foreground bg-main">
                <li>✓ Smart contract deployed and verified on Base</li>
                <li>✓ npm package published</li>
                <li>✓ Frontend UI deployed to Eigen Compute TEE</li>
                <li>✓ AI SDK integration ready</li>
                <li>✓ Comprehensive test coverage</li>
              </ul>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-base border-4 border-foreground bg-secondary-background/80 p-6">
              <Image
                alt="Eigen Cloud"
                className="h-8 w-auto"
                height={32}
                src="/eigencloud-logo-blue.png"
                width={120}
              />
              <p className="font-bold text-foreground">
                Frontend UI deployed verifiably on Eigen Compute TEE for trustless execution
              </p>
            </div>
            <div className="mt-4 text-center">
              <p className="font-semibold text-lg">Ready for production use by AI agents and traders</p>
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
                  <p className="mb-2 font-bold text-xl text-foreground">Near Term</p>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
                    <li>Open source trading agent showcase</li>
                    <li>Eigen Compute integration examples</li>
                    <li>Enhanced documentation</li>
                  </ul>
                </div>
                <div className="rounded-base border-4 border-foreground bg-secondary-background/80 p-5">
                  <p className="mb-2 font-bold text-xl text-foreground">Future</p>
                  <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
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
                  <p className="mb-3 font-bold text-xl text-foreground">For Developers</p>
                  <ul className="ml-4 space-y-2 text-sm text-foreground">
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
                  <p className="mb-3 font-bold text-xl text-foreground">For Traders</p>
                  <ul className="ml-4 space-y-2 text-sm text-foreground">
                    <li>Create OTC orders</li>
                    <li>Fulfill orders for spreads</li>
                    <li>No slippage on fulfilled orders</li>
                    <li>Trade any token pair</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 rounded-base border-4 border-foreground bg-main p-6">
                <p className="mb-3 font-bold text-xl text-main-foreground">Partnership Opportunities</p>
                <p className="text-sm text-main-foreground">
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
        <div className="space-y-6">
          <h2 className="font-bold text-5xl text-foreground md:text-6xl lg:text-7xl">BartMart.sol</h2>
          <p className="font-semibold text-foreground text-xl md:text-2xl">On Base</p>
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Image alt="soko.eth" className="rounded-full" height={32} src="/soko_avatar.png" width={32} />
          <p className="font-bold text-card-foreground text-lg">Built by soko.eth</p>
        </div>
        <div className="mt-8 text-foreground text-lg">
          <p>OTC intent marketplace for humans and agents</p>
          <p className="mt-2 text-base opacity-75">to trade any tokens onchain</p>
        </div>
      </div>
    </Slide>
  );
}
