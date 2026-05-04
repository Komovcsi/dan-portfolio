import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryAsset(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export function getAlbumZipUrl(publicIds: string[], albumName: string): string {
  return cloudinary.utils.download_zip_url({
    public_ids: publicIds,
    resource_type: "image",
    flatten_folders: true,
    target_public_id: albumName.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
    expires_at: Math.round(Date.now() / 1000) + 60 * 60, // 1 hour
  });
}

export function getPhotoDownloadUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/fl_attachment/${publicId}`;
}

export { cloudinary };
