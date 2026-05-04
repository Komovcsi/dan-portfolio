"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/actions/contact";

const initialState = { error: undefined as string | undefined, success: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await submitContactForm(formData);
      return {
        error: "error" in result ? result.error : undefined,
        success: "success" in result ? true : false,
      };
    },
    initialState
  );

  if (state.success) {
    return (
      <div className="bg-[#111111] border border-[#262626] rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
        <p className="text-gray-400">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Name
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Subject
        </label>
        <input
          name="subject"
          type="text"
          required
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="What&apos;s this about?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          placeholder="Tell me about your event, what you need, or just say hi…"
        />
      </div>

      {state.error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
