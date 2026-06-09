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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, name_en } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "El nombre de categoría es requerido" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: toSlug(name.trim()),
        name_en: name_en?.trim() ?? "",
      },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err) {
      if (err.code === "P2025") {
        return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      }
      if (err.code === "P2002") {
        return NextResponse.json(
          { success: false, error: "La categoría ya existe" },
          { status: 409 }
        );
      }
    }
    console.error("[categories/:id PUT]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Eliminado" });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    console.error("[categories/:id DELETE]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
