"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import FadeIn from "@/components/shop/FadeIn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    if (item.product.price != null) return sum + item.product.price * item.quantity;
    return sum;
  }, 0);
  const hasPricedItems = items.some((i) => i.product.price != null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    const form = e.currentTarget;
    const customer = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const orderItems = items.map((item) => ({
      product: item.product.id,
      name: item.product.name,
      image: item.product.images[0] || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, customer }),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        clearCart();
        toast("Pedido enviado correctamente");
      } else {
        toast(result.error || "Error al enviar el pedido", "error");
      }
    } catch {
      toast("Error al enviar el pedido", "error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <FadeIn>
          <div className="py-20">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-6 text-gallery-black">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl mb-4">
              ¡Pedido recibido!
            </h1>
            <p className="text-gallery-gray mb-3 max-w-md mx-auto">
              Hemos recibido tu pedido. Te contactaremos en las próximas 24 horas para confirmar los detalles y organizar el envío.
            </p>
            <p className="text-xs text-gallery-gray mb-8">
              Revisa tu email por si te escribimos.
            </p>
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 bg-gallery-accent text-white text-xs tracking-[0.25em] uppercase hover:bg-gallery-accent/85 transition-all duration-500"
            >
              Seguir explorando
            </Link>
          </div>
        </FadeIn>
      </section>
    );
  }

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeIn>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gallery-gray hover:text-gallery-black transition-colors duration-300 mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Seguir comprando
        </Link>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-gallery-black mb-12">
          Tu Pedido ({totalItems})
        </h1>
      </FadeIn>

      {items.length === 0 ? (
        <FadeIn>
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto text-gallery-border mb-4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-gallery-gray mb-6">Tu carrito está vacío.</p>
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 bg-gallery-accent text-white text-xs tracking-[0.25em] uppercase hover:bg-gallery-accent/85 transition-all duration-500"
            >
              Explorar Colección
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Items list */}
          <FadeIn className="lg:col-span-2">
            <div className="space-y-0">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-5 py-6 border-b border-gallery-border/50"
                >
                  <Link
                    href={`/gallery/${item.product.slug}`}
                    className="relative w-24 h-24 md:w-28 md:h-28 bg-gallery-light flex-shrink-0"
                  >
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/gallery/${item.product.slug}`}>
                      <h3 className="font-[family-name:var(--font-playfair)] text-base md:text-lg hover:text-gallery-gray transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.price != null ? (
                      <p className="text-sm text-gallery-black mt-1">
                        €{item.product.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-xs text-gallery-gray italic mt-1">
                        Precio a consultar
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 border border-gallery-border text-gallery-gray hover:text-gallery-black flex items-center justify-center disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gallery-border text-gallery-gray hover:text-gallery-black flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-4 text-xs tracking-[0.1em] uppercase text-gallery-gray hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Checkout sidebar — sticky */}
          <FadeIn delay={200}>
            <div className="lg:sticky lg:top-28">
              <div className="bg-gallery-light p-8 space-y-6">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl">
                  Datos de contacto
                </h2>
                <p className="text-xs text-gallery-gray -mt-3">
                  Te contactaremos para confirmar el pedido y los detalles de envío.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input id="name" name="name" label="Nombre" placeholder="Tu nombre completo" required />
                  <Input id="email" name="email" type="email" label="Email" placeholder="tu@email.com" required />
                  <Input id="phone" name="phone" type="tel" label="Teléfono" placeholder="+34 600 000 000" required />
                  <div>
                    <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                      Nota (opcional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={2}
                      className="w-full border-b border-gallery-border bg-transparent py-2.5 text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none text-sm"
                      placeholder="Alguna indicación especial..."
                    />
                  </div>

                  {/* Order summary */}
                  <div className="border-t border-gallery-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gallery-gray">
                        {totalItems} {totalItems === 1 ? "pieza" : "piezas"}
                      </span>
                      {hasPricedItems && (
                        <span className="text-gallery-black">€{subtotal.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gallery-gray">Envío</span>
                      <span className="text-gallery-gray text-xs italic">A confirmar</span>
                    </div>
                    {hasPricedItems && (
                      <div className="flex justify-between text-base font-medium pt-2 border-t border-gallery-border/50">
                        <span>Total estimado</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Button type="submit" loading={loading} className="w-full" size="lg">
                    Enviar Pedido
                  </Button>
                </form>
              </div>

              {/* Trust signals below form */}
              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 text-xs text-gallery-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  <span>Cada pieza incluye certificado de autenticidad firmado por la artista.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gallery-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0"><rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1M6 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span>Envío asegurado con embalaje profesional para proteger tu obra.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-gallery-gray">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Te contactaremos personalmente para confirmar todo antes de enviar.</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </section>
  );
}
