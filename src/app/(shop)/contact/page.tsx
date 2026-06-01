"use client";

import { useState, type FormEvent } from "react";
import FadeIn from "@/components/shop/FadeIn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        toast("Mensaje enviado correctamente");
      } else {
        toast(result.error || "Error al enviar", "error");
      }
    } catch {
      toast("Error al enviar el mensaje", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeIn>
        <p className="text-xs tracking-[0.3em] uppercase text-gallery-gray mb-3">
          Contacto
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-gallery-black mb-16 md:mb-20">
          Hablemos
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <FadeIn>
          {submitted ? (
            <div className="flex items-center justify-center h-64 bg-gallery-light">
              <div className="text-center">
                <p className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black mb-2">
                  Gracias
                </p>
                <p className="text-gallery-gray text-sm">
                  Tu mensaje ha sido enviado. Te responderé pronto.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input
                id="name"
                name="name"
                label="Nombre"
                placeholder="Tu nombre"
                required
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="tu@email.com"
                required
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full border-b border-gallery-border bg-transparent py-2.5 text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none"
                  placeholder="Tu mensaje..."
                />
              </div>
              <Button type="submit" loading={loading}>
                Enviar Mensaje
              </Button>
            </form>
          )}
        </FadeIn>

        <FadeIn delay={200}>
          <div className="space-y-12 lg:pl-12 lg:border-l lg:border-gallery-border">
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                Email
              </h2>
              <a
                href="mailto:hello@ornatus.art"
                className="font-[family-name:var(--font-playfair)] text-lg text-gallery-black hover:text-gallery-gray transition-colors duration-300"
              >
                hello@ornatus.art
              </a>
            </div>

            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                WhatsApp
              </h2>
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-playfair)] text-lg text-gallery-black hover:text-gallery-gray transition-colors duration-300"
              >
                +34 600 000 000
              </a>
            </div>

            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                Redes Sociales
              </h2>
              <div className="space-y-3">
                <a
                  href="https://instagram.com/ornatus.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gallery-black hover:text-gallery-gray transition-colors duration-300"
                >
                  Instagram — @ornatus.art
                </a>
                <a
                  href="https://facebook.com/ornatus.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gallery-black hover:text-gallery-gray transition-colors duration-300"
                >
                  Facebook — Ornatus Art
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
