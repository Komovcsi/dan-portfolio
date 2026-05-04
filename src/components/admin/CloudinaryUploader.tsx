"use client";

import { useEffect, useRef, useTransition } from "react";
import { savePhoto } from "@/actions/photos";

interface CloudinaryUploaderProps {
  albumId: string;
  albumSlug: string;
  onUploaded?: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: CloudinaryUploadInfo }) => void
      ) => { open: () => void };
    };
  }
}

interface CloudinaryUploadInfo {
  public_id: string;
  secure_url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
}

export default function CloudinaryUploader({
  albumId,
  albumSlug,
  onUploaded,
}: CloudinaryUploaderProps) {
  const widgetRef = useRef<{ open: () => void } | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (document.querySelector('script[src*="upload-widget.cloudinary.com"]')) return;

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = initWidget;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  function initWidget() {
    if (!window.cloudinary) return;
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: true,
        maxFiles: 20,
        sources: ["local", "camera"],
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
        maxFileSize: 25000000,
        folder: "portfolio",
        styles: {
          palette: {
            window: "#111111",
            windowBorder: "#262626",
            tabIcon: "#3b82f6",
            menuIcons: "#9ca3af",
            textDark: "#ffffff",
            textLight: "#ffffff",
            link: "#3b82f6",
            action: "#3b82f6",
            inactiveTabIcon: "#6b7280",
            error: "#ef4444",
            inProgress: "#3b82f6",
            complete: "#22c55e",
            sourceBg: "#1a1a1a",
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return;
        }
        if (result.event === "success") {
          const info = result.info;
          const thumbnailUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${info.public_id}`;
          startTransition(async () => {
            await savePhoto({
              album_id: albumId,
              cloudinary_public_id: info.public_id,
              url: info.secure_url,
              thumbnail_url: thumbnailUrl,
            });
            onUploaded?.();
          });
        }
      }
    );
  }

  function openWidget() {
    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }
    if (window.cloudinary) {
      initWidget();
    }
  }

  return (
    <button
      onClick={openWidget}
      type="button"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      Upload Photos
    </button>
  );
}
