"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ROTATE_MS } from "@/components/hero";

interface UseAutoCarouselOptions {
  itemCount: number;
  gap?: number;
}

export function useAutoCarousel({ itemCount, gap = 16 }: UseAutoCarouselOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const programmaticRef = useRef(false);

  const getStep = useCallback(() => {
    const el = ref.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + gap : el.clientWidth;
  }, [gap]);

  const updateActive = useCallback(() => {
    if (programmaticRef.current) return;
    const el = ref.current;
    if (!el) return;
    const step = getStep();
    if (step === 0) return;
    setActiveIndex(Math.min(itemCount - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, [itemCount, getStep]);

  const scrollToCard = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const step = getStep();
      if (step === 0) return;
      programmaticRef.current = true;
      el.scrollTo({ left: index * step, behavior: "smooth" });
      setActiveIndex(index);
      setTimeout(() => {
        programmaticRef.current = false;
      }, 600);
    },
    [getStep],
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, ROTATE_MS);
  }, [itemCount]);

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    scrollToCard(activeIndex);
  }, [activeIndex, scrollToCard]);

  const onMouseEnter = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const pauseThenResume = useCallback(() => {
    pausedRef.current = true;
    setTimeout(() => {
      pausedRef.current = false;
    }, 3000);
  }, []);

  return {
    ref,
    activeIndex,
    updateActive,
    scrollToCard,
    onMouseEnter,
    onMouseLeave,
    pauseThenResume,
  };
}
