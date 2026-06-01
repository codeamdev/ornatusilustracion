import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

// GET /api/inventory — lista todos los productos con datos de stock
export async function GET() {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        stock: true,
        showStock: true,
        active: true,
        category: { select: { name: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("[inventory GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
