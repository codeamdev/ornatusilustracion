"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import type { IOrder } from "@/types";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  contacted: { label: "Contactado", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completado", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-600" },
};

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  function fetchOrders() {
    setLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOrders(res.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();

    if (data.success) {
      toast("Estado actualizado");
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: status as IOrder["status"] });
      }
    } else {
      toast("Error al actualizar", "error");
    }
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black mb-8">
        Pedidos
      </h1>

      {loading ? (
        <Spinner className="py-20" />
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded shadow-sm text-center">
          <p className="text-gallery-gray">No hay pedidos aún.</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gallery-border text-xs tracking-[0.1em] uppercase text-gallery-gray">
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4 hidden md:table-cell">Email</th>
                <th className="text-left p-4 hidden sm:table-cell">Items</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4 hidden md:table-cell">Fecha</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const st = statusLabels[order.status] || statusLabels.pending;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-gallery-border/50 hover:bg-gallery-light/50 transition-colors"
                  >
                    <td className="p-4 text-sm font-medium">
                      {order.customer.name}
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gallery-gray">
                      {order.customer.email}
                    </td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gallery-gray">
                      {order.items.length} producto(s)
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${st.color}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gallery-gray">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs text-gallery-gray hover:text-gallery-black transition-colors"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Detalle del Pedido"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Cliente
              </h3>
              <p className="text-sm">
                <strong>{selectedOrder.customer.name}</strong>
              </p>
              <p className="text-sm text-gallery-gray">
                {selectedOrder.customer.email}
              </p>
              <p className="text-sm text-gallery-gray">
                {selectedOrder.customer.phone}
              </p>
              {selectedOrder.customer.message && (
                <p className="text-sm text-gallery-gray mt-2 italic">
                  &ldquo;{selectedOrder.customer.message}&rdquo;
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Productos
              </h3>
              <ul className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm py-2 border-b border-gallery-border/50"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gallery-gray">
                      {item.price != null
                        ? `€${(item.price * item.quantity).toFixed(2)}`
                        : "Consultar"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Cambiar estado
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(selectedOrder.id, key)}
                    className={`px-3 py-1 text-xs border rounded transition-colors ${
                      selectedOrder.status === key
                        ? "bg-gallery-black text-white border-gallery-black"
                        : "border-gallery-border text-gallery-gray hover:border-gallery-black hover:text-gallery-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
