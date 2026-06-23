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
    pinterest_url,
  } = useLocalizedConfig();
  const { t } = useLocale();

  const socials = [
    {
      label: "Instagram",
      href: instagram_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: facebook_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: tiktok_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.76a4.85 4.85 0 01-1.02-.07z"/>
        </svg>
      ),
    },
    {
      label: "Pinterest",
      href: pinterest_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: whatsapp_number ? `https://wa.me/${whatsapp_number.replace(/\D/g, "")}` : "",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: contact_email,
      href: contact_email ? `mailto:${contact_email}` : "",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M2 7l10 7 10-7"/>
        </svg>
      ),
    },
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
                <div className="flex flex-wrap gap-3">
                  {socials.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      title={label}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="text-gallery-gray hover:text-gallery-black transition-colors duration-300"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
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
