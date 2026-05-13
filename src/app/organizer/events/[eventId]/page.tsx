"use client";

import React, { use } from "react";
import Link from "next/link";
import {
   Users, DollarSign, BarChart3, Clock,
   MapPin, Calendar, Edit3, Share2,
   ArrowUpRight, Settings, Download, 
   AlertCircle, ChevronRight, Ticket, Check
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { events } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function EventDetail({ params }: { params: Promise<{ eventId: string }> }) {
   const { eventId } = use(params);
   const event = events.find(e => e.id === eventId) || events[0];

   // Configured Upfront Tier Pricing Set by Organizer
   const configuredTiers = [
      { name: "General Attendee Pass", price: "$150", tier: "Standard Access", desc: "Basic expo mapping and standard lecture seating rows." },
      { name: "Pro Access Delegate", price: "$450", tier: "Popular Link", desc: "Fast-track access control lanes and networking mixer slots." },
      { name: "VIP Executive Track", price: "$899", tier: "Sovereign Cap", desc: "Green room roundtables and active auto hotel link APIs." }
   ];

   return (
      <DashboardShell
         title={event.title}
         subtitle={`${event.city} · ${event.date}`}
         backLink="/organizer/events"
      >
         {/* KPI Cards */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Registrations" value={event.attendees} delta="+142 Live" />
            <StatCard icon={DollarSign} label="Ticket Revenue" value={142500} prefix="$" delta="+8% Yield" />
            <StatCard icon={BarChart3} label="Portal Traffic" value={42901} delta="+2.1k Hits" />
            <StatCard icon={Clock} label="Timeline Target" value={14} suffix=" Days" />
         </div>

         <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content: Overview & Tier Controls */}
            <div className="lg:col-span-8 space-y-6">
               
               {/* Hero Display Banner */}
               <GlassCard className="p-0 overflow-hidden border-border/40" hover={false}>
                  <div className="h-56 relative">
                     <img src={event.image} className="absolute inset-0 h-full w-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                     
                     <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                        <div className="min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-primary text-white font-mono">
                                LIVE STREAMING
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono truncate">{event.venue}</span>
                           </div>
                           <h2 className="text-xl font-bold text-foreground tracking-tight truncate">{event.title}</h2>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                           <Link href={`/organizer/events/new`}>
                             <GradientButton size="sm" className="h-8 px-3 text-xs">
                                <Edit3 className="h-3 w-3 mr-1" /> Config Scope
                             </GradientButton>
                           </Link>
                           <button className="h-8 w-8 rounded-lg bg-background border border-border grid place-items-center text-muted-foreground hover:text-foreground transition-colors">
                              <Share2 className="h-3.5 w-3.5" />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-5 grid sm:grid-cols-3 gap-5 border-t border-border/40">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Registration Audit</h4>
                        <div className="space-y-2.5">
                           <MixItem label="Visitors" count={2400} color="bg-blue-500" />
                           <MixItem label="Exhibitors" count={142} color="bg-purple-500" />
                           <MixItem label="Delegates" count={89} color="bg-amber-500" />
                        </div>
                     </div>

                     <div className="sm:col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Real-Time Telemetry</h4>
                        <div className="space-y-2.5">
                           {[
                             "New Exhibitor Assigned: Orbit Systems (Booth #A-101)",
                             "Dynamic ticket pass tier requested: VIP Executive Track",
                             "Contractor binding active: Peak Visual Vendors"
                           ].map((act, i) => (
                              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-accent/30 border border-border/40">
                                 <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="font-medium text-foreground truncate">{act}</span>
                                 </div>
                                 <span className="text-muted-foreground text-[9px] shrink-0 font-mono ml-2">Just Now</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </GlassCard>

               {/* CONFIGURED TICKET PRICING TIERS BLOCK */}
               <GlassCard className="p-5 border-border/40" hover={false}>
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                     <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                           Configured Upfront Ticket Pricing Tiers
                        </h3>
                     </div>
                     <span className="text-[10px] text-muted-foreground font-mono">Visitor Target Scope</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                     These precise pricing values are assigned directly during Event creation and dynamically govern checkout rates shown inside public attendee portals.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3">
                     {configuredTiers.map(t => (
                        <div key={t.name} className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between">
                           <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                 <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                                    {t.tier}
                                 </span>
                                 <span className="text-xs font-black text-primary font-mono">{t.price}</span>
                              </div>
                              <h4 className="text-xs font-bold text-foreground truncate">{t.name}</h4>
                              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                 {t.desc}
                              </p>
                           </div>
                           <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded w-fit mt-2 font-mono block">
                              Active Sync
                           </span>
                        </div>
                     ))}
                  </div>
               </GlassCard>

               {/* Assigned Partners List */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Commercial Subcontractors</h3>
                     <Link href="/organizer/operations">
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                           Manage Partner Hub <ArrowUpRight className="h-3 w-3" />
                        </button>
                     </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                     <PartnerCard name="SkyTravel Logistics" type="Travel" status="Active Link" commission="12%" />
                     <PartnerCard name="Peak Visual Vendors" type="Vendor" status="Service Crew" commission="15%" />
                  </div>
               </div>
            </div>

            {/* Right Column: Settings & Payout Abstract */}
            <div className="lg:col-span-4 space-y-6">
               <GlassCard className="p-5 border-border/40" hover={false}>
                  <h3 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                     <Settings className="h-4 w-4 text-primary" /> Gateway Routing Controls
                  </h3>
                  <div className="space-y-3">
                     <ControlToggle label="Public Turnstile Registration" active={true} />
                     <ControlToggle label="Exhibitor Booth Provisioning" active={true} />
                     <ControlToggle label="Dynamic Vendor Tasks Hook" active={true} />
                     <ControlToggle label="Automated Payout Comm. Splitting" active={true} />
                  </div>
               </GlassCard>

               <div className="p-5 bg-background rounded-xl border border-border space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Financial Accrual Ledger</h3>
                  <div className="space-y-3 text-xs">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Gross Ticket Settled</span>
                        <span className="font-bold font-mono text-foreground">$142,500</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Partner Pool Comm.</span>
                        <span className="font-bold font-mono text-rose-500">-$12,400</span>
                     </div>
                     <div className="h-[1px] bg-border/60" />
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Net Ledger Yield</span>
                        <span className="font-bold font-mono text-primary">$130,100</span>
                     </div>
                  </div>
                  <button className="w-full py-2 bg-accent/30 rounded-lg border border-border text-[10px] font-bold text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-1.5 font-mono">
                     <Download className="h-3 w-3 text-muted-foreground" /> Generate Yield Audit
                  </button>
               </div>

               <GlassCard className="p-5 bg-primary/[0.02] border-primary/20" hover={false}>
                  <h3 className="font-bold text-xs text-primary flex items-center gap-2 uppercase tracking-wider mb-2">
                     <AlertCircle className="h-4 w-4 shrink-0" /> Dynamic Pricing Hook
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                     Configured base tiers shift standard scaling curves based on turnstile registration velocity thresholds.
                  </p>
                  <GradientButton className="w-full mt-4 h-8 text-xs" size="sm">
                     Inspect Demand Algorithms
                  </GradientButton>
               </GlassCard>
            </div>
         </div>
      </DashboardShell>
   );
}

function MixItem({ label, count, color }: any) {
   return (
      <div className="space-y-1">
         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-foreground">{label}</span>
            <span className="text-muted-foreground font-mono">{count}</span>
         </div>
         <div className="h-1 w-full bg-accent rounded-full overflow-hidden">
            <div className={cn("h-full", color)} style={{ width: "65%" }} />
         </div>
      </div>
   );
}

function PartnerCard({ name, type, commission }: any) {
   return (
      <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3 group hover:border-primary/40 transition-all">
         <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider font-mono">{type} Crew</span>
               <span className="text-[9px] font-bold text-emerald-500 uppercase font-mono">· {commission} Split</span>
            </div>
         </div>
         <div className="h-7 w-7 rounded-lg bg-accent grid place-items-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
            <ChevronRight className="h-3.5 w-3.5" />
         </div>
      </div>
   );
}

function ControlToggle({ label, active }: any) {
   return (
      <div className="flex items-center justify-between gap-2">
         <span className="text-xs font-medium text-foreground">{label}</span>
         <span className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase bg-emerald-500/10 text-emerald-500 shrink-0">
           Active
         </span>
      </div>
   );
}
