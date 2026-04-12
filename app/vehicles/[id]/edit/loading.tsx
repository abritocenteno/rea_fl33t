export default function EditVehicleLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="h-4 w-16 bg-fleet-border rounded mb-6" />
      <div className="h-9 w-56 bg-fleet-border rounded-lg mb-6" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card mb-4">
          <div className="h-3 w-28 bg-fleet-bg rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(i === 0 ? 6 : i === 1 ? 1 : i === 2 ? 0 : 2)].map((_, j) => (
              <div key={j}>
                <div className="h-2.5 w-20 bg-fleet-bg rounded mb-2" />
                <div className="h-10 bg-fleet-bg rounded-lg" />
              </div>
            ))}
            {i === 1 && <div className="col-span-2"><div className="h-28 bg-fleet-bg rounded-lg" /></div>}
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <div className="h-10 w-36 bg-fleet-border rounded-lg" />
        <div className="h-10 w-24 bg-fleet-bg rounded-lg" />
      </div>
    </div>
  )
}
