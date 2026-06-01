"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  contacted: "Contactado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(Math.round(n));
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

function Trend({ current, prev }: { current: number; prev: number }) {
  if (prev === 0 && current === 0) return null;
  if (prev === 0) return <span className="text-green-600 text-xs ml-1">nuevo</span>;
  const pct = Math.round(((current - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className={`text-xs ml-1 ${up ? "text-green-600" : "text-red-500"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

interface DashboardData {
  summary: {
    totalRevenue: number;
    monthRevenue: number;
    lastMonthRevenue: number;
    avgTicket: number;
    ordersThisMonth: number;
    ordersLastMonth: number;
    totalOrders: number;
    products: number;
    categories: number;
  };
  byStatus: Record<string, number>;
  recentOrders: {
    id: string;
    customerName: string;
    status: string;
    total: number;
    itemCount: number;
    createdAt: string;
  }[];
  topSoldProducts: { id: string; name: string; images: string[]; price: number | null; unitsSold: number }[];
  topByViews: { id: string; name: string; views: number; images: string[] }[];
  stockAlerts: { id: string; name: string; stock: number; images: string[] }[];
  salesByCategory: { name: string; units: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="p-8 text-gallery-gray text-sm animate-pulse">Cargando dashboard…</div>
    );
  }

  if (!data) {
    return <div className="p-8 text-red-500 text-sm">Error al cargar los datos.</div>;
  }

  const { summary, byStatus, recentOrders, topSoldProducts, topByViews, stockAlerts, salesByCategory } = data;
  const maxCatUnits = Math.max(...salesByCategory.map((c) => c.units), 1);

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black">
          Dashboard
        </h1>
        <button
          onClick={load}
          className="text-xs tracking-widest uppercase text-gallery-gray hover:text-gallery-black border border-gallery-border px-3 py-1.5 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos totales"
          value={`$${fmt(summary.totalRevenue)}`}
          sub="pedidos completados"
        />
        <KpiCard
          label="Este mes"
          value={`$${fmt(summary.monthRevenue)}`}
          trend={<Trend current={summary.monthRevenue} prev={summary.lastMonthRevenue} />}
        />
        <KpiCard
          label="Pedidos este mes"
          value={String(summary.ordersThisMonth)}
          trend={<Trend current={summary.ordersThisMonth} prev={summary.ordersLastMonth} />}
        />
        <KpiCard
          label="Ticket promedio"
          value={`$${fmt(summary.avgTicket)}`}
          sub={`${summary.totalOrders} pedidos en total`}
        />
      </div>

      {/* ── Status + Category ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white border border-gallery-border p-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
            Pedidos por estado
          </h2>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[status]}`}>
                  {STATUS_LABEL[status]}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gallery-light rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gallery-black/30"
                      style={{ width: summary.totalOrders ? `${(count / summary.totalOrders) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gallery-black w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by category */}
        <div className="bg-white border border-gallery-border p-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
            Ventas por categoría
          </h2>
          {salesByCategory.length === 0 ? (
            <p className="text-sm text-gallery-gray">Sin datos aún.</p>
          ) : (
            <div className="space-y-3">
              {salesByCategory.map(({ name, units }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gallery-black w-28 truncate">{name}</span>
                  <div className="flex-1 bg-gallery-light rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gallery-accent"
                      style={{ width: `${(units / maxCatUnits) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gallery-gray w-12 text-right">{units} uds.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white border border-gallery-border">
        <div className="px-5 py-4 border-b border-gallery-border flex items-center justify-between">
          <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray">Últimos pedidos</h2>
          <Link href="/admin/orders" className="text-xs text-gallery-gray hover:text-gallery-black underline underline-offset-2">
            Ver todos
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gallery-gray">No hay pedidos aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gallery-light">
              <tr>
                {["Cliente", "Items", "Total", "Estado", "Fecha"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-gallery-border/40 hover:bg-gallery-light/40">
                  <td className="px-4 py-3 font-medium text-gallery-black">{o.customerName}</td>
                  <td className="px-4 py-3 text-gallery-gray">{o.itemCount}</td>
                  <td className="px-4 py-3 text-gallery-black">${fmt(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gallery-gray">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Products row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top sold */}
        <ProductList
          title="Más vendidos"
          items={topSoldProducts.map((p) => ({
            id: p.id,
            name: p.name,
            images: p.images,
            badge: `${p.unitsSold} uds.`,
          }))}
          emptyMsg="Sin ventas registradas."
        />

        {/* Top viewed */}
        <ProductList
          title="Más vistos"
          items={topByViews.map((p) => ({
            id: p.id,
            name: p.name,
            images: p.images,
            badge: `${p.views} visitas`,
          }))}
          emptyMsg="Sin visitas registradas aún."
        />

        {/* Stock alerts */}
        <div className="bg-white border border-gallery-border">
          <div className="px-4 py-3 border-b border-gallery-border flex items-center justify-between">
            <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray">Alertas de stock</h2>
            <Link href="/admin/inventory" className="text-xs text-gallery-gray hover:text-gallery-black underline underline-offset-2">
              Inventario
            </Link>
          </div>
          {stockAlerts.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gallery-gray">Todo el stock está en orden.</p>
          ) : (
            <ul className="divide-y divide-gallery-border/40">
              {stockAlerts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="relative w-8 h-8 bg-gallery-light flex-shrink-0 overflow-hidden">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="32px" />
                    )}
                  </div>
                  <span className="flex-1 text-sm text-gallery-black truncate">{p.name}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.stock === 0 ? "Sin stock" : `${p.stock} uds.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="bg-white border border-gallery-border p-5">
        <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="px-4 py-2 bg-gallery-accent text-white text-xs tracking-[0.15em] uppercase hover:bg-gallery-accent/85 transition-colors">
            + Nuevo Producto
          </Link>
          <Link href="/admin/orders" className="px-4 py-2 border border-gallery-border text-gallery-black text-xs tracking-[0.15em] uppercase hover:border-gallery-black transition-colors">
            Ver Pedidos
          </Link>
          <Link href="/admin/inventory" className="px-4 py-2 border border-gallery-border text-gallery-black text-xs tracking-[0.15em] uppercase hover:border-gallery-black transition-colors">
            Inventario
          </Link>
          <Link href="/admin/config" className="px-4 py-2 border border-gallery-border text-gallery-black text-xs tracking-[0.15em] uppercase hover:border-gallery-black transition-colors">
            Configuración
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gallery-border p-5">
      <p className="text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-2">{label}</p>
      <p className="text-2xl font-light text-gallery-black">
        {value}
        {trend}
      </p>
      {sub && <p className="text-xs text-gallery-gray mt-1">{sub}</p>}
    </div>
  );
}

function ProductList({
  title,
  items,
  emptyMsg,
}: {
  title: string;
  items: { id: string; name: string; images: string[]; badge: string }[];
  emptyMsg: string;
}) {
  return (
    <div className="bg-white border border-gallery-border">
      <div className="px-4 py-3 border-b border-gallery-border">
        <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray">{title}</h2>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gallery-gray">{emptyMsg}</p>
      ) : (
        <ul className="divide-y divide-gallery-border/40">
          {items.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xs text-gallery-gray w-4">{i + 1}</span>
              <div className="relative w-8 h-8 bg-gallery-light flex-shrink-0 overflow-hidden">
                {p.images[0] && (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="32px" />
                )}
              </div>
              <span className="flex-1 text-sm text-gallery-black truncate">{p.name}</span>
              <span className="text-xs text-gallery-gray">{p.badge}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
