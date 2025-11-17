"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { OrderList } from "@/components/order-list";
import { Swap } from "@/components/swap";
import { Button } from "@/components/ui/button";

type Tab = "swap" | "orders";
type OrderStatus = "live" | "completed";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("swap");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("live");

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Background Image */}
      <div
        className="-z-10 fixed inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      />
      {/* Overlay for readability */}
      <div className="-z-10 fixed inset-0 bg-background/70 backdrop-blur-[1px] dark:bg-background/85" />

      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-2xl text-zinc-900 dark:text-zinc-50">Barter Market</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            OTC intent marketplace for humans and agents to trade any tokens onchain.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Button onClick={() => setActiveTab("swap")} variant={activeTab === "swap" ? "noShadow" : "default"}>
            Swap
          </Button>
          <Button onClick={() => setActiveTab("orders")} variant={activeTab === "orders" ? "noShadow" : "default"}>
            Orders
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "swap" && <Swap />}

        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(["live", "completed"] as OrderStatus[]).map((status) => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  variant={statusFilter === status ? "noShadow" : "default"}
                >
                  {status === "live" ? "Live Orders" : "Completed Orders"}
                </Button>
              ))}
            </div>
            <OrderList statusFilter={statusFilter} />
          </div>
        )}
      </main>
    </div>
  );
}
