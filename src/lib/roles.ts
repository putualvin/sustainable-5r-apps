// Konfigurasi role & navigasi per role — Sustainable 5R (Modul 1).
// Acuan: CLAUDE.md §4 (6 role + beranda masing-masing).
// Sumber kebenaran tunggal untuk label role & item navigasi shell.

export type Role =
  | "ADMIN"
  | "KOMITE"
  | "AUDITOR"
  | "AUDITEE"
  | "REDTAG"
  | "MANAGEMENT";

export const ROLES: Role[] = [
  "ADMIN",
  "KOMITE",
  "AUDITOR",
  "AUDITEE",
  "REDTAG",
  "MANAGEMENT",
];

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  KOMITE: "Komite Unit",
  AUDITOR: "Auditor",
  AUDITEE: "Auditee / PIC Area",
  REDTAG: "Koordinator Red Tag",
  MANAGEMENT: "Management",
};

// Fokus singkat tiap role (§4) — ditampilkan di beranda & login.
export const ROLE_FOKUS: Record<Role, string> = {
  ADMIN: "Master data & konfigurasi",
  KOMITE: "Kelola siklus, nilai status, scoring, verifikasi",
  AUDITOR: "Menjalankan audit cross-area",
  AUDITEE: "Tindak lanjut temuan + Daily Checklist",
  REDTAG: "Kelola barang & deadline Red Tag",
  MANAGEMENT: "Pantau skor & tren (read-only)",
};

export type IconName =
  | "home"
  | "settings"
  | "clipboard"
  | "verify"
  | "task"
  | "checklist"
  | "tag"
  | "chart";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  /** Nomor modul roadmap (§9) — null bila sudah jadi di Modul 1. */
  modul: number | null;
}

const NAV_BERANDA: NavItem = { label: "Beranda", href: "/beranda", icon: "home", modul: null };

// Navigasi bottom-bar per role. Item non-beranda menuju placeholder modul
// yang belum dibangun (akan diisi pada modul berikutnya sesuai §9).
export const ROLE_NAV: Record<Role, NavItem[]> = {
  ADMIN: [
    NAV_BERANDA,
    { label: "Master Data", href: "/master", icon: "settings", modul: 9 },
  ],
  KOMITE: [
    NAV_BERANDA,
    { label: "Penilaian", href: "/penilaian", icon: "verify", modul: 4 },
    { label: "Dashboard", href: "/dashboard", icon: "chart", modul: 7 },
  ],
  AUDITOR: [
    NAV_BERANDA,
    { label: "Audit", href: "/audit", icon: "clipboard", modul: 2 },
  ],
  AUDITEE: [
    NAV_BERANDA,
    { label: "Temuan", href: "/temuan", icon: "task", modul: 3 },
    { label: "Checklist", href: "/checklist", icon: "checklist", modul: 5 },
  ],
  REDTAG: [
    NAV_BERANDA,
    { label: "Red Tag", href: "/redtag", icon: "tag", modul: 6 },
  ],
  MANAGEMENT: [
    NAV_BERANDA,
    { label: "Dashboard", href: "/dashboard", icon: "chart", modul: 7 },
  ],
};

export function isRole(value: string | null | undefined): value is Role {
  return !!value && (ROLES as string[]).includes(value);
}
