import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ROLE_NAV, isRole, type Role } from "@/lib/roles";
import { RoleSwitcher, type SwitchUser } from "@/components/RoleSwitcher";
import { BottomNav } from "@/components/BottomNav";
import { OfflineBar } from "@/components/OfflineBar";

export const dynamic = "force-dynamic";

// Shell untuk seluruh halaman setelah "login": header brand + switcher role
// + navigasi bawah sesuai role. Guard: tanpa sesi → kembali ke /login.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isRole(user.role)) redirect("/login");

  const role = user.role as Role;
  const nav = ROLE_NAV[role];

  const allUsers = await prisma.user.findMany({
    include: { area: true },
    orderBy: { role: "asc" },
  });
  const switchUsers: SwitchUser[] = allUsers.map((u) => ({
    id: u.id,
    nama: u.nama,
    role: u.role,
    areaNama: u.area?.nama ?? null,
  }));
  const current: SwitchUser = {
    id: user.id,
    nama: user.nama,
    role: user.role,
    areaNama: user.area?.nama ?? null,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-brand-red px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[10px] font-semibold uppercase tracking-wider opacity-80">
              Sustainable 5R · Refinery 2
            </div>
          </div>
          <RoleSwitcher current={current} users={switchUsers} />
        </div>
      </header>

      <OfflineBar />

      <main className="flex-1 pb-2">{children}</main>

      <BottomNav items={nav} />
    </div>
  );
}
