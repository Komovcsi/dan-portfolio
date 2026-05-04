import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dan Photography",
  description: "Sports and party photography portfolio by Dan.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dan Photography",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        <Navbar name={settings.photographer_name} />
        <main className="flex-1">{children}</main>
        <Footer name={settings.photographer_name} />
      </body>
    </html>
  );
}
