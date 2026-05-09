import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, Truck, Hotel, Plane, 
  Settings, Plus, Search, Filter, 
  MoreVertical, CheckCircle2, DollarSign,
  ChevronRight, MessageSquare
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";

export const Route = createFileRoute("/organizer/operations")({ 
  component: OrganizerOperations,
  head: () => ({ meta: [{ title: "Operations Hub — Eventra" }] }) 
});

function OrganizerOperations() {
  const partners = [
    { name: "SkyTravel Logistics", type: "Travel", events: 8, rating: 4.8, status: "Active", commission: 12 },
    { name: "Grand Marquise", type: "Hotel", events: 12, rating: 4.9, status: "Active", commission: 10 },
    { name: "Peak Vendors", type: "Vendor", events: 4, rating: 4.5, status: "Review", commission: 15 },
    { name: "Global Stay", type: "Hotel", events: 24, rating: 4.7, status: "Active", commission: 8 },
  ];

  return (
    <DashboardShell title="Operations Hub" subtitle="Manage your network of service partners and global commissions.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Partners" value={32} />
        <StatCard icon={Hotel} label="Hotel Agents" value={14} />
        <StatCard icon={Plane} label="Travel Agents" value={12} />
        <StatCard icon={Truck} label="Vendors" value={6} />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Partner Management */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Manage Partners</h2>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/5">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <input placeholder="Search partners..." className="bg-transparent text-xs outline-none" />
                 </div>
                 <GradientButton size="sm" className="h-8 text-[10px]"><Plus className="h-3 w-3 mr-2" /> Invite Partner</GradientButton>
              </div>
           </div>

           <div className="space-y-3">
              {partners.map(p => (
                <GlassCard key={p.name} className="p-4" hover={true}>
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl glass border border-white/5 flex items-center justify-center text-primary">
                         {p.type === "Hotel" ? <Hotel className="h-5 w-5" /> : p.type === "Travel" ? <Plane className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold truncate">{p.name}</h3>
                            <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (p.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>{p.status}</span>
                         </div>
                         <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.type} Partner</span>
                            <span className="text-[10px] text-primary font-bold">★ {p.rating}</span>
                         </div>
                      </div>
                      <div className="hidden md:block text-right px-6 border-l border-border/50">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Comm.</p>
                         <p className="text-xs font-bold">{p.commission}%</p>
                      </div>
                      <div className="hidden md:block text-right px-6 border-l border-border/50">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Events</p>
                         <p className="text-xs font-bold">{p.events}</p>
                      </div>
                      <button className="h-8 w-8 rounded-lg glass grid place-items-center hover:bg-accent/50 transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                   </div>
                </GlassCard>
              ))}
           </div>
        </div>

        {/* Global Config & Insights */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <Settings className="h-4 w-4 text-primary" /> Global Commissions
              </h3>
              <div className="space-y-6">
                 <ConfigItem label="Hotel Booking Fee" value="10%" />
                 <ConfigItem label="Travel Package Fee" value="12%" />
                 <ConfigItem label="Vendor Service Fee" value="15%" />
                 <GradientButton className="w-full h-10 mt-4" variant="outline">Update Global Rates</GradientButton>
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Partner Inquiries</h3>
              <div className="space-y-4">
                 {[1,2].map(i => (
                    <div key={i} className="flex items-start gap-3">
                       <div className="h-8 w-8 rounded-full glass flex items-center justify-center shrink-0"><MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /></div>
                       <div>
                          <p className="text-xs font-bold">Luxe Rentals requested access</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Application for: TechSummit 2026</p>
                          <div className="flex gap-2 mt-2">
                             <button className="text-[10px] font-bold text-primary">Review</button>
                             <button className="text-[10px] font-bold text-muted-foreground">Dismiss</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Performance Summary</h3>
                 <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold tracking-tighter">$42,901</p>
              <p className="text-[11px] text-muted-foreground mt-1">Net revenue from partner commissions this quarter.</p>
           </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}

function ConfigItem({ label, value }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
       <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
       <span className="text-sm font-bold text-primary group-hover:underline">{value}</span>
    </div>
  );
}
