export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="h-3 w-16 bg-fleet-border rounded mb-2" />
          <div className="h-9 w-52 bg-fleet-border rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-fleet-border rounded-lg" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-fleet-card border border-fleet-border rounded-xl px-4 py-4 shadow-card">
            <div className="h-9 w-10 bg-fleet-bg rounded-lg mb-2" />
            <div className="h-3 w-20 bg-fleet-bg rounded" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-14 bg-fleet-border rounded" />
          <div className="h-7 w-20 bg-fleet-border rounded-lg" />
          <div className="h-7 w-24 bg-fleet-border rounded-lg" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-fleet-bg rounded" />
          <div className="h-8 w-40 bg-fleet-bg rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-fleet-card border border-fleet-border rounded-xl overflow-hidden shadow-card">
            <div className="aspect-[4/3] bg-fleet-bg" />
            <div className="px-4 pt-3 pb-3.5">
              <div className="h-2.5 w-16 bg-fleet-bg rounded mb-1.5" />
              <div className="h-5 w-36 bg-fleet-border rounded mb-3" />
              <div className="flex gap-2 border-t border-fleet-border pt-2.5">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex-1">
                    <div className="h-2 w-8 bg-fleet-bg rounded mb-1" />
                    <div className="h-3 w-full bg-fleet-border rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
