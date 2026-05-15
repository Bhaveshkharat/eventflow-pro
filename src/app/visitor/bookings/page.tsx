"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, MapPin, Calendar, Clock, 
  ChevronRight, Hotel, Plane, ShieldCheck, 
  ExternalLink, Search, Filter, ArrowLeft,
  Armchair, Building2, Navigation, Info, X,
  ArrowRight, Sparkles, Bell
} from "lucide-react";
import { useRouter } from "next/navigation";
import { events } from "@/data/mock";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { getPersistedBookings, Booking } from "@/lib/servicesStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<"All" | "Events" | "Hotel" | "Travel">("All");
  const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<{ eventId: string; type: "hotel" | "travel" } | null>(null);

  useEffect(() => {
    const data = getPersistedBookings();
    setBookings(data);

    // Load dismissed recommendations
    const rawDismissed = localStorage.getItem("eventflow_pro_dismissed_recommendations");
    if (rawDismissed) setDismissedRecs(JSON.parse(rawDismissed));

    // Recommendation Engine: Check for events without hotel/travel
    const eventBookings = data.filter(b => !b.category); // Tickets don't have category
    const hotelBookings = data.filter(b => b.category === "Hotel");
    const travelBookings = data.filter(b => b.category === "Travel");

    for (const event of eventBookings) {
      const eventId = event.eventId;
      if (!eventId) continue;

      const hasHotel = hotelBookings.some(h => h.eventId === eventId);
      const hasTravel = travelBookings.some(t => t.eventId === eventId);
      
      if (!hasHotel && !dismissedRecs.includes(`${eventId}_hotel`)) {
        setTimeout(() => setActiveRecommendation({ eventId, type: "hotel" }), 1500);
        break;
      } else if (!hasTravel && !dismissedRecs.includes(`${eventId}_travel`)) {
        setTimeout(() => setActiveRecommendation({ eventId, type: "travel" }), 1500);
        break;
      }
    }
  }, []);

  const handleDismiss = (dontShowAgain: boolean) => {
    if (!activeRecommendation) return;
    
    if (dontShowAgain) {
      const newDismissed = [...dismissedRecs, `${activeRecommendation.eventId}_${activeRecommendation.type}`];
      setDismissedRecs(newDismissed);
      localStorage.setItem("eventflow_pro_dismissed_recommendations", JSON.stringify(newDismissed));
    }
    setActiveRecommendation(null);
  };

  const handleDismissIntegrated = (eventId: string, type: "hotel" | "travel") => {
    const key = `${eventId}_${type}`;
    const newDismissed = [...dismissedRecs, key];
    setDismissedRecs(newDismissed);
    localStorage.setItem("eventflow_pro_dismissed_recommendations", JSON.stringify(newDismissed));
    toast.success("Recommendation hidden for this event.");
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "All") return true;
    if (filter === "Events") return !b.category;
    return b.category === filter;
  });

  return (
    <DashboardShell 
      title="My Bookings" 
      subtitle="Track all your confirmed event transit and accommodation details in one place."
      backLink="/visitor"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Stats & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-background/40 backdrop-blur-xl p-8 rounded-[3rem] border border-primary/20 shadow-glow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="h-24 w-24 text-primary" />
           </div>
           <div className="flex items-center gap-10 relative z-10">
              <div className="text-left">
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-1">Your Journey</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground tracking-tighter">{bookings.length}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Active Assets</span>
                 </div>
              </div>
              <div className="h-12 w-[1px] bg-border/60" />
              <div className="text-left">
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Status</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-500 tracking-tighter">{bookings.filter(b => b.status === "Confirmed").length}</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Verified</span>
                 </div>
              </div>
           </div>

            <div className="flex items-center gap-2 p-1.5 bg-accent/30 rounded-2xl border border-border/40 relative z-10">
               {["All", "Events", "Hotel", "Travel"].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f as any)}
                  className={cn(
                    "px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === f ? "bg-primary text-white shadow-glow-sm scale-105" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Trips / Itineraries Section */}
        <div className="space-y-12 pb-32">
           {events.filter(e => bookings.some(b => b.eventId === e.id)).map(event => {
              const eventBookings = bookings.filter(b => b.eventId === event.id);
              const ticket = eventBookings.find(b => !b.category);
              const hotel = eventBookings.find(b => b.category === "Hotel");
              const travel = eventBookings.find(b => b.category === "Travel");

              // Skip if filter is set and this event has no matching items
              if (filter !== "All") {
                 if (filter === "Events" && !ticket) return null;
                 if (filter === "Hotel" && !hotel) return null;
                 if (filter === "Travel" && !travel) return null;
              }

              return (
                 <div key={event.id} className="relative">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="h-1 w-12 bg-primary rounded-full" />
                       <h2 className="text-xl font-black tracking-tight text-foreground uppercase">{event.title} <span className="text-muted-foreground font-medium text-sm ml-2">Expedition Log</span></h2>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                       {/* MAIN EVENT TICKET */}
                       <div className="xl:col-span-1">
                          {ticket ? (
                             <GlassCard className="p-0 overflow-hidden border-primary/20 h-full relative group" hover={false}>
                                <div className="absolute top-4 right-4 z-10">
                                   <div className="px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-glow-sm">Active Pass</div>
                                </div>
                                <div className="h-48 relative overflow-hidden">
                                   <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                </div>
                                <div className="p-6 -mt-12 relative z-10">
                                   <h3 className="text-2xl font-black tracking-tighter mb-1">{event.title}</h3>
                                   <p className="text-xs font-bold text-muted-foreground mb-4 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {event.venue}</p>
                                   
                                   <div className="space-y-3 py-4 border-t border-border/40">
                                      <div className="flex justify-between items-center">
                                         <span className="text-[10px] font-black uppercase text-muted-foreground">Tier</span>
                                         <span className="text-xs font-black text-primary uppercase">{ticket.passTier}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                         <span className="text-[10px] font-black uppercase text-muted-foreground">Gateway Code</span>
                                         <span className="text-xs font-mono font-bold">{ticket.id}</span>
                                      </div>
                                   </div>
                                   
                                   <button className="w-full h-11 mt-4 rounded-xl border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                      Download Smart Pass
                                   </button>
                                </div>
                             </GlassCard>
                          ) : (
                             <div className="h-full border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center bg-accent/5">
                                <Ticket className="h-10 w-10 text-muted-foreground/30 mb-4" />
                                <p className="text-sm font-black text-muted-foreground uppercase">Ticket Record Missing</p>
                             </div>
                          )}
                       </div>

                       {/* COMPANION SERVICES (HOTEL & TRAVEL) */}
                       <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* HOTEL */}
                          {hotel ? (
                             <GlassCard className="p-6 border-blue-500/20 bg-blue-500/[0.02] flex flex-col justify-between" hover={false}>
                                <div>
                                   <div className="flex items-center justify-between mb-6">
                                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Hotel className="h-5 w-5" /></div>
                                      <span className="text-[9px] font-black px-2 py-1 rounded bg-blue-500 text-white uppercase tracking-widest shadow-glow-sm">Stay Secured</span>
                                   </div>
                                   <h4 className="text-lg font-black tracking-tight mb-1">{hotel.serviceName}</h4>
                                   <p className="text-xs font-medium text-muted-foreground mb-4">{hotel.details}</p>
                                   <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-xs font-bold text-foreground"><Calendar className="h-3.5 w-3.5 text-blue-500" /> Check-in: {hotel.bookingDate}</div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Confirmed Reservation</div>
                                   </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-blue-500/10 flex items-center justify-between">
                                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Payout: ₹{hotel.price}</p>
                                   <button className="text-[10px] font-black text-blue-500 uppercase hover:underline">View Voucher</button>
                                </div>
                             </GlassCard>
                          ) : (
                             !dismissedRecs.includes(`${event.id}_hotel`) && (
                                <motion.div 
                                   whileHover={{ scale: 1.02 }}
                                   className="p-8 rounded-[2.5rem] border-2 border-dashed border-blue-500/30 bg-blue-500/[0.03] flex flex-col items-center justify-center text-center group relative overflow-hidden"
                                >
                                   <div className="absolute top-0 right-0 p-4">
                                      <button onClick={() => handleDismissIntegrated(event.id!, "hotel")} className="text-muted-foreground hover:text-rose-500 transition-colors">
                                         <X className="h-4 w-4" />
                                      </button>
                                   </div>
                                   <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                      <Hotel className="h-8 w-8" />
                                   </div>
                                   <h4 className="text-sm font-black uppercase tracking-widest mb-2">No Stay Secured?</h4>
                                   <p className="text-[11px] text-muted-foreground mb-6 max-w-[200px]">Unlock special delegate rates at 5-star hotels near {event.venue}.</p>
                                   <button 
                                      onClick={() => router.push(`/hotels-travel-catalog?filter=hotel&event=${event.id}`)}
                                      className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-glow-sm hover:shadow-blue-500/40 transition-all"
                                   >
                                      Explore Hotels
                                   </button>
                                </motion.div>
                             )
                          )}

                          {/* TRAVEL */}
                          {travel ? (
                             <GlassCard className="p-6 border-purple-500/20 bg-purple-500/[0.02] flex flex-col justify-between" hover={false}>
                                <div>
                                   <div className="flex items-center justify-between mb-6">
                                      <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Plane className="h-5 w-5" /></div>
                                      <span className="text-[9px] font-black px-2 py-1 rounded bg-purple-500 text-white uppercase tracking-widest shadow-glow-sm">Transit Ready</span>
                                   </div>
                                   <h4 className="text-lg font-black tracking-tight mb-1">{travel.serviceName}</h4>
                                   <p className="text-xs font-medium text-muted-foreground mb-4">{travel.route}</p>
                                   <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-xs font-bold text-foreground"><Clock className="h-3.5 w-3.5 text-purple-500" /> Departure: {travel.bookingDate}</div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Armchair className="h-3.5 w-3.5 text-purple-500" /> Seat: {travel.details}</div>
                                   </div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Payout: ₹{travel.price}</p>
                                   <button className="text-[10px] font-black text-purple-500 uppercase hover:underline">View Ticket</button>
                                </div>
                             </GlassCard>
                          ) : (
                             !dismissedRecs.includes(`${event.id}_travel`) && (
                                <motion.div 
                                   whileHover={{ scale: 1.02 }}
                                   className="p-8 rounded-[2.5rem] border-2 border-dashed border-purple-500/30 bg-purple-500/[0.03] flex flex-col items-center justify-center text-center group relative overflow-hidden"
                                >
                                   <div className="absolute top-0 right-0 p-4">
                                      <button onClick={() => handleDismissIntegrated(event.id!, "travel")} className="text-muted-foreground hover:text-rose-500 transition-colors">
                                         <X className="h-4 w-4" />
                                      </button>
                                   </div>
                                   <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                      <Plane className="h-8 w-8" />
                                   </div>
                                   <h4 className="text-sm font-black uppercase tracking-widest mb-2">Transit Missing</h4>
                                   <p className="text-[11px] text-muted-foreground mb-6 max-w-[200px]">Secure VIP shuttles or flight transfers directly to the venue floor.</p>
                                   <button 
                                      onClick={() => router.push(`/hotels-travel-catalog?filter=travel&event=${event.id}`)}
                                      className="px-6 py-2.5 rounded-xl bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest shadow-glow-sm hover:shadow-purple-500/40 transition-all"
                                   >
                                      Book Transport
                                   </button>
                                </motion.div>
                             )
                          )}
                       </div>
                    </div>
                 </div>
              );
           })}
        </div>
      </div>

      {/* Minimal Recommendation Popup */}
      <AnimatePresence>
        {activeRecommendation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] w-[320px]"
          >
            <GlassCard className="p-5 border-primary/30 shadow-2xl bg-background/90 backdrop-blur-2xl" hover={false}>
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Bell className="h-5 w-5 animate-bounce" />
                </div>
                <button onClick={() => handleDismiss(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h4 className="text-sm font-black text-foreground tracking-tight">
                Enhance your {events.find(e => e.id === activeRecommendation.eventId)?.title} journey!
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                You haven't booked your {activeRecommendation.type} yet. Secure your spot now for a seamless experience.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={() => router.push(`/hotels-travel-catalog?filter=${activeRecommendation.type}&event=${activeRecommendation.eventId}`)}
                  className="w-full h-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Book {activeRecommendation.type === "hotel" ? "Nearby Hotel" : "Travel Shuttle"}
                </button>
                <button 
                  onClick={() => handleDismiss(true)}
                  className="w-full h-8 rounded-lg text-[9px] font-bold text-muted-foreground hover:text-rose-500 transition-colors uppercase tracking-widest"
                >
                  Don't show for this event
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
