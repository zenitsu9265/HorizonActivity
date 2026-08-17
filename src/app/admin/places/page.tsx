import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PlacesManager } from "@/components/admin/places-manager";
import { deletePlace, upsertPlace } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin · Places" };
export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: { _count: { select: { activities: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <PlacesManager
      places={places}
      upsertAction={upsertPlace}
      deleteAction={deletePlace}
    />
  );
}
