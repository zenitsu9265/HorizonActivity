import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    users,
    places,
    activities,
    activePlans,
    bookings,
    confirmedBookings,
    paidOrders,
    revenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.activity.count(),
    prisma.cardPlan.count({ where: { active: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.cardOrder.count({ where: { status: "PAID" } }),
    prisma.cardOrder.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const [recentOrders, recentBookings] = await Promise.all([
    prisma.cardOrder.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        cardPlan: { select: { name: true } },
      },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        activity: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Users", value: String(users), icon: Users, href: "/admin/users" },
    { label: "Places", value: String(places), icon: MapPin, href: "/admin/places" },
    { label: "Activities", value: String(activities), icon: Ticket, href: "/admin/activities" },
    { label: "Bookings", value: String(bookings), icon: CalendarDays, href: "/admin/bookings" },
    { label: "Cards sold", value: String(paidOrders), icon: CreditCard, href: "/admin/orders" },
    {
      label: "Revenue (paid)",
      value: formatINR(revenue._sum.amount ?? 0),
      icon: IndianRupee,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Overview of places, activities, bookings and revenue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-5 transition-colors hover:border-brand-500">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-brand-700" />
              </div>
              <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Recent card orders</h2>
          {recentOrders.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">
                      {order.user.name}{" "}
                      <span className="font-normal text-muted">· {order.cardPlan?.name ?? "Card"}</span>
                    </p>
                    <p className="text-xs text-muted">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatINR(order.amount)}</p>
                    <p
                      className={`text-xs ${
                        order.status === "PAID" ? "text-brand-700" : "text-amber-700"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No card orders yet.</p>
          )}
          <p className="mt-3 text-xs text-muted">
            {confirmedBookings} of {bookings} bookings are active.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold">Recent bookings</h2>
          {recentBookings.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {recentBookings.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">
                      {booking.user.name}{" "}
                      <span className="font-normal text-muted">· {booking.activity.name}</span>
                    </p>
                    <p className="text-xs text-muted">{booking.bookingNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatINR(booking.amount)}</p>
                    <p
                      className={`text-xs ${
                        booking.status === "CONFIRMED" ? "text-brand-700" : "text-red-600"
                      }`}
                    >
                      {booking.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No bookings yet.</p>
          )}
          <p className="mt-3 text-xs text-muted">
            {activePlans} active booking card plans.
          </p>
        </Card>
      </div>
    </div>
  );
}
