'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FiMenu, FiX, FiPlus } from 'react-icons/fi'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-fleet-card border-b border-fleet-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/7000rpm_Logo.gif"
            alt="7000rpm"
            width={32}
            height={32}
            className="object-contain rounded"
            unoptimized
          />
          <span className="font-bold text-sm tracking-widest text-white uppercase">
            REA-FL33T
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Voertuigen' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'bg-fleet-red/10 text-fleet-red'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vehicles/new"
            className="flex items-center gap-1.5 bg-fleet-red hover:bg-fleet-red-dark text-white text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <FiPlus size={15} />
            <span className="hidden sm:inline">Voertuig toevoegen</span>
          </Link>
          <button
            className="md:hidden text-zinc-400 hover:text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-fleet-card border-t border-fleet-border px-4 pb-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-sm text-zinc-300 border-b border-white/5"
          >
            Voertuigen
          </Link>
        </div>
      )}
    </nav>
  )
}
