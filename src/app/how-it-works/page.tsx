import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  PackageOpen,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Buy a booking card, pick any activity at any popular place, book your date with wallet balance and explore. Free cancellation with instant refunds.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      icon: PackageOpen,
      title: "1. Buy a booking card",
      text: "Choose a prepaid card worth ₹1,000, ₹2,000 or ₹5,000 and pay a discounted price — e.g. pay ₹1,800 to get ₹2,000 of credit.",
    },
    {
      icon: CreditCard,
      title: "2. Credit hits your wallet",
      text: "The full card value is added to your wallet instantly after a secure Razorpay payment. Nothing expires.",
    },
    {
      icon: MapPin,
      title: "3. Pick an activity",
      text: "Browse crafting, bungee jumping, water sports, trekking and more across popular places like Rishikesh, Jaipur and Goa.",
    },
    {
      icon: CalendarDays,
      title: "4. Book your date",
      text: "Select any available date on the activity page and confirm. The price is deducted straight from your wallet.",
    },
    {
      icon: Wallet,
      title: "5. Cancel anytime",
      text: "Change of plans? Cancel a confirmed booking and the full amount is refunded to your wallet instantly.",
    },
    {
      icon: ShieldCheck,
      title: "6. Explore securely",
      text: "Every payment is processed by Razorpay with bank-grade encryption and instant confirmation.",
    },
  ];

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="How it works"
        title="From card to adventure"
        description="A simple, transparent way to book experiences across India — and save money while doing it."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
              <step.icon className="h-5 w-5 text-white" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-700 px-8 py-10 text-center">
        <h2 className="text-2xl font-bold text-white">Ready when you are</h2>
        <p className="mt-2 text-brand-50/90">
          Create a free account and get your first booking card at a discount.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/booking-cards">
            <Button variant="secondary">View booking cards</Button>
          </Link>
          <Link href="/activities">
            <Button className="border border-white/30 bg-transparent text-white hover:bg-white/10">
              Browse activities
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
