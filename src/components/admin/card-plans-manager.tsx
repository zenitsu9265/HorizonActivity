"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardPlanForm, type CardPlanFormValues } from "@/components/admin/card-plan-form";
import { formatINR, parsePerks } from "@/lib/utils";

interface CardPlanWithMeta {
  id: string;
  name: string;
  value: number;
  price: number;
  perks: string;
  active: boolean;
  _count?: { orders: number };
}

export function CardPlansManager({
  plans,
  upsertAction,
  deleteAction,
}: {
  plans: CardPlanWithMeta[];
  upsertAction: (formData: FormData) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<CardPlanFormValues | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking card plans</h1>
        {!editing ? (
          <Button size="sm" onClick={() => setEditing({ name: "", value: 0, price: 0, perks: "", active: true })}>
            <Plus className="h-4 w-4" /> Add card plan
          </Button>
        ) : null}
      </div>

      {editing ? (
        <CardPlanForm action={upsertAction} defaults={editing} onCancel={() => setEditing(null)} />
      ) : null}

      {plans.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Perks</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plans.map((plan) => {
                const discount = Math.round(((plan.value - plan.price) / plan.value) * 100);
                return (
                  <tr key={plan.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{plan.name}</td>
                    <td className="px-4 py-3">{formatINR(plan.value)}</td>
                    <td className="px-4 py-3">{formatINR(plan.price)}</td>
                    <td className="px-4 py-3">
                      <Badge tone="brand">{discount}% off</Badge>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-muted">
                        {parsePerks(plan.perks).join(" · ")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {plan.active ? <Badge tone="brand">Active</Badge> : <Badge tone="neutral">Inactive</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditing({
                              id: plan.id,
                              name: plan.name,
                              value: plan.value,
                              price: plan.price,
                              perks: plan.perks,
                              active: plan.active,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <form
                          action={deleteAction.bind(null, plan.id)}
                          onSubmit={(e) => {
                            if (!window.confirm(`Delete ${plan.name}?`)) e.preventDefault();
                          }}
                        >
                          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted">No card plans yet. Add your first plan above.</p>
      )}
    </div>
  );
}
