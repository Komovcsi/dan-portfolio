import Link from "next/link";
import type { SiteSettings } from "@/types";

interface Props {
  settings: SiteSettings;
}

export default function HeroBanner({ settings }: Props) {
  const words = settings.hero_headline.trim().split(" ");
  const accent = words.pop()!;
  const before = words.join(" ");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f1623] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          {settings.hero_badge}
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
          {before}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            {accent}
          </span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.hero_subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/albums"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-base"
          >
            Browse Albums
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] text-gray-300 hover:text-white font-semibold rounded-xl transition-colors text-base"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
