import { notFound } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import PhotoLightbox from "@/components/albums/PhotoLightbox";
import DownloadAlbumButton from "@/components/albums/DownloadAlbumButton";
import type { Metadata } from "next";
import { getAlbumBySlug, getPhotosByAlbum, getSiteSettings } from "@/lib/supabase/server";

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return {
    title: `${album.name} | Dan Photography`,
    description: album.description ?? `Photo album: ${album.name}`,
    openGraph: {
      images: album.cover_image_url ? [album.cover_image_url] : [],
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const [album, settings] = await Promise.all([getAlbumBySlug(slug), getSiteSettings()]);

  if (!album) notFound();

  const albumPhotos = await getPhotosByAlbum(album.id);
  const hasDownload = !!(album.download_password ?? settings.download_password);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/albums" className="hover:text-white transition-colors">
          Albums
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-300">{album.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={album.category as "sports" | "parties"}>
              {album.category === "sports" ? "Sports" : "Parties"}
            </Badge>
            <span className="text-gray-500 text-sm">{albumPhotos.length} photos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{album.name}</h1>
          {album.description && (
            <p className="text-gray-400 mt-2 max-w-xl">{album.description}</p>
          )}
        </div>

        {hasDownload && albumPhotos.length > 0 && (
          <DownloadAlbumButton albumId={album.id} albumName={album.name} />
        )}
      </div>

      {albumPhotos.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg font-medium text-gray-600 mb-1">No photos yet</p>
          <p className="text-sm">This album is empty.</p>
        </div>
      ) : (
        <PhotoLightbox
          photos={albumPhotos}
          albumId={album.id}
          albumName={album.name}
          hasDownload={hasDownload}
        />
      )}
    </div>
  );
}
