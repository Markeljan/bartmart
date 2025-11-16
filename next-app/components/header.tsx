import { ConnectButton } from "@/components/connect-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-zinc-200 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-zinc-800 dark:bg-black/95 dark:supports-backdrop-filter:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="font-semibold text-xl text-zinc-900 dark:text-zinc-50">BartMart</h1>
        </div>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
