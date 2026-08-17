import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface PlaceCardProps {
  place: {
    slug: string;
    name: string;
    city: string;
    state: string | null;
    description: string;
    imageUrl: string;
    featured: boolean;
    _count?: { activities: number };
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group u-card block overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-brand-700">{place.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {place.city}
          {place.state ? `, ${place.state}` : ""}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{place.description}</p>
        {typeof place._count?.activities === "number" ? (
          <p className="mt-3 text-xs font-medium text-brand-700">
            {place._count.activities} activities
          </p>
        ) : null}
      </div>
    </Link>
  );
}
