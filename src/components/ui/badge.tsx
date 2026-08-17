import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "neutral" | "red" | "amber" | "blue";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-100 text-brand-800",
  neutral: "bg-slate-100 text-slate-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
