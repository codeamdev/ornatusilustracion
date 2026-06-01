import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { mergeConfig, CONFIG_DEFAULTS } from "@/lib/site-config";

// GET /api/config — público, devuelve toda la configuración del sitio
export async function GET() {
  try {
    const rows = await prisma.siteConfig.findMany();
    const config = mergeConfig(rows);
    return NextResponse.json({ success: true, data: config });
  } catch (err) {
    console.error("[config GET]", err);
    // En caso de error de BD, devuelve los defaults para que el sitio siga funcionando
    return NextResponse.json({ success: true, data: CONFIG_DEFAULTS });
  }
}

// PATCH /api/config — admin, actualiza uno o varios campos
export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body: Record<string, string> = await req.json();
    const validKeys = Object.keys(CONFIG_DEFAULTS);

    const updates = Object.entries(body).filter(
      ([key, value]) => validKeys.includes(key) && typeof value === "string"
    );

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No hay campos válidos" }, { status: 400 });
    }

    // Upsert cada campo
    await Promise.all(
      updates.map(([key, value]) =>
        prisma.siteConfig.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    const rows = await prisma.siteConfig.findMany();
    return NextResponse.json({ success: true, data: mergeConfig(rows) });
  } catch (err) {
    console.error("[config PATCH]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
