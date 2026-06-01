import { NextRequest, NextResponse } from "next/server";
import { validateContactData } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateContactData(body);
    if (errors.length) {
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    await sendContactEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
