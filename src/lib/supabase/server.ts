import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Album, Photo, ContactMessage, SiteSettings, DownloadEvent, Category } from "@/types";

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

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
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

const defaultSettings: SiteSettings = {
  id: 1,
  photographer_name: "Dan",
  hero_badge: "Sports & Party Photography",
  hero_headline: "Capturing the moment",
  hero_subheadline:
    "From the intensity of sport to the joy of celebration — every frame tells a story worth remembering.",
  stat1_value: "100+",
  stat1_label: "Sports events covered",
  stat2_value: "50+",
  stat2_label: "Parties & celebrations",
  stat3_value: "10k+",
  stat3_label: "Photos captured",
  about_bio_1:
    "I'm a passionate photographer with a love for capturing raw, unscripted moments — whether it's the decisive split-second of a sports play or the genuine laughter at a friend's party.",
  about_bio_2:
    "I started shooting as a hobby, borrowing a friend's camera at a local football match. Since then I've shot dozens of sport events — from school tournaments to regional championships — and countless gatherings that I'm proud to have documented.",
  about_bio_3:
    "My style leans toward natural light and authentic emotion. I believe the best photos don't feel staged — they feel like a memory you can hold in your hands.",
  about_photo_url: null,
  about_camera: "Sony A7 IV",
  about_favourite_lens: "85mm f/1.8",
  about_based_in: "Slovenia",
  about_shooting_since: "2019",
  contact_email: "dan@example.com",
  contact_response_time: "Within 24 hours",
  download_password: null,
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data ?? defaultSettings;
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

export async function getDownloadStats() {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [total, thisMonth, thisWeek, recent] = await Promise.all([
    supabase.from("download_events").select("id", { count: "exact", head: true }),
    supabase.from("download_events").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth),
    supabase.from("download_events").select("id", { count: "exact", head: true }).gte("created_at", startOfWeek),
    supabase.from("download_events").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const events: DownloadEvent[] = recent.data ?? [];

  // aggregate by album
  const albumCounts: Record<string, { name: string; count: number }> = {};
  for (const e of events) {
    if (e.album_name) {
      if (!albumCounts[e.album_name]) albumCounts[e.album_name] = { name: e.album_name, count: 0 };
      albumCounts[e.album_name].count++;
    }
  }
  const topAlbums = Object.values(albumCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return {
    total: total.count ?? 0,
    thisMonth: thisMonth.count ?? 0,
    thisWeek: thisWeek.count ?? 0,
    recentEvents: events,
    topAlbums,
  };
}
