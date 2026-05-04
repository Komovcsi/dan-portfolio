"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function savePhoto(data: {
  album_id: string;
  cloudinary_public_id: string;
  url: string;
  thumbnail_url: string;
  caption?: string;
}) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("photos")
    .select("display_order")
    .eq("album_id", data.album_id)
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = existing ? existing.display_order + 1 : 0;

  const { error } = await supabase.from("photos").insert({
    ...data,
    display_order,
    caption: data.caption ?? null,
  });

  if (error) return { error: "Failed to save photo." };

  revalidatePath(`/admin/albums/${data.album_id}`);
  return { success: true };
}

export async function deletePhoto(id: string, cloudinaryPublicId: string, albumSlug: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) return { error: "Failed to delete photo." };

  await deleteCloudinaryAsset(cloudinaryPublicId).catch(() => {});

  revalidatePath(`/albums/${albumSlug}`);
  return { success: true };
}

export async function markMessageRead(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  if (error) return { error: "Failed to update message." };
  revalidatePath("/admin/messages");
  return { success: true };
}
