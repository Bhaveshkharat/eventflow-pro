"use client";
import React from "react";
import Link from "next/link";
import { Ticket, Calendar, Clock, MapPin, Download, ChevronRight, Hotel, Plane, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";

export default function VisitorDashboard() {
  const myEvents = [events[0], events[2]]; // Mock registered events

  return (
    <DashboardShell title="Welcome back, Olivia" subtitle="You have 2 upcoming events this month.">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">My Registered Events</h2>
          {myEvents.map(e => (
            <GlassCard key={e.id} className="p-0 overflow-hidden group">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
                   <img src={e.image} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{e.category}</p>
                      <h3 className="text-xl font-bold tracking-tight">{e.title}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full glass grid place-items-center"><Ticket className="h-4 w-4 text-primary" /></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <Calendar className="h-3.5 w-3.5" /> {e.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <MapPin className="h-3.5 w-3.5" /> {e.city}, {e.country}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Link href={`/events`} className="flex-1">
                      <GradientButton className="w-full h-10 text-xs" variant="glow">View Details</GradientButton>
                    </Link>
                    <button className="h-10 px-4 rounded-xl glass hover:bg-accent/50 transition-colors">
                       <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Quick Actions</h2>
          <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
             <h3 className="font-bold flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" /> Need a Hotel?
             </h3>
             <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                We've partnered with top hotels near the Moscone Center. Get up to 25% off as an attendee.
             </p>
             <Link href="/hotel-agent">
               <GradientButton className="w-full mt-4 h-9 text-[10px] uppercase font-bold tracking-wider" variant="glow">
                  Browse partner hotels <Hotel className="ml-2 h-3.5 w-3.5" />
               </GradientButton>
             </Link>
          </GlassCard>

          <GlassCard className="p-6 bg-indigo-500/5 border-indigo-500/20" hover={false}>
             <h3 className="font-bold flex items-center gap-2 text-indigo-500">
                <Plane className="h-4 w-4" /> Group Travel
             </h3>
             <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Traveling from abroad? Book discounted flight packages curated for {myEvents[0].title}.
             </p>
             <Link href="/travel-agent">
               <GradientButton className="w-full mt-4 h-9 text-[10px] uppercase font-bold tracking-wider" variant="outline">
                  View flight packages <ChevronRight className="ml-1 h-3.5 w-3.5" />
               </GradientButton>
             </Link>
          </GlassCard>

          <div className="pt-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Upcoming Schedule</h3>
             <div className="space-y-4">
                {[
                  { time: "09:00", title: "Opening Keynote", track: "Main Hall" },
                  { time: "11:00", title: "Design Systems in AI", track: "Room 402" },
                ].map(s => (
                  <div key={s.title} className="flex gap-4 items-start">
                     <div className="text-xs font-mono font-bold text-primary py-1 border-r border-border pr-4 min-w-[60px]">{s.time}</div>
                     <div>
                        <p className="text-xs font-semibold">{s.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.track}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
