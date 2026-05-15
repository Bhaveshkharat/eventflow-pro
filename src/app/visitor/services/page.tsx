"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hotel, Plane, MapPin, Star, Clock, 
  CheckCircle2, Building2, Ticket, ArrowRight, ShieldCheck, Map
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── COMPANION SERVICES MOCK DATA ──
type ServiceCategory = "Hotel" | "Travel";

interface CompanionService {
  id: string;
  category: ServiceCategory;
  name: string;
  provider: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
  // Hotel specific
  distance?: string;
  amenities?: string[];
  // Travel specific
  route?: string;
  departureTime?: string;
}

const CATALOG_DATA: CompanionService[] = [
  {
    id: "h1",
    category: "Hotel",
    name: "The Grand Marquise",
    provider: "Marquise Hospitality",
    price: "$299/night",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60",
    tags: ["5-Star", "Official Partner", "Luxury"],
    distance: "0.2 miles to venue",
    amenities: ["Spa", "Executive Lounge", "Fast Wi-Fi"]
  },
  {
    id: "h2",
    category: "Hotel",
    name: "Aura Boutique Suites",
    provider: "Aura Group",
    price: "$185/night",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60",
    tags: ["Boutique", "Business Rate"],
    distance: "1.5 miles to venue",
    amenities: ["24/7 Gym", "Co-working Space", "Breakfast Included"]
  },
  {
    id: "t1",
    category: "Travel",
    name: "VIP Airport Black Car",
    provider: "LuxeTransit API",
    price: "$85/trip",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&auto=format&fit=crop&q=60",
    tags: ["Premium", "Private"],
    route: "SFO Airport → Venue/Hotel",
    departureTime: "On Demand"
  },
  {
    id: "t2",
    category: "Travel",
    name: "Express Event Shuttle",
    provider: "City Fleet Networks",
    price: "$25/day pass",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60",
    tags: ["Shared", "Eco-Friendly"],
    route: "Downtown Hubs ⇄ Main Expo Center",
    departureTime: "Every 15 minutes"
  },
  {
    id: "h3",
    category: "Hotel",
    name: "Neon City Pods",
    provider: "MicroStays",
    price: "$95/night",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=60",
    tags: ["Budget", "Modern"],
    distance: "0.5 miles to venue",
    amenities: ["Smart Pods", "Cafe", "Lockers"]
  },
  {
    id: "t3",
    category: "Travel",
    name: "Helicopter Transfer",
    provider: "AeroLink VIP",
    price: "$450/trip",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=500&auto=format&fit=crop&q=60",
    tags: ["Ultra-Luxury", "Fastest"],
    route: "Regional Airport ⇄ Rooftop Helipad",
    departureTime: "Scheduled directly"
  }
];

function CompanionServicesContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const eventParam = searchParams.get("event");

  const [activeFilters, setActiveFilters] = useState<ServiceCategory[]>(["Hotel", "Travel"]);

  // Initialize filters from query param
  useEffect(() => {
    if (filterParam === "hotel") setActiveFilters(["Hotel"]);
    else if (filterParam === "travel") setActiveFilters(["Travel"]);
    else setActiveFilters(["Hotel", "Travel"]); // default to both
  }, [filterParam]);

  const toggleFilter = (category: ServiceCategory) => {
    setActiveFilters(prev => {
      if (prev.includes(category)) {
        // If unchecking the last active filter, re-enable both (or keep one, but let's allow empty to mean 'both')
        const newFilters = prev.filter(f => f !== category);
        return newFilters.length === 0 ? ["Hotel", "Travel"] : newFilters;
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredCatalog = useMemo(() => {
    // If empty array, fallback to showing all.
    if (activeFilters.length === 0) return CATALOG_DATA;
    return CATALOG_DATA.filter(item => activeFilters.includes(item.category));
  }, [activeFilters]);

  const handleBooking = (item: CompanionService) => {
    toast.success(`${item.category === 'Hotel' ? 'Reservation' : 'Transit slot'} secured for ${item.name}! Your itinerary has been updated.`);
  };

  return (
    <DashboardShell
      title="Companion Services Catalog"
      subtitle="Browse and instantly book integrated luxury stays, partner hotels, and premium transit networks linked directly to your active badges."
      backLink="/visitor"
    >
      {/* ── CONTEXT BANNER ── */}
      {eventParam && (
        <div className="p-4 rounded-xl glass border border-primary/30 bg-primary/5 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-glow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Showing proximity results for your upcoming event.</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Discounts automatically applied via your authorized pass tier.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER TOGGLES ── */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl bg-background border border-border/60">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">Filter Catalog:</span>
        
        <button
          onClick={() => toggleFilter("Hotel")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
            activeFilters.includes("Hotel") 
              ? "bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-sm" 
              : "bg-accent/50 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center transition-colors", activeFilters.includes("Hotel") ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-background")}>
             {activeFilters.includes("Hotel") && <CheckCircle2 className="h-3 w-3 stroke-[3]" />}
          </div>
          <Hotel className="h-4 w-4 shrink-0" /> Hotels & Stays
        </button>

        <button
          onClick={() => toggleFilter("Travel")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
            activeFilters.includes("Travel") 
              ? "bg-purple-500/10 border-purple-500/50 text-purple-500 shadow-sm" 
              : "bg-accent/50 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <div className={cn("h-4 w-4 rounded-md border flex items-center justify-center transition-colors", activeFilters.includes("Travel") ? "bg-purple-500 border-purple-500 text-white" : "border-border bg-background")}>
             {activeFilters.includes("Travel") && <CheckCircle2 className="h-3 w-3 stroke-[3]" />}
          </div>
          <Plane className="h-4 w-4 shrink-0" /> Travel & Shuttles
        </button>

        <span className="text-[10px] text-muted-foreground font-medium ml-auto hidden sm:block">
          Showing {filteredCatalog.length} results
        </span>
      </div>

      {/* ── CATALOG GRID ── */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCatalog.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard hover={true} className="overflow-hidden flex flex-col h-full border-border/40 hover:border-primary/40 group">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-accent">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    {item.category === "Hotel" ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500 text-white shadow-lg flex items-center gap-1.5">
                        <Hotel className="h-3 w-3" /> Stay
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white shadow-lg flex items-center gap-1.5">
                        <Plane className="h-3 w-3" /> Transit
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-amber-400 flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 fill-amber-400" /> {item.rating.toFixed(1)}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{item.name}</h3>
                    <p className="text-[11px] text-white/70 font-medium mt-0.5 flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Operated by {item.provider}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-accent text-muted-foreground border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6 text-xs text-muted-foreground font-medium flex-1">
                    {item.category === "Hotel" ? (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-border/40">
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Distance</span>
                          <span className="text-foreground font-bold">{item.distance}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest block">Premium Amenities:</span>
                          {item.amenities?.map(amenity => (
                            <div key={amenity} className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> {amenity}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-border/40">
                          <span className="flex items-center gap-1.5"><Map className="h-3.5 w-3.5 text-primary" /> Route Path</span>
                          <span className="text-foreground font-bold text-right max-w-[150px] truncate" title={item.route}>{item.route}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Departures</span>
                          <span className="text-foreground font-bold">{item.departureTime}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Booking Footer */}
                  <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-0.5">Rate</span>
                      <span className="text-lg font-black text-foreground font-mono">{item.price}</span>
                    </div>
                    <GradientButton onClick={() => handleBooking(item)} size="sm" className="h-9 px-4 text-xs group-hover:shadow-md transition-all">
                      {item.category === "Hotel" ? "Book Room" : "Reserve Seat"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCatalog.length === 0 && (
         <div className="text-center py-12 glass rounded-2xl border border-dashed border-border mt-8">
            <Ticket className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-foreground">No companion services found for the active filters.</p>
         </div>
      )}
    </DashboardShell>
  );
}

export default function CompanionServicesCatalog() {
  return (
    <Suspense fallback={<DashboardShell title="Companion Services Catalog" subtitle="Loading services..."><div className="h-96" /></DashboardShell>}>
      <CompanionServicesContent />
    </Suspense>
  );
}
