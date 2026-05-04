import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Album, Photo, ContactMessage } from "@/types";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies — middleware handles session refresh
          }
        },
      },
    }
  );
}

export async function getAlbums(category?: string): Promise<Album[]> {
  const supabase = await createClient();
  let query = supabase
    .from("albums")
    .select("*")
    .order("display_order", { ascending: true });
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data } = await query;
  return data ?? [];
}

export async function getFeaturedAlbums(): Promise<Album[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(6);
  return data ?? [];
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getPhotosByAlbum(albumId: string): Promise<Photo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", albumId)
    .order("display_order", { ascending: true });
  return data ?? [];
}

export async function getAllAlbumsForAdmin(): Promise<Album[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*, photos(count)")
    .order("display_order", { ascending: true });
  return data ?? [];
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getDashboardStats() {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const [albums, photos, messages, unread] = await Promise.all([
    supabase.from("albums").select("id", { count: "exact", head: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  return {
    albumCount: albums.count ?? 0,
    photoCount: photos.count ?? 0,
    messageCount: messages.count ?? 0,
    unreadCount: unread.count ?? 0,
  };
}
