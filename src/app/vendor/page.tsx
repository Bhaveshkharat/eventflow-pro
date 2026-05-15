"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, CheckSquare, Clock, FileText, Download, 
  MoreHorizontal, ChevronRight, AlertCircle, Calendar,
  Building2, Wrench, Zap, CheckCircle2, DollarSign, Filter,
  Check, ArrowRight, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPersistedExhibitorRequests, updateExhibitorRequestStatus, ExhibitorRequest } from "@/lib/servicesStore";

export default function VendorDashboard() {
  // Stateful Task Nodes dynamically matching Exhibitor requirements
  const [syncedTasks, setSyncedTasks] = useState<ExhibitorRequest[]>([]);
  const [directBookings, setDirectBookings] = useState<any[]>([]);
  const [vendorType, setVendorType] = useState<"Services" | "Hotel" | "Travel">("Services");

  useEffect(() => {
    setSyncedTasks(getPersistedExhibitorRequests());
    
    // Load direct bookings from catalog
    const rawBookings = localStorage.getItem("eventflow_pro_user_bookings_v1");
    if (rawBookings) {
      const allBookings = JSON.parse(rawBookings);
      setDirectBookings(allBookings);
    }
  }, [vendorType]);

  const [vendorTasks, setVendorTasks] = useState([
    { 
      id: "tsk-1", 
      title: "Deploy 15A High-Voltage Electrical Drop", 
      event: "TechSummit 2026", 
      eventId: "techsummit-26",
      clientBooth: "Booth #A-101 (Orbit Systems)", 
      deadline: "June 10, 08:00 AM", 
      status: "Completed Ready", 
      category: "Electrical",
      payout: "$350"
    },
    { 
      id: "tsk-2", 
      title: "Ultra-Low Latency Wired Internet Link (1 Gbps)", 
      event: "TechSummit 2026", 
      eventId: "techsummit-26",
      clientBooth: "Booth #A-101 (Orbit Systems)", 
      deadline: "June 10, 11:00 AM", 
      status: "Pending Floor Dispatch", 
      category: "Network",
      payout: "$450"
    },
    { 
      id: "tsk-3", 
      title: "Parametric Backlit Overhead Banner Mount", 
      event: "Design Week Milano", 
      eventId: "designweek-26",
      clientBooth: "Booth #D-404 (Studio Core)", 
      deadline: "July 01, 09:00 AM", 
      status: "Pending Floor Dispatch", 
      category: "Rigging",
      payout: "$800"
    },
    { 
      id: "tsk-4", 
      title: "Seamless 65-Inch 4K Commercial LED Monitor", 
      event: "TechSummit 2026", 
      eventId: "techsummit-26",
      clientBooth: "Booth #C-304 (Nimbus Bio)", 
      deadline: "June 11, 02:00 PM", 
      status: "Completed Ready", 
      category: "AV Display",
      payout: "$600"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<"All" | "Pending" | "Completed">("All");

  const allTasks = [...syncedTasks.filter(st => st.assignedVendorId === "v-1").map(st => ({
    id: st.id,
    title: st.title,
    event: st.eventName,
    eventId: st.eventId,
    clientBooth: `Booth #${st.boothNumber} (${st.exhibitorName})`,
    deadline: st.deadline,
    status: st.status === "Completed" ? "Completed Ready" : st.status === "In Progress" ? "In Progress" : "Awaiting Deployment",
    category: st.category,
    payout: st.cost
  })), ...vendorTasks];

  const filteredTasks = allTasks.filter(t => {
    if (activeFilter === "Pending") return !t.status.includes("Completed");
    if (activeFilter === "Completed") return t.status.includes("Completed");
    return true;
  });

  const handleToggleTaskStatus = (id: string) => {
    // Check if it's a synced task or a mock task
    const isSynced = syncedTasks.some(t => t.id === id);

    if (isSynced) {
       const task = syncedTasks.find(t => t.id === id)!;
       let nextStatus: ExhibitorRequest["status"];
       
       if (task.status === "Assigned") nextStatus = "In Progress";
       else if (task.status === "In Progress") nextStatus = "Completed";
       else nextStatus = "In Progress";

       updateExhibitorRequestStatus(id, nextStatus);
       setSyncedTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
       toast.success(`Downstream state relayed: Task flagged as ${nextStatus}`);
    } else {
      setVendorTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        const nextStatus = t.status.includes("Completed") ? "In Progress" : "Completed Ready";
        toast.success(`Downstream state relayed: Task flagged as ${nextStatus}`);
        return { ...t, status: nextStatus };
      }));
    }
  };

  const pendingCount = vendorTasks.filter(t => !t.status.includes("Completed")).length;
  const completedPayout = vendorTasks.filter(t => t.status.includes("Completed"))
    .reduce((sum, t) => sum + parseInt(t.payout.replace("$", ""), 10), 0);

  return (
    <DashboardShell 
      title="Service Execution Command" 
      subtitle="Fulfill live on-site hardware requirements requested by Exhibitors. Handshakes seamlessly trigger complete setup indicators back inside client portals."
    >
      {/* Role Adaptive Header */}
      <div className="flex items-center gap-2 mb-6">
         {(["Services", "Hotel", "Travel"] as const).map(v => (
            <button key={v} onClick={() => setVendorType(v)}
               className={cn("px-4 py-2 rounded-xl text-xs font-bold border transition-all", 
               vendorType === v ? "bg-primary text-white border-primary shadow-glow-sm" : "glass border-transparent text-muted-foreground hover:border-border")}>
               {v} Partner View
            </button>
         ))}
      </div>

      {vendorType === "Services" ? (
         <>
            {/* Top Banner explaining the operational loop */}
            <div className="p-4 rounded-2xl glass border border-primary/30 bg-primary/5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-glow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">Triangular Link Active</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase bg-accent text-primary">Assigned by Organizer HQ</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                    Hardware drop arrays are dispatched onto your terminal by event organizers. Once marked installed, sync signals map instantly onto target Exhibitor dashboards.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Link href="/vendor/billing">
                  <button className="px-3 py-1.5 rounded-lg bg-background text-foreground border border-border text-xs font-bold hover:border-primary transition-all flex items-center gap-1">
                    Billing Hub <ArrowUpRight className="h-3 w-3" />
                  </button>
                </Link>
                <Link href="/vendor/history">
                  <button className="px-3 py-1.5 rounded-lg bg-accent text-foreground text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1 border border-border/40">
                    History Archive <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>

            {/* KPI stats rows */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Wrench} label="Total Setup Requests" value={vendorTasks.length} />
              <StatCard icon={Clock} label="Pending Deployment" value={pendingCount} />
              <StatCard icon={CheckSquare} label="Cleared Tasks" value={vendorTasks.length - pendingCount} />
              <StatCard icon={DollarSign} label="Completed Payout Yield" value={completedPayout} prefix="$" delta="+Pending Bills" />
            </div>
         </>
      ) : (
         <div className="grid lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
               <StatCard icon={DollarSign} label="Gross Revenue" value={(directBookings.length * 12500).toLocaleString()} prefix="₹" delta="+12% growth" />
               <StatCard icon={Calendar} label="Active Bookings" value={directBookings.length} delta="Direct Catalog" />
               <StatCard icon={Building2} label="Partner Ranking" value="#2" delta="Top Preferred" />
            </div>
            <div className="lg:col-span-4">
               <GlassCard className="p-4 flex items-center justify-between" hover={false}>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Growth Performance</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-foreground">88%</span>
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" /> 4.2%</span>
                     </div>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                     {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="w-1.5 bg-primary rounded-t-sm transition-all hover:bg-primary/60" style={{ height: `${h}%` }} />
                     ))}
                  </div>
               </GlassCard>
            </div>
         </div>
      )}

      {vendorType === "Services" ? (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Core Work Schedule Queue */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl glass border border-border/40">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Exhibitor Setup Action Ledger
                </h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Click any task node to toggle physical status on the exhibition hall floor.</p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                {(["All", "Pending", "Completed"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                      activeFilter === f ? "bg-primary text-white shadow-sm" : "bg-background text-muted-foreground hover:text-foreground border border-border/60"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <div className="p-10 text-center glass rounded-xl border border-dashed border-border">
                    <p className="text-xs font-bold text-foreground">No matching operational line items found.</p>
                  </div>
                ) : (
                  filteredTasks.map(t => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => handleToggleTaskStatus(t.id)}
                      className={cn(
                        "p-4 rounded-xl glass border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group",
                        t.status.includes("Completed") ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border/40 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <div className={cn(
                          "h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors mt-0.5 sm:mt-0", 
                          t.status.includes("Completed") ? "bg-emerald-500 border-emerald-500 text-white" : "bg-background border-border text-muted-foreground group-hover:border-primary"
                        )}>
                          {t.status.includes("Completed") ? <Check className="h-4 w-4 stroke-[3]" /> : <Wrench className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-accent text-foreground font-mono uppercase">
                              {t.category}
                            </span>
                            <span className="text-xs font-bold text-primary font-mono">{t.payout}</span>
                          </div>
                          <h3 className="text-xs font-bold text-foreground truncate mt-1 group-hover:text-primary transition-colors">
                            {t.title}
                          </h3>
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                            📍 <span className="font-medium text-foreground">{t.clientBooth}</span> · {t.event}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">Target Readiness</span>
                          <span className="text-xs font-medium font-mono text-foreground">{t.deadline}</span>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider shrink-0 font-mono",
                          t.status.includes("Completed") ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {t.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                 )}
              </AnimatePresence>
            </div>

            {/* Compliance Info */}
            <div className="pt-2">
              <GlassCard className="p-5 border-border/40" hover={false}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Safety Authorizations & Rigging Compliance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-background border border-border/60">
                    <span className="text-[9px] font-bold text-muted-foreground block">Structural Insurance</span>
                    <span className="text-xs font-bold text-emerald-500 mt-0.5 block">Verified Insured</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/60">
                    <span className="text-[9px] font-bold text-muted-foreground block">High-Voltage Clearance</span>
                    <span className="text-xs font-bold text-primary mt-0.5 block">Certified Class A</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/60">
                    <span className="text-[9px] font-bold text-muted-foreground block">Load Bearing Caps</span>
                    <span className="text-xs font-bold text-foreground mt-0.5 block">Audit Pass</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column: Billing Quick Forwarding Shortcut */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-5 border-border/40" hover={false}>
              <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                 <h3 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-primary shrink-0" /> Invoices Dispatcher
                 </h3>
                 <span className="text-[9px] font-mono font-bold text-muted-foreground">Settlement Loop</span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-tight mb-4">
                 Fulfilling drop tasks generates payable claims. Dispatch secure batch invoices directly to target Organizer headquarters.
              </p>

              <Link href="/vendor/billing">
                 <GradientButton size="sm" className="w-full h-9 text-xs">
                    Create Invoice to Organizer <ArrowRight className="ml-1 h-3.5 w-3.5" />
                 </GradientButton>
              </Link>

              <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pending Wires:</span>
                    <span className="font-mono font-bold text-amber-500">2 Batches</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cleared Ledger:</span>
                    <span className="font-mono font-bold text-emerald-500">$4,850 Settled</span>
                 </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 bg-primary/[0.02] border-primary/20" hover={false}>
              <h3 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" /> On-Site Emergency Relay
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Direct telemetry stream to the target Floor Manager authorized for physical setup revisions.
              </p>
              <div className="mt-3.5 flex items-center gap-3 p-2.5 rounded-xl bg-background border border-border/60">
                <img src="https://i.pravatar.cc/80?img=15" className="h-9 w-9 rounded-lg object-cover" alt="" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">Jordan Lee</p>
                  <p className="text-[10px] text-primary font-mono font-bold">+1 (555) 482-9901</p>
                </div>
              </div>
            </GlassCard>

            <div className="p-4 glass rounded-xl border border-border/40 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Fulfillment Scope</p>
                <Link href="/vendor/history" className="text-xs font-bold text-primary hover:underline mt-0.5 block">
                  Audit Master Archive Logs →
                </Link>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
           {/* Direct Bookings Ledger for Hotel/Travel */}
           <div className="lg:col-span-8 space-y-6">
              <div className="p-4 rounded-xl glass border border-border/40 flex items-center justify-between">
                 <h2 className="text-xs font-black uppercase tracking-wider text-foreground">Direct Catalog Bookings</h2>
                 <div className="flex items-center gap-2">
                    <StatCard icon={Calendar} label="Total Booked" value={directBookings.length} />
                 </div>
              </div>

              <div className="space-y-3">
                 {directBookings.length === 0 ? (
                    <div className="p-10 text-center glass rounded-xl border border-dashed border-border">
                       <p className="text-xs font-bold text-foreground">No direct bookings logged in the catalog ledger.</p>
                    </div>
                 ) : (
                    directBookings.filter(b => b.category === vendorType).map(b => (
                       <div key={b.id} className="p-4 rounded-xl glass border border-border/40 hover:border-primary/40 transition-all flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-xl overflow-hidden border border-border shadow-sm">
                                <img src={b.image} className="h-full w-full object-cover" alt="" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary uppercase">Visitor</span>
                                   <span className="text-[10px] font-black text-foreground">₹{b.price}</span>
                                </div>
                                <h3 className="text-xs font-bold text-foreground">{b.serviceName}</h3>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{b.details} · {b.bookingDate}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] font-bold uppercase text-muted-foreground block">Ref ID</span>
                             <span className="text-[10px] font-mono font-bold text-primary">{b.id}</span>
                             <div className="mt-1 flex items-center gap-1 justify-end text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase">Confirmed</span>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* User Type Distribution & Trends */}
           <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-5 border-border/40" hover={false}>
                 <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-4">User Breakdown</h3>
                 <div className="space-y-4">
                    {[
                       { label: "Visitors", val: 65, color: "bg-primary" },
                       { label: "Exhibitors", val: 20, color: "bg-emerald-500" },
                       { label: "Delegates", val: 10, color: "bg-amber-500" },
                       { label: "Speakers", val: 5, color: "bg-rose-500" }
                    ].map(u => (
                       <div key={u.label}>
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                             <span className="text-muted-foreground">{u.label}</span>
                             <span className="text-foreground">{u.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                             <div className={cn("h-full rounded-full transition-all duration-1000", u.color)} style={{ width: `${u.val}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </GlassCard>

              <GlassCard className="p-5 border-primary/20 bg-primary/[0.01]" hover={false}>
                 <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-4">Revenue Payout Schedule</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><DollarSign className="h-4 w-4" /></div>
                       <div>
                          <p className="text-xs font-bold">₹2,48,000</p>
                          <p className="text-[9px] text-muted-foreground uppercase">Next Settlement (3 Days)</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center"><Clock className="h-4 w-4" /></div>
                       <div>
                          <p className="text-xs font-bold">₹12,400</p>
                          <p className="text-[9px] text-muted-foreground uppercase">Processing Ledger</p>
                       </div>
                    </div>
                 </div>
                 <GradientButton className="w-full mt-6 h-10 text-[10px] font-black uppercase tracking-widest">Withdraw Funds</GradientButton>
              </GlassCard>
           </div>
        </div>
      )}
    </DashboardShell>
  );
}
