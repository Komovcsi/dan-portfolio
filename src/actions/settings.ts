"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateSiteSettings(formData: FormData) {
  const supabase = createAdminClient();

  const updates = {
    photographer_name: formData.get("photographer_name") as string,
    hero_badge: formData.get("hero_badge") as string,
    hero_headline: formData.get("hero_headline") as string,
    hero_subheadline: formData.get("hero_subheadline") as string,
    stat1_value: formData.get("stat1_value") as string,
    stat1_label: formData.get("stat1_label") as string,
    stat2_value: formData.get("stat2_value") as string,
    stat2_label: formData.get("stat2_label") as string,
    stat3_value: formData.get("stat3_value") as string,
    stat3_label: formData.get("stat3_label") as string,
    about_bio_1: formData.get("about_bio_1") as string,
    about_bio_2: formData.get("about_bio_2") as string,
    about_bio_3: formData.get("about_bio_3") as string,
    about_photo_url: (formData.get("about_photo_url") as string) || null,
    about_camera: formData.get("about_camera") as string,
    about_favourite_lens: formData.get("about_favourite_lens") as string,
    about_based_in: formData.get("about_based_in") as string,
    about_shooting_since: formData.get("about_shooting_since") as string,
    contact_email: formData.get("contact_email") as string,
    contact_response_time: formData.get("contact_response_time") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...updates });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
  return { success: true };
}
