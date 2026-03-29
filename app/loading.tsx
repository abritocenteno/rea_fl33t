export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-48 bg-[#dde9ff] rounded-lg mb-2" />
          <div className="h-4 w-36 bg-[#e6eeff] rounded" />
        </div>
        <div className="h-10 w-32 bg-[#dde9ff] rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-[#c2c6d4]/40 rounded-xl px-4 py-4">
            <div className="h-8 w-12 bg-[#dde9ff] rounded mb-2" />
            <div className="h-3 w-20 bg-[#e6eeff] rounded" />
          </div>
        ))}
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-4 w-24 bg-[#e6eeff] rounded" />
        <div className="h-8 w-40 bg-[#e6eeff] rounded-lg" />
      </div>

      {/* Vehicle grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white border border-[#c2c6d4]/40 rounded-xl overflow-hidden">
            <div className="aspect-[16/10] bg-[#dde9ff]" />
            <div className="p-4">
              <div className="flex justify-between mb-3">
                <div className="h-4 w-32 bg-[#dde9ff] rounded" />
                <div className="h-4 w-14 bg-[#e6eeff] rounded" />
              </div>
              <div className="flex gap-3">
                <div className="h-3 w-10 bg-[#e6eeff] rounded" />
                <div className="h-3 w-20 bg-[#e6eeff] rounded" />
                <div className="h-3 w-14 bg-[#e6eeff] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
