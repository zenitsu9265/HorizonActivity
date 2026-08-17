import { Check, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BuyCardButton } from "@/components/buy-card-button";
import { cn, formatINR, parsePerks } from "@/lib/utils";

interface CardPlanCardProps {
  plan: {
    id: string;
    name: string;
    value: number;
    price: number;
    perks: string;
    active: boolean;
  };
  signedIn: boolean;
  highlighted?: boolean;
  userEmail?: string;
  userPhone?: string;
}

export function CardPlanCard({
  plan,
  signedIn,
  highlighted = false,
  userEmail,
  userPhone,
}: CardPlanCardProps) {
  const perks = parsePerks(plan.perks);
  const discount = Math.round(((plan.value - plan.price) / plan.value) * 100);

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col p-6 u-card",
        highlighted && "border-brand-600 ring-2 ring-brand-600/20",
      )}
    >
      {highlighted ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge tone="brand">Most popular</Badge>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-brand-700" />
        <h3 className="text-lg font-semibold">{plan.name}</h3>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-foreground">{formatINR(plan.value)}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted line-through">{formatINR(plan.price + plan.value / 10)}</span>
          <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800">
            {discount}% off
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-brand-700">
          Pay only {formatINR(plan.price)}
        </p>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-sm text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            {perk}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <BuyCardButton
          cardPlanId={plan.id}
          name={plan.name}
          price={plan.price}
          value={plan.value}
          signedIn={signedIn}
          userEmail={userEmail}
          userPhone={userPhone}
        />
      </div>
    </Card>
  );
}
