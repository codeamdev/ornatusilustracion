// Definición centralizada de todas las claves configurables del sitio.
// Cada clave tiene un valor por defecto que se usa si no existe en la BD.

export interface SiteConfigMap {
  // ── Colores ─────────────────────────────────────────
  color_accent: string;
  color_black: string;
  color_white: string;
  color_gray: string;
  color_light: string;
  color_border: string;

  // ── Identidad ──────────────────────────────────────
  site_name: string;
  site_tagline: string;
  site_tagline_en: string;
  site_description: string;
  site_description_en: string;
  artist_name: string;

  // ── Hero ────────────────────────────────────────────
  hero_title: string;
  hero_title_en: string;
  hero_subtitle: string;
  hero_subtitle_en: string;
  // Legacy single image
  hero_image_url: string;
  // Videos por orientación
  hero_video_desktop: string;
  hero_video_mobile: string;
  // Carrusel de imágenes (URLs separadas por comas)
  hero_images_desktop: string;
  hero_images_mobile: string;
  hero_cta_primary: string;
  hero_cta_primary_en: string;
  hero_cta_secondary: string;
  hero_cta_secondary_en: string;

  // ── Textos de inicio ────────────────────────────────
  statement_quote: string;
  statement_quote_en: string;
  commission_title: string;
  commission_title_en: string;
  commission_description: string;
  commission_description_en: string;

  // ── Sobre mí ────────────────────────────────────────
  artist_portrait_url: string;
  artist_bio_1: string;
  artist_bio_1_en: string;
  artist_bio_2: string;
  artist_bio_2_en: string;
  artist_process_1: string;
  artist_process_1_en: string;
  artist_process_2: string;
  artist_process_2_en: string;

  // ── Contacto y redes ────────────────────────────────
  whatsapp_number: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  pinterest_url: string;

  // ── Footer ──────────────────────────────────────────
  footer_tagline: string;
  footer_tagline_en: string;

  // ── SEO ─────────────────────────────────────────────
  meta_title: string;
  meta_title_en: string;
  meta_description: string;
  meta_description_en: string;

  // ── Email (SMTP) ────────────────────────────────────
  smtp_host: string;
  smtp_port: string;
  smtp_secure: string;
  smtp_user: string;
  smtp_pass: string;
  from_email: string;
  admin_email: string;
}

export const CONFIG_DEFAULTS: SiteConfigMap = {
  // Colores
  color_accent: "#A67C52",
  color_black: "#1C1917",
  color_white: "#FAF8F4",
  color_gray: "#78716C",
  color_light: "#F0ECE5",
  color_border: "#DDD6CB",

  // Identidad
  site_name: "Ornatus",
  site_tagline: "Arte Hecho a Mano",
  site_tagline_en: "",
  site_description:
    "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
  site_description_en: "",
  artist_name: "La Artista",

  // Hero
  hero_title: "Ornatus",
  hero_title_en: "",
  hero_subtitle:
    "Piezas únicas hechas a mano. Arte que transforma tu espacio y cuenta tu historia.",
  hero_subtitle_en: "",
  hero_image_url: "",
  hero_video_desktop: "",
  hero_video_mobile: "",
  hero_images_desktop: "",
  hero_images_mobile: "",
  hero_cta_primary: "Explorar Colección",
  hero_cta_primary_en: "",
  hero_cta_secondary: "Encargar Pieza",
  hero_cta_secondary_en: "",

  // Inicio
  statement_quote:
    "Cada obra es una conversación entre el color, la forma y la emoción. Pinto para encontrar lo que no se puede decir con palabras.",
  statement_quote_en: "",
  commission_title: "¿Buscas algo hecho solo para ti?",
  commission_title_en: "",
  commission_description:
    "Creo piezas por encargo adaptadas a tu espacio y tu historia. Cuéntame tu idea y la haremos realidad juntos.",
  commission_description_en: "",

  // Sobre mí
  artist_portrait_url: "/artist-portrait.jpg",
  artist_bio_1:
    "Artista multidisciplinar con más de diez años de experiencia creando piezas únicas que fusionan técnicas tradicionales con una visión contemporánea. Cada obra nace de la observación, la paciencia y un profundo respeto por los materiales.",
  artist_bio_1_en: "",
  artist_bio_2:
    "Desde murales que transforman espacios hasta delicadas piezas de cerámica pintadas a mano, mi trabajo busca llevar el arte a la vida cotidiana. Creo en el poder de los objetos hechos con cuidado para transformar nuestro entorno.",
  artist_bio_2_en: "",
  artist_process_1:
    "Cada pieza comienza con una idea, un color, una textura que me inspira. Trabajo capa por capa, dejando que la obra me guíe. No hay dos piezas iguales — cada una lleva la huella del momento en que fue creada.",
  artist_process_1_en: "",
  artist_process_2:
    "Utilizo materiales de alta calidad y técnicas que he perfeccionado a lo largo de los años. Desde la selección del lienzo hasta la última pincelada, cada paso es intencional.",
  artist_process_2_en: "",

  // Contacto y redes
  whatsapp_number: "34600000000",
  contact_email: "hola@ornatusilustracion.com",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  pinterest_url: "",

  // Footer
  footer_tagline:
    "Arte hecho a mano con pasión. Cada pieza cuenta una historia única y transforma tu espacio en algo extraordinario.",
  footer_tagline_en: "",

  // SEO
  meta_title: "Ornatus — Arte Hecho a Mano",
  meta_title_en: "",
  meta_description:
    "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
  meta_description_en: "",

  // Email
  smtp_host: "",
  smtp_port: "587",
  smtp_secure: "false",
  smtp_user: "",
  smtp_pass: "",
  from_email: "",
  admin_email: "",
};

// Fusiona los valores de la BD con los defaults
export function mergeConfig(
  rows: { key: string; value: string }[]
): SiteConfigMap {
  const result = { ...CONFIG_DEFAULTS };
  for (const { key, value } of rows) {
    if (key in result) {
      (result as Record<string, string>)[key] = value;
    }
  }
  return result;
}
