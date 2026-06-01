import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (err) {
    console.error("[categories GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "El nombre de categoría es requerido" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name: name.trim(), slug: toSlug(name.trim()) },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "La categoría ya existe" },
        { status: 409 }
      );
    }
    console.error("[categories POST]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
