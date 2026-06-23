"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/shop/FadeIn";
import ProductGrid from "@/components/shop/ProductGrid";
import HeroBackground from "@/components/shop/HeroBackground";
import Spinner from "@/components/ui/Spinner";
import { useLocalizedConfig } from "@/hooks/useLocalizedConfig";
import { useLocale } from "@/context/LocaleContext";
import type { IProduct } from "@/types";

export default function Home() {
  const [featured, setFeatured] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    hero_title,
    hero_subtitle,
    hero_image_url,
    hero_video_desktop,
    hero_video_mobile,
    hero_images_desktop,
    hero_images_mobile,
    hero_cta_primary,
    hero_cta_secondary,
    statement_quote,
    artist_name,
    commission_title,
    commission_description,
  } = useLocalizedConfig();
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/products?featured=true&limit=6")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setFeatured(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fallbackImage = hero_image_url || featured[0]?.images[0] || "";
  const desktopImages = hero_images_desktop ? hero_images_desktop.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const mobileImages = hero_images_mobile ? hero_images_mobile.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground
          videoDesktop={hero_video_desktop}
          videoMobile={hero_video_mobile}
          imagesDesktop={desktopImages}
          imagesMobile={mobileImages}
          fallbackImage={fallbackImage}
        />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="animate-fade-in-up font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-7xl text-white leading-tight">
            {hero_title}
          </h1>
          <p className="animate-fade-in-up animation-delay-200 mt-6 text-white/80 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto">
            {hero_subtitle}
          </p>
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/gallery"
              className="px-8 py-3 bg-gallery-accent text-white text-xs tracking-[0.25em] uppercase hover:bg-gallery-accent/85 transition-all duration-500"
            >
              {hero_cta_primary}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white/60 text-white text-xs tracking-[0.25em] uppercase hover:bg-white/10 transition-all duration-500"
            >
              {hero_cta_secondary}
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-soft-bounce">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">
            {t("home.scroll")}
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-white/60">
            <path d="M8 0v20m0 0l6-6m-6 6l-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-b border-gallery-border/50 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16 text-[11px] tracking-[0.2em] uppercase text-gallery-gray">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            {t("home.uniquePieces")}
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t("home.handmade")}
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1M6 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {t("home.carefulShipping")}
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {t("home.certificate")}
          </span>
        </div>
      </section>

      {/* ── Featured works ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <FadeIn>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gallery-gray mb-3">
                {t("home.featured")}
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-gallery-black">
                {t("home.recentWorks")}
              </h2>
            </div>
            <Link
              href="/gallery"
              className="hidden sm:inline-block text-xs tracking-[0.2em] uppercase text-gallery-gray hover:text-gallery-black transition-colors duration-300 border-b border-gallery-border pb-1"
            >
              {t("home.seeAll")}
            </Link>
          </div>
        </FadeIn>

        {loading ? (
          <Spinner className="py-20" />
        ) : (
          <ProductGrid products={featured} />
        )}

        <FadeIn>
          <div className="mt-14 text-center">
            <Link
              href="/gallery"
              className="inline-block px-10 py-3.5 bg-gallery-accent text-white text-xs tracking-[0.25em] uppercase hover:bg-gallery-accent/85 transition-colors duration-300"
            >
              {t("home.seeFullCollection")}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Statement ── */}
      <section className="bg-gallery-light py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <blockquote className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl lg:text-3xl leading-relaxed text-gallery-black italic">
              &ldquo;{statement_quote}&rdquo;
            </blockquote>
            <p className="mt-8 text-xs tracking-[0.3em] uppercase text-gallery-gray">
              — {artist_name}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Commission CTA ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <FadeIn>
          <div className="bg-gallery-black text-white p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">
                {t("home.customCommissions")}
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl leading-snug mb-3">
                {commission_title}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {commission_description}
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 px-8 py-3 border border-white/60 text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-gallery-black transition-all duration-500"
            >
              {t("home.letsTalk")}
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
