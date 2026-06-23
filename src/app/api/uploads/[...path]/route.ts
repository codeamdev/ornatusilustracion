import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { join } from "path";
import { Readable } from "stream";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  mov: "video/quicktime",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // Only allow single-level filenames — no path traversal
  if (path.length !== 1 || path[0].includes("..") || path[0].includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filename = path[0];
  const filepath = join(UPLOADS_DIR, filename);

  if (!existsSync(filepath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stat = statSync(filepath);
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext] ?? "application/octet-stream";

  const stream = createReadStream(filepath);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
