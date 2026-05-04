import Link from "next/link";
import { getAllAlbumsForAdmin } from "@/lib/supabase/server";
import DeleteAlbumButton from "@/components/admin/DeleteAlbumButton";
import Badge from "@/components/ui/Badge";

export const metadata = { title: "Albums | Admin" };

export default async function AdminAlbumsPage() {
  const albums = await getAllAlbumsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Albums</h1>
          <p className="text-gray-400 mt-1">{albums.length} total</p>
        </div>
        <Link
          href="/admin/albums/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="mb-4">No albums yet.</p>
          <Link href="/admin/albums/new" className="text-blue-400 hover:text-blue-300 text-sm">
            Create your first album →
          </Link>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left px-6 py-4 text-gray-500 font-medium">Album</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-gray-500 font-medium hidden md:table-cell">Featured</th>
                <th className="text-right px-6 py-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album, i) => (
                <tr
                  key={album.id}
                  className={`border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors ${
                    i === albums.length - 1 ? "border-0" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{album.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">/{album.slug}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Badge variant={album.category}>
                      {album.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {album.is_featured ? (
                      <span className="text-blue-400 text-xs font-medium">✓ Featured</span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/albums/${album.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors text-xs"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/albums/${album.id}`}
                        className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors text-xs"
                      >
                        Edit
                      </Link>
                      <DeleteAlbumButton id={album.id} name={album.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
