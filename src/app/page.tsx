import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// Pintu masuk: arahkan ke beranda (bila sudah login) atau ke login.
export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? "/beranda" : "/login");
}
