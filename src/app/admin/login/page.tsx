"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

export default function AdminLoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        toast("Sesión iniciada");
        window.location.href = "/admin";
      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gallery-light px-6">
      <div className="w-full max-w-sm bg-white p-10 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black">
            Ornatus
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-gallery-gray mt-2">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="admin@ornatus.art"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
