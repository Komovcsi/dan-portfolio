import { getCategories } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CategoriesClient from "./CategoriesClient";

export const metadata = { title: "Categories | Admin" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  const supabase = createAdminClient();
  const albumCounts: Record<string, number> = {};

  if (categories.length > 0) {
    const slugs = categories.map((c) => c.slug);
    const { data } = await supabase
      .from("albums")
      .select("category")
      .in("category", slugs);

    for (const row of data ?? []) {
      albumCounts[row.category] = (albumCounts[row.category] ?? 0) + 1;
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage album categories. Categories are referenced by slug, so renaming a category also updates its URL filter.
        </p>
      </div>
      <CategoriesClient categories={categories} albumCounts={albumCounts} />
    </div>
  );
}
