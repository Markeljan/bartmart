import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getOrders } from "@/lib/db/orders";
import type { OrderFilters } from "@/lib/db/types";

function parseStatusFilter(status: string | null): OrderFilters["status"] | undefined {
  if (status && ["live", "completed"].includes(status)) {
    return status as OrderFilters["status"];
  }
  return;
}

function parseAddressFilter(address: string | null): `0x${string}` | undefined {
  if (address && isAddress(address)) {
    return address as `0x${string}`;
  }
  return;
}

function parseNumericFilter(value: string | null, min: number, max?: number): number | undefined {
  if (!value) {
    return;
  }
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num) || num < min) {
    return;
  }
  if (max !== undefined && num > max) {
    return Math.min(num, max);
  }
  return num;
}

function buildFilters(searchParams: URLSearchParams): OrderFilters {
  const filters: OrderFilters = {};

  const status = parseStatusFilter(searchParams.get("status"));
  if (status) {
    filters.status = status;
  }

  const creator = parseAddressFilter(searchParams.get("creator"));
  if (creator) {
    filters.creator = creator;
  }

  const inputToken = parseAddressFilter(searchParams.get("inputToken"));
  if (inputToken) {
    filters.inputToken = inputToken;
  }

  const outputToken = parseAddressFilter(searchParams.get("outputToken"));
  if (outputToken) {
    filters.outputToken = outputToken;
  }

  const limit = parseNumericFilter(searchParams.get("limit"), 1, 1000);
  if (limit) {
    filters.limit = limit;
  }

  const offset = parseNumericFilter(searchParams.get("offset"), 0);
  if (offset !== undefined) {
    filters.offset = offset;
  }

  return filters;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = buildFilters(searchParams);
    const orders = await getOrders(filters);

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
