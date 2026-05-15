"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, DollarSign, BarChart3, TrendingUp, 
  Clock, CheckCircle2, AlertCircle, Calendar, ArrowUpRight,
  ArrowRight, Layers, Package, Activity, PieChart, ShieldCheck, Hotel
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { cn } from "@/lib/utils";

export default function ExhibitorDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLogisticsPromo, setShowLogisticsPromo] = useState(false);
  const [selectedEventForPromo, setSelectedEventForPromo] = useState<any>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <DashboardShell 
      title="Exhibitor Insights Command" 
      subtitle="Strategic oversight of your exhibition footprint, logistics pipeline, and commercial performance across all event cycles."
    >
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Building2} label="Managed Stalls" value={14} delta="+2 this month" />
        <StatCard icon={Users} label="Total Leads Captured" value={1240} delta="+18% growth" />
        <StatCard icon={DollarSign} label="Overall Investment" value="₹12.4L" prefix="" delta="12 Events" />
        <StatCard icon={Activity} label="ROI Performance" value="84%" delta="Top 5% of Peers" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Billing & Revenue Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <GlassCard className="p-8 border-primary/20 relative overflow-hidden" hover={false}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BarChart3 className="h-32 w-32 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Billing & Settlement Analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">Capital allocation and payout history across your event portfolio.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Total Budgeted</p>
                    <p className="text-lg font-black text-foreground">₹24,50,000</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
               <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                     <ShieldCheck className="h-5 w-5 text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-500 uppercase">Paid</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">₹18.2L</p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-1">Completed Settlements</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-4">
                     <Clock className="h-5 w-5 text-amber-500" />
                     <span className="text-[10px] font-black text-amber-500 uppercase">Pending</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">₹4.8L</p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-1">Awaiting Authorization</p>
               </div>
               <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                     <TrendingUp className="h-5 w-5 text-primary" />
                     <span className="text-[10px] font-black text-primary uppercase">Refunds</span>
                  </div>
                  <p className="text-2xl font-black text-foreground">₹1.5L</p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-1">Credits In-Wallet</p>
               </div>
            </div>

            {/* Mock Chart - Monthly Revenue/Investment */}
            <div className="mt-10 h-40 flex items-end justify-between gap-2 px-2 relative z-10">
               {[35, 60, 45, 90, 65, 85, 40, 75, 100, 55, 80, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                     <div className="w-full bg-primary/10 rounded-t-lg relative overflow-hidden h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05, duration: 1 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 group-hover:to-primary group-transition"
                        />
                     </div>
                     <span className="text-[8px] font-black text-muted-foreground uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
               ))}
            </div>
          </GlassCard>

        {/* Booth Status Ledger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Booth Readiness Ledger</h3>
               <Link href="/exhibitor/booth" className="text-[10px] font-black text-primary hover:underline">Manage All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                  { id: "event-1", name: "TechSummit 2026", booth: "Booth A-101", status: "Operational", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { id: "event-2", name: "Design Week Milano", booth: "Booth D-404", status: "In Setup", color: "text-amber-500", bg: "bg-amber-500/10" },
                  { id: "event-3", name: "FutureMobility Expo", booth: "Stall G-12", status: "Waitlisted", color: "text-primary", bg: "bg-primary/10" },
                  { id: "event-4", name: "Global Health Summit", booth: "Hall B-33", status: "Ready", color: "text-emerald-500", bg: "bg-emerald-500/10" }
               ].map((b, i) => (
                  <GlassCard key={i} className="p-5 flex items-center justify-between group transition-all hover:border-primary/30">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                           <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase">{b.booth}</p>
                           <h4 className="text-xs font-bold text-foreground">{b.name}</h4>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <div className={cn("px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-current opacity-80", b.color, b.bg)}>
                           {b.status}
                        </div>
                        <button 
                          onClick={() => {
                             const skip = localStorage.getItem(`eventflow_pro_skip_logistics_promo_${b.id}`);
                             if (skip === "true") {
                                window.location.href = `/exhibitor/booth/${b.id}`;
                             } else {
                                setSelectedEventForPromo(b);
                                setShowLogisticsPromo(true);
                             }
                          }}
                          className="text-[9px] font-black text-primary uppercase tracking-tighter hover:underline flex items-center gap-1"
                        >
                           Manage Service <ArrowUpRight className="h-3 w-3" />
                        </button>
                     </div>
                  </GlassCard>
               ))}
            </div>
          </div>
        </div>

        {/* LOGISTICS PROMOTION MODAL */}
        <AnimatePresence>
           {showLogisticsPromo && selectedEventForPromo && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   onClick={() => setShowLogisticsPromo(false)}
                   className="absolute inset-0 bg-background/80 backdrop-blur-md"
                 />
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="w-full max-w-lg relative z-10"
                 >
                    <GlassCard className="p-10 border-primary/30 shadow-2xl relative overflow-hidden" hover={false}>
                       {/* Background decoration */}
                       <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                       <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                       
                       <div className="text-center relative z-10">
                          <div className="h-20 w-20 bg-gradient-to-br from-primary to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow rotate-3">
                             <Hotel className="h-10 w-10 text-white" />
                          </div>
                          <h2 className="text-3xl font-black tracking-tight text-foreground">Travel & Stay Simplified</h2>
                          <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                             Need premium hotel accommodations or travel facilities for your staff at <span className="text-foreground font-black">{selectedEventForPromo.name}</span>? 
                             Access exclusive exhibitor rates through our logistics partners.
                          </p>

                          <div className="mt-12 space-y-4">
                             <button 
                               onClick={() => window.location.href = "/hotels-travel-catalog"}
                               className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                                Explore Logistics Hub <ArrowRight className="h-5 w-5" />
                             </button>
                             
                             <div className="flex gap-3">
                                <button 
                                  onClick={() => {
                                     setShowLogisticsPromo(false);
                                     window.location.href = `/exhibitor/booth/${selectedEventForPromo.id}`;
                                  }}
                                  className="flex-1 h-12 rounded-xl bg-accent/30 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-accent/50 transition-all"
                                >
                                   Continue to Service
                                </button>
                                <button 
                                  onClick={() => {
                                     localStorage.setItem(`eventflow_pro_skip_logistics_promo_${selectedEventForPromo.id}`, "true");
                                     setShowLogisticsPromo(false);
                                     window.location.href = `/exhibitor/booth/${selectedEventForPromo.id}`;
                                  }}
                                  className="flex-1 h-12 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                                >
                                   Don't show again
                                </button>
                             </div>
                          </div>
                       </div>
                    </GlassCard>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status Breakdown Chart */}
          <GlassCard className="p-6 border-border/40" hover={false}>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
               <PieChart className="h-4 w-4 text-primary" /> Stall Allocation
            </h3>
            <div className="flex justify-center mb-8">
               <div className="relative h-32 w-32">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-emerald-500/20" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="180 251.2" className="text-emerald-500" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="40 251.2" strokeDashoffset="-180" className="text-amber-500" />
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="31.2 251.2" strokeDashoffset="-220" className="text-primary" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-lg font-black tracking-tighter">14</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">Total</span>
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               {[
                  { label: "Active/Ready", val: 8, color: "bg-emerald-500" },
                  { label: "Under Setup", val: 3, color: "bg-amber-500" },
                  { label: "Waitlisted", val: 3, color: "bg-primary" }
               ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", s.color)} />
                        <span className="text-[10px] font-bold text-muted-foreground">{s.label}</span>
                     </div>
                     <span className="text-[10px] font-black text-foreground">{s.val}</span>
                  </div>
               ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="space-y-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-foreground px-2">Logistics Shortcuts</h3>
             <div className="grid grid-cols-1 gap-3">
                <Link href="/hotels-travel-catalog?filter=hotel">
                   <button className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <Hotel className="h-5 w-5" />
                         <span className="text-xs font-black uppercase tracking-widest text-left">Book Staff Stay</span>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </Link>
                <Link href="/exhibitor/leads">
                   <button className="w-full p-4 rounded-2xl bg-accent/20 border border-border/40 text-foreground hover:border-primary/40 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <Activity className="h-5 w-5" />
                         <span className="text-xs font-black uppercase tracking-widest text-left">Live Lead Stream</span>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </Link>
             </div>
          </div>

          {/* Recent History / Portfolio */}
          <GlassCard className="p-6 border-border/40 bg-accent/[0.02]" hover={false}>
             <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-4">Portfolio History</h3>
             <div className="space-y-5">
                {[
                   { name: "BioTech Expo '25", ROI: "+12%", leads: 450 },
                   { name: "AI Summit '25", ROI: "+24%", leads: 820 },
                   { name: "EcoGrid 2025", ROI: "+8%", leads: 210 }
                ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                      <div>
                         <p className="text-[10px] font-black text-foreground">{h.name}</p>
                         <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{h.leads} Leads Captured</p>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500">{h.ROI} ROI</span>
                   </div>
                ))}
             </div>
          </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}
