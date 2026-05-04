"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "all";

  function setCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`/albums?${params.toString()}`);
  }

  const all = [{ slug: "all", name: "All" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {all.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            current === cat.slug
              ? "bg-blue-500 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626] hover:border-blue-500/40"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
