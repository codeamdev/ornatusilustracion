import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.SITE_URL ?? "https://www.ornatusilustracion.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
