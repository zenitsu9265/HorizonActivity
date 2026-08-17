"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Mountain } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const backgrounds = [
  { seed: "hero-adventure-1", label: "Bungee jumping in Rishikesh" },
  { seed: "hero-adventure-2", label: "River rafting in Manali" },
  { seed: "hero-adventure-3", label: "Pottery workshop in Jaipur" },
  { seed: "hero-adventure-4", label: "Trekking in Himachal" },
  { seed: "hero-adventure-5", label: "Water sports in Goa" },
];

export const ROTATE_MS = 5500;

export function Hero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % backgrounds.length),
      ROTATE_MS,
    );
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goto = (next: number) => {
    setIndex(next);
    resetTimer();
  };

  return (
    <section className="relative overflow-hidden bg-brand-900">
      {backgrounds.map((bg, i) => (
        <Image
          key={bg.seed}
          src={`https://picsum.photos/seed/${bg.seed}/1600/900`}
          alt={bg.label}
          fill
          sizes="100vw"
          priority={i === 0}
          aria-hidden={i !== index}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/45" />

      {/* dots — mid-bottom */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
        {backgrounds.map((bg, i) => (
          <button
            key={bg.seed}
            type="button"
            aria-label={`Go to slide ${i + 1}: ${bg.label}`}
            onClick={() => goto(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60",
            )}
          />
        ))}
      </div>

      <Container className="relative z-10 flex min-h-[560px] flex-col justify-center pb-14 pt-24 sm:min-h-[640px] lg:min-h-[680px]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            <Mountain className="h-4 w-4" />
            India&apos;s activity experience marketplace
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Experience more. Plan better.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">
            Book crafting workshops, bungee jumping, water sports and more with {`50+`} travel
            experiences across India&apos;s most popular places.
          </p>

          <form
            action="/activities"
            method="GET"
            className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full bg-white p-2 shadow-2xl"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
              <input
                type="search"
                name="q"
                placeholder="Search for a place or activity"
                className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
