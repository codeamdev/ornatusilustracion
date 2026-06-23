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
  const [parentId, setParentId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  function fetchCategories() {
    setLoading(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => { if (res.success) setCategories(res.data); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchCategories(); }, []);

  function openCreate(defaultParentId = "") {
    setEditingCategory(null);
    setName("");
    setNameEn("");
    setParentId(defaultParentId);
    setModalOpen(true);
  }

  function openEdit(cat: ICategory) {
    setEditingCategory(cat);
    setName(cat.name);
    setNameEn(cat.name_en || "");
    setParentId(cat.parentId || "");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), name_en: nameEn.trim(), parentId: parentId || null }),
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

  async function handleDelete(id: string, hasChildren = false) {
    const msg = hasChildren
      ? "¿Eliminar esta categoría y todas sus subcategorías?"
      : "¿Eliminar esta categoría?";
    if (!confirm(msg)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast("Categoría eliminada"); fetchCategories(); }
    else toast(data.error || "Error", "error");
  }

  const rootCategories = categories.filter((c) => !c.parentId);

  const modalTitle = editingCategory
    ? `Editar: ${editingCategory.name}`
    : parentId
    ? `Nueva subcategoría`
    : "Nueva categoría";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-gallery-black">
            Categorías
          </h1>
          <p className="text-xs text-gallery-gray mt-1">
            Organiza los productos en categorías y subcategorías.
          </p>
        </div>
        <Button size="sm" onClick={() => openCreate()}>
          + Nueva categoría
        </Button>
      </div>

      {loading ? (
        <Spinner className="py-20" />
      ) : rootCategories.length === 0 ? (
        <div className="bg-white p-10 rounded shadow-sm text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-gallery-border">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p className="text-gallery-gray mb-4">No hay categorías todavía.</p>
          <Button size="sm" onClick={() => openCreate()}>Crear primera categoría</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {rootCategories.map((cat) => {
            const children = cat.children ?? [];
            return (
              <div key={cat.id} className="bg-white rounded shadow-sm overflow-hidden">
                {/* Fila de categoría padre */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gallery-border/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gallery-accent flex-shrink-0">
                      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gallery-black">{cat.name}</span>
                      {cat.name_en && (
                        <span className="ml-2 text-xs text-gallery-gray">/ {cat.name_en}</span>
                      )}
                      <span className="ml-2 text-[10px] text-gallery-border font-mono">{cat.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                    <button
                      onClick={() => openEdit(cat)}
                      className="px-3 py-1.5 text-xs text-gallery-gray hover:text-gallery-black hover:bg-gallery-light rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, children.length > 0)}
                      className="px-3 py-1.5 text-xs text-gallery-gray hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Subcategorías */}
                <div className="px-5 py-3 space-y-2">
                  {children.length === 0 ? (
                    <p className="text-xs text-gallery-border italic py-1">Sin subcategorías</p>
                  ) : (
                    children.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-2 pl-5 pr-2 rounded bg-gallery-light/40 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gallery-border text-sm">↳</span>
                          <span className="text-sm text-gallery-black">{sub.name}</span>
                          {sub.name_en && (
                            <span className="text-xs text-gallery-gray">/ {sub.name_en}</span>
                          )}
                          <span className="text-[10px] text-gallery-border font-mono hidden sm:inline">{sub.slug}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(sub)}
                            className="px-2.5 py-1 text-xs text-gallery-gray hover:text-gallery-black hover:bg-white rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="px-2.5 py-1 text-xs text-gallery-gray hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Botón agregar subcategoría */}
                  <button
                    onClick={() => openCreate(cat.id)}
                    className="flex items-center gap-2 text-xs text-gallery-gray hover:text-gallery-accent transition-colors py-1.5 pl-5"
                  >
                    <span className="text-base leading-none">+</span>
                    Agregar subcategoría de {cat.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        <div className="space-y-5">
          {parentId && !editingCategory && (
            <div className="bg-gallery-light px-4 py-2.5 rounded text-sm text-gallery-gray">
              Subcategoría de:{" "}
              <span className="font-medium text-gallery-black">
                {rootCategories.find((c) => c.id === parentId)?.name}
              </span>
            </div>
          )}

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
            label="Name — EN (opcional)"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="E.g.: Murals"
          />

          {/* Solo al editar se permite cambiar el padre */}
          {editingCategory && (
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-gallery-gray mb-2">
                Pertenece a
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gallery-border bg-transparent p-2.5 text-sm text-gallery-black focus:outline-none focus:border-gallery-black rounded transition-colors"
              >
                <option value="">— Categoría raíz (sin padre) —</option>
                {rootCategories
                  .filter((c) => c.id !== editingCategory.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button onClick={handleSave} loading={saving}>
              {editingCategory ? "Guardar cambios" : "Crear"}
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
