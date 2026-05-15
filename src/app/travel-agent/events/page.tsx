"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Plane, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { getPersistedPartners } from "@/lib/partnersStore";
import Link from "next/link";

export default function TravelAssignedEvents() {
  const [assignedEvents, setAssignedEvents] = useState<any[]>([]);

  useEffect(() => {
    const allPartners = getPersistedPartners();
    const currentPartner = allPartners.find(p => p.type === "Travel" || p.services.includes("Travel"));
    
    if (currentPartner) {
      const ids = currentPartner.assignedEventIds || [currentPartner.eventId];
      const filtered = events.filter(ev => ids.includes(ev.id));
      setAssignedEvents(filtered);
    }
  }, []);

  return (
    <DashboardShell 
      title="Transit & Travel Contracts" 
      subtitle="Coordinate shuttle networks and flight bundles for your assigned event roster."
    >
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignedEvents.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-0 overflow-hidden group h-full flex flex-col">
              <div className="h-40 relative">
                <img src={ev.image} alt={ev.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{ev.title}</h3>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {ev.city}
                  </p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {ev.date}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase font-mono border border-purple-500/20">
                    Travel Partner
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Shuttle Routes</span>
                    <span className="font-bold text-foreground">Verified Hubs</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Plane className="h-3.5 w-3.5" /> Flight Blocks</span>
                    <span className="font-bold text-foreground">LuxeTransit API</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Logistics Tier</span>
                    <span className="font-bold text-foreground">Tier 1 Carrier</span>
                  </div>
                </div>

                <Link href="/travel-agent" className="mt-auto">
                  <GradientButton size="sm" className="w-full h-9 text-xs">
                    Manage Logistics <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </GradientButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {assignedEvents.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-2xl border border-dashed border-border">
            <Plane className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-foreground">No transit contracts found.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
