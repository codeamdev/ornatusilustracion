"use client";

import { useConfig } from "@/context/ConfigContext";
import { useLocale } from "@/context/LocaleContext";
import type { SiteConfigMap } from "@/lib/site-config";

const LOCALIZABLE_KEYS = [
  "site_tagline",
  "site_description",
  "hero_title",
  "hero_subtitle",
  "hero_cta_primary",
  "hero_cta_secondary",
  "statement_quote",
  "commission_title",
  "commission_description",
  "artist_bio_1",
  "artist_bio_2",
  "artist_process_1",
  "artist_process_2",
  "footer_tagline",
  "meta_title",
  "meta_description",
] as const;

export function useLocalizedConfig(): SiteConfigMap {
  const config = useConfig();
  const { locale } = useLocale();

  if (locale === "es") return config;

  const result = { ...config };
  for (const key of LOCALIZABLE_KEYS) {
    const enKey = `${key}_en` as keyof SiteConfigMap;
    const enValue = config[enKey] as string;
    if (enValue) {
      (result as Record<string, string>)[key] = enValue;
    }
  }
  return result;
}
