"use client";
import React from "react";
import { Hotel, Bed, DollarSign, Calendar, MessageSquare, ChevronRight, CheckCircle2, Clock, XCircle, Plus } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { hotels, inquiries } from "@/data/mock";

export default function HotelAgentDashboard() {
  const hotelInquiries = inquiries.filter(i => i.type === "Hotel");

  return (
    <DashboardShell title="Hotel Partner Hub" subtitle="Manage listings, room inventory and guest inquiries.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Hotel} label="Properties" value={4} delta="0" />
        <StatCard icon={Bed} label="Booked Rooms" value={284} delta="+14" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={12} delta="+3" />
        <StatCard icon={DollarSign} label="Total Earnings" value={18400} prefix="$" delta="+8%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Listings Management */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Listings</h2>
             <GradientButton size="sm" className="h-8 text-[10px]"><Plus className="h-3 w-3 mr-2" /> Add Property</GradientButton>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             {hotels.map(h => (
               <GlassCard key={h.id} className="p-0 overflow-hidden group">
                  <div className="h-40 relative">
                     <img src={h.image} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute top-3 right-3 px-2 py-1 rounded-md glass-strong text-[10px] font-bold text-white uppercase tracking-wider">
                        ★ {h.rating}
                     </div>
                  </div>
                  <div className="p-5">
                     <h3 className="font-bold">{h.name}</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{h.distance}</p>
                     <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">${h.price} / night</span>
                        <div className="flex gap-2">
                           <button className="text-[10px] font-bold hover:text-primary transition-colors">Edit</button>
                           <span className="text-muted-foreground/30">|</span>
                           <button className="text-[10px] font-bold hover:text-rose-500 transition-colors">Disable</button>
                        </div>
                     </div>
                  </div>
               </GlassCard>
             ))}
          </div>

          {/* Booking Inquiries */}
          <div className="pt-8 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Inquiries</h2>
                <button className="text-[10px] font-bold text-primary">View Inbox</button>
             </div>
             <div className="space-y-3">
                {hotelInquiries.map(i => (
                  <GlassCard key={i.id} className="p-4 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full glass grid place-items-center"><MessageSquare className="h-4 w-4 text-primary" /></div>
                        <div>
                           <p className="text-xs font-bold">{i.user}</p>
                           <p className="text-[10px] text-muted-foreground mt-0.5">{i.item}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Requested</p>
                           <p className="text-xs font-medium">{i.date}</p>
                        </div>
                        {i.status === "Pending" ? (
                           <div className="flex gap-2">
                              <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 className="h-4 w-4" /></button>
                              <button className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 grid place-items-center hover:bg-rose-500 hover:text-white transition-all"><XCircle className="h-4 w-4" /></button>
                           </div>
                        ) : (
                           <div className={"flex items-center gap-1.5 text-[10px] font-bold " + (i.status === "Confirmed" ? "text-emerald-500" : "text-rose-500")}>
                              {i.status === "Confirmed" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {i.status}
                           </div>
                        )}
                     </div>
                  </GlassCard>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Alerts & Performance */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <Calendar className="h-4 w-4 text-primary" /> High Demand Alert
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 TechSummit 2026 is seeing a surge in bookings. We recommend adjusting your inventory for June 12-14.
              </p>
              <GradientButton className="w-full mt-6 h-10 text-[10px] font-bold uppercase tracking-wider">Manage Inventory</GradientButton>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Payout Schedule</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-xs font-bold">Next Payout</p>
                       <p className="text-[10px] text-muted-foreground">July 15, 2026</p>
                    </div>
                    <span className="text-sm font-bold text-primary">$4,290</span>
                 </div>
                 <div className="h-[1px] bg-border/50" />
                 <div className="flex justify-between items-center opacity-60">
                    <div>
                       <p className="text-xs font-bold">Processing</p>
                       <p className="text-[10px] text-muted-foreground">June 30, 2026</p>
                    </div>
                    <span className="text-sm font-bold">$1,840</span>
                 </div>
              </div>
              <button className="w-full mt-6 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">View All Settlements</button>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
