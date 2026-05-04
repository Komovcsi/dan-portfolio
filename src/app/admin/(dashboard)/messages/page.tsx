import { getContactMessages } from "@/lib/supabase/server";
import MessagesTable from "@/components/admin/MessagesTable";

export const metadata = { title: "Messages | Admin" };

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-1">
          {messages.length} total &middot;{" "}
          <span className={unreadCount > 0 ? "text-blue-400" : "text-gray-500"}>
            {unreadCount} unread
          </span>
        </p>
      </div>
      <MessagesTable messages={messages} />
    </div>
  );
}
