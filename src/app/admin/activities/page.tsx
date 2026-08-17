import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ActivitiesManager } from "@/components/admin/activities-manager";
import { deleteActivity, upsertActivity } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin · Activities" };
export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const [activities, places] = await Promise.all([
    prisma.activity.findMany({
      include: { place: { select: { name: true, city: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.place.findMany({
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ActivitiesManager
      activities={activities}
      places={places}
      upsertAction={upsertActivity}
      deleteAction={deleteActivity}
    />
  );
}
