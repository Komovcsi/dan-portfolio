"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/types";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

interface Props {
  categories: Category[];
  albumCounts: Record<string, number>;
}

export default function CategoriesClient({ categories, albumCounts }: Props) {
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", newName);
    startTransition(async () => {
      const result = await createCategory(fd);
      if (result.error) { setError(result.error); return; }
      setNewName("");
    });
  }

  function handleUpdate(e: React.FormEvent, id: string) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", editName);
    startTransition(async () => {
      const result = await updateCategory(id, fd);
      if (result.error) { setError(result.error); return; }
      setEditId(null);
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      {/* Existing categories */}
      <div className="bg-[#111111] border border-[#262626] rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm px-6 py-8 text-center">
            No categories yet. Add one below.
          </p>
        ) : (
          <ul className="divide-y divide-[#262626]">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-6 py-4">
                {editId === cat.id ? (
                  <form
                    onSubmit={(e) => handleUpdate(e, cat.id)}
                    className="flex-1 flex items-center gap-3"
                  >
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 bg-[#1a1a1a] border border-blue-500 rounded-lg text-white text-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="px-3 py-1.5 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-white font-medium">{cat.name}</p>
                      <p className="text-gray-500 text-xs">
                        slug: <span className="font-mono">{cat.slug}</span>
                        {" · "}
                        {albumCounts[cat.slug] ?? 0} album(s)
                      </p>
                    </div>
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); setError(null); }}
                      className="text-gray-400 hover:text-white text-sm transition-colors px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={isPending || (albumCounts[cat.slug] ?? 0) > 0}
                      className="text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors px-2 py-1"
                      title={(albumCounts[cat.slug] ?? 0) > 0 ? "Remove albums first" : "Delete category"}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new */}
      <div className="bg-[#111111] border border-[#262626] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Add category
        </h3>
        <form onSubmit={handleCreate} className="flex items-center gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name (e.g. Weddings)"
            className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={isPending || !newName.trim()}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {isPending ? "Adding…" : "Add category"}
          </button>
        </form>
      </div>
    </div>
  );
}
