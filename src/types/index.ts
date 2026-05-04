export interface Album {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  category: "sports" | "parties";
  is_featured: boolean;
  display_order: number;
  created_at: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  album_id: string;
  cloudinary_public_id: string;
  url: string;
  thumbnail_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  photographer_name: string;
  hero_badge: string;
  hero_headline: string;
  hero_subheadline: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  about_bio_1: string;
  about_bio_2: string;
  about_bio_3: string;
  about_photo_url: string | null;
  about_camera: string;
  about_favourite_lens: string;
  about_based_in: string;
  about_shooting_since: string;
  contact_email: string;
  contact_response_time: string;
  download_password: string | null;
  updated_at: string;
}

export interface DownloadEvent {
  id: string;
  type: "photo" | "album";
  album_id: string | null;
  album_name: string | null;
  photo_id: string | null;
  created_at: string;
}
