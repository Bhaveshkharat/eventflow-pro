"use client";
import React from "react";
import { ShieldCheck, Users, Globe, PieChart, LayoutDashboard, Settings, MoreVertical, Search, Filter, ArrowUpRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";

export default function SuperAdminDashboard() {
  const organizers = [
    { name: "Lumen Events", status: "Pro", events: 12, revenue: 42000, logo: "https://i.pravatar.cc/80?img=11" },
    { name: "Orbit Expos", status: "Enterprise", events: 45, revenue: 184000, logo: "https://i.pravatar.cc/80?img=12" },
    { name: "Studio Co", status: "Trial", events: 2, revenue: 850, logo: "https://i.pravatar.cc/80?img=13" },
  ];

  return (
    <DashboardShell title="Platform Overview" subtitle="Super Admin dashboard for global platform management.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Globe} label="Total Events" value={2481} delta="+42" />
        <StatCard icon={Users} label="Total Users" value={142091} delta="+1.2k" />
        <StatCard icon={ShieldCheck} label="Organizers" value={384} delta="+12" />
        <StatCard icon={PieChart} label="MRR" value={84200} prefix="$" delta="+14%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Organizer Management */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Manage Organizers</h2>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/5">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <input placeholder="Find organizer..." className="bg-transparent text-xs outline-none" />
                 </div>
                 <button className="h-8 w-8 rounded-lg glass grid place-items-center"><Filter className="h-3.5 w-3.5" /></button>
              </div>
           </div>

           <div className="space-y-3">
              {organizers.map(o => (
                <GlassCard key={o.name} className="p-4" hover={true}>
                   <div className="flex items-center gap-4">
                      <img src={o.logo} className="h-10 w-10 rounded-full" alt="" />
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold truncate">{o.name}</h3>
                            <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (o.status === "Enterprise" ? "bg-primary text-white" : "glass")}>{o.status}</span>
                         </div>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{o.events} Events Hosted</p>
                      </div>
                      <div className="hidden md:block text-right px-6 border-l border-border/50">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</p>
                         <p className="text-sm font-bold">${o.revenue.toLocaleString()}</p>
                      </div>
                      <button className="h-8 w-8 rounded-lg glass grid place-items-center hover:bg-accent/50 transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                   </div>
                </GlassCard>
              ))}
              <button className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-2xl">
                 View All Organizers
              </button>
           </div>
        </div>

        {/* Global Controls */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <ShieldCheck className="h-4 w-4 text-primary" /> Platform Health
              </h3>
              <div className="space-y-4">
                 <HealthItem label="API Infrastructure" status="Operational" />
                 <HealthItem label="Payment Gateway" status="Operational" />
                 <HealthItem label="Storage (S3)" status="Degraded" warning />
                 <HealthItem label="Notification Engine" status="Operational" />
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Settings</h3>
              <div className="space-y-3">
                 <SettingToggle label="Public Signups" checked />
                 <SettingToggle label="Exhibitor Module" checked />
                 <SettingToggle label="Beta Features" />
              </div>
              <GradientButton className="w-full h-10" variant="outline">Global System Config <Settings className="ml-2 h-3.5 w-3.5" /></GradientButton>
           </div>

           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Pending Reviews</h3>
                 <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex -space-x-2 mt-4">
                 {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} className="h-8 w-8 rounded-full ring-2 ring-background" alt="" />)}
                 <div className="h-8 w-8 rounded-full glass border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">+12</div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-4">16 organizer applications are waiting for approval.</p>
           </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}

function HealthItem({ label, status, warning }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs text-muted-foreground">{label}</span>
       <div className="flex items-center gap-1.5">
          <span className={"h-1.5 w-1.5 rounded-full " + (warning ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
          <span className={"text-[10px] font-bold " + (warning ? "text-amber-500" : "text-emerald-500")}>{status}</span>
       </div>
    </div>
  );
}

function SettingToggle({ label, checked }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs">{label}</span>
       <div className={"h-5 w-10 rounded-full glass relative cursor-pointer border border-white/5 transition-colors " + (checked ? "bg-primary/20" : "bg-muted")}>
          <div className={"absolute top-1 h-3 w-3 rounded-full transition-all " + (checked ? "right-1 bg-primary shadow-glow-sm" : "left-1 bg-muted-foreground/40")} />
       </div>
    </div>
  );
}
