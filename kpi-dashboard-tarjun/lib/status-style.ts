import type { Status } from './kpi'
import { theme } from './theme'

/** Kelas Tailwind per status untuk teks, latar lembut, dan garis aksen. */
export const STATUS_STYLE: Record<
  Status,
  { text: string; bg: string; ring: string; accent: string; dot: string }
> = {
  'on-target': {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-500',
  },
  waspada: {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    accent: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
  under: {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200',
    accent: 'bg-rose-500',
    dot: 'bg-rose-500',
  },
  na: {
    text: 'text-slate-500',
    bg: 'bg-slate-50',
    ring: 'ring-slate-200',
    accent: 'bg-slate-300',
    dot: 'bg-slate-300',
  },
}

/** Warna hex per status (untuk recharts / SVG yang tak pakai kelas Tailwind). */
export const STATUS_HEX: Record<Status, string> = {
  'on-target': theme.status.onTarget,
  waspada: theme.status.waspada,
  under: theme.status.under,
  na: theme.status.na,
}
