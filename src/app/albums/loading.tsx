export default function AlbumsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="h-4 w-20 bg-[#1a1a1a] rounded animate-pulse mb-3" />
        <div className="h-10 w-40 bg-[#1a1a1a] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] rounded-xl bg-[#1a1a1a]" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
              <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
