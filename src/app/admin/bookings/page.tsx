import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Bookings" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      activity: { select: { name: true, category: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All bookings</h1>
        <p className="mt-1 text-sm text-muted">{bookings.length} total bookings.</p>
      </div>

      {bookings.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Activity</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{booking.bookingNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-xs text-muted">{booking.user.email}</p>
                  </td>
                  <td className="px-4 py-3">{booking.activity.name}</td>
                  <td className="px-4 py-3">{formatDate(booking.date)}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(booking.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={booking.status === "CONFIRMED" ? "brand" : "red"}>
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">No bookings yet.</p>
      )}
    </div>
  );
}
