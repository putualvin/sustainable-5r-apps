/**
 * Token warna terpusat. Ubah nilai di sini (atau CSS variable padanannya di
 * app/globals.css) untuk mengganti ke palet brand Sinar Mas nanti — komponen
 * tidak perlu disentuh.
 *
 * CATATAN: warna brand di bawah adalah PLACEHOLDER. Ganti `--brand` di
 * globals.css dengan warna korporat resmi saat sudah tersedia.
 */
export const theme = {
  brand: '#0F766E', // teal placeholder — ganti ke warna Sinar Mas
  status: {
    onTarget: '#059669', // emerald-600
    waspada: '#D97706', // amber-600
    under: '#E11D48', // rose-600
    na: '#94A3B8', // slate-400
  },
} as const

export type StatusColorKey = keyof typeof theme.status
