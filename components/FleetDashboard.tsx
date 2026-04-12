'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AutoDetails, LOCATIE_OPTIONS } from '@/lib/types'
import VehicleCard from './VehicleCard'
import { FiPlus } from 'react-icons/fi'

type Filter = 'all' | 'available' | 'sold'
type Sort = 'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'mileage-asc' | 'alpha-asc' | 'alpha-desc'

const SORT_LABELS: Record<Sort, string> = {
  newest:        'Nieuwste eerst',
  'alpha-asc':   'Naam: A → Z',
  'alpha-desc':  'Naam: Z → A',
  'price-asc':   'Prijs: laag → hoog',
  'price-desc':  'Prijs: hoog → laag',
  'year-desc':   'Jaar: nieuw → oud',
  'year-asc':    'Jaar: oud → nieuw',
  'mileage-asc': 'KM: laag → hoog',
}

export default function FleetDashboard({ vehicles }: { vehicles: AutoDetails[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('alpha-asc')
  const [locations, setLocations] = useState<Set<string>>(new Set(LOCATIE_OPTIONS))

  function toggleLocation(loc: string) {
    setLocations((prev) => {
      const next = new Set(prev)
      if (next.has(loc) && next.size > 1) next.delete(loc)
      else next.add(loc)
      return next
    })
  }

  const total     = vehicles.length
  const available = vehicles.filter((v) => !v.sold).length
  const sold      = vehicles.filter((v) => v.sold).length

  const stats: { key: Filter; label: string; value: number; color: string; bg: string; border: string }[] = [
    { key: 'all',       label: 'Totaal',       value: total,     color: 'text-fleet-neutral',   bg: 'bg-fleet-primary/8',    border: 'border-fleet-primary/20' },
    { key: 'available', label: 'Beschikbaar',  value: available, color: 'text-fleet-available', bg: 'bg-fleet-available/8',  border: 'border-fleet-available/20' },
    { key: 'sold',      label: 'Verkocht',     value: sold,      color: 'text-fleet-tertiary',  bg: 'bg-fleet-tertiary/8',   border: 'border-fleet-tertiary/20' },
  ]

  const filtered = useMemo(() => {
    let list = [...vehicles]
    if (filter === 'available') list = list.filter((v) => !v.sold)
    if (filter === 'sold')      list = list.filter((v) => v.sold)
    list = list.filter((v) => !v.locatie || locations.has(v.locatie))

    list.sort((a, b) => {
      switch (sort) {
        case 'price-asc':    return (a.vraagprijs ?? 0) - (b.vraagprijs ?? 0)
        case 'price-desc':   return (b.vraagprijs ?? 0) - (a.vraagprijs ?? 0)
        case 'year-desc':    return parseInt(b.bouwjaar ?? '0') - parseInt(a.bouwjaar ?? '0')
        case 'year-asc':     return parseInt(a.bouwjaar ?? '0') - parseInt(b.bouwjaar ?? '0')
        case 'mileage-asc':  return (a.kmstand ?? 0) - (b.kmstand ?? 0)
        case 'alpha-asc':    return `${a.merk} ${a.model}`.localeCompare(`${b.merk} ${b.model}`)
        case 'alpha-desc':   return `${b.merk} ${b.model}`.localeCompare(`${a.merk} ${a.model}`)
        default:             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
    return list
  }, [vehicles, filter, sort, locations])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-7">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-fleet-neutral tracking-tight">
            Voertuigen
          </h1>
        </div>
        <Link href="/vehicles/new" className="btn-primary self-start sm:self-auto">
          <FiPlus size={15} />
          Toevoegen
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`text-left bg-fleet-card border rounded-xl px-4 py-4 shadow-card transition-all duration-150 relative overflow-hidden ${
              filter === s.key
                ? `${s.border} ${s.bg} shadow-none ring-1 ring-inset ${s.border}`
                : 'border-fleet-border hover:border-fleet-primary/20 hover:shadow-card-hover'
            }`}
          >
            <p className={`font-display font-bold text-3xl sm:text-4xl leading-none mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-fleet-muted uppercase tracking-[0.1em]">{s.label}</p>
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col gap-2.5 mb-6">
        {/* Location pills */}
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <span className="text-[11px] font-semibold text-fleet-muted uppercase tracking-[0.1em] shrink-0">Locatie</span>
          {LOCATIE_OPTIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => toggleLocation(loc)}
              className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-lg border transition-all duration-150 shrink-0 ${
                locations.has(loc)
                  ? 'bg-fleet-primary text-white border-fleet-primary shadow-primary'
                  : 'text-fleet-secondary border-fleet-border bg-fleet-card hover:border-fleet-primary/40 hover:text-fleet-primary'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Count + sort */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-fleet-muted font-medium">
            {filtered.length} voertuig{filtered.length !== 1 ? 'en' : ''}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="text-[12px] font-medium border border-fleet-border rounded-lg px-3 py-1.5 bg-fleet-card text-fleet-neutral focus:outline-none focus:border-fleet-primary focus:ring-2 focus:ring-fleet-primary/10 cursor-pointer transition-all"
          >
            {(Object.entries(SORT_LABELS) as [Sort, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Vehicle grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 bg-fleet-border/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-display font-bold text-fleet-muted">0</span>
          </div>
          <p className="font-display font-bold text-fleet-neutral text-lg">Geen voertuigen gevonden</p>
          <p className="text-fleet-muted text-sm mt-1">Probeer een andere filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
