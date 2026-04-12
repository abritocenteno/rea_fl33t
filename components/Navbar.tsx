'use client'

import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="bg-fleet-card border-b border-fleet-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ height: '56px' }}>
        <div className="flex items-center h-full gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 rounded-md flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: 'var(--fleet-primary-solid)' }}>
              <Image
                src="/images/7000rpm_Logo.gif"
                alt="7000rpm"
                width={18}
                height={18}
                className="object-contain brightness-0 invert"
                unoptimized
              />
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight text-fleet-neutral">
              REA-FL33T
            </span>
          </Link>

          <div className="flex-1" />

          <span className="text-[11px] font-medium text-fleet-muted hidden sm:block tracking-wide">
            Fleet Management
          </span>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
