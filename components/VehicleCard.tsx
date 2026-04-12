'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AutoDetails } from '@/lib/types'
import { FiEdit2 } from 'react-icons/fi'

export default function VehicleCard({ vehicle, index = 0 }: { vehicle: AutoDetails; index?: number }) {
  const router = useRouter()

  const price = vehicle.vraagprijs
    ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(vehicle.vraagprijs)
    : 'Op aanvraag'

  const km = vehicle.kmstand
    ? new Intl.NumberFormat('nl-NL').format(vehicle.kmstand)
    : '—'

  return (
    <div
      className="card-appear bg-fleet-card rounded-xl overflow-hidden cursor-pointer border border-fleet-border shadow-card hover:shadow-card-hover hover:border-fleet-primary/30 transition-all duration-200 group"
      style={{ animationDelay: `${index * 35}ms` }}
      onClick={() => router.push(`/vehicles/${vehicle.aanbod_id}`)}
    >
      {/* Image zone */}
      <div className="relative aspect-[4/3] bg-fleet-bg overflow-hidden">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.merk} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-400 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-fleet-bg">
            <span className="font-display text-3xl font-bold text-fleet-border select-none">NO IMG</span>
          </div>
        )}

        {/* Sold stamp */}
        {vehicle.sold && (
          <div className="absolute top-0 left-0 z-10">
            <Image
              src="/images/hd-sold-red-stamp-word-png-701751694685373mjc3xeasfb.png"
              alt="Verkocht"
              width={80}
              height={50}
              className="object-contain drop-shadow-md"
            />
          </div>
        )}

        {/* Edit button */}
        <div
          className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/vehicles/${vehicle.aanbod_id}/edit`}
            className="flex items-center gap-1.5 bg-fleet-card hover:bg-fleet-primary text-fleet-neutral hover:text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-card transition-all duration-150"
          >
            <FiEdit2 size={10} /> Bewerken
          </Link>
        </div>

        {/* Price pill */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6 bg-gradient-to-t from-black/50 to-transparent">
          <span className="font-display font-bold text-xl text-white leading-none drop-shadow">
            {price}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-3.5">
        {/* Brand / model / sold */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-fleet-secondary uppercase tracking-[0.12em] mb-0.5">{vehicle.merk}</p>
            <h3 className="font-display font-bold text-[17px] text-fleet-neutral leading-snug truncate">{vehicle.model}</h3>
          </div>
          {vehicle.sold ? (
            <span className="shrink-0 text-[10px] font-bold text-fleet-tertiary border border-fleet-tertiary/30 bg-fleet-tertiary/10 px-2 py-0.5 rounded-md uppercase tracking-wider mt-0.5"
              >
              Verkocht
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-bold text-fleet-available border border-fleet-available/25 bg-fleet-available/10 px-2 py-0.5 rounded-md uppercase tracking-wider mt-0.5">
              Beschikbaar
            </span>
          )}
        </div>

        {/* Specs row */}
        <div className="flex items-center border-t border-fleet-border pt-2.5 divide-x divide-fleet-border">
          {[
            { label: 'Jaar', value: vehicle.bouwjaar ?? '—' },
            { label: 'KM', value: km },
            { label: vehicle.locatie ? 'Locatie' : 'Brandstof', value: vehicle.locatie ?? vehicle.brandstof ?? '—' },
          ].map((spec) => (
            <div key={spec.label} className="flex-1 px-2 first:pl-0 last:pr-0">
              <p className="text-[9px] font-semibold text-fleet-muted uppercase tracking-[0.1em] mb-0.5">{spec.label}</p>
              <p className="text-[12px] font-medium text-fleet-neutral truncate">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
