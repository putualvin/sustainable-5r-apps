"use client";
// Navigasi bawah mobile-first. Highlight item sesuai path aktif.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import type { NavItem } from "@/lib/roles";

export function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                active ? "text-brand-red" : "text-zinc-400"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
