export default function NewVehicleLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-16 bg-[#e6eeff] rounded mb-6" />
      <div className="h-7 w-40 bg-[#dde9ff] rounded-lg mb-6" />

      <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5 mb-6">
        <div className="h-3 w-32 bg-[#e6eeff] rounded mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-[#e6eeff] rounded mb-2" />
              <div className="h-10 bg-[#eff4ff] rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5 mb-6">
        <div className="h-3 w-24 bg-[#e6eeff] rounded mb-4" />
        <div className="h-28 bg-[#eff4ff] rounded-md" />
      </div>

      <div className="bg-white border border-[#c2c6d4]/40 rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[#c2c6d4]/40">
          <div className="h-3 w-16 bg-[#e6eeff] rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-5 py-3.5 border-b border-[#c2c6d4]/20 flex justify-between items-center">
            <div className="h-3 w-24 bg-[#e6eeff] rounded" />
            <div className="h-4 w-4 bg-[#e6eeff] rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#c2c6d4]/40 rounded-xl p-5 mb-6">
        <div className="h-3 w-24 bg-[#e6eeff] rounded mb-4" />
        <div className="h-12 bg-[#eff4ff] border border-dashed border-[#c2c6d4] rounded-lg" />
      </div>

      <div className="h-10 w-40 bg-[#dde9ff] rounded-lg" />
    </div>
  )
}
