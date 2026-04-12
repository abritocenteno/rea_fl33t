import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AutoDetails, AanbodImages } from '@/lib/types'
import ImageCarousel from '@/components/ImageCarousel'
import { FiArrowLeft, FiEdit2, FiCalendar, FiActivity, FiDroplet, FiMapPin, FiDollarSign } from 'react-icons/fi'

interface Props { params: { id: string } }

async function getVehicle(aanbodId: string): Promise<AutoDetails | null> {
  const { data } = await supabase
    .from('auto_details')
    .select('*')
    .eq('aanbod_id', aanbodId)
    .single()
  return data
}

async function getImages(aanbodId: string): Promise<string[]> {
  const { data } = await supabase
    .from('aanbod_images')
    .select('url')
    .eq('aanbod_id', aanbodId)
    .single()
  if (!data) return []
  const raw = data as AanbodImages
  return Array.isArray(raw.url) ? raw.url : []
}

const OPTION_SECTIONS = [
  { label: 'Interieur',    key: 'optiesInterieur' },
  { label: 'Exterieur',    key: 'optiesExterieur' },
  { label: 'Comfort',      key: 'optiesComfort' },
  { label: 'Infotainment', key: 'optiesInfotainment' },
  { label: 'Veiligheid',   key: 'optiesVeiligheid' },
  { label: 'Motor',        key: 'optiesMotor' },
] as const

export default async function VehicleDetailPage({ params }: Props) {
  const [vehicle, images] = await Promise.all([
    getVehicle(params.id),
    getImages(params.id),
  ])

  if (!vehicle) notFound()

  const allImages = images.length ? images : vehicle.image_url ? [vehicle.image_url] : []
  const price = vehicle.vraagprijs
    ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(vehicle.vraagprijs)
    : '—'
  const km = vehicle.kmstand
    ? new Intl.NumberFormat('nl-NL').format(vehicle.kmstand) + ' km'
    : '—'

  const specRows = [
    { icon: FiCalendar,   label: 'Bouwjaar',       value: vehicle.bouwjaar },
    { icon: FiActivity,   label: 'Kilometerstand',  value: km !== '—' ? km : null },
    { icon: FiDroplet,    label: 'Brandstof',       value: vehicle.brandstof },
    { icon: FiMapPin,     label: 'Locatie',         value: vehicle.locatie },
    { icon: FiDollarSign, label: 'Vraagprijs',      value: price },
  ].filter((r) => r.value)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-fleet-secondary hover:text-fleet-primary transition-colors"
        >
          <FiArrowLeft size={13} />
          Overzicht
        </Link>
        <Link
          href={`/vehicles/${params.id}/edit`}
          className="flex items-center gap-1.5 border border-fleet-border bg-fleet-card hover:border-fleet-primary hover:text-fleet-primary text-fleet-secondary text-[12px] font-semibold px-3.5 py-2 rounded-lg shadow-card transition-all"
        >
          <FiEdit2 size={12} />
          Bewerken
        </Link>
      </div>

      {/* Title block */}
      <div className="mb-6 pb-5 border-b border-fleet-border">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-fleet-secondary uppercase tracking-[0.12em] mb-0.5">{vehicle.merk}</p>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-fleet-neutral leading-tight truncate">
              {vehicle.model}
            </h1>
          </div>
          <div className="text-right shrink-0">
            {vehicle.sold ? (
              <span className="block text-[11px] font-bold text-fleet-tertiary border border-fleet-tertiary/30 bg-fleet-tertiary/10 px-2.5 py-1 rounded-lg mb-2 w-fit ml-auto">
                Verkocht
              </span>
            ) : (
              <span className="block text-[11px] font-bold text-fleet-available border border-fleet-available/25 bg-fleet-available/10 px-2.5 py-1 rounded-lg mb-2 w-fit ml-auto">
                Beschikbaar
              </span>
            )}
            <p className="font-display font-bold text-3xl sm:text-4xl text-fleet-primary leading-none">{price}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* Left */}
        <div className="space-y-4">
          <ImageCarousel images={allImages} alt={`${vehicle.merk} ${vehicle.model}`} />

          {vehicle.beschrijving && (
            <div className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card">
              <p className="text-[11px] font-semibold text-fleet-secondary uppercase tracking-[0.1em] mb-3">Beschrijving</p>
              <p className="text-fleet-neutral text-sm leading-relaxed whitespace-pre-line">{vehicle.beschrijving}</p>
            </div>
          )}

          {OPTION_SECTIONS.map((s) => {
            const opts = vehicle[s.key as keyof AutoDetails] as string[]
            if (!opts?.length) return null
            return (
              <div key={s.key} className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[11px] font-semibold text-fleet-secondary uppercase tracking-[0.1em]">{s.label}</p>
                  <span className="text-[10px] font-bold text-fleet-primary bg-fleet-primary/10 px-1.5 py-0.5 rounded-md">{opts.length}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {opts.map((opt, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-fleet-neutral">
                      <span className="w-1.5 h-1.5 rounded-full bg-fleet-primary shrink-0" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-3">
          <div className="bg-fleet-card border border-fleet-border rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-fleet-secondary uppercase tracking-[0.1em] mb-4">Specificaties</p>
            <div className="space-y-3">
              {specRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12px] text-fleet-muted font-medium">
                    <row.icon size={13} className="text-fleet-secondary" />
                    {row.label}
                  </span>
                  <span className={`text-[13px] font-semibold ${row.label === 'Vraagprijs' ? 'text-fleet-primary' : 'text-fleet-neutral'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/vehicles/${params.id}/edit`}
              className="mt-5 btn-primary w-full justify-center"
            >
              <FiEdit2 size={14} />
              Bewerken
            </Link>
          </div>

          <div className="bg-fleet-card border border-fleet-border rounded-xl px-5 py-4 shadow-card">
            <p className="text-[10px] font-semibold text-fleet-muted uppercase tracking-[0.1em] mb-1">Toegevoegd</p>
            <p className="text-[13px] font-medium text-fleet-secondary">
              {new Date(vehicle.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
