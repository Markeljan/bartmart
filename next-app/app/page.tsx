"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateOrderModal } from "@/components/create-order-modal";
import { Header } from "@/components/header";
import { OrderList } from "@/components/order-list";

type OrderStatus = "all" | "active" | "fulfilled" | "cancelled";

export default function Home() {
  const { isConnected } = useAccount();
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">Intent Market</h1>
            {isConnected && (
              <button
                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-sm text-white hover:bg-green-700"
                onClick={() => setIsCreateModalOpen(true)}
                type="button"
              >
                Create Order
              </button>
            )}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Exchange tokens by fulfilling orders. Users create orders to buy tokens, and you can fulfill them by
            providing the tokens they want.
          </p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {(["all", "active", "fulfilled", "cancelled"] as OrderStatus[]).map((status) => (
            <button
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium text-sm ${
                statusFilter === status
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
              key={status}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <OrderList statusFilter={statusFilter} />

        <CreateOrderModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </main>
    </div>
  );
}
