"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/context/ToastContext";
import type { ICategory } from "@/types";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [saving, setSaving] = useState(false);

  function fetchCategories() {
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openCreate() {
    setEditingCategory(null);
    setName("");
    setNameEn("");
    setModalOpen(true);
  }

  function openEdit(cat: ICategory) {
    setEditingCategory(cat);
    setName(cat.name);
    setNameEn(cat.name_en || "");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);

    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), name_en: nameEn.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        toast(editingCategory ? "Categoría actualizada" : "Categoría creada");
        setModalOpen(false);
        fetchCategories();
      } else {
        toast(data.error || "Error", "error");
      }
    } catch {
      toast("Error de conexión", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;

    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast("Categoría eliminada");
      fetchCategories();
    } else {
      toast(data.error || "Error", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black">
          Categorías
        </h1>
        <Button size="sm" onClick={openCreate}>
          + Nueva
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : categories.length === 0 ? (
        <div className="bg-white p-10 rounded shadow-sm text-center">
          <p className="text-gallery-gray mb-4">No hay categorías.</p>
          <Button size="sm" onClick={openCreate}>
            Crear primera categoría
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gallery-border text-xs tracking-[0.1em] uppercase text-gallery-gray">
                <th className="text-left p-4">Nombre</th>
                <th className="text-left p-4 hidden sm:table-cell">Slug</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-gallery-border/50 hover:bg-gallery-light/50 transition-colors"
                >
                  <td className="p-4 text-sm font-medium">{cat.name}</td>
                  <td className="p-4 hidden sm:table-cell text-sm text-gallery-gray">
                    {cat.slug}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-xs text-gallery-gray hover:text-gallery-black transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-xs text-gallery-gray hover:text-red-500 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
      >
        <div className="space-y-6">
          <Input
            id="cat-name"
            label="Nombre — ES"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Murales"
            autoFocus
          />
          <Input
            id="cat-name-en"
            label="Name — EN"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="E.g.: Murals"
          />
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>
              {editingCategory ? "Guardar" : "Crear"}
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
