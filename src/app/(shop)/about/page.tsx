"use client";

import Image from "next/image";
import FadeIn from "@/components/shop/FadeIn";
import { useConfig } from "@/context/ConfigContext";

export default function AboutPage() {
  const {
    artist_name,
    artist_portrait_url,
    artist_bio_1,
    artist_bio_2,
    artist_process_1,
    artist_process_2,
  } = useConfig();

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeIn>
        <p className="text-xs tracking-[0.3em] uppercase text-gallery-gray mb-3">
          Sobre mí
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-gallery-black mb-16 md:mb-20">
          {artist_name}
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <FadeIn>
          <div className="relative aspect-[3/4] bg-gallery-light overflow-hidden">
            <Image
              src={artist_portrait_url || "/artist-portrait.jpg"}
              alt={`Retrato de ${artist_name}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="space-y-8">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-gallery-black mb-6">
                Biografía
              </h2>
              <div className="space-y-5 text-gallery-gray leading-relaxed">
                {artist_bio_1 && <p>{artist_bio_1}</p>}
                {artist_bio_2 && <p>{artist_bio_2}</p>}
              </div>
            </div>

            <div className="pt-8 border-t border-gallery-border">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-gallery-black mb-6">
                Mi Proceso
              </h2>
              <div className="space-y-5 text-gallery-gray leading-relaxed">
                {artist_process_1 && <p>{artist_process_1}</p>}
                {artist_process_2 && <p>{artist_process_2}</p>}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
