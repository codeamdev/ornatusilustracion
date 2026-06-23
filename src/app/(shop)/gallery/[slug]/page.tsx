"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/shop/FadeIn";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";
import { useConfig } from "@/context/ConfigContext";
import { localizeProduct } from "@/lib/localize-product";
import { formatCOP } from "@/lib/format-price";
import type { IProduct, ICategory } from "@/types";


export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const { toast } = useToast();
  const { locale, t } = useLocale();
  const { whatsapp_number } = useConfig();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProduct(res.data);
          fetch(`/api/products/${res.data.id}/view`, { method: "POST" }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner className="py-40" />;

  if (!product) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-4">
          {t("product.notFound")}
        </h1>
        <Link
          href="/gallery"
          className="text-xs tracking-[0.2em] uppercase text-gallery-gray hover:text-gallery-black border-b border-gallery-border pb-1"
        >
          {t("product.backToGallery")}
        </Link>
      </div>
    );
  }

  const p = localizeProduct(product, locale);

  const categoryName =
    typeof p.category === "object"
      ? (p.category as ICategory).name
      : "";

  const hasStory = p.story || p.inspiration;
  const hasDetails = p.materials || product.dimensions || product.year;
  const hasUniqueTraits = p.uniqueTraits && p.uniqueTraits.length > 0;
  const outOfStock = product.showStock && product.stock === 0;

  const waNumber = whatsapp_number?.replace(/\D/g, "") || "34600000000";
  const waText = `${t("product.whatsappText")} "${product.name}"`;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(product!);
    toast(t("product.addedToCart"));
  }

  return (
    <>
      {/* ── Above the fold: Image + Purchase panel ── */}
      <section className="pt-24 md:pt-28 pb-8 md:pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeIn>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gallery-gray hover:text-gallery-black transition-colors duration-300 mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("product.gallery")}
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Images */}
          <FadeIn className="lg:col-span-7">
            <div className="relative aspect-[4/5] bg-gallery-light overflow-hidden">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gallery-gray">
                  {t("product.noImage")}
                </div>
              )}

            </div>

            {/* Species — debajo de la imagen */}
            {product.species && (
              <div className="bg-white px-4 py-2.5 border border-gallery-border/50">
                <p className="text-gallery-black text-[11px] tracking-[0.25em] uppercase text-center">
                  {product.species}
                </p>
              </div>
            )}

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 bg-gallery-light overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? "border-gallery-black"
                        : "border-transparent hover:border-gallery-border"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </FadeIn>

          {/* Right: Purchase panel */}
          <FadeIn delay={150} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-6">
              {categoryName && (
                <p className="text-[11px] tracking-[0.3em] uppercase text-gallery-gray">
                  {categoryName}
                </p>
              )}

              <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl md:text-4xl text-gallery-black leading-tight">
                {product.name}
              </h1>

              {product.price != null ? (
                <p className="text-2xl font-light text-gallery-black">
                  {formatCOP(product.price)}
                </p>
              ) : (
                <p className="text-sm text-gallery-gray italic">{t("product.priceOnRequest")}</p>
              )}

              {/* Stock indicator */}
              {product.showStock && (
                <div className="flex items-center gap-2">
                  {product.stock === 0 ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600 font-medium">{t("product.outOfStock")}</p>
                    </>
                  ) : product.stock <= 2 ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                      <p className="text-sm text-amber-700 font-medium">
                        {product.stock === 1
                          ? t("product.onlyUnit", { count: product.stock })
                          : t("product.onlyUnits", { count: product.stock })}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-700">
                        {t("product.unitsAvailable", { count: product.stock })}
                      </p>
                    </>
                  )}
                </div>
              )}

              {p.description && (
                <p className="text-gallery-gray leading-relaxed text-sm border-t border-gallery-border/50 pt-5">
                  {p.description}
                </p>
              )}

              {/* Technical details */}
              {hasDetails && (
                <dl className="space-y-2.5 border-t border-gallery-border/50 pt-5">
                  {p.materials && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gallery-gray">{t("product.technique")}</dt>
                      <dd className="text-gallery-black">{p.materials}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gallery-gray">{t("product.dimensions")}</dt>
                      <dd className="text-gallery-black">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.year && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gallery-gray">{t("product.year")}</dt>
                      <dd className="text-gallery-black">{product.year}</dd>
                    </div>
                  )}
                  {p.creationTime && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gallery-gray">{t("product.creationTime")}</dt>
                      <dd className="text-gallery-black">{p.creationTime}</dd>
                    </div>
                  )}
                </dl>
              )}

              {/* Unique traits chips */}
              {hasUniqueTraits && (
                <div className="border-t border-gallery-border/50 pt-5">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-gallery-gray mb-3">
                    {t("product.whatMakesItUnique")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.uniqueTraits.map((trait, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs text-gallery-black bg-gallery-light px-3 py-1.5"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-gallery-gray">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor" />
                        </svg>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  size="lg"
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                >
                  {outOfStock ? t("product.outOfStock") : t("product.addToCart")}
                </Button>

                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 border border-gallery-border text-gallery-gray text-xs tracking-[0.15em] uppercase hover:border-gallery-black hover:text-gallery-black transition-all duration-300"
                >
                  {t("product.inquireWhatsApp")}
                </a>
              </div>

              {/* Trust signals */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-[11px] text-gallery-gray">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  {t("product.signedCertificate")}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gallery-gray">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1M6 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {t("product.secureShipping")}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gallery-gray">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t("product.handmade")}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gallery-gray">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t("product.neverReproduced")}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Storytelling ── */}
      {hasStory && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="max-w-3xl">
            {p.story && (
              <FadeIn>
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-px bg-gallery-black" />
                    <h2 className="text-xs tracking-[0.3em] uppercase text-gallery-gray">
                      {t("product.theStory")}
                    </h2>
                  </div>
                  <p className="text-gallery-gray leading-[1.9] text-base whitespace-pre-line">
                    {p.story}
                  </p>
                </div>
              </FadeIn>
            )}

            {p.inspiration && (
              <FadeIn delay={150}>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-px bg-gallery-black" />
                    <h2 className="text-xs tracking-[0.3em] uppercase text-gallery-gray">
                      {t("product.inspiration")}
                    </h2>
                  </div>
                  <blockquote className="border-l-2 border-gallery-border pl-6">
                    <p className="font-[family-name:var(--font-playfair)] text-lg md:text-xl leading-relaxed text-gallery-black/80 italic">
                      {p.inspiration}
                    </p>
                  </blockquote>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* ── Cinematic second image ── */}
      {product.images.length > 1 && (
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={product.images[1]}
            alt={`${product.name}${t("product.imageDetail")}`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gallery-black/10" />
        </section>
      )}

      {/* ── Artist note fallback ── */}
      {!hasStory && (
        <FadeIn>
          <section className="bg-gallery-light py-20 md:py-28">
            <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
              <p className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl leading-relaxed text-gallery-black/80 italic">
                &ldquo;{t("product.defaultQuote")}&rdquo;
              </p>
              <p className="mt-6 text-xs tracking-[0.3em] uppercase text-gallery-gray">
                {t("product.theArtist")}
              </p>
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── Process gallery ── */}
      {product.images.length > 2 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-gallery-black" />
              <h2 className="text-xs tracking-[0.3em] uppercase text-gallery-gray">
                {t("product.theProcess")}
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {product.images.slice(2).map((img, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="relative aspect-square bg-gallery-light overflow-hidden group">
                  <Image
                    src={img}
                    alt={`${product.name} ${t("product.imageProcess", { n: i + 1 })}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky mobile purchase bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gallery-border px-4 py-3 flex items-center justify-between gap-4 lg:hidden">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gallery-black truncate">{product.name}</p>
          {product.price != null && (
            <p className="text-xs text-gallery-gray">{formatCOP(product.price)}</p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={outOfStock ? t("product.outOfStockBtn") : `${t("product.add")} ${product.name}`}
          className="flex-shrink-0 bg-gallery-accent text-white px-6 py-2.5 text-xs tracking-[0.15em] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {outOfStock ? t("product.outOfStockBtn") : t("product.add")}
        </button>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
