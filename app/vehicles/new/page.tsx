import Link from 'next/link'
import VehicleForm from '@/components/VehicleForm'
import { FiArrowLeft } from 'react-icons/fi'

export default function NewVehiclePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-fleet-muted hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft size={14} />
        Terug naar overzicht
      </Link>
      <h1 className="text-xl font-bold text-white mb-6">Nieuw voertuig toevoegen</h1>
      <VehicleForm mode="add" />
    </div>
  )
}
