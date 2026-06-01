import sharp from "sharp";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

function uploadsDir() {
  return join(process.cwd(), "public", "uploads");
}

export async function saveImage(file: File): Promise<string> {
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${randomUUID()}.webp`;
  const filepath = join(dir, filename);

  await sharp(buffer)
    .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(filepath);

  return `/uploads/${filename}`;
}

export async function deleteImage(url: string) {
  try {
    if (!url.startsWith("/uploads/")) return;
    const filename = url.split("/").pop();
    if (!filename) return;
    await unlink(join(uploadsDir(), filename));
  } catch {
    // archivo ya no existe, ignorar
  }
}
