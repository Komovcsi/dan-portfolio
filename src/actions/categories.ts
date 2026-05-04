"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  if (!name) return { error: "Name is required." };

  const slug = slugify(name);
  if (!slug) return { error: "Name produces an invalid slug." };

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    display_order: count ?? 0,
  });

  if (error) {
    if (error.code === "23505") return { error: "A category with that name already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/albums");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name = (formData.get("name") as string).trim();
  if (!name) return { error: "Name is required." };

  const slug = slugify(name);
  if (!slug) return { error: "Name produces an invalid slug." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "A category with that name already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/albums");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .single();

  if (!cat) return { error: "Category not found." };

  const { count } = await supabase
    .from("albums")
    .select("id", { count: "exact", head: true })
    .eq("category", cat.slug);

  if ((count ?? 0) > 0) {
    return { error: `Cannot delete: ${count} album(s) still use this category.` };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/albums");
  return { success: true };
}
