import Link from "next/link";
import { getDashboardStats } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Albums", value: stats.albumCount, href: "/admin/albums", color: "blue" },
    { label: "Photos", value: stats.photoCount, href: "/admin/albums", color: "blue" },
    { label: "Messages", value: stats.messageCount, href: "/admin/messages", color: "blue" },
    { label: "Unread", value: stats.unreadCount, href: "/admin/messages", color: "purple" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back — here&apos;s your portfolio overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
