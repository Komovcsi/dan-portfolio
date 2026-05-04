"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAlbumZipUrl, getPhotoDownloadUrl } from "@/lib/cloudinary";

async function resolveDownloadPassword(albumId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const [settings, album] = await Promise.all([
    supabase.from("site_settings").select("download_password").single(),
    supabase.from("albums").select("download_password").eq("id", albumId).single(),
  ]);
  // Album-specific password takes priority over the global one
  return album.data?.download_password ?? settings.data?.download_password ?? null;
}

async function logDownloadEvent(params: {
  type: "photo" | "album";
  albumId?: string;
  albumName?: string;
  photoId?: string;
}) {
  const supabase = createAdminClient();
  await supabase.from("download_events").insert({
    type: params.type,
    album_id: params.albumId ?? null,
    album_name: params.albumName ?? null,
    photo_id: params.photoId ?? null,
  });
}

export async function verifyAndDownloadPhoto(
  password: string,
  publicId: string,
  photoId: string,
  albumId: string,
  albumName: string
): Promise<{ url?: string; error?: string }> {
  const storedPassword = await resolveDownloadPassword(albumId);

  if (!storedPassword) return { error: "Downloads are not enabled." };
  if (password !== storedPassword) return { error: "Incorrect password." };

  await logDownloadEvent({ type: "photo", albumId, albumName, photoId });

  return { url: getPhotoDownloadUrl(publicId) };
}

export async function verifyAndDownloadAlbum(
  password: string,
  albumId: string,
  albumName: string
): Promise<{ url?: string; error?: string }> {
  const storedPassword = await resolveDownloadPassword(albumId);

  if (!storedPassword) return { error: "Downloads are not enabled." };
  if (password !== storedPassword) return { error: "Incorrect password." };

  const supabase = createAdminClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("cloudinary_public_id")
    .eq("album_id", albumId);

  if (!photos || photos.length === 0) return { error: "No photos in this album." };

  const publicIds = photos.map((p) => p.cloudinary_public_id);
  const url = getAlbumZipUrl(publicIds, albumName);

  await logDownloadEvent({ type: "album", albumId, albumName });

  return { url };
}
