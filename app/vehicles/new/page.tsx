import Link from 'next/link'
import VehicleForm from '@/components/VehicleForm'
import { FiArrowLeft } from 'react-icons/fi'

export default function NewVehiclePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fleet-secondary hover:text-fleet-primary transition-colors mb-6"
      >
        <FiArrowLeft size={13} />
        Overzicht
      </Link>
      <h1 className="font-display font-bold text-3xl text-fleet-neutral mb-6">Nieuw voertuig</h1>
      <VehicleForm mode="add" />
    </div>
  )
}
