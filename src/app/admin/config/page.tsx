"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import type { SiteConfigMap } from "@/lib/site-config";
import { CONFIG_DEFAULTS } from "@/lib/site-config";

type Field = {
  key: keyof SiteConfigMap;
  label: string;
  type: "text" | "textarea" | "url" | "email" | "tel" | "color";
  placeholder?: string;
  rows?: number;
  en_key?: keyof SiteConfigMap;
  en_placeholder?: string;
};

type Section = {
  title: string;
  description: string;
  fields: Field[];
};

const CUSTOM_PALETTES_KEY = "ornatus_custom_palettes";

type Palette = {
  name: string;
  accent: string;
  black: string;
  white: string;
  gray: string;
  light: string;
  border: string;
  custom?: boolean;
};

const PALETTES: Palette[] = [
  { name: "Tierra", accent: "#A67C52", black: "#1C1917", white: "#FAF8F4", gray: "#78716C", light: "#F0ECE5", border: "#DDD6CB" },
  { name: "Noir", accent: "#D4B483", black: "#111111", white: "#F8F8F8", gray: "#888888", light: "#EEEEEE", border: "#CCCCCC" },
  { name: "Bosque", accent: "#5C8A5C", black: "#1A2420", white: "#F4F8F4", gray: "#6B8068", light: "#E8F0E8", border: "#C5D5C5" },
  { name: "Cielo", accent: "#4A7FA5", black: "#1A2530", white: "#F4F7FA", gray: "#627585", light: "#E8EFF5", border: "#C5D5E0" },
  { name: "Rosa", accent: "#C47B8C", black: "#2A1A1F", white: "#FDF5F7", gray: "#8C6B73", light: "#F5E8EC", border: "#E0C5CC" },
  { name: "Índigo", accent: "#6B5FA6", black: "#1A1830", white: "#F6F5FC", gray: "#7B78A0", light: "#EEECF8", border: "#D0CDE8" },
  { name: "Ámbar", accent: "#D4940A", black: "#1C1500", white: "#FEFDF0", gray: "#8C7A20", light: "#F8F2DC", border: "#E5D8A0" },
  { name: "Vino", accent: "#8C2D4A", black: "#1A0A12", white: "#FDF5F7", gray: "#7A4055", light: "#F5E5EA", border: "#E0C0CC" },
  { name: "Minimal", accent: "#555555", black: "#222222", white: "#FAFAFA", gray: "#999999", light: "#F0F0F0", border: "#E0E0E0" },
  { name: "Arena", accent: "#C49A6C", black: "#2C2015", white: "#FDFAF5", gray: "#8C7860", light: "#F5EFE0", border: "#E5D8C0" },
];

const SECTIONS: Section[] = [
  {
    title: "Identidad",
    description: "Nombre del sitio y datos generales de la marca.",
    fields: [
      { key: "site_name", label: "Nombre del sitio", type: "text", placeholder: "Ornatus" },
      {
        key: "site_tagline",
        label: "Eslogan",
        type: "text",
        placeholder: "Arte Hecho a Mano",
        en_key: "site_tagline_en",
        en_placeholder: "Handmade Art",
      },
      { key: "artist_name", label: "Nombre de la artista", type: "text", placeholder: "La Artista" },
      {
        key: "site_description",
        label: "Descripción del sitio",
        type: "textarea",
        rows: 3,
        placeholder: "Galería de arte contemporáneo…",
        en_key: "site_description_en",
        en_placeholder: "Contemporary art gallery…",
      },
    ],
  },
  {
    title: "Hero (Página Principal)",
    description: "Fondo del banner: video (prioridad) → carrusel de imágenes → color de fondo. Configura versiones para escritorio y móvil por separado.",
    fields: [
      {
        key: "hero_title",
        label: "Título del Hero",
        type: "text",
        placeholder: "Ornatus",
        en_key: "hero_title_en",
        en_placeholder: "Ornatus",
      },
      {
        key: "hero_subtitle",
        label: "Subtítulo del Hero",
        type: "textarea",
        rows: 2,
        placeholder: "Piezas únicas hechas a mano…",
        en_key: "hero_subtitle_en",
        en_placeholder: "Unique handmade pieces…",
      },
      {
        key: "hero_video_desktop",
        label: "Video — Escritorio (URL .mp4/.webm)",
        type: "url",
        placeholder: "https://… (horizontal, 16:9)",
      },
      {
        key: "hero_video_mobile",
        label: "Video — Móvil (URL .mp4/.webm)",
        type: "url",
        placeholder: "https://… (vertical, 9:16)",
      },
      {
        key: "hero_images_desktop",
        label: "Carrusel imágenes — Escritorio (URLs separadas por comas)",
        type: "textarea",
        rows: 2,
        placeholder: "https://imagen1.jpg, https://imagen2.jpg, …",
      },
      {
        key: "hero_images_mobile",
        label: "Carrusel imágenes — Móvil (URLs separadas por comas)",
        type: "textarea",
        rows: 2,
        placeholder: "https://imagen-vertical1.jpg, https://imagen-vertical2.jpg, …",
      },
      {
        key: "hero_image_url",
        label: "Imagen fallback (si no hay video ni carrusel)",
        type: "url",
        placeholder: "https://… (dejar vacío para usar imagen del primer producto)",
      },
      {
        key: "hero_cta_primary",
        label: "Botón principal",
        type: "text",
        placeholder: "Explorar Colección",
        en_key: "hero_cta_primary_en",
        en_placeholder: "Explore Collection",
      },
      {
        key: "hero_cta_secondary",
        label: "Botón secundario",
        type: "text",
        placeholder: "Encargar Pieza",
        en_key: "hero_cta_secondary_en",
        en_placeholder: "Commission a Piece",
      },
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
        en_key: "statement_quote_en",
        en_placeholder: "Each piece is a conversation between…",
      },
      {
        key: "commission_title",
        label: "Título de encargos",
        type: "text",
        placeholder: "¿Buscas algo hecho solo para ti?",
        en_key: "commission_title_en",
        en_placeholder: "Looking for something made just for you?",
      },
      {
        key: "commission_description",
        label: "Descripción de encargos",
        type: "textarea",
        rows: 3,
        placeholder: "Creo piezas por encargo…",
        en_key: "commission_description_en",
        en_placeholder: "I create custom pieces tailored to your space…",
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
        en_key: "artist_bio_1_en",
        en_placeholder: "Multidisciplinary artist with more than…",
      },
      {
        key: "artist_bio_2",
        label: "Biografía (párrafo 2)",
        type: "textarea",
        rows: 4,
        placeholder: "Desde murales que transforman…",
        en_key: "artist_bio_2_en",
        en_placeholder: "From murals that transform spaces…",
      },
      {
        key: "artist_process_1",
        label: "Mi proceso (párrafo 1)",
        type: "textarea",
        rows: 4,
        placeholder: "Cada pieza comienza con una idea…",
        en_key: "artist_process_1_en",
        en_placeholder: "Each piece begins with an idea…",
      },
      {
        key: "artist_process_2",
        label: "Mi proceso (párrafo 2)",
        type: "textarea",
        rows: 4,
        placeholder: "Utilizo materiales de alta calidad…",
        en_key: "artist_process_2_en",
        en_placeholder: "I use high quality materials…",
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
        en_key: "footer_tagline_en",
        en_placeholder: "Handmade art with passion…",
      },
    ],
  },
  {
    title: "SEO",
    description: "Títulos y descripciones para motores de búsqueda.",
    fields: [
      {
        key: "meta_title",
        label: "Meta título",
        type: "text",
        placeholder: "Ornatus — Arte Hecho a Mano",
        en_key: "meta_title_en",
        en_placeholder: "Ornatus — Handmade Art",
      },
      {
        key: "meta_description",
        label: "Meta descripción",
        type: "textarea",
        rows: 3,
        placeholder: "Galería de arte contemporáneo…",
        en_key: "meta_description_en",
        en_placeholder: "Contemporary art gallery…",
      },
    ],
  },
  {
    title: "Correo Electrónico",
    description: "Configuración SMTP para envío de emails de contacto y pedidos. Tiene prioridad sobre las variables de entorno del servidor.",
    fields: [
      { key: "smtp_host", label: "Servidor SMTP (host)", type: "text", placeholder: "smtp.gmail.com" },
      { key: "smtp_port", label: "Puerto SMTP", type: "text", placeholder: "587" },
      { key: "smtp_secure", label: "SSL/TLS (true/false)", type: "text", placeholder: "false" },
      { key: "smtp_user", label: "Usuario SMTP", type: "email", placeholder: "tu@gmail.com" },
      { key: "smtp_pass", label: "Contraseña / App Password", type: "text", placeholder: "••••••••" },
      { key: "from_email", label: "Email remitente", type: "email", placeholder: "noreply@ornatus.art" },
      { key: "admin_email", label: "Email del admin (recibe pedidos y mensajes)", type: "email", placeholder: "admin@ornatus.art" },
    ],
  },
];

const COLOR_FIELDS: Field[] = [
  { key: "color_accent", label: "Color de acento (botones, badges)", type: "color" },
  { key: "color_black", label: "Color principal / texto", type: "color" },
  { key: "color_white", label: "Color de fondo", type: "color" },
  { key: "color_gray", label: "Texto secundario", type: "color" },
  { key: "color_light", label: "Fondo de secciones claras", type: "color" },
  { key: "color_border", label: "Bordes y separadores", type: "color" },
];

export default function AdminConfigPage() {
  const { toast } = useToast();
  const [values, setValues] = useState<SiteConfigMap>(CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [customPalettes, setCustomPalettes] = useState<Palette[]>([]);
  const [showSavePalette, setShowSavePalette] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState("");

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_PALETTES_KEY);
      if (stored) setCustomPalettes(JSON.parse(stored));
    } catch {}
  }, []);

  function handleChange(key: keyof SiteConfigMap, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function applyPalette(p: typeof PALETTES[0]) {
    setValues((prev) => ({
      ...prev,
      color_accent: p.accent,
      color_black: p.black,
      color_white: p.white,
      color_gray: p.gray,
      color_light: p.light,
      color_border: p.border,
    }));
    setSaved(false);
  }

  function saveCustomPalette() {
    const name = newPaletteName.trim();
    if (!name) return;
    const palette: Palette = {
      name,
      accent: values.color_accent,
      black: values.color_black,
      white: values.color_white,
      gray: values.color_gray,
      light: values.color_light,
      border: values.color_border,
      custom: true,
    };
    const updated = [...customPalettes.filter((p) => p.name !== name), palette];
    setCustomPalettes(updated);
    localStorage.setItem(CUSTOM_PALETTES_KEY, JSON.stringify(updated));
    setNewPaletteName("");
    setShowSavePalette(false);
    toast("Paleta guardada");
  }

  function deleteCustomPalette(name: string) {
    const updated = customPalettes.filter((p) => p.name !== name);
    setCustomPalettes(updated);
    localStorage.setItem(CUSTOM_PALETTES_KEY, JSON.stringify(updated));
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

  function renderInput(field: Field) {
    if (field.type === "color") {
      return (
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
      );
    }
    if (field.type === "textarea") {
      return (
        <textarea
          value={values[field.key]}
          onChange={(e) => handleChange(field.key, e.target.value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2C2520]/30 focus:border-[#2C2520] resize-y"
        />
      );
    }
    return (
      <input
        type={field.type}
        value={values[field.key]}
        onChange={(e) => handleChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2C2520]/30 focus:border-[#2C2520]"
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gallery-gray text-sm">
        Cargando configuración…
      </div>
    );
  }

  const allPalettes = [...PALETTES, ...customPalettes];
  const currentPalette = allPalettes.find(
    (p) =>
      p.accent === values.color_accent &&
      p.black === values.color_black &&
      p.white === values.color_white &&
      p.gray === values.color_gray &&
      p.light === values.color_light &&
      p.border === values.color_border
  );

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

      {/* Colors section — palette picker + individual controls */}
      <section className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Colores</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Elige una paleta predefinida o ajusta los colores individualmente.
          </p>
        </div>

        {/* Palette picker */}
        <div className="px-6 pt-5 pb-2 space-y-4">
          {/* Built-in palettes */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-3 tracking-wide uppercase">Paletas predefinidas</p>
            <div className="grid grid-cols-5 gap-2">
              {PALETTES.map((palette) => {
                const isActive = currentPalette?.name === palette.name;
                return (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => applyPalette(palette)}
                    className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                      isActive ? "border-gray-800 shadow-sm" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="flex gap-0.5">
                      <div className="w-4 h-6 rounded-l-sm" style={{ backgroundColor: palette.black }} />
                      <div className="w-4 h-6" style={{ backgroundColor: palette.accent }} />
                      <div className="w-4 h-6 rounded-r-sm" style={{ backgroundColor: palette.light }} />
                    </div>
                    <span className="text-[10px] text-gray-600 font-medium">{palette.name}</span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom palettes */}
          {customPalettes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-3 tracking-wide uppercase">Mis paletas</p>
              <div className="grid grid-cols-5 gap-2">
                {customPalettes.map((palette) => {
                  const isActive = currentPalette?.name === palette.name && currentPalette?.custom;
                  return (
                    <div key={palette.name} className="relative group/card">
                      <button
                        type="button"
                        onClick={() => applyPalette(palette)}
                        className={`w-full flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                          isActive ? "border-gray-800 shadow-sm" : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <div className="flex gap-0.5">
                          <div className="w-4 h-6 rounded-l-sm" style={{ backgroundColor: palette.black }} />
                          <div className="w-4 h-6" style={{ backgroundColor: palette.accent }} />
                          <div className="w-4 h-6 rounded-r-sm" style={{ backgroundColor: palette.light }} />
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium truncate w-full text-center">{palette.name}</span>
                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCustomPalette(palette.name)}
                        title="Eliminar paleta"
                        className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 text-white rounded-full items-center justify-center text-[9px] hidden group-hover/card:flex"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save current as palette */}
          {showSavePalette ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveCustomPalette(); } if (e.key === "Escape") setShowSavePalette(false); }}
                placeholder="Nombre de la paleta…"
                autoFocus
                maxLength={24}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
              />
              <button
                type="button"
                onClick={saveCustomPalette}
                disabled={!newPaletteName.trim()}
                className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => { setShowSavePalette(false); setNewPaletteName(""); }}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSavePalette(true)}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 pt-1"
            >
              <span className="text-base leading-none">+</span>
              Guardar colores actuales como nueva paleta
            </button>
          )}
        </div>

        {/* Individual color fields */}
        <div className="px-6 py-5 space-y-5 border-t border-gray-100 mt-3">
          <p className="text-xs font-medium text-gray-600 tracking-wide uppercase">Ajuste fino</p>
          {COLOR_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
                {field.label}
              </label>
              {renderInput(field)}
            </div>
          ))}
        </div>
      </section>

      {/* All other sections */}
      {SECTIONS.map((section) => (
        <section key={section.title} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800">{section.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
          </div>
          <div className="px-6 py-5 space-y-6">
            {section.fields.map((field) => (
              <div key={field.key} className="space-y-3">
                {/* ES field */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
                    {field.label}
                    {field.en_key && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-gray-100 text-gray-500">ES</span>
                    )}
                  </label>
                  {renderInput(field)}
                </div>
                {/* EN field — only if field has en_key */}
                {field.en_key && (
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
                      {field.label.replace(/—.*$/, "").trim()} — English
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-blue-50 text-blue-500">EN</span>
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={values[field.en_key] as string}
                        onChange={(e) => handleChange(field.en_key!, e.target.value)}
                        rows={field.rows ?? 3}
                        placeholder={field.en_placeholder ?? ""}
                        className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-y bg-blue-50/30"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.en_key] as string}
                        onChange={(e) => handleChange(field.en_key!, e.target.value)}
                        placeholder={field.en_placeholder ?? ""}
                        className="w-full border border-blue-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-blue-50/30"
                      />
                    )}
                  </div>
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
