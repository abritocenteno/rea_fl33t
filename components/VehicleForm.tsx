'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { AutoDetails, Optie, OptionKey, BRANDSTOF_OPTIONS, OPTIE_CATEGORIES } from '@/lib/types'
import { FiChevronDown, FiChevronUp, FiX, FiUpload, FiLoader } from 'react-icons/fi'

interface InitialData {
  vehicle: AutoDetails
  images: string[]
}

interface VehicleFormProps {
  mode: 'add' | 'edit'
  initialData?: InitialData
}

type FormState = {
  merk: string
  model: string
  bouwjaar: string
  brandstof: string
  kmstand: string
  vraagprijs: string
  beschrijving: string
  sold: boolean
  optiesInterieur: string[]
  optiesExterieur: string[]
  optiesComfort: string[]
  optiesInfotainment: string[]
  optiesVeiligheid: string[]
  optiesMotor: string[]
}

const emptyForm: FormState = {
  merk: '', model: '', bouwjaar: '', brandstof: '', kmstand: '', vraagprijs: '',
  beschrijving: '', sold: false,
  optiesInterieur: [], optiesExterieur: [], optiesComfort: [],
  optiesInfotainment: [], optiesVeiligheid: [], optiesMotor: [],
}

export default function VehicleForm({ mode, initialData }: VehicleFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>(() => {
    if (!initialData) return emptyForm
    const v = initialData.vehicle
    return {
      merk: v.merk ?? '',
      model: v.model ?? '',
      bouwjaar: v.bouwjaar ?? '',
      brandstof: v.brandstof ?? '',
      kmstand: v.kmstand != null ? String(v.kmstand) : '',
      vraagprijs: v.vraagprijs != null ? String(v.vraagprijs) : '',
      beschrijving: v.beschrijving ?? '',
      sold: v.sold ?? false,
      optiesInterieur: v.optiesInterieur ?? [],
      optiesExterieur: v.optiesExterieur ?? [],
      optiesComfort: v.optiesComfort ?? [],
      optiesInfotainment: v.optiesInfotainment ?? [],
      optiesVeiligheid: v.optiesVeiligheid ?? [],
      optiesMotor: v.optiesMotor ?? [],
    }
  })

  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [removedUrls, setRemovedUrls] = useState<string[]>([])

  const [opties, setOpties] = useState<Optie[]>([])
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    supabase.from('optiies').select('*').then(({ data }) => {
      if (data) setOpties(data as Optie[])
    })
  }, [])

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleOption(key: OptionKey, value: string) {
    setForm((prev) => {
      const arr = prev[key] as string[]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const arr = Array.from(files)
    setNewFiles((prev) => [...prev, ...arr])
    arr.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(f)
    })
  }

  function removeNewFile(i: number) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url))
    setRemovedUrls((prev) => [...prev, url])
  }

  async function uploadFiles(aanbodId: string): Promise<string[]> {
    const urls: string[] = []
    for (const file of newFiles) {
      const ext = file.name.split('.').pop()
      const path = `${aanbodId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('aanbod-images').upload(path, file, { upsert: false })
      if (error) throw new Error(`Upload mislukt: ${error.message}`)
      const { data } = supabase.storage.from('aanbod-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.merk || !form.model || !form.bouwjaar || !form.kmstand || !form.vraagprijs) {
      setError('Vul alle verplichte velden in (Merk, Model, Bouwjaar, Kmstand, Vraagprijs).')
      return
    }

    setLoading(true)
    try {
      if (mode === 'add') {
        // 1. Insert into aanbod_list
        const { data: aanbodRow, error: aanbodErr } = await supabase
          .from('aanbod_list')
          .insert({ merk: form.merk, model: form.model, brandstof: form.brandstof, bouwjaar: form.bouwjaar })
          .select()
          .single()
        if (aanbodErr) throw aanbodErr

        const aanbodId = aanbodRow.id

        // 2. Upload images
        const uploadedUrls = await uploadFiles(aanbodId)
        const allUrls = [...existingImages, ...uploadedUrls]

        // 3. Insert auto_details
        const { error: detailsErr } = await supabase.from('auto_details').insert({
          aanbod_id: aanbodId,
          merk: form.merk,
          model: form.model,
          brandstof: form.brandstof || null,
          bouwjaar: form.bouwjaar,
          kmstand: form.kmstand ? parseFloat(form.kmstand) : null,
          vraagprijs: form.vraagprijs ? parseFloat(form.vraagprijs) : null,
          beschrijving: form.beschrijving || null,
          image_url: allUrls[0] ?? null,
          sold: false,
          optiesInterieur: form.optiesInterieur,
          optiesExterieur: form.optiesExterieur,
          optiesComfort: form.optiesComfort,
          optiesInfotainment: form.optiesInfotainment,
          optiesVeiligheid: form.optiesVeiligheid,
          optiesMotor: form.optiesMotor,
        })
        if (detailsErr) throw detailsErr

        // 4. Insert aanbod_images if any
        if (allUrls.length > 0) {
          await supabase.from('aanbod_images').insert({ aanbod_id: aanbodId, url: allUrls })
        }

        router.push(`/vehicles/${aanbodId}`)
      } else {
        // EDIT mode
        const v = initialData!.vehicle
        const aanbodId = v.aanbod_id!

        // 1. Upload new images
        const uploadedUrls = await uploadFiles(aanbodId)
        const allUrls = [...existingImages, ...uploadedUrls]

        // 2. Update auto_details
        const { error: detailsErr } = await supabase
          .from('auto_details')
          .update({
            merk: form.merk,
            model: form.model,
            brandstof: form.brandstof || null,
            bouwjaar: form.bouwjaar,
            kmstand: form.kmstand ? parseFloat(form.kmstand) : null,
            vraagprijs: form.vraagprijs ? parseFloat(form.vraagprijs) : null,
            beschrijving: form.beschrijving || null,
            image_url: allUrls[0] ?? v.image_url,
            sold: form.sold,
            optiesInterieur: form.optiesInterieur,
            optiesExterieur: form.optiesExterieur,
            optiesComfort: form.optiesComfort,
            optiesInfotainment: form.optiesInfotainment,
            optiesVeiligheid: form.optiesVeiligheid,
            optiesMotor: form.optiesMotor,
          })
          .eq('id', v.id)
        if (detailsErr) throw detailsErr

        // 3. Update aanbod_list
        await supabase
          .from('aanbod_list')
          .update({ merk: form.merk, model: form.model, brandstof: form.brandstof || null, bouwjaar: form.bouwjaar, sold: form.sold })
          .eq('id', aanbodId)

        // 4. Upsert aanbod_images
        const { data: existingImgRow } = await supabase
          .from('aanbod_images')
          .select('id')
          .eq('aanbod_id', aanbodId)
          .single()

        if (existingImgRow) {
          await supabase.from('aanbod_images').update({ url: allUrls }).eq('id', existingImgRow.id)
        } else if (allUrls.length > 0) {
          await supabase.from('aanbod_images').insert({ aanbod_id: aanbodId, url: allUrls })
        }

        router.push(`/vehicles/${aanbodId}`)
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm('Weet je zeker dat je dit voertuig wilt verwijderen?')) return
    setDeleting(true)
    const v = initialData.vehicle
    const aanbodId = v.aanbod_id!
    await supabase.from('auto_details').delete().eq('id', v.id)
    await supabase.from('aanbod_images').delete().eq('aanbod_id', aanbodId)
    await supabase.from('aanbod_list').delete().eq('id', aanbodId)
    setDeleting(false)
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-950/50 border border-fleet-red/50 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="bg-fleet-card border border-fleet-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Basisinformatie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="fleet-label">Merk *</label>
            <input className="fleet-input" placeholder="bijv. BMW" value={form.merk} onChange={(e) => setForm((p) => ({ ...p, merk: e.target.value }))} />
          </div>
          <div>
            <label className="fleet-label">Model *</label>
            <input className="fleet-input" placeholder="bijv. 5-serie" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} />
          </div>
          <div>
            <label className="fleet-label">Bouwjaar *</label>
            <input className="fleet-input" type="number" placeholder="2020" value={form.bouwjaar} onChange={(e) => setForm((p) => ({ ...p, bouwjaar: e.target.value }))} />
          </div>
          <div>
            <label className="fleet-label">Brandstof</label>
            <select className="fleet-input" value={form.brandstof} onChange={(e) => setForm((p) => ({ ...p, brandstof: e.target.value }))}>
              <option value="">Selecteer brandstof</option>
              {BRANDSTOF_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="fleet-label">Kilometerstand *</label>
            <input className="fleet-input" type="number" placeholder="50000" value={form.kmstand} onChange={(e) => setForm((p) => ({ ...p, kmstand: e.target.value }))} />
          </div>
          <div>
            <label className="fleet-label">Vraagprijs (€) *</label>
            <input className="fleet-input" type="number" placeholder="15000" value={form.vraagprijs} onChange={(e) => setForm((p) => ({ ...p, vraagprijs: e.target.value }))} />
          </div>
        </div>

        {mode === 'edit' && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, sold: !p.sold }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.sold ? 'bg-fleet-red' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.sold ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-zinc-300">Verkocht</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-fleet-card border border-fleet-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Beschrijving</h2>
        <textarea
          className="fleet-input resize-none h-28"
          placeholder="Beschrijf het voertuig..."
          value={form.beschrijving}
          onChange={(e) => setForm((p) => ({ ...p, beschrijving: e.target.value }))}
        />
      </div>

      {/* Options */}
      <div className="bg-fleet-card border border-fleet-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-fleet-border">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Opties</h2>
        </div>
        {OPTIE_CATEGORIES.map((cat) => {
          const catOpties = opties.filter((o) => o.categorie?.toLowerCase() === cat.label.toLowerCase())
          const selected = form[cat.key] as string[]
          const isOpen = openSections[cat.key as string] ?? false

          return (
            <div key={cat.key as string} className="border-b border-fleet-border last:border-b-0">
              <button
                type="button"
                onClick={() => toggleSection(cat.key as string)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-sm font-medium text-zinc-200">
                  {cat.label}
                  {selected.length > 0 && (
                    <span className="ml-2 text-xs bg-fleet-red/20 text-fleet-red px-1.5 py-0.5 rounded-full">
                      {selected.length}
                    </span>
                  )}
                </span>
                {isOpen ? <FiChevronUp size={15} className="text-zinc-500" /> : <FiChevronDown size={15} className="text-zinc-500" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-4">
                  {catOpties.length === 0 ? (
                    <p className="text-xs text-fleet-muted">Geen opties beschikbaar.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {catOpties.map((o) => {
                        const val = o.optie ?? ''
                        const checked = selected.includes(val)
                        return (
                          <label key={o.id} className="flex items-center gap-2 cursor-pointer group">
                            <span
                              className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                                checked ? 'bg-fleet-red border-fleet-red' : 'border-fleet-border group-hover:border-zinc-500'
                              }`}
                              onClick={() => toggleOption(cat.key, val)}
                            >
                              {checked && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">{val}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Images */}
      <div className="bg-fleet-card border border-fleet-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Afbeeldingen</h2>

        {/* Existing + new images grid */}
        {(existingImages.length > 0 || newPreviews.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {existingImages.map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-fleet-border">
                <Image src={url} alt="Vehicle" fill className="object-cover" sizes="(max-width: 640px) 33vw, 25vw" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-fleet-red text-white rounded-full p-1 transition-colors"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-fleet-red/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-fleet-red text-white rounded-full p-1 transition-colors"
                >
                  <FiX size={12} />
                </button>
                <span className="absolute bottom-0 inset-x-0 bg-fleet-red/80 text-white text-[10px] text-center py-0.5">Nieuw</span>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border border-dashed border-fleet-border hover:border-fleet-red/60 text-fleet-muted hover:text-white text-sm px-4 py-3 rounded-lg transition-colors w-full justify-center"
        >
          <FiUpload size={15} />
          Afbeeldingen toevoegen
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pb-8">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-fleet-red hover:bg-fleet-red-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {loading && <span className="animate-spin"><FiLoader size={15} /></span>}
            {mode === 'add' ? 'Voertuig opslaan' : 'Wijzigingen opslaan'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white px-4 py-2.5 rounded-lg border border-fleet-border hover:border-zinc-600 text-sm transition-colors"
          >
            Annuleren
          </button>
        </div>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-fleet-red border border-red-900/50 hover:border-fleet-red text-sm px-4 py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            {deleting ? 'Verwijderen...' : 'Verwijder voertuig'}
          </button>
        )}
      </div>
    </form>
  )
}
