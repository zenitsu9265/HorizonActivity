"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Spinner } from "@/components/ui/spinner";

export interface PlaceFormValues {
  id?: string;
  name: string;
  city: string;
  state: string;
  country: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export function PlaceForm({
  action,
  defaults,
  onCancel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: PlaceFormValues;
  onCancel?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
    >
      <input type="hidden" name="id" value={defaults?.id ?? ""} />
      <Field label="Place name">
        <Input name="name" required defaultValue={defaults?.name} placeholder="Rishikesh" />
      </Field>
      <Field label="City">
        <Input name="city" required defaultValue={defaults?.city} placeholder="Rishikesh" />
      </Field>
      <Field label="State">
        <Input name="state" defaultValue={defaults?.state} placeholder="Uttarakhand" />
      </Field>
      <Field label="Country">
        <Input name="country" defaultValue={defaults?.country ?? "India"} />
      </Field>
      <Field label="Image URL" hint="Use a placeholder like https://picsum.photos/seed/name/800/600">
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
            placeholder="Describe the place and why it's great for activities..."
          />
        </Field>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner size={16} /> : null}
          {defaults?.id ? "Save changes" : "Add place"}
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
