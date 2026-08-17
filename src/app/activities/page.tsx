import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container, SectionHeading } from "@/components/ui/container";
import { ActivityCard } from "@/components/activity-card";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Browse Activities",
  description:
    "Discover 50+ activities including crafting, bungee jumping, water sports, trekking and more at India's most popular destinations.",
};

export const dynamic = "force-dynamic";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; place?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const place = params.place?.trim() ?? "";

  const where = {
    AND: [
      q ? { name: { contains: q } } : {},
      category ? { category } : {},
      place ? { placeId: place } : {},
    ],
  };

  const [activities, categories, places] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { place: { select: { name: true, slug: true, city: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.activity.groupBy({ by: ["category"], _count: { category: true } }),
    prisma.place.findMany({ orderBy: { name: "asc" } }),
  ]);

  const allCategories = categories.map((c) => c.category).sort();

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Explore"
        title="Activities across India"
        description="Filter by category or destination to find your next adventure."
      />

      <form
        method="GET"
        className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_200px_220px_auto]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search activities..."
            className="pl-9"
          />
        </div>
        <Select name="category" defaultValue={category}>
          <option value="">All categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select name="place" defaultValue={place}>
          <option value="">All places</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}, {p.city}
            </option>
          ))}
        </Select>
        <Button type="submit" className="h-10">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </form>

      {(q || category || place) && (
        <p className="mt-4 text-sm text-muted">
          Showing results for{" "}
          {[q && `"${q}"`, category && `category ${category}`, place && `in ${places.find((p) => p.id === place)?.name}`]
            .filter(Boolean)
            .join(", ")}{" "}
          <Link href="/activities" className="font-medium text-brand-700 hover:underline">
            Clear filters
          </Link>
        </p>
      )}

      {activities.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-semibold">No activities found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search term or clear the filters.
          </p>
        </div>
      )}
    </Container>
  );
}
