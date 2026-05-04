"use client";

import { useTransition } from "react";
import { deleteAlbum } from "@/actions/albums";

export default function DeleteAlbumButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${name}"? This will also remove all its photos.`)) return;
    startTransition(async () => {
      await deleteAlbum(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-xs disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
