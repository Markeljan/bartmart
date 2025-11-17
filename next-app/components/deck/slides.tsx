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
        <h1 className="font-bold text-7xl text-foreground md:text-8xl lg:text-9xl">BartMart</h1>
        <p className="font-semibold text-2xl text-foreground md:text-3xl lg:text-4xl">
          OTC intent marketplace for humans and agents
        </p>
        <div className="mt-8 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-card-foreground text-lg">Built by soko.eth</p>
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
            <div className="mt-8 rounded-base border-4 border-foreground bg-secondary-background p-6">
              <p className="font-bold">
                Especially problematic for TEE environments like Eigen Compute where frequent updates hurt trust and
                verifiability
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
              <p className="font-semibold text-2xl">Intent-based OTC market onchain</p>
              <div className="rounded-base border-4 border-foreground bg-main p-6">
                <p className="font-bold font-mono text-lg text-main-foreground">@BartMart.sol</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <p>Agents/users provide:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Tokens and amounts they want to buy/sell</li>
                <li>Simple intent declaration</li>
              </ul>
              <p className="mt-4 font-semibold">The market fulfills orders when conditions are favorable</p>
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
              <p className="font-bold text-2xl">Agents deployed to TEEs with one simple trading tool</p>
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
        <div className="mt-8 rounded-base border-4 border-foreground bg-card px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
