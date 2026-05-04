export default function AlbumLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
        <div className="h-4 w-4 bg-[#1a1a1a] rounded" />
        <div className="h-4 w-32 bg-[#1a1a1a] rounded" />
      </div>
      <div className="mb-10">
        <div className="h-8 w-64 bg-[#1a1a1a] rounded mb-3" />
        <div className="h-4 w-96 bg-[#1a1a1a] rounded" />
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-lg bg-[#1a1a1a]"
            style={{ height: `${200 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </div>
  );
}
