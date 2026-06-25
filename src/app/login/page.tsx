import { prisma } from "@/lib/prisma";
import { ROLE_LABEL, ROLE_FOKUS, ROLES, isRole, type Role } from "@/lib/roles";
import { loginAs } from "@/app/actions/session";

export const dynamic = "force-dynamic";

// "Login sederhana" untuk demo (§4): pilih salah satu user → masuk ke beranda
// role tersebut. Tanpa password — switcher role tersedia di dalam shell.
export default async function LoginPage() {
  const users = await prisma.user.findMany({
    include: { area: true },
    orderBy: { nama: "asc" },
  });

  // Kelompokkan user per role, urut sesuai daftar ROLES.
  const byRole = ROLES.reduce<Record<Role, typeof users>>((acc, r) => {
    acc[r] = users.filter((u) => u.role === r);
    return acc;
  }, {} as Record<Role, typeof users>);

  return (
    <main className="min-h-screen">
      <header className="bg-brand-red px-5 pb-7 pt-10 text-white">
        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Sinar Mas Agribusiness and Food
        </div>
        <h1 className="mt-1 text-2xl font-bold leading-tight">Sustainable 5R</h1>
        <p className="mt-1 text-sm opacity-90">
          Refinery 2 · Ringkas · Rapi · Resik · Rawat · Rajin
        </p>
      </header>

      <div className="p-5">
        <h2 className="text-base font-semibold text-brand-black">Masuk sebagai</h2>
        <p className="mb-5 mt-0.5 text-sm text-zinc-500">
          Pilih pengguna untuk demo. Tiap role punya beranda sendiri.
        </p>

        <div className="space-y-6">
          {ROLES.map((role) => {
            const list = byRole[role];
            if (!list.length) return null;
            return (
              <section key={role}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold text-brand-black">
                    {ROLE_LABEL[role]}
                  </h3>
                  <span className="text-xs text-zinc-400">{ROLE_FOKUS[role]}</span>
                </div>
                <div className="space-y-2">
                  {list.map((u) => (
                    <form key={u.id} action={loginAs.bind(null, u.id)}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition active:scale-[0.99] hover:border-brand-red/40"
                      >
                        <div>
                          <div className="text-sm font-medium text-brand-black">
                            {u.nama}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {isRole(u.role) ? ROLE_LABEL[u.role] : u.role}
                            {u.area ? ` · ${u.area.nama}` : ""}
                          </div>
                        </div>
                        <span className="text-brand-red" aria-hidden>
                          →
                        </span>
                      </button>
                    </form>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Demo Shadow Build · bukan sistem produksi
        </p>
      </div>
    </main>
  );
}
