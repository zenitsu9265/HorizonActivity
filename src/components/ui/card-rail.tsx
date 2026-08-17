"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardRail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollByCards = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className={cn(
          "flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children}
      </div>
      {canScroll ? (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:border-brand-500 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:border-brand-500 hover:text-brand-700 disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function RailItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-72 shrink-0 snap-start sm:w-80", className)}>{children}</div>
  );
}
