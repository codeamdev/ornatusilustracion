import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Agrega aquí dominios externos si usas URLs de imágenes externas en la config
      // { protocol: "https", hostname: "ejemplo.com" },
    ],
  },
};

export default nextConfig;
