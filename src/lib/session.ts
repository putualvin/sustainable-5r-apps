// Sesi demo sederhana (CLAUDE.md §4 "login sederhana + role switcher").
// BUKAN auth produksi — hanya menyimpan id user terpilih di cookie.
// Tidak ada password; pemilihan user setara "login" untuk keperluan demo.
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "demo_user_id";

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Ambil user aktif dari cookie. null bila belum "login". */
export async function getCurrentUser() {
  const id = cookies().get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    include: { area: true },
  });
}
