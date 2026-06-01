"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type SiteConfigMap, CONFIG_DEFAULTS } from "@/lib/site-config";

const ConfigContext = createContext<SiteConfigMap>(CONFIG_DEFAULTS);

export function ConfigProvider({
  config,
  children,
}: {
  config: SiteConfigMap;
  children: ReactNode;
}) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
