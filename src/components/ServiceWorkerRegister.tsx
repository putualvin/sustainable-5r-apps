"use client";
// Daftarkan service worker (PWA). Aman bila browser tak mendukung.
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* abaikan: PWA opsional, app tetap jalan */
      });
    }
  }, []);
  return null;
}
