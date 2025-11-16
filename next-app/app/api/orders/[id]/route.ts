import { type NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/db/orders";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}
