import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { validateOrderData } from "@/lib/validations";
import { sendOrderEmail } from "@/lib/email";

export async function GET() {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    const shaped = orders.map((o) => ({
      id: o.id,
      customer: {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        message: o.customerMsg,
      },
      items: o.items,
      status: o.status,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({ success: true, data: shaped });
  } catch (err) {
    console.error("[orders GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateOrderData(body);
    if (errors.length) {
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName: body.customer.name,
        customerEmail: body.customer.email,
        customerPhone: body.customer.phone,
        customerMsg: body.customer.message ?? "",
        items: {
          create: body.items.map((item: {
            product?: string;
            name: string;
            image?: string;
            price?: number;
            quantity: number;
          }) => ({
            productId: item.product ?? null,
            name: item.name,
            image: item.image ?? "",
            price: item.price ?? null,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Descontar stock automáticamente si el producto tiene inventario
    for (const item of body.items) {
      if (item.product) {
        await prisma.product.updateMany({
          where: { id: item.product, stock: { gt: 0 } },
          data: { stock: { decrement: item.quantity } },
        });
        await prisma.stockMovement.create({
          data: {
            productId: item.product,
            delta: -item.quantity,
            reason: "sale",
            note: `Pedido ${order.id}`,
          },
        });
      }
    }

    sendOrderEmail({
      customer: body.customer,
      items: body.items,
    }).catch((err) => console.error("[orders] Failed to send email:", err));

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    console.error("[orders POST]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID y estado son requeridos" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    console.error("[orders PATCH]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
