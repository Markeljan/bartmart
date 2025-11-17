"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateOrderModal } from "@/components/create-order-modal";
import { Header } from "@/components/header";
import { OrderList } from "@/components/order-list";
import { Button } from "@/components/ui/button";

type OrderStatus = "live" | "completed";

export default function Home() {
  const { isConnected } = useAccount();
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("live");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-no-repeat"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-background/70 backdrop-blur-[1px] dark:bg-background/85" />

      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">Barter Market</h1>
            {isConnected && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Order
              </Button>
            )}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Exchange tokens by fulfilling orders. Users create orders to buy tokens, and you can fulfill them by
            providing the tokens they want.
          </p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(["live", "completed"] as OrderStatus[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "live" ? "Live Orders" : "Completed Orders"}
            </Button>
          ))}
        </div>

        <OrderList statusFilter={statusFilter} />

        <CreateOrderModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  );
}
