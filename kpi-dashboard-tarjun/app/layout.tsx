import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard KPI — Unit Tarjun',
  description:
    'Mockup dashboard KPI Unit Tarjun (Sinar Mas Agri). Data Januari 2025 asli; Feb–Des dummy.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
