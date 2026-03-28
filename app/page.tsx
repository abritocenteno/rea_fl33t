import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AutoDetails } from '@/lib/types'
import VehicleCard from '@/components/VehicleCard'
import { FiPlus, FiTruck } from 'react-icons/fi'

async function getVehicles(): Promise<AutoDetails[]> {
  const { data } = await supabase
    .from('auto_details')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HomePage() {
  const vehicles = await getVehicles()

  const total = vehicles.length
  const available = vehicles.filter((v) => !v.sold).length
  const sold = vehicles.filter((v) => v.sold).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Voertuigenbeheer</h1>
          <p className="text-fleet-muted text-sm mt-0.5">Alle voertuigen in het systeem</p>
        </div>
        <Link
          href="/vehicles/new"
          className="flex items-center gap-2 bg-fleet-red hover:bg-fleet-red-dark text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <FiPlus size={16} />
          Toevoegen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Totaal', value: total, color: 'text-white' },
          { label: 'Beschikbaar', value: available, color: 'text-green-400' },
          { label: 'Verkocht', value: sold, color: 'text-fleet-red' },
        ].map((s) => (
          <div key={s.label} className="bg-fleet-card border border-fleet-border rounded-xl px-4 py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-fleet-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Vehicle grid */}
      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FiTruck size={40} className="text-fleet-border mb-4" />
          <p className="text-zinc-400 text-lg font-medium">Geen voertuigen gevonden</p>
          <p className="text-fleet-muted text-sm mt-1 mb-6">Voeg je eerste voertuig toe om te beginnen.</p>
          <Link
            href="/vehicles/new"
            className="flex items-center gap-2 bg-fleet-red hover:bg-fleet-red-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            <FiPlus size={16} />
            Voertuig toevoegen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}
