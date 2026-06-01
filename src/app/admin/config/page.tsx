"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import type { SiteConfigMap } from "@/lib/site-config";
import { CONFIG_DEFAULTS } from "@/lib/site-config";

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

type Field = {
  key: keyof SiteConfigMap;
  label: string;
  type: "text" | "textarea" | "url" | "email" | "tel" | "color";
  placeholder?: string;
  rows?: number;
};

const SECTIONS: Section[] = [
  {
    title: "Colores",
    description: "Paleta principal del sitio. Los cambios se aplican en tiempo real.",
    fields: [
      { key: "color_accent", label: "Color de acento (botones, badges)", type: "color" as Field["type"] },
      { key: "color_black", label: "Color principal / texto", type: "color" as Field["type"] },
      { key: "color_white", label: "Color de fondo", type: "color" as Field["type"] },
      { key: "color_gray", label: "Texto secundario", type: "color" as Field["type"] },
      { key: "color_light", label: "Fondo de secciones claras", type: "color" as Field["type"] },
      { key: "color_border", label: "Bordes y separadores", type: "color" as Field["type"] },
    ],
  },
  {
    title: "Identidad",
    description: "Nombre del sitio y datos generales de la marca.",
    fields: [
      { key: "site_name", label: "Nombre del sitio", type: "text", placeholder: "Ornatus" },
      { key: "site_tagline", label: "Eslogan", type: "text", placeholder: "Arte Hecho a Mano" },
      { key: "artist_name", label: "Nombre de la artista", type: "text", placeholder: "La Artista" },
      {
        key: "site_description",
        label: "Descripción del sitio",
        type: "textarea",
        rows: 3,
        placeholder: "Galería de arte contemporáneo…",
      },
    ],
  },
  {
    title: "Hero (Página Principal)",
    description: "Textos e imagen del banner principal.",
    fields: [
      { key: "hero_title", label: "Título del Hero", type: "text", placeholder: "Ornatus" },
      {
        key: "hero_subtitle",
        label: "Subtítulo del Hero",
        type: "textarea",
        rows: 2,
        placeholder: "Piezas únicas hechas a mano…",
      },
      {
        key: "hero_image_url",
        label: "URL de imagen del Hero",
        type: "url",
        placeholder: "https://… (dejar vacío para usar imagen del primer producto)",
      },
      { key: "hero_cta_primary", label: "Botón principal", type: "text", placeholder: "Explorar Colección" },
      { key: "hero_cta_secondary", label: "Botón secundario", type: "text", placeholder: "Encargar Pieza" },
    ],
  },
  {
    title: "Textos de Inicio",
    description: "Frase destacada y sección de encargos.",
    fields: [
      {
        key: "statement_quote",
        label: "Frase de la artista",
        type: "textarea",
        rows: 3,
        placeholder: "Cada obra es una conversación entre…",
      },
      { key: "commission_title", label: "Título de encargos", type: "text", placeholder: "¿Buscas algo hecho solo para ti?" },
      {
        key: "commission_description",
        label: "Descripción de encargos",
        type: "textarea",
        rows: 3,
        placeholder: "Creo piezas por encargo…",
      },
    ],
  },
  {
    title: "Sobre mí",
    description: "Retrato, biografía y proceso creativo.",
    fields: [
      {
        key: "artist_portrait_url",
        label: "URL del retrato",
        type: "url",
        placeholder: "/artist-portrait.jpg",
      },
      {
        key: "artist_bio_1",
        label: "Biografía (párrafo 1)",
        type: "textarea",
        rows: 4,
        placeholder: "Artista multidisciplinar con más de…",
      },
      {
        key: "artist_bio_2",
        label: "Biografía (párrafo 2)",
        type: "textarea",
        rows: 4,
        placeholder: "Desde murales que transforman…",
      },
      {
        key: "artist_process_1",
        label: "Mi proceso (párrafo 1)",
        type: "textarea",
        rows: 4,
        placeholder: "Cada pieza comienza con una idea…",
      },
      {
        key: "artist_process_2",
        label: "Mi proceso (párrafo 2)",
        type: "textarea",
        rows: 4,
        placeholder: "Utilizo materiales de alta calidad…",
      },
    ],
  },
  {
    title: "Contacto y Redes Sociales",
    description: "Datos de contacto y enlaces a redes.",
    fields: [
      { key: "contact_email", label: "Email de contacto", type: "email", placeholder: "hola@ornatusilustracion.com" },
      { key: "whatsapp_number", label: "Número de WhatsApp", type: "tel", placeholder: "34600000000 (solo dígitos)" },
      { key: "instagram_url", label: "URL de Instagram", type: "url", placeholder: "https://instagram.com/…" },
      { key: "facebook_url", label: "URL de Facebook", type: "url", placeholder: "https://facebook.com/…" },
      { key: "tiktok_url", label: "URL de TikTok", type: "url", placeholder: "https://tiktok.com/@…" },
      { key: "pinterest_url", label: "URL de Pinterest", type: "url", placeholder: "https://pinterest.com/…" },
    ],
  },
  {
    title: "Footer",
    description: "Texto del pie de página.",
    fields: [
      {
        key: "footer_tagline",
        label: "Tagline del footer",
        type: "textarea",
        rows: 3,
        placeholder: "Arte hecho a mano con pasión…",
      },
    ],
  },
  {
    title: "SEO",
    description: "Títulos y descripciones para motores de búsqueda.",
    fields: [
      { key: "meta_title", label: "Meta título", type: "text", placeholder: "Ornatus — Arte Hecho a Mano" },
      {
        key: "meta_description",
        label: "Meta descripción",
        type: "textarea",
        rows: 3,
        placeholder: "Galería de arte contemporáneo…",
      },
    ],
  },
];

export default function AdminConfigPage() {
  const { toast } = useToast();
  const [values, setValues] = useState<SiteConfigMap>(CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.success) setValues(data.data);
    } catch {
      toast("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  function handleChange(key: keyof SiteConfigMap, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleResetSection(fields: Field[]) {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of fields) {
        next[f.key] = CONFIG_DEFAULTS[f.key];
      }
      return next;
    });
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error");
      toast("Configuración guardada");
      setSaved(true);
    } catch {
      toast("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gallery-gray text-sm">
        Cargando configuración…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-8 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configuración del sitio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Todos los cambios se reflejan en el sitio de inmediato.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#2C2520] text-white text-sm rounded hover:bg-[#3a302a] transition-colors disabled:opacity-60"
        >
          {saving ? "Guardando…" : saved ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <section key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">{section.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
            </div>
            <button
              type="button"
              onClick={() => handleResetSection(section.fields)}
              className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Restaurar defaults
            </button>
          </div>
          <div className="px-6 py-5 space-y-5">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
                  {field.label}
                </label>
                {field.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={values[field.key] || "#000000"}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder="#000000"
                      maxLength={7}
                      className="w-32 border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2C2520]/30 focus:border-[#2C2520]"
                    />
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: values[field.key] }}
                    />
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.rows ?? 3}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2C2520]/30 focus:border-[#2C2520] resize-y"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2C2520]/30 focus:border-[#2C2520]"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#2C2520] text-white text-sm rounded hover:bg-[#3a302a] transition-colors disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
