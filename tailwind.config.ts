import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fleet: {
          // All values come from CSS variables — dark mode is handled by .dark {...}
          bg:             'var(--fleet-bg)',
          card:           'var(--fleet-card)',
          'card-hover':   'var(--fleet-card-hover)',
          // RGB tuple format enables opacity modifiers (bg-fleet-primary/10 etc.)
          primary:        'rgb(var(--fleet-primary) / <alpha-value>)',
          'primary-dark': 'var(--fleet-primary-dark)',
          secondary:      'var(--fleet-secondary)',
          tertiary:       'rgb(var(--fleet-tertiary) / <alpha-value>)',
          neutral:        'var(--fleet-neutral)',
          muted:          'var(--fleet-muted)',
          border:         'var(--fleet-border)',
          'border-strong':'var(--fleet-border-strong)',
          input:          'var(--fleet-input)',
          sold:           'var(--fleet-sold)',
          available:      'rgb(var(--fleet-available) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        card:        '0 1px 3px rgba(51,65,85,0.08), 0 1px 2px rgba(51,65,85,0.04)',
        'card-hover':'0 4px 12px rgba(0,95,184,0.10), 0 1px 3px rgba(51,65,85,0.06)',
        primary:     '0 2px 8px rgba(0,95,184,0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
