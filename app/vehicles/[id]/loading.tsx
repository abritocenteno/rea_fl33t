export default function VehicleDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-16 bg-[#e6eeff] rounded" />
        <div className="h-9 w-28 bg-[#e6eeff] rounded-lg" />
      </div>

      {/* Title + price */}
      <div className="mb-5">
        <div className="h-8 w-64 bg-[#dde9ff] rounded-lg mb-2" />
        <div className="h-9 w-28 bg-[#dde9ff] rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          {/* Carousel */}
          <div className="aspect-[16/9] bg-[#dde9ff] rounded-xl" />
          {/* Thumbnail strip */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-20 h-14 bg-[#e6eeff] rounded-lg shrink-0" />
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5">
            <div className="h-3 w-24 bg-[#e6eeff] rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#e6eeff] rounded" />
              <div className="h-3 w-5/6 bg-[#e6eeff] rounded" />
              <div className="h-3 w-4/6 bg-[#e6eeff] rounded" />
            </div>
          </div>

          {/* Options block */}
          <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5">
            <div className="h-3 w-20 bg-[#e6eeff] rounded mb-4" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-[#e6eeff] rounded w-3/4" />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-[#e6eeff] rounded" />
                  <div className="h-3 w-20 bg-[#dde9ff] rounded" />
                </div>
              ))}
            </div>
            <div className="mt-5 h-10 bg-[#dde9ff] rounded-lg" />
          </div>
          <div className="bg-white border border-[#c2c6d4]/40 rounded-xl px-5 py-4">
            <div className="h-3 w-20 bg-[#e6eeff] rounded mb-2" />
            <div className="h-3 w-32 bg-[#e6eeff] rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
