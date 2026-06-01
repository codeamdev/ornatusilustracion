"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";

interface InventoryItem {
  id: string;
  name: string;
  slug: string;
  images: string[];
  stock: number;
  showStock: boolean;
  active: boolean;
  category: { name: string } | null;
}

type ModalMode = "adjust" | "set" | null;

export default function InventoryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  // Modal state
  const [modal, setModal] = useState<{ mode: ModalMode; item: InventoryItem | null }>({
    mode: null,
    item: null,
  });
  const [modalValue, setModalValue] = useState("");
  const [modalNote, setModalNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch {
      toast("Error cargando inventario", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleShowStock(item: InventoryItem) {
    setSaving(item.id);
    try {
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showStock: !item.showStock }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, showStock: !item.showStock } : i))
        );
        toast(`Visibilidad de stock ${!item.showStock ? "activada" : "desactivada"}`);
      } else {
        toast(data.error || "Error", "error");
      }
    } catch {
      toast("Error al actualizar", "error");
    } finally {
      setSaving(null);
    }
  }

  function openModal(mode: ModalMode, item: InventoryItem) {
    setModal({ mode, item });
    setModalValue(mode === "set" ? String(item.stock) : "");
    setModalNote("");
  }

  function closeModal() {
    setModal({ mode: null, item: null });
    setModalValue("");
    setModalNote("");
  }

  async function submitModal(e: React.FormEvent) {
    e.preventDefault();
    if (!modal.item || !modal.mode) return;
    const num = parseInt(modalValue);
    if (isNaN(num)) return;

    setSaving(modal.item.id);
    const payload =
      modal.mode === "set"
        ? { stock: num, note: modalNote }
        : { delta: num, note: modalNote, reason: num >= 0 ? "restock" : "adjustment" };

    try {
      const res = await fetch(`/api/inventory/${modal.item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === data.data.id ? { ...i, stock: data.data.stock } : i))
        );
        toast("Stock actualizado");
        closeModal();
      } else {
        toast(data.error || "Error", "error");
      }
    } catch {
      toast("Error al actualizar stock", "error");
    } finally {
      setSaving(null);
    }
  }

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.category?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = items.filter((i) => i.stock <= 2 && i.stock > 0).length;
  const outOfStock = items.filter((i) => i.stock === 0).length;
  const totalUnits = items.reduce((s, i) => s + i.stock, 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gallery-black mb-1">Inventario</h1>
        <p className="text-sm text-gallery-gray">
          Gestiona el stock y la visibilidad de disponibilidad en tienda.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gallery-light border border-gallery-border p-4">
          <p className="text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-1">
            Total unidades
          </p>
          <p className="text-2xl font-semibold text-gallery-black">{totalUnits}</p>
        </div>
        <div className={`border p-4 ${lowStock > 0 ? "bg-amber-50 border-amber-200" : "bg-gallery-light border-gallery-border"}`}>
          <p className="text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-1">
            Stock bajo (≤2)
          </p>
          <p className={`text-2xl font-semibold ${lowStock > 0 ? "text-amber-600" : "text-gallery-black"}`}>
            {lowStock}
          </p>
        </div>
        <div className={`border p-4 ${outOfStock > 0 ? "bg-red-50 border-red-200" : "bg-gallery-light border-gallery-border"}`}>
          <p className="text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-1">
            Sin stock
          </p>
          <p className={`text-2xl font-semibold ${outOfStock > 0 ? "text-red-600" : "text-gallery-black"}`}>
            {outOfStock}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gallery-border bg-white px-3 py-2 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors"
        />
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : (
        <div className="border border-gallery-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gallery-light border-b border-gallery-border">
              <tr>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal">
                  Producto
                </th>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal hidden md:table-cell">
                  Categoría
                </th>
                <th className="text-center px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal">
                  Stock
                </th>
                <th className="text-center px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal">
                  Mostrar en tienda
                </th>
                <th className="text-right px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-gallery-gray font-normal">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gallery-gray">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gallery-border/50 hover:bg-gallery-light/50 transition-colors"
                >
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-gallery-light flex-shrink-0 overflow-hidden">
                        {item.images[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gallery-gray/40">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-gallery-black truncate max-w-[180px]">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gallery-gray hidden md:table-cell">
                    {item.category?.name ?? "—"}
                  </td>

                  {/* Stock badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold ${
                        item.stock === 0
                          ? "bg-red-100 text-red-700"
                          : item.stock <= 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>

                  {/* Toggle show stock */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleShowStock(item)}
                      disabled={saving === item.id}
                      aria-label={`${item.showStock ? "Ocultar" : "Mostrar"} stock de ${item.name} en tienda`}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                        item.showStock ? "bg-gallery-black" : "bg-gallery-border"
                      } ${saving === item.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                          item.showStock ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal("adjust", item)}
                        className="text-[11px] tracking-[0.1em] uppercase text-gallery-gray hover:text-gallery-black border border-gallery-border px-2.5 py-1 transition-colors"
                      >
                        Ajustar
                      </button>
                      <button
                        onClick={() => openModal("set", item)}
                        className="text-[11px] tracking-[0.1em] uppercase text-gallery-gray hover:text-gallery-black border border-gallery-border px-2.5 py-1 transition-colors"
                      >
                        Fijar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.mode && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gallery-black/50 px-4">
          <div className="bg-white w-full max-w-sm p-6">
            <h2 className="font-semibold text-gallery-black mb-1">
              {modal.mode === "set" ? "Fijar stock" : "Ajustar stock"}
            </h2>
            <p className="text-sm text-gallery-gray mb-5">{modal.item.name}</p>

            <form onSubmit={submitModal} className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-1.5">
                  {modal.mode === "set"
                    ? "Nuevo stock total"
                    : "Cantidad (negativo para restar)"}
                </label>
                <input
                  type="number"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  min={modal.mode === "set" ? 0 : undefined}
                  required
                  autoFocus
                  className="w-full border border-gallery-border px-3 py-2 text-gallery-black focus:outline-none focus:border-gallery-black transition-colors"
                />
                {modal.mode === "adjust" && modalValue && !isNaN(parseInt(modalValue)) && (
                  <p className="text-xs text-gallery-gray mt-1">
                    Resultado: {modal.item.stock + parseInt(modalValue)} unidades
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-gallery-gray mb-1.5">
                  Nota (opcional)
                </label>
                <input
                  type="text"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="Ej: reposición semanal"
                  className="w-full border border-gallery-border px-3 py-2 text-gallery-black focus:outline-none focus:border-gallery-black transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gallery-border py-2 text-sm text-gallery-gray hover:text-gallery-black transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving === modal.item.id}
                  className="flex-1 bg-gallery-black text-white py-2 text-sm hover:bg-gallery-black/85 transition-colors disabled:opacity-50"
                >
                  {saving === modal.item.id ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
