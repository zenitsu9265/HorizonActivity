"use client";

import { CalendarDays, MapPin, PackageOpen, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { useAutoCarousel } from "@/hooks/use-auto-carousel";

const steps = [
  {
    icon: PackageOpen,
    step: "1",
    title: "Buy a booking card",
    text: "Pick a card worth ₹1,000–₹5,000 and pay a discounted price. Credit is added to your wallet instantly.",
  },
  {
    icon: MapPin,
    step: "2",
    title: "Pick an activity",
    text: "Browse crafting, bungee jumping, trekking, water sports and more at popular places across India.",
  },
  {
    icon: CalendarDays,
    step: "3",
    title: "Book your date",
    text: "Choose any available date, pay from your wallet balance and get instant confirmation.",
  },
  {
    icon: Wallet,
    step: "4",
    title: "Go explore",
    text: "Turn up, have fun. Change of plans? Cancel and the amount returns to your wallet instantly.",
  },
];

export function HowItWorksSection() {
  const { ref, activeIndex, updateActive, scrollToCard, onMouseEnter, onMouseLeave, pauseThenResume } =
    useAutoCarousel({ itemCount: steps.length });

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-700">
            How it works
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            From card to adventure in four steps
          </h2>
        </div>

        <div className="mt-10" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div
            ref={ref}
            onScroll={updateActive}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none"
          >
            {steps.map((item, i) => (
              <div
                key={item.step}
                data-card
                className={cn(
                  "flex w-full shrink-0 snap-start flex-col rounded-xl border border-border bg-card p-5 transition-all duration-500 lg:w-auto",
                  i === activeIndex && "max-lg:border-brand-600 max-lg:shadow-md",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                    <item.icon className="h-5 w-5 text-white" />
                  </span>
                  <span className="text-3xl font-bold text-brand-100">{item.step}</span>
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
            {steps.map((item, i) => (
              <button
                key={item.step}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => {
                  pauseThenResume();
                  scrollToCard(i);
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
