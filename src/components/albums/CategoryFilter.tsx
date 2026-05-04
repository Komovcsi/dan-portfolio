"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "All" },
  { value: "sports", label: "Sports" },
  { value: "parties", label: "Parties" },
];

export default function CategoryFilter() {
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

  return (
    <div className="flex items-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            current === cat.value
              ? "bg-blue-500 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#262626] hover:border-blue-500/40"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
