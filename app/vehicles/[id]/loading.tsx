export default function VehicleDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-20 bg-fleet-border rounded" />
        <div className="h-9 w-28 bg-fleet-border rounded-lg" />
      </div>
      <div className="mb-6 pb-5 border-b border-fleet-border">
        <div className="flex items-end justify-between">
          <div>
            <div className="h-3 w-16 bg-fleet-bg rounded mb-2" />
            <div className="h-10 w-64 bg-fleet-border rounded-lg" />
          </div>
          <div className="h-9 w-28 bg-fleet-border rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="aspect-[16/9] bg-fleet-border rounded-xl" />
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => <div key={i} className="w-16 h-11 bg-fleet-bg rounded-lg shrink-0" />)}
          </div>
          <div className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card">
            <div className="h-3 w-24 bg-fleet-bg rounded mb-3" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-3 bg-fleet-bg rounded" style={{ width: `${90 - i * 15}%` }} />)}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card">
            <div className="h-3 w-24 bg-fleet-bg rounded mb-4" />
            <div className="space-y-3.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-fleet-bg rounded" />
                  <div className="h-3 w-20 bg-fleet-border rounded" />
                </div>
              ))}
            </div>
            <div className="mt-5 h-10 bg-fleet-border rounded-lg" />
          </div>
          <div className="bg-fleet-card border border-fleet-border rounded-xl px-5 py-4 shadow-card">
            <div className="h-2.5 w-20 bg-fleet-bg rounded mb-2" />
            <div className="h-3 w-32 bg-fleet-bg rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
