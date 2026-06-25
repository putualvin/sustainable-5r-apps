"use client";
// Bilah status koneksi & sync — tampil di bawah header shell.
// Sembunyi saat online & tidak ada antrean (low noise §3).
import { useOffline } from "@/lib/offline/useOffline";

export function OfflineBar() {
  const { online, pendingCount, syncing, doSync } = useOffline();

  if (online && pendingCount === 0) return null;

  if (!online) {
    return (
      <div className="flex items-center justify-between gap-2 bg-brand-black px-4 py-1.5 text-xs text-white">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-grey" />
          Mode offline — perubahan disimpan di HP
        </span>
        {pendingCount > 0 && <span className="opacity-80">{pendingCount} menunggu sync</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 bg-amber-50 px-4 py-1.5 text-xs text-amber-800">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-status-progress" />
        {pendingCount} perubahan menunggu sync
      </span>
      <button
        onClick={doSync}
        disabled={syncing}
        className="font-semibold underline disabled:opacity-60"
      >
        {syncing ? "Menyinkronkan…" : "Sync sekarang"}
      </button>
    </div>
  );
}
