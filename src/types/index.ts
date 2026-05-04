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
