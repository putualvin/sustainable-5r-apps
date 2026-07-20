import {
  Coins,
  Wallet,
  Landmark,
  Factory,
  FlaskConical,
  Fuel,
  Boxes,
  Gauge,
  Percent,
  Droplet,
  Droplets,
  Truck,
  Flame,
  Leaf,
  HardHat,
  ClipboardCheck,
  LayoutGrid,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { Kategori } from './kpi'

/**
 * Peta nama KPI → icon lucide. Pencocokan berbasis kata kunci (case-insensitive)
 * agar sub-KPI (mis. "Refinery 1") ikut terpetakan. Fallback: Gauge.
 */
const KEYWORD_ICONS: [RegExp, LucideIcon][] = [
  [/factory\s*cost/i, Coins],
  [/ga\s*cost/i, Wallet],
  [/capex/i, Landmark],
  [/refiner/i, Factory],
  [/fractionation/i, FlaskConical],
  [/biodiesel/i, Fuel],
  [/volume/i, Boxes],
  [/yield|loss/i, Percent],
  [/efficiency/i, Gauge],
  [/swro|bwro|ratio.*water|water.*ratio/i, Droplets],
  [/handling/i, Truck],
  [/steam/i, Flame],
  [/environment/i, Leaf],
  [/safety/i, HardHat],
  [/audit/i, ClipboardCheck],
  [/5r/i, LayoutGrid],
  [/bbs/i, ShieldCheck],
  [/swro/i, Droplet],
]

export function iconForKpi(nama: string): LucideIcon {
  for (const [re, icon] of KEYWORD_ICONS) {
    if (re.test(nama)) return icon
  }
  return Gauge
}

/** Icon representatif per kategori (untuk header baris kategori). */
export const CATEGORY_ICON: Record<Kategori, LucideIcon> = {
  Financial: Coins,
  Production: Boxes,
  Utility: Droplets,
  Logistic: Truck,
  'Power Plant': Flame,
  EHFS: HardHat,
  Collaboration: LayoutGrid,
}
