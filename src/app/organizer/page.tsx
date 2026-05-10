"use client";
import React from "react";
import { 
  LayoutDashboard, Plus, Users, DollarSign, Calendar, 
  ChevronRight, ArrowUpRight, TrendingUp, Filter, 
  Download, MoreHorizontal, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { events, settlements } from "@/data/mock";

export default function OrganizerDashboard() {
  return (
    <DashboardShell title="Event Management" subtitle="Create events, track revenue and manage settlements.">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={LayoutDashboard} label="Active Events" value={4} delta="+1" />
        <StatCard icon={Users} label="Total Registered" value={28491} delta="+12%" />
        <StatCard icon={DollarSign} label="Gross Revenue" value={842900} prefix="$" delta="+18%" />
        <StatCard icon={TrendingUp} label="Avg. Conversion" value={6.2} suffix="%" delta="+0.4%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Active Events List */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Events</h2>
              <GradientButton size="sm" className="h-8 text-[10px] px-4"><Plus className="h-3 w-3 mr-2" /> Create Event</GradientButton>
           </div>
           
           <div className="space-y-4">
              {events.slice(0, 3).map(e => (
                <GlassCard key={e.id} className="p-4" hover={true}>
                   <div className="flex items-center gap-4">
                      <img src={e.image} className="h-14 w-14 rounded-xl object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                         <h3 className="font-bold truncate">{e.title}</h3>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.date} · {e.city}</p>
                      </div>
                      <div className="hidden md:block text-right px-6 border-l border-border/50">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue</p>
                         <p className="text-sm font-bold">$142,500</p>
                      </div>
                      <div className="hidden md:block text-right px-6 border-l border-border/50">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Regs</p>
                         <p className="text-sm font-bold">{e.attendees}</p>
                      </div>
                      <button className="h-9 w-9 rounded-xl glass grid place-items-center hover:text-primary transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                   </div>
                </GlassCard>
              ))}
              <button className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl">
                 View all events
              </button>
           </div>

           {/* Settlement Tracking */}
           <div className="pt-8 space-y-6">
              <div className="flex items-center justify-between px-1">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Pending Settlements</h2>
                 <button className="text-[10px] font-bold text-primary flex items-center gap-1">View Payout History <ArrowUpRight className="h-3 w-3" /></button>
              </div>
              <GlassCard className="p-0 overflow-hidden" hover={false}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-border bg-accent/20">
                             <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recipient</th>
                             <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                             <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                             <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                             <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {settlements.map(s => (
                            <tr key={s.id} className="hover:bg-accent/30 transition-colors">
                               <td className="px-6 py-4">
                                  <p className="text-xs font-semibold">{s.recipient}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.date}</p>
                               </td>
                               <td className="px-6 py-4"><span className="text-[10px] font-medium glass px-2 py-1 rounded-md">{s.role}</span></td>
                               <td className="px-6 py-4 text-xs font-bold">${s.amount.toLocaleString()}</td>
                               <td className="px-6 py-4">
                                  <div className={"flex items-center gap-1.5 text-[10px] font-bold " + (s.status === "Paid" ? "text-emerald-500" : "text-amber-500")}>
                                     {s.status === "Paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                     {s.status}
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button className="h-8 w-8 rounded-lg glass grid place-items-center text-muted-foreground hover:text-foreground">
                                     <MoreHorizontal className="h-4 w-4" />
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </GlassCard>
           </div>
        </div>

        {/* Right Sidebar: Quick Ops */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <Filter className="h-4 w-4 text-primary" /> Quick Ops
              </h3>
              <div className="space-y-3">
                 <QuickOpButton icon={Download} label="Export Sales Report" />
                 <QuickOpButton icon={Users} label="Manage Volunteers" />
                 <QuickOpButton icon={AlertCircle} label="Broadcast Announcement" />
              </div>
           </GlassCard>

           <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20" hover={false}>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-emerald-500">Global Check-ins</h3>
                 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">Live</span>
              </div>
              <div className="text-3xl font-bold tracking-tighter">84%</div>
              <p className="text-xs text-muted-foreground mt-1">12,402 of 14,800 arrived</p>
              <div className="mt-4 h-2 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[84%]" />
              </div>
              <GradientButton className="w-full mt-6 h-10" variant="glow">View Check-in Dashboard</GradientButton>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Partner Performance</h3>
              {[
                { name: "SkyTravel", score: 4.8, inquiries: 142 },
                { name: "Grand Marquise", score: 4.9, inquiries: 89 },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between">
                   <div>
                      <p className="text-xs font-bold">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{p.inquiries} inquiries handled</p>
                   </div>
                   <div className="text-xs font-bold text-primary">★ {p.score}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function QuickOpButton({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl glass hover:bg-accent/50 transition-all text-xs text-left group">
       <span className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          {label}
       </span>
       <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
    </button>
  );
}
