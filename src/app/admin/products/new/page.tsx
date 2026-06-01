"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black mb-8">
        Nuevo Producto
      </h1>
      <ProductForm />
    </div>
  );
}
