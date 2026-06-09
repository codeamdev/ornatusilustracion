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

function Textarea({
  id,
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  lang,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  lang?: "es" | "en";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
      >
        {label}
        {lang && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${lang === "en" ? "bg-blue-50 text-blue-500" : "bg-gallery-light text-gallery-gray"}`}>
            {lang.toUpperCase()}
          </span>
        )}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gallery-border bg-transparent p-3 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none rounded"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!product;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [descriptionEn, setDescriptionEn] = useState(product?.description_en || "");
  const [story, setStory] = useState(product?.story || "");
  const [storyEn, setStoryEn] = useState(product?.story_en || "");
  const [inspiration, setInspiration] = useState(product?.inspiration || "");
  const [inspirationEn, setInspirationEn] = useState(product?.inspiration_en || "");
  const [materials, setMaterials] = useState(product?.materials || "");
  const [materialsEn, setMaterialsEn] = useState(product?.materials_en || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "");
  const [year, setYear] = useState(product?.year?.toString() || "");
  const [edition, setEdition] = useState(product?.edition || "Pieza única — 1/1");
  const [editionEn, setEditionEn] = useState(product?.edition_en || "");
  const [creationTime, setCreationTime] = useState(product?.creationTime || "");
  const [creationTimeEn, setCreationTimeEn] = useState(product?.creationTime_en || "");
  const [uniqueTraits, setUniqueTraits] = useState<string[]>(product?.uniqueTraits || []);
  const [newTrait, setNewTrait] = useState("");
  const [uniqueTraitsEn, setUniqueTraitsEn] = useState<string[]>(product?.uniqueTraits_en || []);
  const [newTraitEn, setNewTraitEn] = useState("");
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
      description_en: descriptionEn,
      story,
      story_en: storyEn,
      inspiration,
      inspiration_en: inspirationEn,
      materials,
      materials_en: materialsEn,
      dimensions,
      year: year ? parseInt(year) : null,
      edition,
      edition_en: editionEn,
      creationTime,
      creationTime_en: creationTimeEn,
      uniqueTraits,
      uniqueTraits_en: uniqueTraitsEn,
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

        <Textarea
          id="description"
          label="Descripción"
          value={description}
          onChange={setDescription}
          placeholder="Descripción del producto..."
          lang="es"
        />
        <Textarea
          id="description_en"
          label="Description (English)"
          value={descriptionEn}
          onChange={setDescriptionEn}
          placeholder="Product description in English..."
          lang="en"
        />

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
            label="Materiales / Técnica — ES"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="Ej: Óleo sobre lienzo"
          />
          <Input
            id="materials_en"
            label="Materials / Technique — EN"
            value={materialsEn}
            onChange={(e) => setMaterialsEn(e.target.value)}
            placeholder="E.g.: Oil on canvas"
          />
        </div>

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
            Estas historias aparecen en la página del producto. Si se rellena la versión EN, se mostrará cuando el visitante tenga el idioma en inglés.
          </p>

          <div className="space-y-6">
            <Textarea
              id="story"
              label="La Historia — ¿Qué hay detrás de esta obra?"
              value={story}
              onChange={setStory}
              placeholder="Cuenta la historia emocional: ¿qué momento captura esta pieza? ¿qué sentías al crearla?"
              lang="es"
            />
            <Textarea
              id="story_en"
              label="The Story — What's behind this work?"
              value={storyEn}
              onChange={setStoryEn}
              placeholder="Tell the emotional story in English..."
              lang="en"
            />

            <Textarea
              id="inspiration"
              label="Inspiración — ¿De dónde nació la idea?"
              value={inspiration}
              onChange={setInspiration}
              rows={3}
              placeholder="Un paseo al atardecer, una conversación, un recuerdo de la infancia..."
              lang="es"
            />
            <Textarea
              id="inspiration_en"
              label="Inspiration — Where did the idea come from?"
              value={inspirationEn}
              onChange={setInspirationEn}
              rows={3}
              placeholder="A sunset walk, a conversation, a childhood memory..."
              lang="en"
            />
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
            Estos datos aparecen en el certificado de unicidad visible en la página del producto.
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                id="edition"
                label="Edición — ES"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="Pieza única — 1/1"
              />
              <Input
                id="edition_en"
                label="Edition — EN"
                value={editionEn}
                onChange={(e) => setEditionEn(e.target.value)}
                placeholder="Unique piece — 1/1"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                id="creationTime"
                label="Tiempo de creación — ES"
                value={creationTime}
                onChange={(e) => setCreationTime(e.target.value)}
                placeholder="Ej: 3 semanas"
              />
              <Input
                id="creationTime_en"
                label="Creation time — EN"
                value={creationTimeEn}
                onChange={(e) => setCreationTimeEn(e.target.value)}
                placeholder="E.g.: 3 weeks"
              />
            </div>

            {/* Unique traits ES */}
            <div>
              <label className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Rasgos únicos — ES
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-gallery-light text-gallery-gray">ES</span>
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
                  placeholder="Ej: Textura con arena de playa..."
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

            {/* Unique traits EN */}
            <div>
              <label className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Unique traits — EN
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-blue-50 text-blue-500">EN</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {uniqueTraitsEn.map((trait, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded"
                  >
                    {trait}
                    <button
                      type="button"
                      onClick={() =>
                        setUniqueTraitsEn(uniqueTraitsEn.filter((_, idx) => idx !== i))
                      }
                      className="text-blue-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTraitEn}
                  onChange={(e) => setNewTraitEn(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTraitEn.trim()) {
                      e.preventDefault();
                      setUniqueTraitsEn([...uniqueTraitsEn, newTraitEn.trim()]);
                      setNewTraitEn("");
                    }
                  }}
                  className="flex-1 border border-gallery-border bg-transparent p-2.5 text-sm text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 rounded"
                  placeholder="E.g.: Beach sand texture..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTraitEn.trim()) {
                      setUniqueTraitsEn([...uniqueTraitsEn, newTraitEn.trim()]);
                      setNewTraitEn("");
                    }
                  }}
                  className="px-4 py-2 border border-gallery-border text-gallery-black text-xs uppercase hover:border-gallery-black transition-colors rounded"
                >
                  Add
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
