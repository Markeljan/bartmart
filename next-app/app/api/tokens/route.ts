import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getAllTokens, saveTokenMetadata } from "@/lib/db/tokens";

export async function GET() {
  try {
    const tokens = await getAllTokens();
    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length,
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tokens" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, symbol, name, decimals, logoURI } = body;

    if (!(address && isAddress(address))) {
      return NextResponse.json({ success: false, error: "Invalid token address" }, { status: 400 });
    }

    if (!(symbol && name) || decimals === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: symbol, name, decimals" },
        { status: 400 }
      );
    }

    const success = await saveTokenMetadata(address as `0x${string}`, {
      symbol,
      name,
      decimals: Number.parseInt(decimals, 10),
      logoURI,
    });

    if (!success) {
      return NextResponse.json({ success: false, error: "Failed to save token metadata" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Token metadata saved",
    });
  } catch (error) {
    console.error("Error saving token metadata:", error);
    return NextResponse.json({ success: false, error: "Failed to save token metadata" }, { status: 500 });
  }
}
