import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime, formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookingCount, activeBookings, cardOrders, recentBookings, recentTransactions] =
    await Promise.all([
      prisma.booking.count({ where: { userId: user.id } }),
      prisma.booking.count({ where: { userId: user.id, status: "CONFIRMED" } }),
      prisma.cardOrder.count({ where: { userId: user.id, status: "PAID" } }),
      prisma.booking.findMany({
        where: { userId: user.id },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { activity: { select: { name: true, slug: true, imageUrl: true } } },
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const spent = await prisma.transaction.aggregate({
    where: { userId: user.id, type: "DEBIT" },
    _sum: { amount: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your wallet, bookings and booking cards.
        </p>
      </div>

      <div className="rounded-xl bg-brand-700 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-brand-50/90">
              <Wallet className="h-4 w-4" /> Available wallet balance
            </p>
            <p className="mt-1 text-4xl font-bold">{formatINR(user.walletBalance)}</p>
            <p className="mt-2 text-sm text-brand-50/90">
              Total spent on activities: {formatINR(spent._sum.amount ?? 0)}
            </p>
          </div>
          <Link href="/booking-cards">
            <Button variant="secondary" className="bg-white text-brand-800 hover:bg-brand-50">
              <Plus className="h-4 w-4" /> Buy a booking card
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/account/bookings">
          <Card className="p-5 transition-colors hover:border-brand-500">
            <CalendarDays className="h-6 w-6 text-brand-700" />
            <p className="mt-3 text-2xl font-bold">{activeBookings}</p>
            <p className="text-sm text-muted">Active bookings</p>
          </Card>
        </Link>
        <Link href="/account/bookings">
          <Card className="p-5 transition-colors hover:border-brand-500">
            <Receipt className="h-6 w-6 text-brand-700" />
            <p className="mt-3 text-2xl font-bold">{bookingCount}</p>
            <p className="text-sm text-muted">Total bookings</p>
          </Card>
        </Link>
        <Link href="/account/cards">
          <Card className="p-5 transition-colors hover:border-brand-500">
            <CreditCard className="h-6 w-6 text-brand-700" />
            <p className="mt-3 text-2xl font-bold">{cardOrders}</p>
            <p className="text-sm text-muted">Cards purchased</p>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent bookings</CardTitle>
            <Link href="/account/bookings" className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <Link
                        href={`/activities/${booking.activity.slug}`}
                        className="text-sm font-semibold hover:text-brand-700"
                      >
                        {booking.activity.name}
                      </Link>
                      <p className="text-xs text-muted">{formatDateTime(booking.date)}</p>
                    </div>
                    <Badge tone={booking.status === "CONFIRMED" ? "brand" : "red"}>
                      {booking.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                No bookings yet.{" "}
                <Link href="/activities" className="text-brand-700 hover:underline">
                  Browse activities
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent transactions</CardTitle>
            <Link href="/account/transactions" className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <ul className="divide-y divide-border">
                {recentTransactions.map((tx) => (
                  <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted">{formatDateTime(tx.createdAt)}</p>
                    </div>
                    <p
                      className={`flex items-center text-sm font-semibold ${
                        tx.type === "CREDIT" ? "text-brand-700" : "text-red-600"
                      }`}
                    >
                      {tx.type === "CREDIT" ? "+" : "-"}
                      {formatINR(tx.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted">No transactions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/activities">
          <Button variant="outline">
            Explore activities <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
