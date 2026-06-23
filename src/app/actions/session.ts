"use server";
// Server actions untuk sesi demo: pilih user (login) & keluar.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session";

export async function loginAs(userId: string) {
  cookies().set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari (demo)
  });
  redirect("/beranda");
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/login");
}
