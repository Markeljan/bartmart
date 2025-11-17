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
      <div className="z-10 w-full max-w-4xl">
        <Card className="border-4">
          <CardHeader>
            <CardTitle className="text-5xl md:text-6xl">The Problem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg md:text-xl">
            <div className="space-y-4">
              <p className="font-semibold">AI agents need difficult SDK integrations:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Must manage Uniswap V3, V4, Aerodrome, etc.</li>
                <li>Each protocol requires separate SDK integration</li>
                <li>New protocols constantly emerge</li>
              </ul>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-base border-4 border-foreground bg-secondary-background p-6">
              <Image alt="Eigen Cloud" className="h-8 w-auto" height={32} src="/eigencloud-logo-blue.png" width={120} />
              <p className="font-bold">
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
            <a
              className="mt-1 text-base text-primary hover:underline"
              href="https://www.npmjs.com/package/bartmart"
              rel="noopener noreferrer"
              target="_blank"
            >
              npmjs.com/package/bartmart
            </a>
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
