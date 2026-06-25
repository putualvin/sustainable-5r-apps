// Hook konektivitas: status online/offline, jumlah perubahan pending,
// dan auto-sync saat koneksi kembali.
"use client";

import { useCallback, useEffect, useState } from "react";
import { pendingCount } from "./outbox";
import { syncOutbox } from "./sync";

export function useOffline() {
  const [online, setOnline] = useState(true);
  const [count, setCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setCount(await pendingCount());
    } catch {
      /* IndexedDB belum siap — abaikan */
    }
  }, []);

  const doSync = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    setSyncing(true);
    try {
      await syncOutbox();
    } finally {
      setSyncing(false);
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    setOnline(navigator.onLine);
    void refresh();
    if (navigator.onLine) void doSync();

    const onOnline = () => {
      setOnline(true);
      void doSync();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    // Polling ringan agar badge ikut update saat input dari tab/halaman lain.
    const iv = window.setInterval(refresh, 4000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(iv);
    };
  }, [refresh, doSync]);

  return { online, pendingCount: count, syncing, doSync, refresh };
}
