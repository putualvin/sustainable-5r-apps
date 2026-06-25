"use client";
// Daily Checklist — offline-first (§5.6).
// Item & area di-cache di HP saat online; jawaban yes/no disimpan lokal lalu
// di-antre ke outbox untuk sync otomatis ketika ada sinyal.
import { useCallback, useEffect, useState } from "react";
import { refGet, refSet } from "@/lib/offline/db";
import { enqueue } from "@/lib/offline/outbox";
import { useOffline } from "@/lib/offline/useOffline";
import { PageTitle, SectionTitle, EmptyState, Badge } from "@/components/ui";

interface Item {
  id: string;
  teks: string;
  urutan: number;
}
interface Meta {
  area: { id: string; nama: string } | null;
  items: Item[];
}
type Jawaban = "YES" | "NO";

function todayStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const META_KEY = "checklist:meta";
const answersKey = (tgl: string) => `checklist:answers:${tgl}`;

export default function ChecklistPage() {
  const today = todayStr();
  const { online, pendingCount, syncing, doSync, refresh } = useOffline();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [answers, setAnswers] = useState<Record<string, Jawaban>>({});
  const [source, setSource] = useState<"online" | "cache" | "none">("none");

  useEffect(() => {
    let alive = true;
    (async () => {
      // 1) Tampilkan dari cache lokal lebih dulu (instan, jalan offline).
      const cached = await refGet<Meta>(META_KEY);
      const draft = (await refGet<Record<string, Jawaban>>(answersKey(today))) ?? {};
      if (alive && cached) {
        setMeta(cached);
        setSource("cache");
      }
      if (alive) setAnswers(draft);

      // 2) Bila online, ambil data terbaru dari server & perbarui cache.
      if (navigator.onLine) {
        try {
          const res = await fetch("/api/checklist/items", { cache: "no-store" });
          if (res.ok) {
            const fresh = (await res.json()) as Meta;
            await refSet(META_KEY, fresh);
            if (alive) {
              setMeta(fresh);
              setSource("online");
            }
          }
        } catch {
          /* gagal online → tetap pakai cache */
        }
      }
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [today]);

  const toggle = useCallback(
    async (itemId: string, value: Jawaban) => {
      const next = { ...answers, [itemId]: value };
      setAnswers(next);
      await refSet(answersKey(today), next); // draft lokal (tahan reload & offline)
      await enqueue(
        "checklistEntry",
        { itemId, tanggal: today, jawaban: value },
        `${itemId}:${today}`, // dedupe: 1 jawaban terakhir per item per hari
      );
      await refresh();
      if (navigator.onLine) void doSync();
    },
    [answers, today, refresh, doSync],
  );

  if (loading) {
    return (
      <div className="p-5">
        <PageTitle title="Daily Checklist" sub={today} />
        <div className="animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400">
          Memuat…
        </div>
      </div>
    );
  }

  // Belum ada data sama sekali & offline → minta buka sekali saat online.
  if (!meta && source === "none") {
    return (
      <div className="p-5">
        <PageTitle title="Daily Checklist" sub={today} />
        <EmptyState
          title="Belum siap offline"
          desc="Buka halaman ini sekali saat ada sinyal agar item checklist tersimpan untuk dipakai offline."
        />
      </div>
    );
  }

  if (!meta?.area) {
    return (
      <div className="p-5">
        <PageTitle title="Daily Checklist" sub={today} />
        <EmptyState
          title="Belum terhubung ke area"
          desc="Akun ini belum memiliki area PIC. Hubungi Admin."
        />
      </div>
    );
  }

  const items = meta.items;
  const answered = items.filter((i) => answers[i.id]).length;
  const yes = items.filter((i) => answers[i.id] === "YES").length;
  const compliance = answered > 0 ? Math.round((yes / items.length) * 100) : 0;

  return (
    <div className="p-5">
      <PageTitle title="Daily Checklist" sub={`${meta.area.nama} · ${today}`} />

      {items.length === 0 ? (
        // Empty state jelas, bukan error (§5.6).
        <EmptyState
          title="Area ini belum punya item checklist"
          desc="Item harian belum dikonfigurasi untuk area ini. Hubungi Admin untuk menambahkannya."
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <div>
              <div className="text-sm font-medium text-brand-black">
                {answered}/{items.length} terisi
              </div>
              <div className="text-xs text-zinc-400">
                Compliance {compliance}% · target &gt;90%
              </div>
            </div>
            <Badge tone={compliance >= 90 ? "green" : answered === items.length ? "amber" : "grey"}>
              {answered === items.length ? "Lengkap" : "Berjalan"}
            </Badge>
          </div>

          <SectionTitle>Item Hari Ini</SectionTitle>
          <div className="space-y-2">
            {items.map((it) => {
              const val = answers[it.id];
              return (
                <div
                  key={it.id}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
                >
                  <div className="mb-2 text-sm text-brand-black">{it.teks}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggle(it.id, "YES")}
                      className={`flex-1 rounded-lg border py-1.5 text-sm font-semibold transition ${
                        val === "YES"
                          ? "border-status-done bg-status-done text-white"
                          : "border-zinc-200 text-zinc-500"
                      }`}
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => toggle(it.id, "NO")}
                      className={`flex-1 rounded-lg border py-1.5 text-sm font-semibold transition ${
                        val === "NO"
                          ? "border-status-noprogress bg-status-noprogress text-white"
                          : "border-zinc-200 text-zinc-500"
                      }`}
                    >
                      Tidak
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
            <span>
              {online ? "Tersimpan & ter-sync" : "Tersimpan di HP (offline)"}
              {pendingCount > 0 ? ` · ${pendingCount} menunggu sync` : ""}
            </span>
            {online && pendingCount > 0 && (
              <button
                onClick={doSync}
                disabled={syncing}
                className="font-semibold text-brand-red underline disabled:opacity-60"
              >
                {syncing ? "Sync…" : "Sync sekarang"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
