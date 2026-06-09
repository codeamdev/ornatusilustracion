"use client";

import { useEffect, useState, useCallback } from "react";
import FadeIn from "@/components/shop/FadeIn";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryFilter from "@/components/shop/CategoryFilter";
import SearchBar from "@/components/shop/SearchBar";
import Spinner from "@/components/ui/Spinner";
import { useLocale } from "@/context/LocaleContext";
import type { IProduct, ICategory } from "@/types";

export default function GalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchProducts, search]);

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  const count = products.length;
  const pieceLabel = count === 1 ? t("gallery.piece") : t("gallery.pieces");

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeIn>
        <p className="text-xs tracking-[0.3em] uppercase text-gallery-gray mb-3">
          {t("gallery.collection")}
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-gallery-black mb-4">
          {selectedCategoryName || t("gallery.galleryTitle")}
        </h1>
        <p className="text-sm text-gallery-gray mb-10 max-w-lg">
          {t("gallery.subtitle")}
        </p>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={100}>
        <div className="flex flex-col sm:flex-row gap-6 sm:items-end justify-between mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            allLabel={t("gallery.all")}
          />
          <div className="w-full sm:w-64">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t("gallery.search")}
            />
          </div>
        </div>
      </FadeIn>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-gallery-gray mb-8">
          {count} {pieceLabel}
          {selectedCategoryName ? ` ${t("gallery.inCategory")} ${selectedCategoryName}` : ""}
          {search ? ` ${t("gallery.resultsFor")} "${search}"` : ""}
        </p>
      )}

      {loading ? <Spinner className="py-20" /> : <ProductGrid products={products} />}
    </section>
  );
}
