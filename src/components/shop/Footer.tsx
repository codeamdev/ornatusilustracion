"use client";

import Link from "next/link";
import { useLocalizedConfig } from "@/hooks/useLocalizedConfig";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const {
    site_name,
    footer_tagline,
    contact_email,
    whatsapp_number,
    instagram_url,
    facebook_url,
    tiktok_url,
  } = useLocalizedConfig();
  const { t } = useLocale();

  const socials = [
    { label: "Instagram", href: instagram_url },
    { label: "Facebook", href: facebook_url },
    { label: "TikTok", href: tiktok_url },
    {
      label: "WhatsApp",
      href: whatsapp_number ? `https://wa.me/${whatsapp_number.replace(/\D/g, "")}` : "",
    },
    { label: contact_email, href: contact_email ? `mailto:${contact_email}` : "" },
  ].filter((s) => s.href);

  const navLinks = [
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/cart", label: t("footer.myOrder") },
  ];

  return (
    <footer className="border-t border-gallery-border/50">
      {/* Trust strip */}
      <div className="py-8 px-6 md:px-12 border-b border-gallery-border/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gallery-black mb-1">
              {t("footer.uniquePieces")}
            </p>
            <p className="text-xs text-gallery-gray">{t("footer.uniquePiecesDesc")}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gallery-black mb-1">
              {t("footer.secureShipping")}
            </p>
            <p className="text-xs text-gallery-gray">{t("footer.secureShippingDesc")}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gallery-black mb-1">
              {t("footer.personalAttention")}
            </p>
            <p className="text-xs text-gallery-gray">{t("footer.personalAttentionDesc")}</p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-[family-name:var(--font-playfair)] text-lg mb-3">
                {site_name}
              </h3>
              <p className="text-sm text-gallery-gray leading-relaxed max-w-sm">
                {footer_tagline}
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                {t("footer.navigation")}
              </h4>
              <ul className="space-y-2">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social / contact */}
            {socials.length > 0 && (
              <div>
                <h4 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                  {t("footer.connect")}
                </h4>
                <ul className="space-y-2">
                  {socials.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-300"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border-t border-gallery-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs tracking-widest uppercase text-gallery-gray">
            <span>&copy; {new Date().getFullYear()} {site_name}</span>
            <span>{t("footer.allRightsReserved")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
