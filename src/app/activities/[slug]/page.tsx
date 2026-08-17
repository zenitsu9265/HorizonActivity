import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/components/activity-card";
import { BookActivityButton } from "@/components/book-activity-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: { place: true },
  });
  if (!activity) return {};
  return {
    title: `${activity.name} - ${activity.place.city}`,
    description: activity.description,
    openGraph: {
      title: `${activity.name} - ${activity.place.city}`,
      description: activity.description,
      images: [activity.imageUrl],
    },
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      place: true,
      _count: { select: { bookings: true } },
    },
  });

  if (!activity) notFound();

  const [user, related] = await Promise.all([
    getCurrentUser(),
    prisma.activity.findMany({
      where: {
        AND: [
          { id: { not: activity.id } },
          { OR: [{ placeId: activity.placeId }, { category: activity.category }] },
        ],
      },
      take: 3,
      include: { place: { select: { name: true, slug: true, city: true } } },
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: activity.name,
    description: activity.description,
    image: activity.imageUrl,
    category: activity.category,
    offers: {
      "@type": "Offer",
      price: (activity.price / 100).toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    locationCreated: {
      "@type": "Place",
      name: activity.place.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: activity.place.city,
        addressRegion: activity.place.state ?? undefined,
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-10">
        <Link
          href="/activities"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to activities
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src={activity.imageUrl}
                alt={activity.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">{activity.category}</Badge>
                {activity.featured ? <Badge tone="amber">Featured</Badge> : null}
                <Badge tone="neutral">
                  {activity._count.bookings} bookings
                </Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">{activity.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-muted">
                <MapPin className="h-4 w-4 text-brand-700" />
                <Link
                  href={`/places/${activity.place.slug}`}
                  className="font-medium text-foreground hover:text-brand-700"
                >
                  {activity.place.name}
                </Link>
                , {activity.place.city}
                {activity.place.state ? `, ${activity.place.state}` : ""}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <Tag className="h-5 w-5 text-brand-700" />
                  <div>
                    <p className="text-xs text-muted">Price</p>
                    <p className="font-semibold">{formatINR(activity.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <Clock className="h-5 w-5 text-brand-700" />
                  <div>
                    <p className="text-xs text-muted">Duration</p>
                    <p className="font-semibold">{activity.duration ?? "Flexible"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <Users className="h-5 w-5 text-brand-700" />
                  <div>
                    <p className="text-xs text-muted">Minimum age</p>
                    <p className="font-semibold">
                      {activity.minAge ? `${activity.minAge}+ years` : "All ages"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold">About this activity</h2>
                <p className="mt-3 leading-relaxed text-muted">{activity.description}</p>
              </div>

              <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-start gap-2 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Wear comfortable clothing and carry a valid ID. Follow the safety briefing
                  provided by the activity host on the day.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm text-muted">Pay from wallet</p>
                  <p className="text-3xl font-bold text-brand-700">
                    {formatINR(activity.price)}
                  </p>
                </div>
                {activity.duration ? (
                  <span className="flex items-center gap-1 text-sm text-muted">
                    <Clock className="h-4 w-4" /> {activity.duration}
                  </span>
                ) : null}
              </div>
              <div className="my-5 border-t border-border" />
              <BookActivityButton
                activityId={activity.id}
                activityName={activity.name}
                price={activity.price}
                walletBalance={user?.walletBalance ?? 0}
                signedIn={!!user}
              />
              <p className="mt-4 text-center text-xs text-muted">
                Instant confirmation · Free cancellation · Secure payments
              </p>
            </Card>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-16">
            <h2 className="text-xl font-semibold">You may also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </>
  );
}
