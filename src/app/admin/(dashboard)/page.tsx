import Link from "next/link";
import { getDashboardStats, getDownloadStats } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  const [stats, downloads] = await Promise.all([getDashboardStats(), getDownloadStats()]);

  const cards = [
    { label: "Albums", value: stats.albumCount, href: "/admin/albums" },
    { label: "Photos", value: stats.photoCount, href: "/admin/albums" },
    { label: "Messages", value: stats.messageCount, href: "/admin/messages" },
    { label: "Unread", value: stats.unreadCount, href: "/admin/messages" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back — here&apos;s your portfolio overview.</p>
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#111111] border border-[#262626] rounded-xl p-6 hover:border-blue-500/40 transition-colors group"
          >
            <p className="text-gray-500 text-sm mb-1">{card.label}</p>
            <p className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Download stats */}
      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Analytics
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "All time", value: downloads.total },
            { label: "This month", value: downloads.thisMonth },
            { label: "This week", value: downloads.thisWeek },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top albums */}
          {downloads.topAlbums.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top albums</p>
              <div className="space-y-2">
                {downloads.topAlbums.map((album) => (
                  <div key={album.name} className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
                    <span className="text-gray-300 text-sm truncate">{album.name}</span>
                    <span className="text-blue-400 text-sm font-semibold ml-4 shrink-0">{album.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent downloads */}
          {downloads.recentEvents.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent activity</p>
              <div className="space-y-2">
                {downloads.recentEvents.slice(0, 8).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a]">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      event.type === "album"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-gray-300 text-sm truncate flex-1">{event.album_name ?? "—"}</span>
                    <span className="text-gray-600 text-xs shrink-0">{formatDate(event.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {downloads.total === 0 && (
            <div className="lg:col-span-2 text-center py-8 text-gray-600">
              <p className="text-sm">No downloads yet. Set a download password in Settings to enable downloads.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/admin/albums/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Album
        </Link>
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#262626] hover:bg-[#262626] text-gray-300 font-semibold rounded-xl transition-colors"
        >
          View Messages
          {stats.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {stats.unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
