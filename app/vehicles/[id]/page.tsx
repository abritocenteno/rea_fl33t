import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AutoDetails, AanbodImages } from '@/lib/types'
import ImageCarousel from '@/components/ImageCarousel'
import { FiArrowLeft, FiEdit2, FiCalendar, FiActivity, FiDroplet, FiDollarSign } from 'react-icons/fi'

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
  { label: 'Interieur', key: 'optiesInterieur' },
  { label: 'Exterieur', key: 'optiesExterieur' },
  { label: 'Comfort', key: 'optiesComfort' },
  { label: 'Infotainment', key: 'optiesInfotainment' },
  { label: 'Veiligheid', key: 'optiesVeiligheid' },
  { label: 'Motor', key: 'optiesMotor' },
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-fleet-muted hover:text-white transition-colors">
          <FiArrowLeft size={14} />
          Terug
        </Link>
        <Link
          href={`/vehicles/${params.id}/edit`}
          className="flex items-center gap-2 bg-fleet-card border border-fleet-border hover:border-zinc-500 text-sm text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg transition-all"
        >
          <FiEdit2 size={13} />
          Bewerken
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          <ImageCarousel images={allImages} alt={`${vehicle.merk} ${vehicle.model}`} />

          {/* Description */}
          {vehicle.beschrijving && (
            <div className="bg-fleet-card border border-fleet-border rounded-xl p-5">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Beschrijving</h2>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{vehicle.beschrijving}</p>
            </div>
          )}

          {/* Options */}
          {OPTION_SECTIONS.map((s) => {
            const opts = vehicle[s.key as keyof AutoDetails] as string[]
            if (!opts?.length) return null
            return (
              <div key={s.key} className="bg-fleet-card border border-fleet-border rounded-xl p-5">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  {s.label} <span className="text-fleet-red">({opts.length})</span>
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {opts.map((opt, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="w-1 h-1 rounded-full bg-fleet-red shrink-0" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Right — sticky card */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="bg-fleet-card border border-fleet-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-white">
                {vehicle.merk} {vehicle.model}
              </h1>
              {vehicle.sold && (
                <span className="bg-fleet-red/20 border border-fleet-red/40 text-fleet-red text-xs font-bold px-2 py-0.5 rounded-full">
                  VERKOCHT
                </span>
              )}
            </div>

            <p className="text-3xl font-black text-fleet-red mb-5">{price}</p>

            <div className="space-y-3 border-t border-fleet-border pt-4">
              {[
                { icon: FiCalendar, label: 'Bouwjaar', value: vehicle.bouwjaar },
                { icon: FiActivity, label: 'Kilometerstand', value: km },
                { icon: FiDroplet, label: 'Brandstof', value: vehicle.brandstof },
                { icon: FiDollarSign, label: 'Vraagprijs', value: price },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <row.icon size={13} />
                    {row.label}
                  </span>
                  <span className="text-white font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/vehicles/${params.id}/edit`}
              className="mt-5 flex items-center justify-center gap-2 w-full bg-fleet-red hover:bg-fleet-red-dark text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              <FiEdit2 size={14} />
              Bewerken
            </Link>
          </div>

          <div className="bg-fleet-card border border-fleet-border rounded-xl px-5 py-4">
            <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1">ID</p>
            <p className="text-zinc-400 text-xs font-mono break-all">{vehicle.aanbod_id}</p>
            <p className="text-[11px] text-zinc-600 uppercase tracking-wider mt-3 mb-1">Toegevoegd</p>
            <p className="text-zinc-400 text-xs">
              {new Date(vehicle.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
