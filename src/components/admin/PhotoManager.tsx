"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deletePhoto } from "@/actions/photos";
import { updateAlbumCover } from "@/actions/albums";
import type { Photo } from "@/types";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

interface PhotoManagerProps {
  photos: Photo[];
  albumId: string;
  albumSlug: string;
  coverUrl: string | null;
}

export default function PhotoManager({ photos, albumId, albumSlug, coverUrl }: PhotoManagerProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete(photo: Photo) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    startTransition(async () => {
      await deletePhoto(photo.id, photo.cloudinary_public_id, albumSlug);
    });
  }

  function handleSetCover(photo: Photo) {
    startTransition(async () => {
      await updateAlbumCover(albumId, albumSlug, photo.url);
    });
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed border-[#262626] rounded-xl">
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">No photos yet — upload some above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo) => {
        const thumbSrc = photo.thumbnail_url.startsWith("http")
          ? photo.thumbnail_url
          : getCloudinaryUrl(photo.cloudinary_public_id, { width: 400, height: 300 });

        const isCover = coverUrl === photo.url;

        return (
          <div
            key={photo.id}
            className={`group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a] border-2 transition-colors ${
              isCover ? "border-blue-500" : "border-[#262626]"
            }`}
          >
            <Image
              src={thumbSrc}
              alt={photo.caption ?? "Photo"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Cover badge */}
            {isCover && (
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-blue-500 rounded text-white text-[10px] font-bold tracking-wide">
                COVER
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              {!isCover && (
                <button
                  onClick={() => handleSetCover(photo)}
                  disabled={pending}
                  className="px-2.5 py-1.5 bg-blue-500/90 hover:bg-blue-500 rounded-lg text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                  title="Set as cover"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                  Set cover
                </button>
              )}
              <button
                onClick={() => handleDelete(photo)}
                disabled={pending}
                className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
                title="Delete photo"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
