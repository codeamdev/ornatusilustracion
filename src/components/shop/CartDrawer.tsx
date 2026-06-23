"use client";

import Image from "next/image";
import { formatCOP } from "@/lib/format-price";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, isOpen, setIsOpen } =
    useCart();
  const { t } = useLocale();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    if (item.product.price != null) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const hasPricedItems = items.some((i) => i.product.price != null);

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gallery-black/30 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gallery-border">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg">
            {t("cart.title", { count: totalItems })}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gallery-gray hover:text-gallery-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gallery-border mb-4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p className="text-gallery-gray text-sm mb-4">{t("cart.emptyCartDrawer")}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs tracking-[0.15em] uppercase text-gallery-black border-b border-gallery-border pb-0.5 hover:border-gallery-black transition-colors"
              >
                {t("cart.exploreCollectionBtn")}
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 py-3 border-b border-gallery-border/50"
                >
                  <Link
                    href={`/gallery/${item.product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="relative w-20 h-20 bg-gallery-light flex-shrink-0"
                  >
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gallery-light" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gallery-black truncate">
                      {item.product.name}
                    </h4>
                    {item.product.price != null && (
                      <p className="text-xs text-gallery-gray mt-0.5">
                        {formatCOP(item.product.price)}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 border border-gallery-border text-gallery-gray hover:text-gallery-black flex items-center justify-center text-sm disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 border border-gallery-border text-gallery-gray hover:text-gallery-black flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-gallery-gray hover:text-red-500 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with subtotal + CTA */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gallery-border space-y-4">
            {hasPricedItems && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gallery-gray">{t("cart.subtotal")}</span>
                <span className="font-medium text-gallery-black">
                  {formatCOP(subtotal)}
                </span>
              </div>
            )}

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-gallery-accent text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gallery-accent/85 transition-colors duration-300"
            >
              {t("cart.completeOrder")}
            </Link>

            <div className="flex items-center justify-center gap-4 text-[10px] tracking-[0.1em] uppercase text-gallery-gray">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                {t("cart.secureShipping")}
              </span>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t("cart.certifiedPiece")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
