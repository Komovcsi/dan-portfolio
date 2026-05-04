import AlbumForm from "@/components/admin/AlbumForm";
import { createAlbum } from "@/actions/albums";

export const metadata = { title: "New Album | Admin" };

export default function NewAlbumPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">New Album</h1>
        <p className="text-gray-400 mt-1">Create a new photo album.</p>
      </div>
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 sm:p-8">
        <AlbumForm action={createAlbum} />
      </div>
    </div>
  );
}
