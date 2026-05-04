"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createAlbum(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "on";
  const download_password = (formData.get("download_password") as string)?.trim() || null;

  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  const slug = slugify(name);
  const supabase = createAdminClient();

  const { error } = await supabase.from("albums").insert({
    name,
    slug,
    category,
    description,
    is_featured,
    download_password,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "An album with this name already exists." };
    }
    return { error: "Failed to create album." };
  }

  revalidatePath("/albums");
  revalidatePath("/admin/albums");
  revalidatePath("/");
  return { success: true, slug };
}

export async function updateAlbum(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const description = (formData.get("description") as string)?.trim() || null;
  const is_featured = formData.get("is_featured") === "on";
  const download_password = (formData.get("download_password") as string)?.trim() || null;

  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("albums").update({
    name,
    category,
    description,
    is_featured,
    download_password,
  }).eq("id", id);

  if (error) return { error: "Failed to update album." };

  revalidatePath("/albums");
  revalidatePath("/admin/albums");
  revalidatePath("/");
  return { success: true };
}

export async function updateAlbumCover(id: string, slug: string, coverUrl: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("albums").update({ cover_image_url: coverUrl }).eq("id", id);
  if (error) return { error: "Failed to update cover." };
  revalidatePath(`/albums/${slug}`);
  revalidatePath("/albums");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAlbum(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("albums").delete().eq("id", id);
  if (error) return { error: "Failed to delete album." };
  revalidatePath("/albums");
  revalidatePath("/admin/albums");
  revalidatePath("/");
  return { success: true };
}
