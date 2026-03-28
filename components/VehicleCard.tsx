'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AutoDetails } from '@/lib/types'
import { FiCalendar, FiActivity, FiDroplet, FiEdit2 } from 'react-icons/fi'

export default function VehicleCard({ vehicle }: { vehicle: AutoDetails }) {
  const price = vehicle.vraagprijs
    ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(vehicle.vraagprijs)
    : 'Prijs op aanvraag'

  const km = vehicle.kmstand
    ? new Intl.NumberFormat('nl-NL').format(vehicle.kmstand) + ' km'
    : '—'

  return (
    <div className="group bg-fleet-card border border-fleet-border rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200">
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
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Image
              src="/images/hd-sold-red-stamp-word-png-701751694685373mjc3xeasfb.png"
              alt="Verkocht"
              width={110}
              height={70}
              className="object-contain"
            />
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/vehicles/${vehicle.aanbod_id}/edit`}
            className="flex items-center gap-1 bg-black/80 hover:bg-fleet-red text-white text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FiEdit2 size={11} /> Bewerken
          </Link>
        </div>
      </div>

      {/* Info */}
      <Link href={`/vehicles/${vehicle.aanbod_id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm truncate">
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
      </Link>
    </div>
  )
}
