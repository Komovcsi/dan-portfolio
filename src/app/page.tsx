import HeroBanner from "@/components/home/HeroBanner";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import { getFeaturedAlbums } from "@/lib/supabase/server";

export default async function HomePage() {
  const featuredAlbums = await getFeaturedAlbums();

  return (
    <>
      <HeroBanner />
      <FeaturedGallery albums={featuredAlbums} />

      {/* Stats section */}
      <section className="py-16 border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { label: "Sports events covered", value: "100+" },
              { label: "Parties & celebrations", value: "50+" },
              { label: "Photos captured", value: "10k+" },
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
