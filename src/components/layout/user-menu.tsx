"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CreditCard, LogOut, User, Wallet } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
    walletBalance: number;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 text-sm font-medium hover:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open ? (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Wallet className="h-4 w-4 text-brand-700" />
              <div>
                <p className="text-xs text-muted">Wallet balance</p>
                <p className="text-sm font-semibold">{formatINR(user.walletBalance)}</p>
              </div>
            </div>
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => navigate("/account")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                <User className="h-4 w-4" />
                My account
              </button>
              <button
                type="button"
                onClick={() => navigate("/account/bookings")}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                <CreditCard className="h-4 w-4" />
                My bookings
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {pending ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
