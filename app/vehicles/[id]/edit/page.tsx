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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href={`/vehicles/${params.id}`}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fleet-secondary hover:text-fleet-primary transition-colors mb-6"
      >
        <FiArrowLeft size={13} />
        Terug
      </Link>
      <h1 className="font-display font-bold text-3xl text-fleet-neutral mb-6">
        {vehicle.merk} {vehicle.model}
      </h1>
      <VehicleForm mode="edit" initialData={{ vehicle, images }} />
    </div>
  )
}
