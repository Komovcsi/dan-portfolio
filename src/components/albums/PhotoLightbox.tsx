"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Photo } from "@/types";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

interface PhotoLightboxProps {
  photos: Photo[];
}

export default function PhotoLightbox({ photos }: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = photos.map((p) => ({
    src: p.url.startsWith("http")
      ? p.url
      : getCloudinaryUrl(p.cloudinary_public_id, { width: 1600 }),
    alt: p.caption ?? "",
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
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
      />
    </>
  );
}
