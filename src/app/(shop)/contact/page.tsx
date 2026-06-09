"use client";

import { useState, type FormEvent } from "react";
import FadeIn from "@/components/shop/FadeIn";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";
import { useConfig } from "@/context/ConfigContext";

export default function ContactPage() {
  const { toast } = useToast();
  const { t } = useLocale();
  const { contact_email, whatsapp_number, instagram_url, facebook_url } = useConfig();
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
        toast(t("contact.messageSent"));
      } else {
        toast(result.error || t("contact.errorSending"), "error");
      }
    } catch {
      toast(t("contact.errorSendingMessage"), "error");
    } finally {
      setLoading(false);
    }
  }

  const socials = [
    instagram_url && { label: "Instagram", href: instagram_url },
    facebook_url && { label: "Facebook", href: facebook_url },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className="pt-32 md:pt-40 pb-24 md:pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <FadeIn>
        <p className="text-xs tracking-[0.3em] uppercase text-gallery-gray mb-3">
          {t("contact.label")}
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-gallery-black mb-16 md:mb-20">
          {t("contact.title")}
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <FadeIn>
          {submitted ? (
            <div className="flex items-center justify-center h-64 bg-gallery-light">
              <div className="text-center">
                <p className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black mb-2">
                  {t("contact.thanks")}
                </p>
                <p className="text-gallery-gray text-sm">
                  {t("contact.sentMessage")}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input
                id="name"
                name="name"
                label={t("contact.name")}
                placeholder={t("contact.namePlaceholder")}
                required
              />
              <Input
                id="email"
                name="email"
                type="email"
                label={t("contact.email")}
                placeholder={t("contact.emailPlaceholder")}
                required
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full border-b border-gallery-border bg-transparent py-2.5 text-gallery-black placeholder:text-gallery-gray/50 focus:outline-none focus:border-gallery-black transition-colors duration-300 resize-none"
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>
              <Button type="submit" loading={loading}>
                {t("contact.send")}
              </Button>
            </form>
          )}
        </FadeIn>

        <FadeIn delay={200}>
          <div className="space-y-12 lg:pl-12 lg:border-l lg:border-gallery-border">
            {contact_email && (
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                  {t("contact.email")}
                </h2>
                <a
                  href={`mailto:${contact_email}`}
                  className="font-[family-name:var(--font-playfair)] text-lg text-gallery-black hover:text-gallery-gray transition-colors duration-300"
                >
                  {contact_email}
                </a>
              </div>
            )}

            {whatsapp_number && (
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                  {t("contact.whatsapp")}
                </h2>
                <a
                  href={`https://wa.me/${whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-playfair)] text-lg text-gallery-black hover:text-gallery-gray transition-colors duration-300"
                >
                  {whatsapp_number}
                </a>
              </div>
            )}

            {socials.length > 0 && (
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-gallery-gray mb-4">
                  {t("contact.socialMedia")}
                </h2>
                <div className="space-y-3">
                  {socials.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gallery-black hover:text-gallery-gray transition-colors duration-300"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
