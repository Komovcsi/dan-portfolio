import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Dan Photography",
  description: "Learn about Dan and his photography journey.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-2">
          About
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Hey, I&apos;m Dan.
        </h1>
        <div className="w-16 h-1 bg-blue-500 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Photo placeholder */}
        <div className="md:col-span-2">
          <div className="aspect-[3/4] rounded-2xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
            <div className="text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm">Your photo here</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-3 space-y-6 text-gray-300 leading-relaxed">
          <p className="text-lg">
            I&apos;m a passionate photographer with a love for capturing raw,
            unscripted moments — whether it&apos;s the decisive split-second
            of a sports play or the genuine laughter at a friend&apos;s party.
          </p>
          <p>
            I started shooting as a hobby, borrowing a friend&apos;s camera at
            a local football match. Since then I&apos;ve shot dozens of sport
            events — from school tournaments to regional championships — and
            countless gatherings that I&apos;m proud to have documented.
          </p>
          <p>
            My style leans toward natural light and authentic emotion. I believe
            the best photos don&apos;t feel staged — they feel like a memory
            you can hold in your hands.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            {[
              { label: "Camera", value: "Sony A7 IV" },
              { label: "Favourite lens", value: "85mm f/1.8" },
              { label: "Based in", value: "Slovenia" },
              { label: "Shooting since", value: "2019" },
            ].map((item) => (
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
