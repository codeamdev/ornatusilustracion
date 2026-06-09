"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { es } from "@/i18n/es";
import { en } from "@/i18n/en";

export type Locale = "es" | "en";

const translations = { es, en };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "es",
  setLocale: () => {},
  t: (path) => path,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "es" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      const keys = path.split(".");
      let value: unknown = translations[locale];
      for (const key of keys) {
        if (typeof value !== "object" || value === null) return path;
        value = (value as Record<string, unknown>)[key];
      }
      if (typeof value !== "string") return path;
      if (vars) {
        return value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
      }
      return value;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
