import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { ActivityCard } from "@/components/activity-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await prisma.place.findUnique({ where: { slug } });
  if (!place) return {};
  return {
    title: `${place.name} - Activities & Experiences`,
    description: place.description,
    openGraph: { title: place.name, description: place.description, images: [place.imageUrl] },
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await prisma.place.findUnique({
    where: { slug },
    include: {
      activities: {
        include: { place: { select: { name: true, slug: true, city: true } } },
        orderBy: { price: "asc" },
      },
    },
  });

  if (!place) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: place.name,
    description: place.description,
    image: place.imageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.city,
      addressRegion: place.state ?? undefined,
      addressCountry: "IN",
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
          href="/places"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to places
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{place.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted">
              <MapPin className="h-4 w-4 text-brand-700" />
              {place.city}
              {place.state ? `, ${place.state}` : ""}
              {place.country ? `, ${place.country}` : ""}
            </p>
            <p className="mt-4 leading-relaxed text-muted">{place.description}</p>
            <p className="mt-4 text-sm font-semibold text-brand-700">
              {place.activities.length} activities available here
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">Activities in {place.name}</h2>
          {place.activities.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {place.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-muted">Activities coming soon to {place.name}.</p>
          )}
        </div>
      </Container>
    </>
  );
}
