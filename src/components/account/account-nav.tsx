"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

interface AccountNavProps {
  user: { name: string; email: string; role: string; walletBalance: number };
}

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/bookings", label: "My bookings", icon: CalendarDays },
  { href: "/account/cards", label: "My cards", icon: CreditCard },
  { href: "/account/transactions", label: "Transactions", icon: Receipt },
];

export function AccountNav({ user }: AccountNavProps) {
  const pathname = usePathname();  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <nav className="mt-4 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:bg-slate-100 hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-700" />
          <p className="text-xs text-brand-800">Wallet balance</p>
        </div>
        <p className="mt-1 text-xl font-bold text-brand-800">
          ₹{formatINR(user.walletBalance)}
        </p>
        <p className="mt-1 text-xs text-brand-700">Use it to book any activity.</p>
      </div>
    </aside>
  );
}
