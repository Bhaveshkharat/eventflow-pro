"use client";
import React from "react";
import { Calendar, MapPin, Users, Star, Share2, CalendarPlus, Building2, ChevronRight, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events, tickets, hotels, agenda } from "@/data/mock";
import { HotelCard } from "@/components/events/HotelCard";
import { toast } from "sonner";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function EventDetailClient({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = React.use(params);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    notFound();
  }

  const date = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const end = new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  return (
    <div className="min-h-screen">
      <MarketingNav />
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-10">
          <span className="self-start px-3 py-1 rounded-full text-xs glass-strong">{event.category}</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">{event.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{event.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{date} – {end}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}, {event.city}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{event.attendees.toLocaleString()} attendees</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{event.rating}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">About this event</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Join {event.attendees.toLocaleString()}+ professionals at {event.venue} for {event.title}. Three days of keynotes,
              workshops and networking with the brightest minds in {event.category.toLowerCase()}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map(t => <span key={t} className="text-xs px-3 py-1 rounded-full glass">{t}</span>)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Agenda · Day 1</h2>
            <div className="mt-5 space-y-2">
              {agenda.map((a, i) => (
                <GlassCard key={i} className="p-4 flex items-center gap-4" hover={false}>
                  <div className="w-16 text-sm font-mono text-muted-foreground">{a.time}</div>
                  <div className="flex-1">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.speaker} · {a.track}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Hotels & travel</h2>
            <p className="text-sm text-muted-foreground mt-1">Negotiated rates near the venue.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-5">
              {hotels.slice(0, 4).map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </div>
        </div>

        {/* Participation Options */}
        <aside className="lg:sticky lg:top-24 h-max space-y-6">
          <GlassCard className="p-6 border-primary/20 bg-primary/5" hover={false}>
             <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" /> Participate in Event
             </h3>
             
              <div className="space-y-4">
                 {/* 1. VISITOR */}
                 <GlassCard className="p-0 overflow-hidden border-border bg-background hover:border-primary/40 transition-all" hover={false}>
                    <div className="p-5">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black uppercase text-foreground">As Visitor</p>
                          <Users className="h-4 w-4 text-primary" />
                       </div>
                       <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">Gain access to all keynotes, breakout sessions, and networking lounges.</p>
                       <Link href={`/onboarding?role=visitor&event=${event.id}`} className="block mt-4">
                          <GradientButton className="w-full h-10 text-[10px] font-black uppercase tracking-widest">Book Now</GradientButton>
                       </Link>
                    </div>
                 </GlassCard>

                 {/* 2. DELEGATE (NEW) */}
                 <GlassCard className="p-0 overflow-hidden border-border bg-background hover:border-primary/40 transition-all shadow-glow-sm" hover={false}>
                    <div className="p-5">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black uppercase text-foreground">As Delegate</p>
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                       </div>
                       <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">VIP access, executive lounges, and priority seating for high-level summits.</p>
                       <Link href={`/onboarding?role=delegate&event=${event.id}`} className="block mt-4">
                          <GradientButton className="w-full h-10 text-[10px] font-black uppercase tracking-widest">Book Now</GradientButton>
                       </Link>
                    </div>
                 </GlassCard>

                 {/* 3. EXHIBITOR */}
                 <GlassCard className="p-0 overflow-hidden border-border bg-background hover:border-primary/40 transition-all" hover={false}>
                    <div className="p-5">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black uppercase text-foreground">As Exhibitor</p>
                          <Building2 className="h-4 w-4 text-amber-500" />
                       </div>
                       <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">Secure premium stall locations, showcase products, and scan high-intent leads.</p>
                       <Link href={`/onboarding?role=exhibitor&event=${event.id}`} className="block mt-4">
                          <GradientButton className="w-full h-10 text-[10px] font-black uppercase tracking-widest">Book Now</GradientButton>
                       </Link>
                    </div>
                 </GlassCard>

                 {/* 4. SPEAKER */}
                 <GlassCard className="p-0 overflow-hidden border-border bg-background opacity-60 hover:opacity-100 transition-all" hover={false}>
                    <div className="p-5">
                       <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-black uppercase text-foreground">As Speaker</p>
                          <Star className="h-4 w-4 text-primary" />
                       </div>
                       <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">Submit your session proposals and share your expertise with a global audience.</p>
                       <Link href={`/onboarding?role=speaker&event=${event.id}`} className="block mt-4">
                          <button className="w-full h-10 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Apply to Speak</button>
                       </Link>
                    </div>
                 </GlassCard>
              </div>

             <div className="mt-6 pt-6 border-t border-border/60">
                <div className="flex items-center justify-between text-xs mb-2">
                   <span className="text-muted-foreground font-medium">Tickets from</span>
                   <span className="font-black text-foreground">₹{event.priceFrom.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-muted-foreground font-medium">Exhibitors</span>
                   <span className="font-black text-primary">{event.exhibitors} Confirmed</span>
                </div>
             </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between border-border/40" hover={false}>
             <div className="flex gap-2">
                <button onClick={() => toast.success("Added to calendar")} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"><CalendarPlus className="h-4 w-4" /></button>
                <button onClick={() => toast.success("Link copied")} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-primary/10 transition-colors"><Share2 className="h-4 w-4" /></button>
             </div>
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Help & Support</span>
          </GlassCard>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
