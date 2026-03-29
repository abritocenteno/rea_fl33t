'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AutoDetails } from '@/lib/types'
import { FiCalendar, FiActivity, FiDroplet, FiEdit2 } from 'react-icons/fi'

export default function VehicleCard({ vehicle }: { vehicle: AutoDetails }) {
  const router = useRouter()

  const price = vehicle.vraagprijs
    ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(vehicle.vraagprijs)
    : 'Prijs op aanvraag'

  const km = vehicle.kmstand
    ? new Intl.NumberFormat('nl-NL').format(vehicle.kmstand) + ' km'
    : '—'

  return (
    <div
      className="group bg-fleet-card border border-[#c2c6d4]/40 rounded-xl overflow-hidden hover:border-fleet-red/40 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => router.push(`/vehicles/${vehicle.aanbod_id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-fleet-bg overflow-hidden">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.merk} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/images/error_image.jpg" alt="Geen afbeelding" width={64} height={64} className="opacity-20 object-contain" />
          </div>
        )}
        {vehicle.sold && (
          <div className="absolute top-0 left-0">
            <Image
              src="/images/hd-sold-red-stamp-word-png-701751694685373mjc3xeasfb.png"
              alt="Verkocht"
              width={80}
              height={50}
              className="object-contain drop-shadow-md"
            />
          </div>
        )}
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/vehicles/${vehicle.aanbod_id}/edit`}
            className="flex items-center gap-1 bg-white/90 hover:bg-fleet-red hover:text-white text-[#0d1c2f] text-xs font-medium px-2.5 py-1 rounded-lg transition-colors shadow-sm"
          >
            <FiEdit2 size={11} /> Bewerken
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#0d1c2f] text-sm truncate">
            {vehicle.merk} {vehicle.model}
          </h3>
          <span className="text-fleet-red font-bold text-sm shrink-0">{price}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2.5 text-xs text-fleet-muted">
          {vehicle.bouwjaar && (
            <span className="flex items-center gap-1"><FiCalendar size={11} />{vehicle.bouwjaar}</span>
          )}
          {vehicle.kmstand && (
            <span className="flex items-center gap-1"><FiActivity size={11} />{km}</span>
          )}
          {vehicle.brandstof && (
            <span className="flex items-center gap-1"><FiDroplet size={11} />{vehicle.brandstof}</span>
          )}
        </div>
      </div>
    </div>
  )
}
