"use server";

import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required." };
  }

  if (name.length < 2 || message.length < 10) {
    return { error: "Please provide a valid name and message." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
  });

  if (error) {
    return { error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
