"use client";

import Image from "next/image";
import Link from "next/link";
import type { IProduct, ICategory } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { locale, t } = useLocale();

  const cat = typeof product.category === "object" ? (product.category as ICategory) : null;
  const categoryName = cat
    ? (locale === "en" ? cat.name_en || cat.name : cat.name)
    : "";
  const editionLabel =
    locale === "en"
      ? product.edition_en || product.edition
      : product.edition;

  const outOfStock = product.showStock && product.stock === 0;

  return (
    <div className="group">
      <Link href={`/gallery/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gallery-light">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gallery-gray">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {/* Edition badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gallery-black text-[10px] tracking-[0.15em] uppercase px-2.5 py-1">
              {editionLabel || "Pieza única — 1/1"}
            </span>
          </div>

          {/* Stock badge — solo si showStock está activado */}
          {product.showStock && (
            <div className="absolute top-3 right-3">
              {product.stock === 0 ? (
                <span className="bg-red-600 text-white text-[10px] tracking-[0.1em] uppercase px-2.5 py-1">
                  {t("product.outOfStockBtn")}
                </span>
              ) : product.stock <= 2 ? (
                <span className="bg-amber-500 text-white text-[10px] tracking-[0.1em] uppercase px-2.5 py-1">
                  {t("product.onlyUnits", { count: product.stock })}
                </span>
              ) : (
                <span className="bg-white/90 backdrop-blur-sm text-gallery-black text-[10px] tracking-[0.1em] uppercase px-2.5 py-1">
                  {t("product.unitsAvailable", { count: product.stock })}
                </span>
              )}
            </div>
          )}

          {/* Desktop hover overlay */}
          <div className="absolute inset-0 bg-gallery-black/0 group-hover:bg-gallery-black/30 transition-colors duration-500 hidden md:flex items-end opacity-0 group-hover:opacity-100">
            <div className="w-full p-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (outOfStock) return;
                  addItem(product);
                  toast(t("product.addedToCart"));
                }}
                disabled={outOfStock}
                className="w-full bg-white text-gallery-black text-xs tracking-[0.15em] uppercase py-2.5 hover:bg-gallery-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {outOfStock ? t("product.outOfStockBtn") : t("product.addToCart")}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Info + mobile CTA */}
      <div className="mt-3">
        <Link href={`/gallery/${product.slug}`}>
          <h3 className="font-[family-name:var(--font-playfair)] text-base text-gallery-black group-hover:text-gallery-gray transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        {categoryName && (
          <p className="text-[11px] tracking-[0.15em] uppercase text-gallery-gray mt-0.5">
            {categoryName}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {product.price != null ? (
            <p className="text-sm font-medium text-gallery-black">
              €{product.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-xs text-gallery-gray italic">{t("product.priceOnRequest")}</p>
          )}

          {/* Always-visible mobile add button */}
          <button
            onClick={() => {
              if (outOfStock) return;
              addItem(product);
              toast(t("product.addedToCart"));
            }}
            disabled={outOfStock}
            aria-label={`${t("product.add")} ${product.name}`}
            className="md:hidden flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-gallery-gray hover:text-gallery-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {outOfStock ? t("product.outOfStockBtn") : t("product.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
