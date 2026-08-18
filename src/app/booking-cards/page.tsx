import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { Container, SectionHeading } from "@/components/ui/container";
import { CardRail, RailItem } from "@/components/ui/card-rail";
import { CardPlanCard } from "@/components/card-plan-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Booking Cards - Save Up to 25%",
  description:
    "Buy a prepaid booking card and get up to 25% off. A ₹2,000 card costs just ₹1,800. Pay once, book any activity at any place.",
};

export const dynamic = "force-dynamic";

export default async function BookingCardsPage() {
  const [plans, user] = await Promise.all([
    prisma.cardPlan.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
    getCurrentUser(),
  ]);

  const mid = plans[1];

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Booking cards"
        title="Choose your booking card"
        description="Pay a discounted price today, get full store credit in your wallet to spend on any activity across India. Credit never expires."
      />

      <div className="mt-8">
        <CardRail>
          {plans.map((plan) => (
            <RailItem key={plan.id}>
              <CardPlanCard
                plan={plan}
                signedIn={!!user}
                highlighted={plan.id === mid?.id}
                userEmail={user?.email}
                userPhone={user?.phone ?? undefined}
              />
            </RailItem>
          ))}
        </CardRail>
      </div>

      {user ? (
        <div className="mt-8 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
          <Badge tone="brand">Your wallet</Badge>
          <p className="text-sm text-brand-800">
            Balance: {formatINR(user.walletBalance)} — ready to spend on
            activities.
          </p>
        </div>
      ) : null}
    </Container>
  );
}
