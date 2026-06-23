"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface HeroImagesUploadProps {
  label: string;
  value: string;
  onChange: (csv: string) => void;
}

export default function HeroImagesUpload({ label, value, onChange }: HeroImagesUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const added: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) added.push(data.data.url);
      } catch {
        console.error("Upload failed:", file.name);
      }
    }

    const updated = [...images, ...added];
    onChange(updated.join(", "));
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.join(", "));
  }

  function move(from: number, to: number) {
    const updated = [...images];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated.join(", "));
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700 tracking-wide">{label}</label>
      <p className="text-[11px] text-gray-400">Arrastra para reordenar. El primero es la imagen inicial del carrusel.</p>

      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={`${url}-${i}`} className="relative w-28 h-20 bg-gray-100 rounded group overflow-hidden border border-gray-200">
            <Image src={url} alt={`Hero ${i + 1}`} fill className="object-cover" sizes="112px" />

            {/* Order arrows */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  className="w-6 h-6 bg-white/90 text-gray-700 rounded text-xs flex items-center justify-center hover:bg-white"
                  title="Mover izquierda"
                >
                  ←
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-6 h-6 bg-red-500 text-white rounded text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              {i < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  className="w-6 h-6 bg-white/90 text-gray-700 rounded text-xs flex items-center justify-center hover:bg-white"
                  title="Mover derecha"
                >
                  →
                </button>
              )}
            </div>

            <div className="absolute bottom-1 left-1 w-4 h-4 bg-black/50 text-white text-[9px] rounded-full flex items-center justify-center font-mono">
              {i + 1}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-28 h-20 border-2 border-dashed border-gray-300 hover:border-gray-500 rounded flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 gap-1"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M12 8v8m-4-4h8"/>
              </svg>
              <span className="text-[10px]">Agregar</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
