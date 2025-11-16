import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getTokenMetadata } from "@/lib/db/tokens";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    if (!(address && isAddress(address))) {
      return NextResponse.json({ success: false, error: "Invalid token address" }, { status: 400 });
    }

    const token = await getTokenMetadata(address as `0x${string}`);
    if (!token) {
      return NextResponse.json({ success: false, error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: token,
    });
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch token metadata" }, { status: 500 });
  }
}
