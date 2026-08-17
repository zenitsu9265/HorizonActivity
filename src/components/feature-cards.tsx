"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { ROTATE_MS } from "@/components/hero";

const items = [
  {
    icon: ShieldCheck,
    title: "Secure payments",
    text: "Razorpay-powered checkout with bank-grade encryption.",
  },
  {
    icon: CreditCard,
    title: "Save up to 25%",
    text: "Every booking card gives you more credit than you pay.",
  },
  {
    icon: CalendarDays,
    title: "Flexible dates",
    text: "Book any date you like — change plans whenever.",
  },
  {
    icon: Wallet,
    title: "Instant refunds",
    text: "Free cancellation with credit back to your wallet instantly.",
  },
];

export function WhyBookSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const programmaticRef = useRef(false);

  const updateActive = useCallback(() => {
    if (programmaticRef.current) return;
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth;
    setActiveIndex(Math.min(items.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth;
    programmaticRef.current = true;
    el.scrollTo({ left: index * step, behavior: "smooth" });
    setActiveIndex(index);
    setTimeout(() => { programmaticRef.current = false; }, 600);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_MS);
  }, []);

  useEffect(() => {
    updateActive();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(updateActive);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateActive]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  useEffect(() => {
    scrollToCard(activeIndex);
  }, [activeIndex, scrollToCard]);

  return (
    <section className="border-b border-border bg-card py-12 sm:py-16">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Why book with HorizonActivity?
        </h2>

        <div
          className="mt-8"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div
            ref={ref}
            onScroll={updateActive}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:pb-0 lg:snap-none"
          >
            {items.map((item, i) => (
              <div
                key={item.title}
                data-card
                className={cn(
                  "flex w-full shrink-0 snap-start flex-col items-center text-center rounded-xl border border-transparent p-2 transition-all duration-500 lg:w-auto",
                  i === activeIndex && "max-lg:border-brand-600/30 max-lg:bg-brand-50/60",
                )}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <item.icon className="h-7 w-7 text-brand-700" />
                </span>
                <h3 className="mt-3 font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
            {items.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to feature ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => {
                  pausedRef.current = true;
                  scrollToCard(i);
                  setTimeout(() => { pausedRef.current = false; }, 3000);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === activeIndex ? "w-5 bg-brand-600" : "w-2 bg-slate-300 hover:bg-slate-400",
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
