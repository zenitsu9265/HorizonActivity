import Link from "next/link";
import {
  ArrowRight,
  Plus,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/container";
import { CardRail, RailItem } from "@/components/ui/card-rail";
import { Hero } from "@/components/hero";
import { WhyBookSection } from "@/components/feature-cards";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { StarIcon } from "@/components/ui/icons";
import { ActivityCard } from "@/components/activity-card";
import { PlaceCard } from "@/components/place-card";
import { CardPlanCard } from "@/components/card-plan-card";

export const metadata: Metadata = {
  title: "Book Adventure & Experience Activities Across India",
  description:
    "Crafting, bungee jumping, water sports and 50+ activities at India's most popular places. Buy a booking card and save up to 25%.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredActivities, featuredPlaces, cardPlans, user] = await Promise.all([
    prisma.activity.findMany({
      where: { featured: true },
      take: 6,
      include: { place: { select: { name: true, slug: true, city: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.place.findMany({
      where: { featured: true },
      take: 6,
      include: { _count: { select: { activities: true } } },
    }),
    prisma.cardPlan.findMany({ where: { active: true }, orderBy: { price: "asc" } }),
    getCurrentUser(),
  ]);

  const hero = cardPlans.find((p) => p.price === Math.min(...cardPlans.map((p) => p.price)));
  const midPlan = cardPlans.find((p) => p.id !== hero?.id && p.price > (hero?.price ?? 0));

  return (
    <>
      <Hero />
      <WhyBookSection />
      <FeaturedActivities activities={featuredActivities} />
      <PopularPlaces places={featuredPlaces} />
      <BookingCardsSection plans={cardPlans} signedIn={!!user} highlightId={midPlan?.id} />
      <HowItWorksSection />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}

function FeaturedActivities({
  activities,
}: {
  activities: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    price: number;
    imageUrl: string;
    duration: string | null;
    featured: boolean;
    place: { name: string; slug: string; city: string };
  }[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Trending now"
            title="Popular activities"
            description="Handpicked experiences our explorers love the most."
          />
          <Link href="/activities" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:underline sm:flex">
            View all<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <CardRail>
            {activities.map((activity) => (
              <RailItem key={activity.id}>
                <ActivityCard activity={activity} />
              </RailItem>
            ))}
          </CardRail>
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/activities">
            <Button variant="fillUp">View all</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function BookingCardsSection({
  plans,
  signedIn,
  highlightId,
}: {
  plans: Awaited<ReturnType<typeof prisma.cardPlan.findMany>>;
  signedIn: boolean;
  highlightId?: string;
}) {
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Booking cards"
            title="Buy credit, pay less on everything"
            description="Prepaid booking cards give you store credit at a discount. Use the balance on any activity, any place."
          />
        </div>
        <div className="mt-8">
          <CardRail>
            {plans.map((plan) => (
              <RailItem key={plan.id}>
                <CardPlanCard
                  plan={plan}
                  signedIn={signedIn}
                  highlighted={plan.id === highlightId}
                />
              </RailItem>
            ))}
          </CardRail>
        </div>
      </Container>
    </section>
  );
}

function PopularPlaces({
  places,
}: {
  places: Awaited<ReturnType<typeof prisma.place.findMany>>;
}) {
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Top destinations"
            title="Popular places to explore"
            description="From mountain towns to beachside getaways — adventures everywhere."
          />
          <Link href="/places" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:underline sm:flex">
            View all<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8">
          <CardRail>
            {places.map((place) => (
              <RailItem key={place.id}>
                <PlaceCard place={place} />
              </RailItem>
            ))}
          </CardRail>
        </div>
      </Container>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Ananya Sharma",
      role: "Booked crafting workshop, Jaipur",
      text: "Bought the ₹2,000 card for ₹1,800 and used it across two pottery workshops. Saved money and the booking took under a minute.",
    },
    {
      name: "Rohit Verma",
      role: "Bungee jumping, Rishikesh",
      text: "The wallet balance made it super easy to book bungee jumping. Cancelled once and got an instant refund to my wallet. Zero hassle.",
    },
    {
      name: "Sneha Iyer",
      role: "River rafting, Manali",
      text: "Love that one card works across all places. I have a ₹5,000 card and keep topping up with my family. Highly recommended.",
    },
  ];
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Explorer stories"
          title="Loved by thousands of explorers"
          className="mx-auto text-center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <figure key={item.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-foreground">&ldquo;{item.text}&rdquo;</blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  const faqs = [
    {
      q: "What is a booking card?",
      a: "A booking card is prepaid store credit. You pay a discounted price and the full face value is added to your wallet — e.g. pay ₹1,800 and get ₹2,000 of booking credit.",
    },
    {
      q: "How do I use my wallet balance?",
      a: "Once signed in, pick any activity and a date, then confirm. The activity price is deducted from your wallet instantly.",
    },
    {
      q: "Can I cancel a booking?",
      a: "Yes. Cancel any confirmed booking and the full amount is refunded to your wallet instantly.",
    },
    {
      q: "Do cards expire?",
      a: "Booking cards and wallet balance never expire, so you can explore at your own pace.",
    },
    {
      q: "Is my payment secure?",
      a: "Payments are processed by Razorpay with bank-grade encryption. Test mode uses Razorpay test cards — no real money is charged.",
    },
  ];
  return (
    <section className="border-y border-border bg-card py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">FAQs</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-border bg-background">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium">
                  {faq.q}
                  <span className="text-brand-700 transition-transform group-open:rotate-45">
                    <Plus className="h-5 w-5" />
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-brand-700 px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready for your next adventure?
            </h2>
            <p className="mt-2 text-brand-50/90">
              Get ₹2,000 of booking credit for just ₹1,800. Create your free account and start exploring.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Get started free
              </Button>
            </Link>
            <Link href="/booking-cards">
              <Button
                size="lg"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                View booking cards
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
