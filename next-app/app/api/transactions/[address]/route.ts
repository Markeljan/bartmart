import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getUserTransactions } from "@/lib/db/transactions";

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    if (!(address && isAddress(address))) {
      return NextResponse.json({ success: false, error: "Invalid address" }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Number.parseInt(limitParam, 10), 1000) : 100;

    const transactions = await getUserTransactions(address as `0x${string}`, limit);

    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 });
  }
}
