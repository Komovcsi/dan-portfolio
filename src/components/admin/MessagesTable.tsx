"use client";

import { useTransition, useState } from "react";
import { markMessageRead } from "@/actions/photos";
import type { ContactMessage } from "@/types";
import { formatDate } from "@/lib/utils";

export default function MessagesTable({ messages }: { messages: ContactMessage[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markMessageRead(id);
    });
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`bg-[#111111] border rounded-xl overflow-hidden transition-colors ${
            msg.is_read ? "border-[#262626]" : "border-blue-500/30"
          }`}
        >
          <button
            className="w-full text-left px-6 py-4 hover:bg-[#1a1a1a] transition-colors"
            onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {!msg.is_read && (
                  <span className="shrink-0 w-2 h-2 bg-blue-400 rounded-full" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">
                    {msg.name}{" "}
                    <span className="text-gray-500 font-normal text-sm">
                      &lt;{msg.email}&gt;
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm truncate">{msg.subject}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-500 text-xs">{formatDate(msg.created_at)}</p>
                {!msg.is_read && (
                  <span className="inline-block text-blue-400 text-xs font-medium mt-0.5">
                    Unread
                  </span>
                )}
              </div>
            </div>
          </button>

          {expanded === msg.id && (
            <div className="px-6 pb-5 border-t border-[#262626]">
              <p className="text-gray-300 text-sm mt-4 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Reply via email
                </a>
                {!msg.is_read && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
