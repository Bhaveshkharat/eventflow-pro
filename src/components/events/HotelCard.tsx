import { Star } from "lucide-react";
import type { Hotel } from "@/data/mock";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="group overflow-hidden rounded-2xl glass shadow-elegant hover-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={hotel.image} alt={hotel.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[11px] font-medium glass-strong flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{hotel.rating}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h4 className="font-semibold tracking-tight">{hotel.name}</h4>
        <p className="text-xs text-muted-foreground">{hotel.distance}</p>
        <div className="flex flex-wrap gap-1.5">
          {hotel.perks.map(p => <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p}</span>)}
        </div>
        <div className="pt-2 flex items-end justify-between">
          <p className="text-lg font-semibold">${hotel.price}<span className="text-xs font-normal text-muted-foreground"> /night</span></p>
          <button className="text-xs font-medium gradient-text">Book →</button>
        </div>
      </div>
    </div>
  );
}
