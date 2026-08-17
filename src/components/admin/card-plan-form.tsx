"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Spinner } from "@/components/ui/spinner";
import { parsePerks } from "@/lib/utils";

export interface CardPlanFormValues {
  id?: string;
  name: string;
  value: number;
  price: number;
  perks: string;
  active: boolean;
}

export function CardPlanForm({
  action,
  defaults,
  onCancel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: CardPlanFormValues;
  onCancel?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => action(formData))}
      className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2"
    >
      <input type="hidden" name="id" value={defaults?.id ?? ""} />
      <Field label="Card name">
        <Input name="name" required defaultValue={defaults?.name} placeholder="Explorer Card" />
      </Field>
      <Field label="Card value (₹)" hint="Credit added to the wallet">
        <Input
          name="value"
          type="number"
          required
          min={1}
          defaultValue={defaults?.value ?? ""}
          placeholder="2000"
        />
      </Field>
      <Field label="Selling price (₹)" hint="What the customer actually pays">
        <Input
          name="price"
          type="number"
          required
          min={1}
          defaultValue={defaults?.price ?? ""}
          placeholder="1800"
        />
      </Field>
      <Field label="Active" hint="Visible on the booking cards page">
        <Toggle name="active" defaultChecked={defaults?.active ?? true} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Perks" hint="One per line">
          <Textarea
            name="perks"
            required
            rows={4}
            defaultValue={defaults ? parsePerks(defaults.perks).join("\n") : ""}
            placeholder={"₹2,000 of booking credit\nWorks on all activities\nNever expires"}
          />
        </Field>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner size={16} /> : null}
          {defaults?.id ? "Save changes" : "Add card plan"}
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
