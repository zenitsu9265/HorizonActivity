import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CardPlansManager } from "@/components/admin/card-plans-manager";
import { deleteCardPlan, upsertCardPlan } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin · Booking Cards" };
export const dynamic = "force-dynamic";

export default async function AdminCardsPage() {
  const plans = await prisma.cardPlan.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { price: "asc" },
  });

  return (
    <CardPlansManager
      plans={plans}
      upsertAction={upsertCardPlan}
      deleteAction={deleteCardPlan}
    />
  );
}
