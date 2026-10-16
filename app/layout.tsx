import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'REA-FL33T',
  description: 'Vehicle fleet management dashboard',
  icons: { icon: '/images/favicon.png' },
}

// Runs synchronously before React hydrates — prevents flash of wrong theme
const themeScript = `
  try {
    var t = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-fleet-bg text-fleet-neutral min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-fleet-border px-4 py-4 text-center text-xs text-fleet-muted">
          Powered by{' '}
          <a
            href="https://prikichilabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-fleet-border underline-offset-2 hover:text-fleet-primary transition-colors"
          >
            Prikichi Labs
          </a>
        </footer>
      </body>
    </html>
  )
}
