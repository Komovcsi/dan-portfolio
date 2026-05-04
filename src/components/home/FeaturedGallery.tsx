import Link from "next/link";
import AlbumCard from "@/components/albums/AlbumCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { StaggerReveal, StaggerItem } from "@/components/ui/StaggerReveal";
import type { Album } from "@/types";

interface FeaturedGalleryProps {
  albums: Album[];
}

export default function FeaturedGallery({ albums }: FeaturedGalleryProps) {
  if (albums.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <ScrollReveal className="flex items-end justify-between mb-10">
        <div>
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-2">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Featured Albums
          </h2>
        </div>
        <Link
          href="/albums"
          className="hidden sm:inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </ScrollReveal>

      <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <StaggerItem key={album.id}>
            <AlbumCard album={album} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <div className="sm:hidden mt-8 text-center">
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#262626] text-gray-300 rounded-xl text-sm font-medium hover:bg-[#262626] transition-colors"
        >
          View all albums
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
