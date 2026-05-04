export function getCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  const { width = 800, height, crop = "fill" } = options;
  const h = height ? `,h_${height}` : "";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width}${h},q_auto,f_auto/${publicId}`;
}
