import type { Metadata } from "next";
import { Mountain, Target, HeartHandshake, Globe2 } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "HorizonActivity is India's activity experience marketplace. We connect explorers with crafting, adventure and cultural experiences at popular places — with the power of prepaid booking cards.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Globe2,
      title: "Experiences for everyone",
      text: "From pottery workshops to bungee jumping, we curate safe, vetted activities at the destinations you love.",
    },
    {
      icon: HeartHandshake,
      title: "Pay less, do more",
      text: "Booking cards give every explorer up to 25% off, so more people can afford great experiences more often.",
    },
    {
      icon: Target,
      title: "Transparent and fair",
      text: "No hidden fees, instant confirmations and full refunds to your wallet when you cancel.",
    },
    {
      icon: Mountain,
      title: "Local-first",
      text: "We work with local activity hosts and communities across India, bringing income to small experiences businesses.",
    },
  ];

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="About us"
        title="Making India's experiences easy to book"
        description="HorizonActivity started with a simple idea: booking an adventure or a creative workshop should be as easy as buying a coffee — and a lot more affordable."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold">Our story</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Travellers kept telling us the same thing — they wanted to try new things like
            bungee jumping, rafting, crafting and paragliding, but every activity was priced
            separately and bookings were a hassle. So we built HorizonActivity: a single
            marketplace where one prepaid booking card works across every activity and every
            destination we list.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Today thousands of explorers use booking cards to save up to 25% while discovering
            hidden gems in India&apos;s most popular places.
          </p>
        </div>
        <div className="grid gap-4">
          {values.map((value) => (
            <div key={value.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                <value.icon className="h-5 w-5 text-brand-700" />
              </span>
              <div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-1 text-sm text-muted">{value.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
