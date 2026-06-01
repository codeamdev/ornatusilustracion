"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Spinner from "@/components/ui/Spinner";
import type { IProduct } from "@/types";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setProduct(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="py-20" />;
  if (!product) return <p className="text-gallery-gray">Producto no encontrado.</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black mb-8">
        Editar: {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
