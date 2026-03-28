import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fleet: {
          bg: '#f8f9ff',
          card: '#ffffff',
          'card-hover': '#dde9ff',
          border: 'transparent',
          red: '#00488d',
          'red-dark': '#005fb8',
          muted: '#424752',
          input: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
