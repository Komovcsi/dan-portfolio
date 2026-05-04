"use client";

import { useState } from "react";
import DownloadModal from "@/components/albums/DownloadModal";
import { verifyAndDownloadAlbum } from "@/actions/downloads";

interface Props {
  albumId: string;
  albumName: string;
}

export default function DownloadAlbumButton({ albumId, albumName }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-blue-500/40 text-gray-300 hover:text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download all
      </button>

      {modalOpen && (
        <DownloadModal
          title={`Download "${albumName}"`}
          onClose={() => setModalOpen(false)}
          onVerify={(password) => verifyAndDownloadAlbum(password, albumId, albumName)}
        />
      )}
    </>
  );
}
