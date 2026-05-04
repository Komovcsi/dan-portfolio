import { getSiteSettings } from "@/lib/supabase/server";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export const metadata = { title: "Site Settings | Admin" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Edit all public-facing content — changes appear on the live site immediately.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#262626] rounded-xl p-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
