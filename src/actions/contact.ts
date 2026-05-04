"use server";

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

  // Send email notification — non-fatal
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("contact_email, photographer_name")
        .single();

      if (settings?.contact_email) {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: settings.contact_email,
          subject: `New message: ${subject.trim()}`,
          text: [
            `From: ${name.trim()} <${email.trim()}>`,
            `Subject: ${subject.trim()}`,
            "",
            message.trim(),
          ].join("\n"),
        });
      }
    }
  } catch {
    // Email failure doesn't affect the user response
  }

  return { success: true };
}
