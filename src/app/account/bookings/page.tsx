import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CancelBookingButton } from "@/components/cancel-booking-button";

export const metadata: Metadata = { title: "My Bookings" };
export const dynamic = "force-dynamic";

function isCancellable(status: string, date: Date): boolean {
  return status === "CONFIRMED" && date.getTime() > Date.now();
}

export default async function AccountBookingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      activity: {
        select: { name: true, slug: true, imageUrl: true, place: { select: { name: true, city: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My bookings</h1>
        <p className="mt-1 text-sm text-muted">View and manage all your activity bookings.</p>
      </div>

      {bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const cancellable = isCancellable(booking.status, booking.date);
            return (
              <li key={booking.id}>
                <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:w-28">
                    <Image
                      src={booking.activity.imageUrl}
                      alt={booking.activity.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/activities/${booking.activity.slug}`}
                        className="font-semibold hover:text-brand-700"
                      >
                        {booking.activity.name}
                      </Link>
                      <Badge tone={booking.status === "CONFIRMED" ? "brand" : "red"}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {booking.activity.place.name}, {booking.activity.place.city}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(booking.date)}
                      <span className="mx-1">·</span>
                      {formatINR(booking.amount)}
                    </p>
                    <p className="mt-1 text-xs text-muted">Booking # {booking.bookingNumber}</p>
                  </div>
                  <div className="shrink-0">
                    {cancellable ? (
                      <CancelBookingButton bookingId={booking.id} />
                    ) : booking.status === "CANCELLED" ? (
                      <p className="text-xs text-muted">Refunded to wallet</p>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 font-semibold">No bookings yet</p>
          <p className="mt-1 text-sm text-muted">
            Browse activities and book your first adventure.
          </p>
          <Link href="/activities" className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline">
            Explore activities →
          </Link>
        </Card>
      )}
    </div>
  );
}
