import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact | Dan Photography",
  description: "Get in touch with Dan for bookings, questions, or collaborations.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Location",
      value: settings.about_based_in,
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Response time",
      value: settings.contact_response_time,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-2">
          Contact
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-400 max-w-xl">
          Interested in having your event photographed? Have a question? Just
          drop me a message and I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-6">
          {contactInfo.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                {item.href ? (
                  <a href={item.href} className="text-white font-medium hover:text-blue-400 transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-[#111111] border border-[#262626] rounded-2xl p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
