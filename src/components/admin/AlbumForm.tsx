"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Album } from "@/types";

interface AlbumFormProps {
  album?: Album;
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean; slug?: string }>;
}

const initialState = { error: undefined as string | undefined, success: false };

export default function AlbumForm({ album, action }: AlbumFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await action(formData);
      return {
        error: result.error,
        success: result.success ?? false,
      };
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/albums");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Album Name
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={album?.name}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="e.g. Football Finals 2025"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Category
        </label>
        <select
          name="category"
          required
          defaultValue={album?.category ?? "sports"}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          <option value="sports">Sports</option>
          <option value="parties">Parties</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description{" "}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={album?.description ?? ""}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          placeholder="Brief description of this album…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Download password{" "}
          <span className="text-gray-600 font-normal">(optional)</span>
        </label>
        <input
          name="download_password"
          type="password"
          autoComplete="new-password"
          defaultValue={album?.download_password ?? ""}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Leave blank to use the global password"
        />
        <p className="text-xs text-gray-500 mt-1">
          Overrides the global download password for this album only.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_featured"
          id="is_featured"
          defaultChecked={album?.is_featured}
          className="w-4 h-4 rounded border-[#262626] bg-[#1a1a1a] accent-blue-500"
        />
        <label htmlFor="is_featured" className="text-sm text-gray-300">
          Feature this album on the homepage
        </label>
      </div>

      {state.error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
        >
          {pending ? "Saving…" : album ? "Update Album" : "Create Album"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/albums")}
          className="px-6 py-2.5 bg-[#1a1a1a] border border-[#262626] hover:bg-[#262626] text-gray-300 font-semibold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
