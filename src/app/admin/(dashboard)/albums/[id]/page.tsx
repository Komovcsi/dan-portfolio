import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AlbumForm from "@/components/admin/AlbumForm";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import PhotoManager from "@/components/admin/PhotoManager";
import { getAlbumById, getPhotosByAlbum, getCategories } from "@/lib/supabase/server";
import { updateAlbum } from "@/actions/albums";

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Album | Admin" };

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
  const { id } = await params;
  const [album, photos, categories] = await Promise.all([
    getAlbumById(id),
    getPhotosByAlbum(id),
    getCategories(),
  ]);

  if (!album) notFound();

  async function updateAction(formData: FormData) {
    "use server";
    return updateAlbum(id, formData);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/albums"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">{album.name}</h1>
          <p className="text-gray-400 mt-0.5 text-sm">{photos.length} photos</p>
        </div>
      </div>

      {/* Top row: settings + cover */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Album settings */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#262626] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Album Settings</h2>
          <AlbumForm album={album} categories={categories} action={updateAction} />
        </div>

        {/* Cover photo */}
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Cover Photo</h2>

          <div className="flex-1 relative rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#262626] min-h-[200px]">
            {album.cover_image_url ? (
              <>
                <Image
                  src={album.cover_image_url}
                  alt="Album cover"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-blue-500 rounded text-white text-xs font-bold tracking-wide">
                    COVER
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">No cover set</p>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
            Hover over any photo below and click{" "}
            <span className="text-blue-400 font-medium">Set cover</span> to use it as the album thumbnail.
          </p>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">
            Photos
            {photos.length > 0 && (
              <span className="ml-2 text-sm text-gray-500 font-normal">{photos.length} total</span>
            )}
          </h2>
          <CloudinaryUploader albumId={album.id} albumSlug={album.slug} />
        </div>
        <PhotoManager
          photos={photos}
          albumId={album.id}
          albumSlug={album.slug}
          coverUrl={album.cover_image_url}
        />
      </div>
    </div>
  );
}
