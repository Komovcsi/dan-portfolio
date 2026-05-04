"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox, { useLightboxState } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Photo } from "@/types";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import { verifyAndDownloadPhoto } from "@/actions/downloads";
import DownloadModal from "@/components/albums/DownloadModal";

interface ExtendedSlide {
  src: string;
  alt: string;
  cloudinary_public_id: string;
  photo_id: string;
  album_id: string;
  album_name: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  albumId: string;
  albumName: string;
  hasDownload: boolean;
}

function LightboxDownloadButton({
  onDownload,
}: {
  onDownload: (slide: ExtendedSlide) => void;
}) {
  const { currentIndex, slides } = useLightboxState();
  const slide = slides[currentIndex] as unknown as ExtendedSlide;

  return (
    <button
      type="button"
      onClick={() => onDownload(slide)}
      title="Download photo"
      className="yarl__button"
      style={{ filter: "none" }}
    >
      <svg
        className="yarl__icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </button>
  );
}

export default function PhotoLightbox({ photos, albumId, albumName, hasDownload }: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [downloadSlide, setDownloadSlide] = useState<ExtendedSlide | null>(null);

  const slides: ExtendedSlide[] = photos.map((p) => ({
    src: p.url.startsWith("http")
      ? p.url
      : getCloudinaryUrl(p.cloudinary_public_id, { width: 1600 }),
    alt: p.caption ?? "",
    cloudinary_public_id: p.cloudinary_public_id,
    photo_id: p.id,
    album_id: albumId,
    album_name: albumName,
  }));

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, i) => {
          const thumbSrc = photo.thumbnail_url.startsWith("http")
            ? photo.thumbnail_url
            : getCloudinaryUrl(photo.cloudinary_public_id, { width: 600 });

          return (
            <button
              key={photo.id}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="block w-full break-inside-avoid group cursor-zoom-in"
              aria-label={`Open photo ${i + 1}`}
            >
              <div className="relative overflow-hidden rounded-lg bg-[#1a1a1a] border border-[#262626] transition-all duration-300 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/10">
                <Image
                  src={thumbSrc}
                  alt={photo.caption ?? `Photo ${i + 1}`}
                  width={600}
                  height={400}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides as Parameters<typeof Lightbox>[0]["slides"]}
        toolbar={
          hasDownload
            ? {
                buttons: [
                  <LightboxDownloadButton
                    key="download"
                    onDownload={(slide) => setDownloadSlide(slide)}
                  />,
                  "close",
                ],
              }
            : undefined
        }
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
      />

      {downloadSlide && (
        <DownloadModal
          title="Download photo"
          onClose={() => setDownloadSlide(null)}
          onVerify={(password) =>
            verifyAndDownloadPhoto(
              password,
              downloadSlide.cloudinary_public_id,
              downloadSlide.photo_id,
              downloadSlide.album_id,
              downloadSlide.album_name
            )
          }
        />
      )}
    </>
  );
}
