"use client";
// Switcher role demo (§4): ganti user/role cepat tanpa kembali ke login.
import { useState } from "react";
import { ROLE_LABEL, isRole } from "@/lib/roles";
import { loginAs, logout } from "@/app/actions/session";

export interface SwitchUser {
  id: string;
  nama: string;
  role: string;
  areaNama: string | null;
}

export function RoleSwitcher({
  current,
  users,
}: {
  current: SwitchUser;
  users: SwitchUser[];
}) {
  const [open, setOpen] = useState(false);
  const currentRoleLabel = isRole(current.role) ? ROLE_LABEL[current.role] : current.role;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-left text-white transition active:scale-95"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs font-bold">
          {current.nama.charAt(0)}
        </span>
        <span className="leading-tight">
          <span className="block text-xs font-semibold">{current.nama}</span>
          <span className="block text-[10px] opacity-80">{currentRoleLabel}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          {/* backdrop untuk tutup */}
          <button
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Tutup"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white text-brand-black shadow-lg">
            <div className="border-b border-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Ganti pengguna (demo)
            </div>
            <div className="max-h-72 overflow-y-auto">
              {users.map((u) => {
                const active = u.id === current.id;
                return (
                  <form key={u.id} action={loginAs.bind(null, u.id)}>
                    <button
                      type="submit"
                      disabled={active}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-zinc-50 disabled:cursor-default disabled:bg-brand-red/5`}
                    >
                      <span>
                        <span className="block font-medium">{u.nama}</span>
                        <span className="block text-xs text-zinc-400">
                          {isRole(u.role) ? ROLE_LABEL[u.role] : u.role}
                          {u.areaNama ? ` · ${u.areaNama}` : ""}
                        </span>
                      </span>
                      {active && (
                        <span className="text-xs font-semibold text-brand-red">aktif</span>
                      )}
                    </button>
                  </form>
                );
              })}
            </div>
            <form action={logout} className="border-t border-zinc-100">
              <button
                type="submit"
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-brand-red hover:bg-zinc-50"
              >
                Keluar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
