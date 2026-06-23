export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ToastProvider } from "@/context/ToastContext";
import { prisma } from "@/lib/db";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.SITE_URL ?? "https://www.ornatusilustracion.com";

export async function generateMetadata(): Promise<Metadata> {
  let title = "Ornatus — Arte Hecho a Mano";
  let description =
    "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.";

  let faviconUrl = "";

  try {
    const rows = await prisma.siteConfig.findMany({
      where: { key: { in: ["meta_title", "meta_description", "favicon_url"] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    if (map.meta_title) title = map.meta_title;
    if (map.meta_description) description = map.meta_description;
    if (map.favicon_url) faviconUrl = map.favicon_url;
  } catch {
    // BD no disponible — usar defaults
  }

  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    icons: faviconUrl
      ? { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl }
      : undefined,
    ...(googleVerification && {
      verification: { google: googleVerification },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
