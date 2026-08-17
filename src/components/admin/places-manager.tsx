"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceForm, type PlaceFormValues } from "@/components/admin/place-form";
import { formatDate } from "@/lib/utils";

interface PlaceWithMeta {
  id: string;
  name: string;
  city: string;
  state: string | null;
  imageUrl: string;
  featured: boolean;
  createdAt: Date;
  _count: { activities: number };
}

export function PlacesManager({
  places,
  upsertAction,
  deleteAction,
}: {
  places: PlaceWithMeta[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<PlaceFormValues | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Places</h1>
        {!editing ? (
          <Button size="sm" onClick={() => setEditing({ name: "", city: "", state: "", country: "India", description: "", imageUrl: "", featured: false })}>
            <Plus className="h-4 w-4" /> Add place
          </Button>
        ) : null}
      </div>

      {editing ? (
        <PlaceForm
          action={upsertAction}
          defaults={editing}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {places.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Place</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Activities</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Added</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {place.imageUrl ? (
                        <Image src={place.imageUrl} alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                          <ImageIcon className="h-4 w-4 text-brand-700" />
                        </span>
                      )}
                      <span className="font-medium">{place.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {place.city}
                    {place.state ? `, ${place.state}` : ""}
                  </td>
                  <td className="px-4 py-3">{place._count.activities}</td>
                  <td className="px-4 py-3">
                    {place.featured ? <Badge tone="brand">Featured</Badge> : <Badge>Standard</Badge>}
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(place.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditing({
                            id: place.id,
                            name: place.name,
                            city: place.city,
                            state: place.state ?? "",
                            country: "India",
                            description: "",
                            imageUrl: place.imageUrl,
                            featured: place.featured,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <form
                        action={deleteAction.bind(null, place.id)}
                        onSubmit={(e) => {
                          if (!window.confirm(`Delete ${place.name}?`)) e.preventDefault();
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
        <p className="text-sm text-muted">No places yet. Add your first place above.</p>
      )}
    </div>
  );
}
