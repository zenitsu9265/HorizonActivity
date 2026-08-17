"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityForm, type ActivityFormValues } from "@/components/admin/activity-form";
import { formatINR } from "@/lib/utils";

interface ActivityWithPlace {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string | null;
  imageUrl: string;
  featured: boolean;
  placeId: string;
  place: { name: string; city: string };
}

export function ActivitiesManager({
  activities,
  places,
  upsertAction,
  deleteAction,
}: {
  activities: ActivityWithPlace[];
  places: { id: string; name: string; city: string }[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<ActivityFormValues | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activities</h1>
        {!editing ? (
          <Button
            size="sm"
            onClick={() =>
              setEditing({
                name: "",
                placeId: places[0]?.id ?? "",
                category: "",
                price: 0,
                description: "",
                imageUrl: "",
                duration: "",
                minAge: null,
                featured: false,
              })
            }
          >
            <Plus className="h-4 w-4" /> Add activity
          </Button>
        ) : null}
      </div>

      {editing ? (
        <ActivityForm
          action={upsertAction}
          defaults={editing}
          places={places}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {activities.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Activity</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Place</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{activity.name}</td>
                  <td className="px-4 py-3">
                    <Badge tone="brand">{activity.category}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {activity.place.name}, {activity.place.city}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(activity.price)}</td>
                  <td className="px-4 py-3 text-muted">{activity.duration ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditing({
                            id: activity.id,
                            name: activity.name,
                            placeId: activity.placeId,
                            category: activity.category,
                            price: activity.price,
                            description: "",
                            imageUrl: activity.imageUrl,
                            duration: activity.duration ?? "",
                            minAge: null,
                            featured: activity.featured,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <form
                        action={deleteAction.bind(null, activity.id)}
                        onSubmit={(e) => {
                          if (!window.confirm(`Delete ${activity.name}?`)) e.preventDefault();
                        }}
                      >
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">No activities yet. Add your first activity above.</p>
      )}
    </div>
  );
}
