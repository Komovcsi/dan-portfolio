import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const desc = s.about_bio_1.split(".")[0] + ".";
  return {
    title: `About — ${s.photographer_name}`,
    description: desc,
    openGraph: {
      title: `About — ${s.photographer_name}`,
      description: desc,
      images: s.about_photo_url ? [{ url: s.about_photo_url }] : [],
    },
  };
}

export default async function AboutPage() {
  const s = await getSiteSettings();

  const gearCards = [
    { label: "Camera", value: s.about_camera },
    { label: "Favourite lens", value: s.about_favourite_lens },
    { label: "Based in", value: s.about_based_in },
    { label: "Shooting since", value: s.about_shooting_since },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-2">
          About
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Hey, I&apos;m {s.photographer_name}.
        </h1>
        <div className="w-16 h-1 bg-blue-500 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Photo */}
        <div className="md:col-span-2">
          <div className="aspect-[3/4] rounded-2xl bg-[#1a1a1a] border border-[#262626] overflow-hidden relative">
            {s.about_photo_url ? (
              <Image
                src={s.about_photo_url}
                alt={s.photographer_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">Add photo in admin settings</p>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-3 space-y-6 text-gray-300 leading-relaxed">
          {[s.about_bio_1, s.about_bio_2, s.about_bio_3].filter(Boolean).map((bio, i) => (
            <p key={i} className={i === 0 ? "text-lg" : undefined}>
              {bio}
            </p>
          ))}

          <div className="pt-4 grid grid-cols-2 gap-4">
            {gearCards.map((item) => (
              <div
                key={item.label}
                className="bg-[#111111] border border-[#262626] rounded-xl p-4"
              >
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {(s.instagram_url || s.facebook_url || s.tiktok_url) && (
            <div className="flex items-center gap-4 pt-2">
              {s.instagram_url && (
                <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {s.facebook_url && (
                <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {s.tiktok_url && (
                <a href={s.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                  </svg>
                </a>
              )}
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Get in touch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
