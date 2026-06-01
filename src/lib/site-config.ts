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
  site_description: string;
  artist_name: string;

  // ── Hero (página principal) ─────────────────────────
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  // ── Textos de inicio ────────────────────────────────
  statement_quote: string;
  commission_title: string;
  commission_description: string;

  // ── Sobre mí ────────────────────────────────────────
  artist_portrait_url: string;
  artist_bio_1: string;
  artist_bio_2: string;
  artist_process_1: string;
  artist_process_2: string;

  // ── Contacto y redes ────────────────────────────────
  whatsapp_number: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  pinterest_url: string;

  // ── Footer ──────────────────────────────────────────
  footer_tagline: string;

  // ── SEO ─────────────────────────────────────────────
  meta_title: string;
  meta_description: string;
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
  site_description:
    "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
  artist_name: "La Artista",

  // Hero
  hero_title: "Ornatus",
  hero_subtitle:
    "Piezas únicas hechas a mano. Arte que transforma tu espacio y cuenta tu historia.",
  hero_image_url: "",
  hero_cta_primary: "Explorar Colección",
  hero_cta_secondary: "Encargar Pieza",

  // Inicio
  statement_quote:
    "Cada obra es una conversación entre el color, la forma y la emoción. Pinto para encontrar lo que no se puede decir con palabras.",
  commission_title: "¿Buscas algo hecho solo para ti?",
  commission_description:
    "Creo piezas por encargo adaptadas a tu espacio y tu historia. Cuéntame tu idea y la haremos realidad juntos.",

  // Sobre mí
  artist_portrait_url: "/artist-portrait.jpg",
  artist_bio_1:
    "Artista multidisciplinar con más de diez años de experiencia creando piezas únicas que fusionan técnicas tradicionales con una visión contemporánea. Cada obra nace de la observación, la paciencia y un profundo respeto por los materiales.",
  artist_bio_2:
    "Desde murales que transforman espacios hasta delicadas piezas de cerámica pintadas a mano, mi trabajo busca llevar el arte a la vida cotidiana. Creo en el poder de los objetos hechos con cuidado para transformar nuestro entorno.",
  artist_process_1:
    "Cada pieza comienza con una idea, un color, una textura que me inspira. Trabajo capa por capa, dejando que la obra me guíe. No hay dos piezas iguales — cada una lleva la huella del momento en que fue creada.",
  artist_process_2:
    "Utilizo materiales de alta calidad y técnicas que he perfeccionado a lo largo de los años. Desde la selección del lienzo hasta la última pincelada, cada paso es intencional.",

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

  // SEO
  meta_title: "Ornatus — Arte Hecho a Mano",
  meta_description:
    "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
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
