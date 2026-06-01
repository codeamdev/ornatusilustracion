import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: { db: { url: "postgresql://postgres:posgres@localhost:5432/ornatus" } },
});

const DEFAULT_CATEGORIES = ["Murales", "Cuadros", "Camisetas", "Vajillas", "Vasos", "Platos"];

const DEFAULT_CONFIG = {
  color_accent: "#A67C52",
  color_black: "#1C1917",
  color_white: "#FAF8F4",
  color_gray: "#78716C",
  color_light: "#F0ECE5",
  color_border: "#DDD6CB",
  site_name: "Ornatus",
  site_tagline: "Arte Hecho a Mano",
  site_description: "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
  artist_name: "La Artista",
  hero_title: "Ornatus",
  hero_subtitle: "Piezas únicas hechas a mano. Arte que transforma tu espacio y cuenta tu historia.",
  hero_image_url: "",
  hero_cta_primary: "Explorar Colección",
  hero_cta_secondary: "Encargar Pieza",
  statement_quote: "Cada obra es una conversación entre el color, la forma y la emoción. Pinto para encontrar lo que no se puede decir con palabras.",
  commission_title: "¿Buscas algo hecho solo para ti?",
  commission_description: "Creo piezas por encargo adaptadas a tu espacio y tu historia. Cuéntame tu idea y la haremos realidad juntos.",
  artist_portrait_url: "/artist-portrait.jpg",
  artist_bio_1: "Artista multidisciplinar con más de diez años de experiencia creando piezas únicas que fusionan técnicas tradicionales con una visión contemporánea. Cada obra nace de la observación, la paciencia y un profundo respeto por los materiales.",
  artist_bio_2: "Desde murales que transforman espacios hasta delicadas piezas de cerámica pintadas a mano, mi trabajo busca llevar el arte a la vida cotidiana. Creo en el poder de los objetos hechos con cuidado para transformar nuestro entorno.",
  artist_process_1: "Cada pieza comienza con una idea, un color, una textura que me inspira. Trabajo capa por capa, dejando que la obra me guíe. No hay dos piezas iguales — cada una lleva la huella del momento en que fue creada.",
  artist_process_2: "Utilizo materiales de alta calidad y técnicas que he perfeccionado a lo largo de los años. Desde la selección del lienzo hasta la última pincelada, cada paso es intencional.",
  whatsapp_number: "",
  contact_email: "hola@ornatusilustracion.com",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  pinterest_url: "",
  footer_tagline: "Arte hecho a mano con pasión. Cada pieza cuenta una historia única y transforma tu espacio en algo extraordinario.",
  meta_title: "Ornatus — Arte Hecho a Mano",
  meta_description: "Galería de arte contemporáneo. Murales, cuadros, camisetas y más, creados con pasión y dedicación.",
};

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // Categories
  let cats = 0;
  for (const name of DEFAULT_CATEGORIES) {
    const slug = toSlug(name);
    const exists = await prisma.category.findUnique({ where: { slug } });
    if (!exists) {
      await prisma.category.create({ data: { name, slug } });
      console.log(`  ✔ Categoría creada: ${name}`);
      cats++;
    }
  }
  if (cats === 0) console.log("  — Categorías ya existían");

  // Admin
  const email = "admin@ornatusilustracion.com";
  const exists = await prisma.admin.findUnique({ where: { email } });
  if (exists) {
    console.log(`\n  — Admin ya existe: ${email}`);
  } else {
    const hashed = await bcrypt.hash("Ornatus2025*", 12);
    await prisma.admin.create({
      data: { email, password: hashed, name: "Admin" },
    });
    console.log(`\n  ✔ Admin creado: ${email}`);
    console.log(`  ✔ Contraseña:   Ornatus2025*`);
  }

  // Config defaults
  let cfgNew = 0;
  for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
    const exists = await prisma.siteConfig.findUnique({ where: { key } });
    if (!exists) {
      await prisma.siteConfig.create({ data: { key, value } });
      cfgNew++;
    }
  }
  if (cfgNew > 0) console.log(`\n  ✔ ${cfgNew} valores de configuración insertados`);
  else console.log("\n  — Configuración ya existía");

  console.log("\n✅ Seed completo.");
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
