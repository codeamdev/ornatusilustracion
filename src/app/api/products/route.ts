import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin } from "@/lib/auth";
import { validateProductData } from "@/lib/validations";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    const where: Record<string, unknown> = { active: true };

    if (category) where.categoryId = category;
    if (featured === "true") where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, name_en: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[products GET]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const errors = validateProductData(body);
    if (errors.length) {
      return NextResponse.json({ success: false, error: errors.join(", ") }, { status: 400 });
    }

    const slug = body.slug || toSlug(body.name);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description ?? "",
        description_en: body.description_en ?? "",
        story: body.story ?? "",
        story_en: body.story_en ?? "",
        inspiration: body.inspiration ?? "",
        inspiration_en: body.inspiration_en ?? "",
        materials: body.materials ?? "",
        materials_en: body.materials_en ?? "",
        dimensions: body.dimensions ?? "",
        year: body.year ?? null,
        edition: body.edition ?? "Pieza única — 1/1",
        edition_en: body.edition_en ?? "",
        creationTime: body.creationTime ?? "",
        creationTime_en: body.creationTime_en ?? "",
        uniqueTraits: body.uniqueTraits ?? [],
        uniqueTraits_en: body.uniqueTraits_en ?? [],
        price: body.price ?? null,
        images: body.images ?? [],
        categoryId: body.category,
        featured: body.featured ?? false,
        active: body.active ?? true,
        stock: body.stock ?? 0,
        showStock: body.showStock ?? false,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Ya existe un producto con ese nombre" },
        { status: 409 }
      );
    }
    console.error("[products POST]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
