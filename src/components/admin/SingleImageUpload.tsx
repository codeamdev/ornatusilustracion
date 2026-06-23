"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface SingleImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  size?: number;
}

export default function SingleImageUpload({
  label,
  value,
  onChange,
  hint,
  size = 64,
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) onChange(data.data.url);
    } catch {
      console.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 tracking-wide">
        {label}
      </label>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}

      <div className="flex items-center gap-4">
        {value ? (
          <div
            className="relative border border-gray-200 rounded overflow-hidden bg-gray-50 flex-shrink-0"
            style={{ width: size, height: size }}
          >
            <Image src={value} alt={label} fill className="object-contain p-1" sizes={`${size}px`} />
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-300 flex-shrink-0"
            style={{ width: size, height: size }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            {uploading ? "Subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 text-xs text-red-500 hover:text-red-700 transition-colors text-left"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
