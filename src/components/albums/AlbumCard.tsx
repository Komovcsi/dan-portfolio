import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import type { Album } from "@/types";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const coverUrl = album.cover_image_url
    ? album.cover_image_url.startsWith("http")
      ? album.cover_image_url
      : getCloudinaryUrl(album.cover_image_url, { width: 600, height: 400 })
    : null;

  return (
    <Link href={`/albums/${album.slug}`} className="group block">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#262626] transition-all duration-300 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/10">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={album.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover caret */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
            {album.name}
          </h3>
          <Badge variant={album.category}>
            {album.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Badge>
        </div>
        {album.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {album.description}
          </p>
        )}
      </div>
    </Link>
  );
}
