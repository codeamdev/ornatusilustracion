"use client";

import type { ICategory } from "@/types";

interface CategoryFilterProps {
  categories: ICategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-all duration-300 ${
          selected === null
            ? "bg-gallery-accent text-white border-gallery-accent"
            : "bg-transparent text-gallery-gray border-gallery-border hover:border-gallery-black hover:text-gallery-black"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-all duration-300 ${
            selected === cat.id
              ? "bg-gallery-accent text-white border-gallery-accent"
              : "bg-transparent text-gallery-gray border-gallery-border hover:border-gallery-black hover:text-gallery-black"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
