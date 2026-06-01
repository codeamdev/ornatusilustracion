import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

// PATCH /api/inventory/[id] — ajustar stock y visibilidad
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: { stock?: number; showStock?: boolean } = {};

    if (typeof body.showStock === "boolean") {
      updateData.showStock = body.showStock;
    }

    if (typeof body.stock === "number") {
      if (body.stock < 0) {
        return NextResponse.json(
          { success: false, error: "El stock no puede ser negativo" },
          { status: 400 }
        );
      }
      updateData.stock = body.stock;
    }

    if (typeof body.delta === "number") {
      const current = await prisma.product.findUnique({
        where: { id },
        select: { stock: true },
      });
      if (!current) {
        return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      }
      const newStock = current.stock + body.delta;
      if (newStock < 0) {
        return NextResponse.json(
          { success: false, error: "Stock insuficiente" },
          { status: 400 }
        );
      }
      updateData.stock = newStock;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, stock: true, showStock: true },
    });

    // Register movement if stock changed
    if (typeof body.delta === "number" && body.delta !== 0) {
      await prisma.stockMovement.create({
        data: {
          productId: id,
          delta: body.delta,
          reason: body.reason ?? (body.delta > 0 ? "restock" : "adjustment"),
          note: body.note ?? "",
        },
      });
    } else if (typeof body.stock === "number") {
      const prev = await prisma.stockMovement.findFirst({
        where: { productId: id },
        orderBy: { createdAt: "desc" },
      });
      const prevStock = prev ? 0 : 0; // We just compare to new value
      void prevStock;
      await prisma.stockMovement.create({
        data: {
          productId: id,
          delta: 0,
          reason: "adjustment",
          note: body.note ?? `Ajuste manual → ${body.stock}`,
        },
      });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    console.error("[inventory/:id PATCH]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// GET /api/inventory/[id] — historial de movimientos
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [product, movements] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        select: { id: true, name: true, stock: true, showStock: true },
      }),
      prisma.stockMovement.findMany({
        where: { productId: id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { product, movements } });
  } catch (err) {
    console.error("[inventory/:id GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
