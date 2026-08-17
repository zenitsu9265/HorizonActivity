import Link from "next/link";
import { CreditCard, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "My Cards" };
export const dynamic = "force-dynamic";

export default async function AccountCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { paid } = await searchParams;

  const orders = await prisma.cardOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { cardPlan: true },
  });

  const justPaid = paid ? orders.find((o) => o.orderNumber === paid) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My booking cards</h1>
        <p className="mt-1 text-sm text-muted">
          Cards you have purchased. Credit is added to your wallet instantly.
        </p>
      </div>

      {justPaid && justPaid.status === "PAID" ? (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
          <PartyPopper className="h-5 w-5 shrink-0 text-brand-700" />
          <p className="text-sm text-brand-800">
            Payment successful! {formatINR(justPaid.cardValue)} of booking credit has been added
            to your wallet.
          </p>
        </div>
      ) : null}

      {orders.length > 0 ? (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold">{order.cardPlan?.name ?? "Booking card"}</p>
                  <p className="text-sm text-muted">
                    #{order.orderNumber} · {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Credit:{" "}
                    <span className="font-semibold text-brand-700">
                      {formatINR(order.cardValue)}
                    </span>
                  </p>
                  <p className="text-xs text-muted">Paid {formatINR(order.amount)}</p>
                </div>
                <Badge
                  tone={
                    order.status === "PAID"
                      ? "brand"
                      : order.status === "FAILED"
                        ? "red"
                        : "amber"
                  }
                >
                  {order.status === "PAID"
                    ? "Active"
                    : order.status === "FAILED"
                      ? "Failed"
                      : "Pending"}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="p-12 text-center">
          <CreditCard className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 font-semibold">No cards yet</p>
          <p className="mt-1 text-sm text-muted">Buy a booking card and save up to 25%.</p>
          <Link href="/booking-cards" className="mt-4 inline-block">
            <Button size="sm">Buy a booking card</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
