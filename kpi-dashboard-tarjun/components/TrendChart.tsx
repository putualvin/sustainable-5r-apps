'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { TrendPoint } from '@/lib/kpi'
import { theme } from '@/lib/theme'

/**
 * Grafik garis tren Achievement 12 bulan, dengan garis referensi di 100%.
 * Client component karena recharts butuh DOM.
 */
export default function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v: number) => `${v}%`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(v) => {
              const n = typeof v === 'number' ? v : Number(v)
              return [Number.isFinite(n) ? `${n.toFixed(1)}%` : '—', 'Ach']
            }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={100}
            stroke={theme.status.onTarget}
            strokeDasharray="4 4"
            label={{ value: 'Target 100%', position: 'right', fontSize: 10, fill: theme.status.onTarget }}
          />
          <Line
            type="monotone"
            dataKey="ach"
            stroke={theme.brand}
            strokeWidth={2.5}
            dot={{ r: 3, fill: theme.brand }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
