"use client";
import React, { use } from "react";
import Link from "next/link";
import { 
  Users, DollarSign, BarChart3, Clock, 
  MapPin, Calendar, Edit3, Share2, 
  MoreVertical, ChevronLeft, ArrowUpRight, 
  CheckCircle2, AlertCircle, Settings, Download, ChevronRight
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { events } from "@/data/mock";

export default function EventDetail({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = events.find(e => e.id === eventId) || events[0];

  return (
    <DashboardShell 
      title={event.title} 
      subtitle={`${event.city} · ${event.date}`}
      backLink="/organizer/events"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Regs" value={event.attendees} delta="+142" />
        <StatCard icon={DollarSign} label="Ticket Sales" value={142500} prefix="$" delta="+8%" />
        <StatCard icon={BarChart3} label="Page Views" value={42901} delta="+2.1k" />
        <StatCard icon={Clock} label="Days Left" value={14} color="text-amber-500" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Content: Stats & Management */}
        <div className="lg:col-span-8 space-y-8">
           {/* Event Overview Card */}
           <GlassCard className="p-0 overflow-hidden" hover={false}>
              <div className="h-64 relative">
                 <img src={event.image} className="absolute inset-0 h-full w-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary text-white">LIVE</span>
                          <span className="text-[10px] text-white/70 uppercase tracking-widest">{event.venue}</span>
                       </div>
                       <h2 className="text-2xl font-bold text-white tracking-tight">{event.title}</h2>
                    </div>
                    <div className="flex gap-2">
                       <GradientButton size="sm" className="h-9 px-4 text-[10px]"><Edit3 className="h-3 w-3 mr-2" /> Edit Details</GradientButton>
                       <button className="h-9 w-9 rounded-xl glass-strong grid place-items-center text-white border border-white/20"><Share2 className="h-4 w-4" /></button>
                    </div>
                 </div>
              </div>
              <div className="p-8 grid md:grid-cols-3 gap-8">
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Registration Mix</h4>
                    <div className="space-y-3">
                       <MixItem label="Visitors" count={2400} color="bg-blue-500" />
                       <MixItem label="Exhibitors" count={142} color="bg-purple-500" />
                       <MixItem label="Delegates" count={89} color="bg-amber-500" />
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                               <div className="h-2 w-2 rounded-full bg-primary" />
                               <span className="font-medium">New Exhibitor Registration: Orbit Systems</span>
                            </div>
                            <span className="text-muted-foreground text-[10px]">2m ago</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </GlassCard>

           {/* Operations Management */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Assigned Partners</h3>
                 <Link href="/organizer/operations">
                   <button className="text-[10px] font-bold text-primary flex items-center gap-1">Manage All Partners <ArrowUpRight className="h-3 w-3" /></button>
                 </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <PartnerCard name="SkyTravel Logistics" type="Travel" status="Active" commission="12%" />
                 <PartnerCard name="Grand Marquise" type="Hotel" status="Active" commission="10%" />
              </div>
           </div>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <Settings className="h-4 w-4 text-primary" /> Event Controls
              </h3>
              <div className="space-y-4">
                 <ControlToggle label="Public Registration" active={true} />
                 <ControlToggle label="Exhibitor Portal" active={true} />
                 <ControlToggle label="Networking Features" active={false} />
                 <ControlToggle label="Media Downloads" active={true} />
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Financial Summary</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Gross Sales</span>
                    <span className="text-sm font-bold">$142,500</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Partner Comm.</span>
                    <span className="text-sm font-bold text-rose-500">-$12,400</span>
                 </div>
                 <div className="h-[1px] bg-border" />
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Net Payout</span>
                    <span className="text-sm font-bold text-primary">$130,100</span>
                 </div>
              </div>
              <button className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
                 <Download className="h-3.5 w-3.5" /> Download Revenue Report
              </button>
           </div>

           <GlassCard className="p-6 bg-amber-500/5 border-amber-500/20" hover={false}>
              <h3 className="font-bold text-amber-500 flex items-center gap-2 mb-2">
                 <AlertCircle className="h-4 w-4" /> Pending Action
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                 You have 12 speaker submissions waiting for review before the deadline in 3 days.
              </p>
              <GradientButton className="w-full mt-6 h-10" variant="outline">Review Submissions</GradientButton>
           </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}

function MixItem({ label, count, color }: any) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
          <span>{label}</span>
          <span className="text-muted-foreground">{count}</span>
       </div>
       <div className="h-1 w-full bg-accent/20 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: "65%" }} />
       </div>
    </div>
  );
}

function PartnerCard({ name, type, status, commission }: any) {
  return (
    <div className="p-4 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group">
       <div>
          <p className="text-xs font-bold">{name}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{type}</span>
             <span className="h-1 w-1 rounded-full bg-border" />
             <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{commission} Comm.</span>
          </div>
       </div>
       <button className="h-8 w-8 rounded-lg glass-strong grid place-items-center group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="h-4 w-4" />
       </button>
    </div>
  );
}

function ControlToggle({ label, active }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-medium">{label}</span>
       <div className={`h-5 w-10 rounded-full glass relative border border-white/5 cursor-pointer transition-colors ${active ? "bg-primary/20" : "bg-accent/10"}`}>
          <div className={`absolute top-1 h-3 w-3 rounded-full transition-all ${active ? "right-1 bg-primary shadow-glow-sm" : "left-1 bg-muted-foreground/40"}`} />
       </div>
    </div>
  );
}
