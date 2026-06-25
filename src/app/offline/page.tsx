// Halaman fallback saat offline & rute belum pernah di-cache.
// Statis (tanpa DB) agar selalu bisa tampil tanpa server.
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 text-4xl">📡</div>
      <h1 className="text-lg font-bold text-brand-black">Sedang offline</h1>
      <p className="mt-2 max-w-xs text-sm text-zinc-500">
        Halaman ini belum tersimpan untuk mode offline. Sambungkan ke jaringan sebentar,
        lalu buka kembali. Data yang sudah Anda isi di HP tetap aman dan akan ter-sync
        otomatis saat online.
      </p>
    </main>
  );
}
