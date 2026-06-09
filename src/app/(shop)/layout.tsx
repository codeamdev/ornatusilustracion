import { CartProvider } from "@/context/CartContext";
import { ConfigProvider } from "@/context/ConfigContext";
import { LocaleProvider } from "@/context/LocaleContext";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import CartDrawer from "@/components/shop/CartDrawer";
import WhatsAppButton from "@/components/shop/WhatsAppButton";
import ThemeInjector from "@/components/shop/ThemeInjector";
import { prisma } from "@/lib/db";
import { mergeConfig, CONFIG_DEFAULTS } from "@/lib/site-config";

async function getSiteConfig() {
  try {
    const rows = await prisma.siteConfig.findMany();
    return mergeConfig(rows);
  } catch {
    return CONFIG_DEFAULTS;
  }
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <LocaleProvider>
    <ConfigProvider config={config}>
      <CartProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <ThemeInjector />
      </CartProvider>
    </ConfigProvider>
    </LocaleProvider>
  );
}
