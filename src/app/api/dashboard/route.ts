import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      orders,
      products,
      categories,
      stockAlerts,
      topByViews,
      salesMovements,
    ] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.findMany({
        where: { active: true, stock: { lte: 2 } },
        select: { id: true, name: true, stock: true, images: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.product.findMany({
        where: { active: true, views: { gt: 0 } },
        select: { id: true, name: true, views: true, images: true },
        orderBy: { views: "desc" },
        take: 5,
      }),
      prisma.stockMovement.findMany({
        where: { reason: "sale" },
        select: { productId: true, delta: true, createdAt: true },
      }),
    ]);

    // ── Revenue ──────────────────────────────────────────────────────────
    function calcTotal(items: { price: number | null; quantity: number }[]) {
      return items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0);
    }

    const completedOrders = orders.filter((o) => o.status === "completed");
    const totalRevenue = completedOrders.reduce((s, o) => s + calcTotal(o.items), 0);
    const monthRevenue = completedOrders
      .filter((o) => o.createdAt >= startOfMonth)
      .reduce((s, o) => s + calcTotal(o.items), 0);
    const lastMonthRevenue = completedOrders
      .filter((o) => o.createdAt >= startOfLastMonth && o.createdAt < startOfMonth)
      .reduce((s, o) => s + calcTotal(o.items), 0);
    const avgTicket =
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // ── Orders by status ─────────────────────────────────────────────────
    const byStatus = { pending: 0, contacted: 0, completed: 0, cancelled: 0 };
    for (const o of orders) {
      if (o.status in byStatus) byStatus[o.status as keyof typeof byStatus]++;
    }

    const ordersThisMonth = orders.filter((o) => o.createdAt >= startOfMonth).length;
    const ordersLastMonth = orders.filter(
      (o) => o.createdAt >= startOfLastMonth && o.createdAt < startOfMonth
    ).length;

    // ── Recent orders ─────────────────────────────────────────────────────
    const recentOrders = orders.slice(0, 10).map((o) => ({
      id: o.id,
      customerName: o.customerName,
      status: o.status,
      total: calcTotal(o.items),
      itemCount: o.items.reduce((s, i) => s + i.quantity, 0),
      createdAt: o.createdAt,
    }));

    // ── Top products by units sold ────────────────────────────────────────
    const soldMap: Record<string, number> = {};
    for (const m of salesMovements) {
      soldMap[m.productId] = (soldMap[m.productId] ?? 0) + Math.abs(m.delta);
    }
    const productIds = Object.keys(soldMap).sort((a, b) => soldMap[b] - soldMap[a]).slice(0, 5);
    const topSoldProducts =
      productIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, images: true, price: true },
          }).then((ps) =>
            ps
              .map((p) => ({ ...p, unitsSold: soldMap[p.id] ?? 0 }))
              .sort((a, b) => b.unitsSold - a.unitsSold)
          )
        : [];

    // ── Sales by category ─────────────────────────────────────────────────
    const catSalesRaw = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { productId: { not: null } },
    });

    const prodCatMap = await prisma.product.findMany({
      where: { id: { in: catSalesRaw.map((r) => r.productId!).filter(Boolean) } },
      select: { id: true, category: { select: { name: true } } },
    });

    const catTotals: Record<string, number> = {};
    for (const row of catSalesRaw) {
      const cat = prodCatMap.find((p) => p.id === row.productId)?.category?.name ?? "Sin categoría";
      catTotals[cat] = (catTotals[cat] ?? 0) + (row._sum.quantity ?? 0);
    }
    const salesByCategory = Object.entries(catTotals)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          monthRevenue,
          lastMonthRevenue,
          avgTicket,
          ordersThisMonth,
          ordersLastMonth,
          totalOrders: orders.length,
          products,
          categories,
        },
        byStatus,
        recentOrders,
        topSoldProducts,
        topByViews,
        stockAlerts,
        salesByCategory,
      },
    });
  } catch (err) {
    console.error("[dashboard GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
