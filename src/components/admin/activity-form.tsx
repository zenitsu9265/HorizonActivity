"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Spinner } from "@/components/ui/spinner";

export interface ActivityFormValues {
  id?: string;
  name: string;
  placeId: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  duration: string;
  minAge: number | null;
  featured: boolean;
}

export function ActivityForm({
  action,
  defaults,
  places,
  onCancel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: ActivityFormValues;
  places: { id: string; name: string; city: string }[];
  onCancel?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
    >
      <input type="hidden" name="id" value={defaults?.id ?? ""} />
      <Field label="Activity name">
        <Input name="name" required defaultValue={defaults?.name} placeholder="Bungee Jumping" />
      </Field>
      <Field label="Place">
        <Select name="placeId" required defaultValue={defaults?.placeId}>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}, {place.city}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Category">
        <Input name="category" required defaultValue={defaults?.category} placeholder="Adventure" />
      </Field>
      <Field label="Price (₹)">
        <Input
          name="price"
          type="number"
          required
          min={1}
          defaultValue={defaults?.price ?? ""}
          placeholder="1200"
        />
      </Field>
      <Field label="Duration">
        <Input name="duration" defaultValue={defaults?.duration} placeholder="2 hours" />
      </Field>
      <Field label="Minimum age" hint="Leave blank if all ages allowed">
        <Input
          name="minAge"
          type="number"
          min={0}
          defaultValue={defaults?.minAge ?? ""}
          placeholder="12"
        />
      </Field>
      <Field label="Image URL" hint="e.g. https://picsum.photos/seed/name/800/600">
        <Input
          name="imageUrl"
          required
          defaultValue={defaults?.imageUrl}
          placeholder="https://picsum.photos/seed/..."
        />
      </Field>
      <Field label="Featured" hint="Show on the homepage">
        <Toggle name="featured" defaultChecked={defaults?.featured} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description">
          <Textarea
            name="description"
            required
            rows={3}
            defaultValue={defaults?.description}
            placeholder="Describe the activity, safety, what to expect..."
          />
        </Field>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner size={16} /> : null}
          {defaults?.id ? "Save changes" : "Add activity"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
