'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AutoDetails } from '@/lib/types'
import VehicleCard from './VehicleCard'
import { FiPlus } from 'react-icons/fi'

type Filter = 'all' | 'available' | 'sold'
type Sort = 'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc'

const SORT_LABELS: Record<Sort, string> = {
  newest: 'Nieuwste eerst',
  'price-asc': 'Prijs: laag → hoog',
  'price-desc': 'Prijs: hoog → laag',
  'year-desc': 'Jaar: nieuw → oud',
  'year-asc': 'Jaar: oud → nieuw',
  'mileage-asc': 'Kilometerstand: laag → hoog',
}

export default function FleetDashboard({ vehicles }: { vehicles: AutoDetails[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('newest')

  const total = vehicles.length
  const available = vehicles.filter((v) => !v.sold).length
  const sold = vehicles.filter((v) => v.sold).length

  const stats: { key: Filter; label: string; value: number; color: string }[] = [
    { key: 'all', label: 'Totaal', value: total, color: 'text-[#0d1c2f]' },
    { key: 'available', label: 'Beschikbaar', value: available, color: 'text-green-600' },
    { key: 'sold', label: 'Verkocht', value: sold, color: 'text-fleet-red' },
  ]

  const filtered = useMemo(() => {
    let list = [...vehicles]
    if (filter === 'available') list = list.filter((v) => !v.sold)
    if (filter === 'sold') list = list.filter((v) => v.sold)

    list.sort((a, b) => {
      switch (sort) {
        case 'price-asc': return (a.vraagprijs ?? 0) - (b.vraagprijs ?? 0)
        case 'price-desc': return (b.vraagprijs ?? 0) - (a.vraagprijs ?? 0)
        case 'year-desc': return parseInt(b.bouwjaar ?? '0') - parseInt(a.bouwjaar ?? '0')
        case 'year-asc': return parseInt(a.bouwjaar ?? '0') - parseInt(b.bouwjaar ?? '0')
        case 'mileage-asc': return (a.kmstand ?? 0) - (b.kmstand ?? 0)
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
    return list
  }, [vehicles, filter, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1c2f]">Voertuigenbeheer</h1>
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

      {/* Stat cards — click to filter */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`text-left bg-fleet-card border rounded-xl px-4 py-4 transition-all ${
              filter === s.key
                ? 'border-fleet-red shadow-sm ring-1 ring-fleet-red/20'
                : 'border-[#c2c6d4]/40 hover:border-fleet-red/40 hover:bg-fleet-card-hover'
            }`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-fleet-muted mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Sort + result count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-fleet-muted">
          {filtered.length} voertuig{filtered.length !== 1 ? 'en' : ''}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="text-sm border border-[#c2c6d4]/60 rounded-lg px-3 py-1.5 bg-fleet-card text-[#0d1c2f] focus:outline-none focus:border-fleet-red transition-colors"
        >
          {(Object.entries(SORT_LABELS) as [Sort, string][]).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Vehicle grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[#424752] text-lg font-medium">Geen voertuigen gevonden</p>
          <p className="text-fleet-muted text-sm mt-1">Probeer een andere filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}
