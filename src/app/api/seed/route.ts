import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

const DEFAULT_CATEGORIES = [
  "Murales",
  "Cuadros",
  "Camisetas",
  "Vajillas",
  "Vasos",
  "Platos",
];

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST() {
  try {
    // Seed only allowed if no admin exists OR caller is authenticated
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      const auth = await getAuthAdmin();
      if (!auth) {
        return NextResponse.json(
          { success: false, error: "Unauthorized — admin already exists" },
          { status: 401 }
        );
      }
    }

    // Seed categories
    let categoriesCreated = 0;
    for (const name of DEFAULT_CATEGORIES) {
      const slug = toSlug(name);
      const exists = await prisma.category.findUnique({ where: { slug } });
      if (!exists) {
        await prisma.category.create({ data: { name, slug } });
        categoriesCreated++;
      }
    }

    // Seed admin if none exists
    let adminCreated = false;
    if (adminCount === 0) {
      const rawPassword = process.env.ADMIN_PASSWORD || "admin123";
      const hashed = await bcrypt.hash(rawPassword, 12);
      await prisma.admin.create({
        data: {
          email: (process.env.ADMIN_EMAIL || "admin@ornatus.art").toLowerCase(),
          password: hashed,
          name: "Admin",
        },
      });
      adminCreated = true;
    }

    return NextResponse.json({
      success: true,
      message: `Seed completo. Categorías creadas: ${categoriesCreated}. Admin creado: ${adminCreated}`,
    });
  } catch (err) {
    console.error("[seed]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Seed fallido: ${message}` },
      { status: 500 }
    );
  }
}
