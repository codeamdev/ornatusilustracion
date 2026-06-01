import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, authCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = signToken({ id: admin.id, email: admin.email });
    const cookieOpts = authCookieOptions();

    const res = NextResponse.json({
      success: true,
      data: { name: admin.name, email: admin.email },
    });
    res.cookies.set(cookieOpts.name, token, cookieOpts);
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
