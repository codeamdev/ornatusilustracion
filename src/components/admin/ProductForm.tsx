"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/context/ToastContext";
import type { IProduct, ICategory } from "@/types";

interface ProductFormProps {
  product?: IProduct;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!product;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [story, setStory] = useState(product?.story || "");
  const [inspiration, setInspiration] = useState(product?.inspiration || "");
  const [materials, setMaterials] = useState(product?.materials || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "");
  const [year, setYear] = useState(product?.year?.toString() || "");
  const [edition, setEdition] = useState(product?.edition || "Pieza única — 1/1");
  const [creationTime, setCreationTime] = useState(product?.creationTime || "");
  const [uniqueTraits, setUniqueTraits] = useState<string[]>(product?.uniqueTraits || []);
  const [newTrait, setNewTrait] = useState("");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [categoryId, setCategoryId] = useState(
    typeof product?.category === "object"
      ? (product.category as ICategory).id
      : product?.category || ""
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [active, setActive] = useState(product?.active ?? true);
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [showStock, setShowStock] = useState(product?.showStock ?? false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      name,
      description,
      story,
      inspiration,
      materials,
      dimensions,
      year: year ? parseInt(year) : null,
      edition,
      creationTime,
      uniqueTraits,
      price: price ? parseFloat(price) : null,
      category: categoryId,
      images,
      featured,
      active,
      stock: parseInt(stock) || 0,
      showStock,
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        toast(isEdit ? "Producto actualizado" : "Producto creado");
        router.push("/admin/products");
      } else {
        toast(data.error || "Error al guardar", "error");
      }
    } catch {
      toast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="bg-white p-8 rounded shadow-sm space-y-6">
        <Input
          id="name"
          label="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Mural Paisaje Urbano"
          required
        />

        <div>
          <label
            htmlFor="description"
            className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gallery-border bg-transparent p-3 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none rounded"
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            id="price"
            label="Precio (€) — opcional"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />

          <div>
            <label
              htmlFor="category"
              className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
            >
              Categoría
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full border border-gallery-border bg-transparent p-2.5 text-sm text-gallery-black focus:outline-none focus:border-gallery-black transition-colors duration-300 rounded"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            id="materials"
            label="Materiales / Técnica"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="Ej: Óleo sobre lienzo"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="dimensions"
              label="Dimensiones"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="Ej: 120 × 90 cm"
            />
            <Input
              id="year"
              label="Año"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-gallery-black"
            />
            <span className="text-sm text-gallery-black">Destacado</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-gallery-black"
            />
            <span className="text-sm text-gallery-black">Activo</span>
          </label>
        </div>
      </div>

      {/* Inventario */}
      <div className="bg-white p-8 rounded shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-medium text-gallery-black mb-1">Inventario</h3>
          <p className="text-xs text-gallery-gray mb-5">
            Controla el stock y decide si mostrar la disponibilidad en tienda.
          </p>

          <div className="flex items-end gap-6">
            <div className="w-40">
              <Input
                id="stock"
                label="Stock inicial"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pb-1">
              <button
                type="button"
                role="switch"
                aria-checked={showStock}
                onClick={() => setShowStock(!showStock)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  showStock ? "bg-gallery-black" : "bg-gallery-border"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
                    showStock ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gallery-black">
                Mostrar disponibilidad en tienda
              </span>
            </label>
          </div>

          {showStock && (
            <p className="text-xs text-gallery-gray mt-3 bg-gallery-light px-3 py-2 rounded">
              Los visitantes verán el stock disponible en la tarjeta y en la página del producto.
              Rojo = sin stock, Ámbar = stock bajo (≤2), Verde = disponible.
            </p>
          )}
        </div>
      </div>

      {/* Storytelling section */}
      <div className="bg-white p-8 rounded shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gallery-black mb-1">
            Narrativa emocional
          </h3>
          <p className="text-xs text-gallery-gray mb-5">
            Estas historias aparecen en la página del producto para conectar
            emocionalmente con el visitante.
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="story"
                className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
              >
                La Historia — ¿Qué hay detrás de esta obra?
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={4}
                className="w-full border border-gallery-border bg-transparent p-3 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none rounded"
                placeholder="Cuenta la historia emocional: ¿qué momento captura esta pieza? ¿qué sentías al crearla?"
              />
            </div>

            <div>
              <label
                htmlFor="inspiration"
                className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
              >
                Inspiración — ¿De dónde nació la idea?
              </label>
              <textarea
                id="inspiration"
                value={inspiration}
                onChange={(e) => setInspiration(e.target.value)}
                rows={3}
                className="w-full border border-gallery-border bg-transparent p-3 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none rounded"
                placeholder="Un paseo al atardecer, una conversación, un recuerdo de la infancia..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Uniqueness section */}
      <div className="bg-white p-8 rounded shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gallery-black mb-1">
            Unicidad de la pieza
          </h3>
          <p className="text-xs text-gallery-gray mb-5">
            Estos datos aparecen en el certificado de unicidad visible en la
            página del producto.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                id="edition"
                label="Edición"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="Pieza única — 1/1"
              />
              <Input
                id="creationTime"
                label="Tiempo de creación"
                value={creationTime}
                onChange={(e) => setCreationTime(e.target.value)}
                placeholder="Ej: 3 semanas"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Rasgos únicos — ¿Qué hace irrepetible esta pieza?
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {uniqueTraits.map((trait, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-gallery-light text-gallery-black text-xs px-3 py-1.5 rounded"
                  >
                    {trait}
                    <button
                      type="button"
                      onClick={() =>
                        setUniqueTraits(uniqueTraits.filter((_, idx) => idx !== i))
                      }
                      className="text-gallery-gray hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTrait.trim()) {
                      e.preventDefault();
                      setUniqueTraits([...uniqueTraits, newTrait.trim()]);
                      setNewTrait("");
                    }
                  }}
                  className="flex-1 border border-gallery-border bg-transparent p-2.5 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 rounded"
                  placeholder="Ej: Textura con arena de playa, Pigmentos naturales..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTrait.trim()) {
                      setUniqueTraits([...uniqueTraits, newTrait.trim()]);
                      setNewTrait("");
                    }
                  }}
                  className="px-4 py-2 border border-gallery-border text-gallery-black text-xs uppercase hover:border-gallery-black transition-colors rounded"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-sm">
        <ImageUpload images={images} onChange={setImages} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {isEdit ? "Guardar Cambios" : "Crear Producto"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
