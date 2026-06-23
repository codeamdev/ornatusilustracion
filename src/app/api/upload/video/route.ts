import { NextRequest, NextResponse } from "next/server";
import { getAuthAdmin } from "@/lib/auth";
import { saveVideo } from "@/lib/storage";

const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const MAX_SIZE = 200 * 1024 * 1024; // 200 MB

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Formato no válido. Usa MP4, WebM u OGG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "El video no puede superar 200 MB." },
        { status: 400 }
      );
    }

    const url = await saveVideo(file);
    return NextResponse.json({ success: true, data: { url } });
  } catch (err) {
    console.error("[upload/video]", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
