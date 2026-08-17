"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Receipt,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/places", label: "Places", icon: MapPin },
  { href: "/admin/activities", label: "Activities", icon: Ticket },
  { href: "/admin/cards", label: "Booking cards", icon: CreditCard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/orders", label: "Card orders", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Admin panel</p>
        <p className="text-xs text-muted">Manage everything</p>
      </div>
      <nav className="mt-4 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
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
    </aside>
  );
}
