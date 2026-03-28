'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-fleet-card border-b border-[#c2c6d4]/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/7000rpm_Logo.gif"
            alt="7000rpm"
            width={32}
            height={32}
            className="object-contain rounded"
            unoptimized
          />
          <span className="font-bold text-sm tracking-widest text-[#0d1c2f] uppercase">
            REA-FL33T
          </span>
        </Link>
      </div>
    </nav>
  )
}
