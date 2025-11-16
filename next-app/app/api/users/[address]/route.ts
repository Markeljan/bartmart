import { type NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { getUserStats } from "@/lib/db/users";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    if (!(address && isAddress(address))) {
      return NextResponse.json({ success: false, error: "Invalid address" }, { status: 400 });
    }

    const stats = await getUserStats(address as `0x${string}`);
    if (!stats) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user stats" }, { status: 500 });
  }
}
