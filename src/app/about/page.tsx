import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About | Dan Photography",
  description: "Learn about Dan and his photography journey.",
};

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
