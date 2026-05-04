export default function AlbumLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="shimmer h-3.5 w-14 rounded-full" />
        <div className="shimmer h-3.5 w-3.5 rounded-full" />
        <div className="shimmer h-3.5 w-28 rounded-full" />
      </div>

      {/* Album title area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="space-y-3">
          <div className="shimmer h-5 w-20 rounded-full" />
          <div className="shimmer h-9 w-72 rounded-lg" />
          <div className="shimmer h-4 w-52 rounded" />
        </div>
        <div className="shimmer h-10 w-36 rounded-xl" />
      </div>

      {/* Photo masonry skeleton */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {[320, 240, 380, 280, 420, 260, 350, 230, 390].map((h, i) => (
          <div
            key={i}
            className="shimmer break-inside-avoid rounded-lg"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}
