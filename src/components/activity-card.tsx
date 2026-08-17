import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Clock, IndianRupee, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

interface ActivityCardProps {
  activity: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    price: number;
    imageUrl: string;
    duration: string | null;
    featured: boolean;
    place: { name: string; slug: string; city: string };
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="group u-card block overflow-hidden rounded-xl border border-border bg-card"
    >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={activity.imageUrl}
            alt={activity.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {activity.featured ? (
            <div className="absolute right-3 top-3">
              <Badge tone="amber">Featured</Badge>
            </div>
          ) : null}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
              <BadgeCheck className="h-3 w-3 text-brand-700" />
              Free cancellation
            </span>
          </div>
        </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-brand-700">{activity.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {activity.place.name}, {activity.place.city}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{activity.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            {activity.duration ? (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {activity.duration}
              </span>
            ) : null}
          </div>
          <p className="flex items-center font-semibold text-brand-700">
            <IndianRupee className="h-4 w-4" />
            {formatINR(activity.price).replace("₹", "")}
          </p>
        </div>
      </div>
    </Link>
  );
}
