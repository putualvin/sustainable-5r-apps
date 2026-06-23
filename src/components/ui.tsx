// Primitif UI ringan dipakai lintas halaman. Bahasa Indonesia, mobile-first.
import Link from "next/link";

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold text-brand-black">{title}</h1>
      {sub && <p className="mt-0.5 text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </h2>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "red" | "amber" | "green";
}) {
  const valueColor = {
    default: "text-brand-black",
    red: "text-status-noprogress",
    amber: "text-status-progress",
    green: "text-status-done",
  }[tone];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      {sub && <div className="mt-0.5 text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
      <div className="text-sm font-medium text-brand-black">{title}</div>
      {desc && <p className="mt-1 text-xs text-zinc-500">{desc}</p>}
    </div>
  );
}

const BADGE_TONE: Record<string, string> = {
  green: "bg-status-done/10 text-status-done",
  amber: "bg-status-progress/10 text-status-progress",
  red: "bg-status-noprogress/10 text-status-noprogress",
  grey: "bg-zinc-100 text-zinc-500",
};

export function Badge({
  children,
  tone = "grey",
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "red" | "grey";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_TONE[tone]}`}
    >
      {children}
    </span>
  );
}

// Kartu placeholder untuk modul yang belum dibangun (§9).
export function ComingSoon({
  modul,
  title,
  desc,
}: {
  modul: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-5">
      <PageTitle title={title} sub={`Modul ${modul} — roadmap §9`} />
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
        <div className="mb-1 text-3xl">🚧</div>
        <div className="text-sm font-semibold text-brand-black">Segera hadir</div>
        <p className="mx-auto mt-1 max-w-xs text-xs text-zinc-500">{desc}</p>
        <Link
          href="/beranda"
          className="mt-4 inline-block rounded-lg bg-brand-red px-4 py-2 text-xs font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
