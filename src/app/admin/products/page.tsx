"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import type { IProduct, ICategory } from "@/types";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchProducts() {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProducts(res.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast("Producto eliminado");
      fetchProducts();
    } else {
      toast(data.error || "Error", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black">
          Productos
        </h1>
        <Link href="/admin/products/new">
          <Button size="sm">+ Nuevo</Button>
        </Link>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : products.length === 0 ? (
        <div className="bg-white p-10 rounded shadow-sm text-center">
          <p className="text-gallery-gray mb-4">No hay productos aún.</p>
          <Link href="/admin/products/new">
            <Button size="sm">Crear primer producto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gallery-border text-xs tracking-[0.1em] uppercase text-gallery-gray">
                <th className="text-left p-4">Imagen</th>
                <th className="text-left p-4">Nombre</th>
                <th className="text-left p-4 hidden md:table-cell">Categoría</th>
                <th className="text-left p-4 hidden md:table-cell">Precio</th>
                <th className="text-left p-4 hidden sm:table-cell">Estado</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gallery-border/50 hover:bg-gallery-light/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="relative w-12 h-12 bg-gallery-light">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">{product.name}</span>
                    {product.featured && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-gallery-gray">
                    {typeof product.category === "object"
                      ? (product.category as ICategory).name
                      : "—"}
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm">
                    {product.price != null
                      ? `€${product.price.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-gallery-gray hover:text-gallery-black transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-xs text-gallery-gray hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
