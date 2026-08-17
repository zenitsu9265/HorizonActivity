import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container, SectionHeading } from "@/components/ui/container";
import { PlaceCard } from "@/components/place-card";

export const metadata: Metadata = {
  title: "Popular Places & Destinations",
  description:
    "Explore adventure and experience activities across India's most popular destinations — Rishikesh, Goa, Jaipur, Manali and more.",
};

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const places = await prisma.place.findMany({
    include: { _count: { select: { activities: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Destinations"
        title="Popular places"
        description="Handpicked destinations with the best activities and experiences."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </Container>
  );
}
