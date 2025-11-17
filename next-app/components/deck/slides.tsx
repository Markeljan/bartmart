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
        <h1 className="font-bold text-7xl text-foreground md:text-8xl lg:text-9xl">
          BartMart
        </h1>
        <p className="font-semibold text-2xl text-foreground md:text-3xl lg:text-4xl">
          OTC intent marketplace for humans and agents
        </p>
        <div className="mt-8 flex items-center gap-3 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Image
            src="/soko_avatar.png"
            alt="soko.eth"
            width={32}
            height={32}
            className="rounded-full"
          />
          <p className="font-bold text-card-foreground text-lg">
            Built by soko.eth
          </p>
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
              <p className="font-semibold">
                AI agents need difficult SDK integrations:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Must manage Uniswap V3, V4, Aerodrome, etc.</li>
                <li>Each protocol requires separate SDK integration</li>
                <li>New protocols constantly emerge</li>
              </ul>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-base border-4 border-foreground bg-secondary-background p-6">
              <Image
                src="/eigencloud-logo-blue.png"
                alt="Eigen Cloud"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <p className="font-bold">
                Especially problematic for TEE environments like Eigen Compute
                where frequent updates hurt trust and verifiability
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function SolutionSlide() {
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
            <CardTitle className="text-5xl md:text-6xl">The Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg md:text-xl">
            <div className="space-y-4">
              <p className="font-semibold text-2xl">
                Intent-based OTC market onchain
              </p>
              <div className="rounded-base border-4 border-foreground bg-main p-6">
                <p className="font-bold font-mono text-lg text-main-foreground">
                  @BartMart.sol
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <p>Agents/users provide:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Tokens and amounts they want to buy/sell</li>
                <li>Simple intent declaration</li>
              </ul>
              <p className="mt-4 font-semibold">
                The market fulfills orders when conditions are favorable
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function ResultSlide() {
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
            <CardTitle className="text-5xl md:text-6xl">The Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg md:text-xl">
            <div className="space-y-6">
              <p className="font-bold text-2xl">
                Agents deployed to TEEs with one simple trading tool
              </p>
              <div className="rounded-base border-4 border-foreground bg-main p-6">
                <p className="font-bold font-mono text-lg text-main-foreground">
                  Single contract integration: BartMart.sol
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <p className="font-semibold">Benefits:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>No need to manage multiple protocol SDKs</li>
                  <li>Stable, verifiable agent implementations</li>
                  <li>Works with any token onchain</li>
                  <li>Trust through onchain verifiability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

export function ContractFlowSlide() {
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
            <CardTitle className="text-4xl md:text-5xl">
              Contract Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm md:text-base">
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-semibold text-lg">Order Structure</p>
                <div className="overflow-hidden rounded-lg border-2 border-foreground">
                  <SyntaxHighlighter
                    language="solidity"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      fontSize: "0.875rem",
                      borderRadius: "0.5rem",
                    }}
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
                      language="solidity"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {createOrderSnippet}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold">2. Fulfill Order</p>
                  <div className="overflow-hidden rounded-lg border-2 border-foreground">
                    <SyntaxHighlighter
                      language="solidity"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {fulfilOrderSnippet}
                    </SyntaxHighlighter>
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
  const npmInstall = `npm i bartmart`;

  const importExample = `import { createOrderTool } from "bartmart"`;

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
                <p className="font-bold text-2xl">1. Agent Tools SDK</p>
                <p className="font-semibold">
                  Build OpenAI SDK & Vercel AI SDK compatible agent tools
                </p>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-lg border-2 border-foreground bg-card">
                    <SyntaxHighlighter
                      language="bash"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {npmInstall}
                    </SyntaxHighlighter>
                  </div>
                  <div className="overflow-hidden rounded-lg border-2 border-foreground bg-card">
                    <SyntaxHighlighter
                      language="typescript"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {importExample}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="font-bold text-2xl">
                  2. Open Source Trading Agent
                </p>
                <p className="font-semibold">
                  Showcase an open source X trading agent with BartMart across
                  various DEX platforms
                </p>
                <div className="mt-4 flex items-center gap-4 rounded-base border-4 border-foreground bg-main p-6">
                  <Image
                    src="/eigencloud-logo-blue.png"
                    alt="Eigen Cloud"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <p className="font-bold text-main-foreground">
                    Deployed verifiably with Eigen Compute
                  </p>
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
          <h2 className="font-bold text-5xl text-foreground md:text-6xl lg:text-7xl">
            BartMart.sol
          </h2>
          <p className="font-semibold text-foreground text-xl md:text-2xl">
            On Base
          </p>
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Image
            src="/soko_avatar.png"
            alt="soko.eth"
            width={32}
            height={32}
            className="rounded-full"
          />
          <p className="font-bold text-card-foreground text-lg">
            Built by soko.eth
          </p>
        </div>
        <div className="mt-8 text-foreground text-lg">
          <p>OTC intent marketplace for humans and agents</p>
          <p className="mt-2 text-base opacity-75">
            to trade any tokens onchain
          </p>
        </div>
      </div>
    </Slide>
  );
}
