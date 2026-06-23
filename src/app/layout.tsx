import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sustainable 5R — Refinery 2",
  description:
    "Digitalisasi program Sustainable 5R (Ringkas, Rapi, Resik, Rawat, Rajin) — Sinar Mas Agribusiness and Food.",
};

export const viewport: Viewport = {
  themeColor: "#E30613",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
