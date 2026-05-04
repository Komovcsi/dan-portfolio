import { Suspense } from "react";
import AlbumCard from "@/components/albums/AlbumCard";
import CategoryFilter from "@/components/albums/CategoryFilter";
import { getAlbums } from "@/lib/supabase/server";

interface AlbumsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export const metadata = {
  title: "Albums | Dan Photography",
  description: "Browse all photo albums — sports events and parties.",
};

export default async function AlbumsPage({ searchParams }: AlbumsPageProps) {
  const { category } = await searchParams;
  const albums = await getAlbums(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-2">
          Gallery
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Albums</h1>
          <Suspense fallback={null}>
            <CategoryFilter />
          </Suspense>
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-600 mb-1">No albums yet</p>
          <p className="text-sm">Check back soon — photos are on the way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
