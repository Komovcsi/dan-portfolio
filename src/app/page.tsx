import HeroBanner from "@/components/home/HeroBanner";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import { getFeaturedAlbums, getSiteSettings } from "@/lib/supabase/server";

export default async function HomePage() {
  const [featuredAlbums, settings] = await Promise.all([
    getFeaturedAlbums(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroBanner settings={settings} />
      <FeaturedGallery albums={featuredAlbums} />

      {/* Stats section */}
      <section className="py-16 border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: settings.stat1_value, label: settings.stat1_label },
              { value: settings.stat2_value, label: settings.stat2_label },
              { value: settings.stat3_value, label: settings.stat3_label },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-blue-400 mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
