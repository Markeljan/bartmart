import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getTransaction, saveTransaction } from "@/lib/db/transactions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hash = searchParams.get("hash");

    if (hash) {
      const tx = await getTransaction(hash);
      if (!tx) {
        return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: tx,
      });
    }

    // If no hash, return empty (should use /transactions/[address] for user transactions)
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, from, to, type, orderId, tokenAddress, amount, blockNumber, timestamp, status } = body;

    if (!(hash && from && isAddress(from))) {
      return NextResponse.json({ success: false, error: "Missing required fields: hash, from" }, { status: 400 });
    }

    const success = await saveTransaction({
      hash,
      from: from as `0x${string}`,
      to: to && isAddress(to) ? (to as `0x${string}`) : undefined,
      type: type || "create",
      orderId,
      tokenAddress: tokenAddress && isAddress(tokenAddress) ? (tokenAddress as `0x${string}`) : undefined,
      amount,
      blockNumber: blockNumber ? Number.parseInt(blockNumber, 10) : undefined,
      timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
      status: status || "confirmed",
    });

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to save transaction" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Transaction saved",
    });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return NextResponse.json({ success: false, error: "Failed to save transaction" }, { status: 500 });
  }
}
