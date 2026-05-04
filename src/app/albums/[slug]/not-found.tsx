import Link from "next/link";

export default function AlbumNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-blue-400 text-6xl font-bold mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Album not found</h1>
        <p className="text-gray-400 mb-8">This album doesn&apos;t exist.</p>
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          Browse all albums
        </Link>
      </div>
    </div>
  );
}
