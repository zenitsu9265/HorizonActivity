import Link from "next/link";
import { Mail, MapPin, Mountain, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";

const exploreLinks = [
  { href: "/activities", label: "All activities" },
  { href: "/places", label: "Popular places" },
  { href: "/booking-cards", label: "Booking cards" },
  { href: "/how-it-works", label: "How it works" },
];

const accountLinks = [
  { href: "/account", label: "My account" },
  { href: "/account/bookings", label: "My bookings" },
  { href: "/account/cards", label: "My cards" },
  { href: "/login", label: "Sign in" },
];

const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-12">
        <div className="grid gap-8 border-b border-border pb-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Popular places</h3>
            <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
              {[
                "Rishikesh",
                "Goa",
                "Jaipur",
                "Manali",
                "Mumbai",
                "Delhi",
                "Udaipur",
                "Pondicherry",
                "Coorg",
                "Ooty",
                "Shimla",
                "Alleppey",
              ].map((place) => (
                <Link
                  key={place}
                  href="/places"
                  className="text-sm text-muted transition-colors hover:text-brand-700"
                >
                  {place}
                </Link>
              ))}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Popular activities</h3>
            <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
              {[
                "Bungee jumping",
                "River rafting",
                "Pottery workshops",
                "Water sports",
                "Trekking",
                "Paragliding",
                "Scuba diving",
                "Camping",
                "Craft workshops",
                "Cooking classes",
              ].map((activity) => (
                <Link
                  key={activity}
                  href="/activities"
                  className="text-sm text-muted transition-colors hover:text-brand-700"
                >
                  {activity}
                </Link>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <Mountain className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Horizon<span className="text-brand-700">Activity</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Book crafting, bungee jumping, water sports and more at India&apos;s most popular
              destinations — pay once with a Horizon booking card and explore without limits.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAdmin ? (
                <li>
                  <Link href="/admin" className="text-sm text-muted hover:text-brand-700">
                    Admin
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} HorizonActivity. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" /> 1800-000-0000
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> hello@horizonactivity.in
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Mumbai, India
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
