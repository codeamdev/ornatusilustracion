"use client";

import { useRef, useState } from "react";

interface HeroVideoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function HeroVideoUpload({ label, value, onChange }: HeroVideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(`Subiendo ${file.name}…`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/video", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        onChange(data.data.url);
        setProgress("");
      } else {
        setProgress(`Error: ${data.error}`);
      }
    } catch {
      setProgress("Error al subir el video.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700 tracking-wide">{label}</label>

      {value ? (
        <div className="relative rounded border border-gray-200 overflow-hidden bg-black">
          <video
            src={value}
            className="w-full max-h-40 object-contain"
            controls={false}
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1 bg-white/90 text-gray-700 text-xs rounded hover:bg-white transition-colors"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-2.5 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Quitar
            </button>
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded font-mono truncate max-w-[70%]">
            {value.split("/").pop()}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-lg p-6 flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          <span className="text-xs">{uploading ? progress : "Subir video (MP4 / WebM, máx. 200 MB)"}</span>
        </button>
      )}

      {uploading && (
        <p className="text-xs text-gray-500 animate-pulse">{progress}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
