"use client";

import { useEffect } from "react";
import { useConfig } from "@/context/ConfigContext";

export default function ThemeInjector() {
  const { color_accent, color_black, color_white, color_gray, color_light, color_border } =
    useConfig();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-gallery-accent", color_accent);
    root.style.setProperty("--color-gallery-black", color_black);
    root.style.setProperty("--color-gallery-white", color_white);
    root.style.setProperty("--color-gallery-gray", color_gray);
    root.style.setProperty("--color-gallery-light", color_light);
    root.style.setProperty("--color-gallery-border", color_border);
  }, [color_accent, color_black, color_white, color_gray, color_light, color_border]);

  return null;
}
