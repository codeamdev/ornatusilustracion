"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface HeroBackgroundProps {
  videoDesktop: string;
  videoMobile: string;
  imagesDesktop: string[];
  imagesMobile: string[];
  fallbackImage: string;
  carouselInterval?: number;
}

export default function HeroBackground({
  videoDesktop,
  videoMobile,
  imagesDesktop,
  imagesMobile,
  fallbackImage,
  carouselInterval = 5000,
}: HeroBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const videoSrc = isMobile ? videoMobile : videoDesktop;
  const images = (isMobile ? imagesMobile : imagesDesktop).filter(Boolean);

  // Carousel timer — only when showing images
  useEffect(() => {
    if (videoSrc || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, carouselInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videoSrc, images.length, carouselInterval]);

  // Reset index when switching orientation
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  if (videoSrc) {
    return (
      <>
        <video
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} />
        </video>
        <div className="absolute inset-0 bg-gallery-black/50" />
      </>
    );
  }

  const activeImages = images.length > 0 ? images : fallbackImage ? [fallbackImage] : [];

  if (activeImages.length === 0) {
    return <div className="absolute inset-0 bg-gallery-black" />;
  }

  return (
    <>
      {activeImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gallery-black/50" />

      {/* Carousel dots */}
      {activeImages.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setCurrentIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
