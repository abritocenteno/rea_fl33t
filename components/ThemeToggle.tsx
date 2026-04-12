'use client'

import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Schakel naar licht' : 'Schakel naar donker'}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-fleet-border hover:border-fleet-border-strong hover:bg-fleet-card-hover text-fleet-muted hover:text-fleet-neutral transition-all"
    >
      {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  )
}
