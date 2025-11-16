import { type NextRequest, NextResponse } from "next/server";
import { indexNewBlocks } from "@/lib/indexer/indexer";
import { syncAllOrders } from "@/lib/indexer/sync";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action = "index" } = body;

    if (action === "sync") {
      // Full sync of all orders
      const synced = await syncAllOrders();
      return NextResponse.json({
        success: true,
        message: `Synced ${synced} orders`,
        synced,
      });
    }
    // Index new blocks
    const processed = await indexNewBlocks();
    return NextResponse.json({
      success: true,
      message: `Processed ${processed} events`,
      processed,
    });
  } catch (error) {
    console.error("Error running indexer:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({
    success: true,
    message: "Indexer endpoint. Use POST to trigger indexing.",
    endpoints: {
      "POST /api/indexer": "Index new blocks since last run",
      "POST /api/indexer with { action: 'sync' }": "Sync all orders from contract",
    },
  });
}
