import { cn } from "@/lib/utils";

interface ToggleProps {
  name: string;
  defaultChecked?: boolean;
  className?: string;
}

export function Toggle({ name, defaultChecked, className }: ToggleProps) {
  return (
    <label className={cn("inline-flex cursor-pointer", className)}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-brand-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600 peer-focus-visible:ring-offset-2" />
    </label>
  );
}
