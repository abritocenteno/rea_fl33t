import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AutoDetails, AanbodImages } from '@/lib/types'
import VehicleForm from '@/components/VehicleForm'
import { FiArrowLeft } from 'react-icons/fi'

interface Props { params: { id: string } }

export default async function EditVehiclePage({ params }: Props) {
  const { data: vehicle } = await supabase
    .from('auto_details')
    .select('*')
    .eq('aanbod_id', params.id)
    .single<AutoDetails>()

  if (!vehicle) notFound()

  const { data: imgRow } = await supabase
    .from('aanbod_images')
    .select('url')
    .eq('aanbod_id', params.id)
    .single<AanbodImages>()

  const images = Array.isArray(imgRow?.url) ? imgRow.url : []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={`/vehicles/${params.id}`}
        className="inline-flex items-center gap-2 text-sm text-fleet-muted hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft size={14} />
        Terug naar detail
      </Link>
      <h1 className="text-xl font-bold text-[#0d1c2f] mb-6">
        {vehicle.merk} {vehicle.model} bewerken
      </h1>
      <VehicleForm mode="edit" initialData={{ vehicle, images }} />
    </div>
  )
}
