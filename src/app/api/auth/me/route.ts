import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthAdmin, authCookieOptions } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: auth.id },
      select: { name: true, email: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: "Admin no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (err) {
    console.error("[auth/me]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieOpts = authCookieOptions();
  const res = NextResponse.json({ success: true });
  res.cookies.set(cookieOpts.name, "", { ...cookieOpts, maxAge: 0 });
  return res;
}
