"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import type { SiteSettings } from "@/types";
import Image from "next/image";

interface Props {
  settings: SiteSettings;
}

const initialState = { error: undefined as string | undefined, success: false };

export default function SiteSettingsForm({ settings }: Props) {
  const [state, action, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await updateSiteSettings(formData);
      return { error: result.error, success: !!result.success };
    },
    initialState
  );

  const [photoUrl, setPhotoUrl] = useState(settings.about_photo_url ?? "");
  const widgetRef = useRef<{ open: () => void } | null>(null);

  function openPhotoUpload() {
    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }
    // @ts-expect-error cloudinary global
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
        folder: "portfolio/profile",
        cropping: true,
        croppingAspectRatio: 0.75,
      },
      (error: unknown, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result.event === "success") {
          setPhotoUrl(result.info.secure_url);
        }
      }
    );
    widgetRef.current = widget;
    widget.open();
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <form action={action} className="space-y-10">
      {state.success && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          Settings saved successfully.
        </div>
      )}
      {state.error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {/* Identity */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#262626]">
          Site Identity
        </h3>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Photographer name</label>
          <input
            name="photographer_name"
            defaultValue={settings.photographer_name}
            className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Appears in the navbar logo, footer, and About heading.</p>
        </div>
      </section>

      {/* Hero */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#262626]">
          Hero Section
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Badge text</label>
            <input
              name="hero_badge"
              defaultValue={settings.hero_badge}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Headline</label>
            <input
              name="hero_headline"
              defaultValue={settings.hero_headline}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">The last word is shown with a blue gradient.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Subheadline</label>
            <textarea
              name="hero_subheadline"
              defaultValue={settings.hero_subheadline}
              rows={2}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#262626]">
          Home Stats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stat {n} value</label>
                <input
                  name={`stat${n}_value`}
                  defaultValue={settings[`stat${n}_value`]}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stat {n} label</label>
                <input
                  name={`stat${n}_label`}
                  defaultValue={settings[`stat${n}_label`]}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#262626]">
          About Page
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile photo */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Profile photo</label>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#262626] relative mb-3">
              {photoUrl ? (
                <Image src={photoUrl} alt="Profile" fill className="object-cover" sizes="300px" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                  <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm">No photo</p>
                </div>
              )}
            </div>
            <input type="hidden" name="about_photo_url" value={photoUrl} />
            <button
              type="button"
              onClick={openPhotoUpload}
              className="w-full px-3 py-2 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] rounded-lg text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {photoUrl ? "Change photo" : "Upload photo"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="w-full mt-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Bio paragraphs */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <label className="block text-sm text-gray-300 mb-1.5">Bio paragraph {n}</label>
                <textarea
                  name={`about_bio_${n}`}
                  defaultValue={settings[`about_bio_${n}` as keyof SiteSettings] as string}
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gear cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "about_camera", label: "Camera" },
            { name: "about_favourite_lens", label: "Favourite lens" },
            { name: "about_based_in", label: "Based in" },
            { name: "about_shooting_since", label: "Shooting since" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
              <input
                name={field.name}
                defaultValue={settings[field.name as keyof SiteSettings] as string}
                className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-[#262626]">
          Contact Page
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Email address</label>
            <input
              name="contact_email"
              type="email"
              defaultValue={settings.contact_email}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Displayed publicly on the contact page.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Response time</label>
            <input
              name="contact_response_time"
              defaultValue={settings.contact_response_time}
              className="w-full bg-[#1a1a1a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">e.g. &quot;Within 24 hours&quot;</p>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
