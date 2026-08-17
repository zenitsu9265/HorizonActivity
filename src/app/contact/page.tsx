import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container, SectionHeading } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the HorizonActivity team. We're here to help with bookings, booking cards and everything in between.",
};

export default function ContactPage() {
  const channels = [
    {
      icon: Mail,
      title: "Email us",
      value: "hello@horizonactivity.in",
      href: "mailto:hello@horizonactivity.in",
    },
    {
      icon: Phone,
      title: "Call us",
      value: "1800-000-0000",
      href: "tel:18000000000",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 90000 00000",
      href: "https://wa.me/919000000000",
    },
    {
      icon: MapPin,
      title: "Visit us",
      value: "Bandra West, Mumbai, Maharashtra 400050",
      href: undefined,
    },
  ];

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about a booking, a card, or a partnership with an activity host? Reach out any time."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="p-8">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <form className="mt-5 space-y-4" action="mailto:hello@horizonactivity.in">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                placeholder="Your name"
                required
              />
              <input
                type="email"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                placeholder="Your email"
                required
              />
            </div>
            <textarea
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              placeholder="How can we help?"
              required
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Mail className="h-4 w-4" /> Send message
            </button>
          </form>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <div key={channel.title} className="rounded-xl border border-border bg-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <channel.icon className="h-5 w-5 text-brand-700" />
              </span>
              <h3 className="mt-3 font-semibold">{channel.title}</h3>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-1 inline-block text-sm text-brand-700 hover:underline"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted">{channel.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
