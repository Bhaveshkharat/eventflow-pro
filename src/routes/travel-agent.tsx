import { createFileRoute } from "@tanstack/react-router";
import { Plane, Train, Bus, DollarSign, MessageSquare, Plus, ChevronRight, CheckCircle2, Clock, XCircle, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { inquiries } from "@/data/mock";

export const Route = createFileRoute("/travel-agent")({ component: TravelAgentDashboard, head: () => ({ meta: [{ title: "Travel Partner Hub — Eventra" }] }) });

function TravelAgentDashboard() {
  const travelInquiries = inquiries.filter(i => i.type === "Travel");

  return (
    <DashboardShell title="Travel Partner Hub" subtitle="Manage flight/transport packages and group bookings.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Plane} label="Active Packages" value={12} delta="+2" />
        <StatCard icon={MessageSquare} label="Booking Requests" value={84} delta="+12" />
        <StatCard icon={MapPin} label="Destination Cities" value={24} />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={42900} prefix="$" delta="+18%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Package Management */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Transport Packages</h2>
             <GradientButton size="sm" className="h-8 text-[10px]"><Plus className="h-3 w-3 mr-2" /> New Package</GradientButton>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             {[
               { icon: Plane, name: "US West Coast Flight Bundle", price: 450, routes: "SFO / LAX / SEA", status: "Active" },
               { icon: Train, name: "EuroRail Tech Pass", price: 120, routes: "AMS / BER / PAR", status: "Active" },
               { icon: Bus, name: "Local Shuttle Pass (San Fran)", price: 25, routes: "All Venues", status: "Review" },
               { icon: Plane, name: "Asia-Pacific Premium", price: 890, routes: "SIN / NRT / HKG", status: "Active" },
             ].map(p => (
               <GlassCard key={p.name} className="p-5 flex items-start gap-4" hover={true}>
                  <div className="h-10 w-10 rounded-xl glass border border-white/5 flex items-center justify-center shrink-0">
                     <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-bold truncate">{p.name}</h3>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{p.routes}</p>
                     <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">${p.price}</span>
                        <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (p.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>{p.status}</span>
                     </div>
                  </div>
               </GlassCard>
             ))}
          </div>

          {/* Travel Inquiries */}
          <div className="pt-8 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Recent Inquiries</h2>
                <button className="text-[10px] font-bold text-primary">View Global Inbox</button>
             </div>
             <div className="space-y-3">
                {travelInquiries.map(i => (
                  <GlassCard key={i.id} className="p-4 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full glass grid place-items-center text-primary"><Plane className="h-4 w-4" /></div>
                        <div>
                           <p className="text-xs font-bold">{i.user}</p>
                           <p className="text-[10px] text-muted-foreground mt-0.5">{i.item}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</p>
                           <p className="text-xs font-medium">{i.date}</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 className="h-4 w-4" /></button>
                           <button className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 grid place-items-center hover:bg-rose-500 hover:text-white transition-all"><XCircle className="h-4 w-4" /></button>
                        </div>
                     </div>
                  </GlassCard>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Earnings & Settlements */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-2">
                 <DollarSign className="h-4 w-4 text-primary" /> Payout Summary
              </h3>
              <div className="mt-6 space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Settlement</span>
                    <span className="text-2xl font-bold tracking-tighter">$8,200</span>
                 </div>
                 <div className="h-[1px] bg-border" />
                 <div className="flex justify-between items-center opacity-60">
                    <span className="text-xs font-medium">Last payout (June 30)</span>
                    <span className="text-xs font-bold">$12,450</span>
                 </div>
              </div>
              <GradientButton className="w-full mt-8 h-10" variant="glow">Manage Bank Details</GradientButton>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Partner Score</h3>
              <div className="flex items-center justify-between">
                 <div className="text-3xl font-bold tracking-tighter">4.8<span className="text-sm text-muted-foreground font-medium">/5</span></div>
                 <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 w-4 rounded-full bg-primary" />)}
                 </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 font-medium">Based on 184 passenger reviews</p>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
