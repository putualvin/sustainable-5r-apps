import type { Config } from 'tailwindcss'

/**
 * Warna status & brand di-drive dari CSS variables (lihat app/globals.css dan
 * lib/theme.ts) supaya mudah diganti ke palet brand Sinar Mas nanti tanpa
 * menyentuh komponen.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        'brand-fg': 'var(--brand-fg)',
        ontarget: 'var(--status-ontarget)',
        waspada: 'var(--status-waspada)',
        under: 'var(--status-under)',
        na: 'var(--status-na)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
