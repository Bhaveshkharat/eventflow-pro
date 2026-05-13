"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Clock, CheckCircle2, Download, 
  FileText, ArrowUpRight, TrendingUp, MoreVertical,
  Filter, Search, Calendar, Truck, Check, Zap,
  Building2, ArrowRight, ShieldCheck, X
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrganizerSettlements() {
  // ── STATEFUL MASTER SETTLEMENTS LEDGER (INCLUDES VENDOR CLAIMS) ──
  const [payoutsLedger, setPayoutsLedger] = useState([
    {
      id: "set-v1",
      invoiceRef: "INV-2026-901",
      recipient: "Lumen Horizon Operations (Vendor)",
      role: "Vendor - Equipment & Drops",
      eventBound: "TechSummit 2026",
      amount: 1350,
      date: "June 11, 2026",
      status: "Paid",
      wireHash: "WIRE_TX_8819230192A",
      description: "Deploy 15A High-Voltage Electrical Drop & AV Cables"
    },
    {
      id: "set-v2",
      invoiceRef: "INV-2026-902",
      recipient: "Orbit AV Systems (Vendor)",
      role: "Vendor - Services",
      eventBound: "TechSummit 2026",
      amount: 450,
      date: "June 12, 2026",
      status: "Pending Escrow",
      wireHash: "Pending Wire Clearing",
      description: "Ultra-Low Latency Wired Internet Link (1 Gbps Array)"
    },
    {
      id: "set-h1",
      invoiceRef: "HTL-2026-104",
      recipient: "Grand Marquise Suites",
      role: "Hotel Partner",
      eventBound: "TechSummit 2026",
      amount: 12400,
      date: "July 15, 2026",
      status: "Pending Escrow",
      wireHash: "Pending Wire Clearing",
      description: "Master delegate suite blocks allocated during early-bird checkout."
    },
    {
      id: "set-t1",
      invoiceRef: "TRV-2026-88",
      recipient: "SkyTravel Express",
      role: "Travel Partner",
      eventBound: "TechSummit 2026",
      amount: 8200,
      date: "July 15, 2026",
      status: "Pending Escrow",
      wireHash: "Pending Wire Clearing",
      description: "VIP charter flight routing packages synchronized for keynote presenters."
    },
    {
      id: "set-e1",
      invoiceRef: "EXB-2026-12",
      recipient: "Nimbus Bio Corp",
      role: "Exhibitor Rebate",
      eventBound: "TechSummit 2026",
      amount: 4500,
      date: "July 01, 2026",
      status: "Paid",
      wireHash: "WIRE_TX_901823110E",
      description: "Booth floorplan reconfiguration rebate clearing."
    }
  ]);

  const [activeFilterCategory, setActiveFilterCategory] = useState<"All" | "Vendor" | "Partner" | "Pending">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectPayoutObj, setInspectPayoutObj] = useState<any | null>(null);

  // Settlement processing execution trigger
  const handleAuthorizeWireSettlement = (id: string) => {
    setPayoutsLedger(prev => prev.map(item => {
      if (item.id === id) {
        const genHash = `WIRE_TX_ORG_${Math.floor(Math.random() * 800000) + 100000}A`;
        toast.success(`Wire transfer released! $${item.amount.toLocaleString()} settled to ${item.recipient}. Transaction signature recorded.`);
        return {
          ...item,
          status: "Paid",
          wireHash: genHash
        };
      }
      return item;
    }));
  };

  const filteredPayouts = payoutsLedger.filter(item => {
    // text search
    const matchText = item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchText) return false;

    if (activeFilterCategory === "Vendor") return item.role.includes("Vendor");
    if (activeFilterCategory === "Partner") return item.role.includes("Partner");
    if (activeFilterCategory === "Pending") return item.status !== "Paid";
    return true;
  });

  // Calculate top visual dynamic totals
  const totalPayoutsSum = payoutsLedger.reduce((sum, item) => sum + item.amount, 0);
  const pendingPayoutsSum = payoutsLedger.filter(i => i.status !== "Paid").reduce((sum, item) => sum + item.amount, 0);
  const completedCount = payoutsLedger.filter(i => i.status === "Paid").length;

  return (
    <DashboardShell 
      title="Settlements & Finance Hub" 
      subtitle="Settle vendor invoices, authorize corporate payouts, track travel/hotel partner commission streams, and issue encrypted wire transfer authorizations."
      backLink="/organizer"
    >
      {/* ── INFO BANNER: VENDOR PAYMENT RECONCILIATION ── */}
      <div className="p-4 rounded-xl glass bg-primary/5 border border-primary/20 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
               <Truck className="h-5 w-5" />
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Accounts Payable: Vendor Settlements Stream</span>
                  <span className="text-[9px] font-bold bg-accent text-primary px-1.5 py-0.2 rounded font-mono uppercase">Escrow Enabled</span>
               </div>
               <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                  Vendors dispatch structured hardware invoices directly onto your operations ledger upon completing exhibition booth drops. Click <span className="font-bold text-primary">"Authorize Wire"</span> to clear banking holds instantly.
               </p>
            </div>
         </div>

         <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto">
            <button 
              onClick={() => setActiveFilterCategory("Vendor")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                activeFilterCategory === "Vendor" ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground hover:text-foreground border-border"
              )}
            >
               Filter Vendor Bills
            </button>
         </div>
      </div>

      {/* KPI stats metrics rows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Managed Ledger" value={totalPayoutsSum} prefix="$" delta="+Tripartite Verified" />
        <StatCard icon={Clock} label="Pending Authorization" value={pendingPayoutsSum} prefix="$" />
        <StatCard icon={CheckCircle2} label="Cleared Payouts" value={completedCount} />
        <StatCard icon={TrendingUp} label="Platform Tax Escrow" value={8.5} suffix="%" delta="Auto Reconciled" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Payouts Table Column */}
        <div className="lg:col-span-9 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
              <div>
                 <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Master Liabilities & Settlement History
                 </h2>
                 <p className="text-[10px] text-muted-foreground mt-0.5">Authorize real-time funds release to external contractors and digital partners.</p>
              </div>

              {/* Filtering triggers controls */}
              <div className="flex items-center gap-2 flex-wrap">
                 <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-xl">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <input 
                      placeholder="Search recipient or ref..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs outline-none w-28 sm:w-36 font-medium text-foreground placeholder:text-muted-foreground" 
                    />
                 </div>

                 <select
                   value={activeFilterCategory}
                   onChange={(e: any) => setActiveFilterCategory(e.target.value)}
                   className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground outline-none cursor-pointer"
                 >
                    <option value="All">All Roles</option>
                    <option value="Vendor">Vendors Only</option>
                    <option value="Partner">Travel/Hotel Partners</option>
                    <option value="Pending">Pending Status</option>
                 </select>
              </div>
           </div>

           <GlassCard className="p-0 overflow-hidden border-border/60" hover={false}>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border/80 bg-accent/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                          <th className="px-5 py-3.5">Invoice Ref</th>
                          <th className="px-5 py-3.5">Contracting Recipient</th>
                          <th className="px-5 py-3.5">Target Convention</th>
                          <th className="px-5 py-3.5">Payable Sum</th>
                          <th className="px-5 py-3.5">Verification</th>
                          <th className="px-5 py-3.5 text-right">Execution Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-xs font-sans">
                       {filteredPayouts.length === 0 ? (
                          <tr>
                             <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground font-medium">
                                No matching corporate liabilities found in active memory view.
                             </td>
                          </tr>
                       ) : (
                          filteredPayouts.map(item => (
                             <tr key={item.id} className="hover:bg-accent/20 transition-colors group">
                                <td className="px-5 py-4">
                                   <span className="font-mono font-bold text-primary block">
                                      {item.invoiceRef}
                                   </span>
                                   <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                                      {item.date}
                                   </span>
                                </td>

                                <td className="px-5 py-4 min-w-[180px]">
                                   <p className="font-bold text-foreground tracking-tight flex items-center gap-1.5">
                                      {item.recipient}
                                   </p>
                                   <span className={cn(
                                     "text-[10px] px-1.5 py-0.2 rounded font-mono font-bold inline-block mt-1",
                                     item.role.includes("Vendor") ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" : "bg-accent text-muted-foreground"
                                   )}>
                                      {item.role}
                                   </span>
                                </td>

                                <td className="px-5 py-4">
                                   <span className="font-bold text-foreground/80 block truncate max-w-[140px]">
                                      {item.eventBound}
                                   </span>
                                   <span className="text-[10px] text-muted-foreground truncate max-w-[140px] block">
                                      {item.description}
                                   </span>
                                </td>

                                <td className="px-5 py-4 font-mono font-black text-sm text-foreground">
                                   ${item.amount.toLocaleString()}
                                </td>

                                <td className="px-5 py-4 shrink-0">
                                   <div className={cn(
                                     "flex items-center gap-1.5 text-[10px] font-bold font-mono px-2 py-0.5 rounded w-fit",
                                     item.status === "Paid" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                                   )}>
                                      {item.status === "Paid" ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <Clock className="h-3 w-3 shrink-0" />}
                                      {item.status}
                                   </div>
                                </td>

                                <td className="px-5 py-4 text-right shrink-0">
                                   <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => setInspectPayoutObj(item)}
                                        className="px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground text-[10px] font-bold transition-colors"
                                      >
                                         Inspect
                                      </button>

                                      {item.status !== "Paid" ? (
                                         <GradientButton 
                                           onClick={() => handleAuthorizeWireSettlement(item.id)}
                                           size="sm" 
                                           className="h-7 px-3 text-[10px] shrink-0"
                                         >
                                            Authorize Wire
                                         </GradientButton>
                                      ) : (
                                         <span className="text-[10px] font-mono text-emerald-500 font-bold block truncate max-w-[100px] px-2 py-1">
                                            ✓ Cleared
                                         </span>
                                      )}
                                   </div>
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </GlassCard>
        </div>

        {/* Right Financial Utility Sidebar */}
        <div className="lg:col-span-3 space-y-6">
           <GlassCard className="p-5 text-center border-border/60" hover={false}>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                 Next Scheduled Escrow Clearing
              </span>
              <p className="text-2xl font-black text-foreground mt-1 tracking-tight">
                 $14,290
              </p>
              <span className="text-[10px] text-primary font-mono block mt-0.5">Expected Processing: July 15</span>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-bold font-mono">
                 <span className="text-muted-foreground">Tripartite Hold:</span>
                 <span className="text-emerald-500">Auto Sign-off</span>
              </div>
           </GlassCard>

           <div className="p-5 glass rounded-2xl border border-border/40 space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                 Quick Invoicing Modules
              </h3>
              
              <button 
                onClick={() => toast.info("Simulating manual vendor claim sync ingestion string.")}
                className="w-full p-2.5 rounded-xl bg-background border border-border text-left hover:border-primary transition-colors flex items-center gap-2 text-foreground font-medium"
              >
                 <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                 <span className="truncate">Ingest Dispatched Vendor Claim</span>
              </button>

              <button 
                onClick={() => toast.info("Exporting corporate remittance tax documentation hash.")}
                className="w-full p-2.5 rounded-xl bg-background border border-border text-left hover:border-primary transition-colors flex items-center gap-2 text-foreground font-medium"
              >
                 <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                 <span className="truncate">Export Tax Compliance Batch</span>
              </button>
           </div>

           <GlassCard className="p-4 bg-accent/10 border-border/40 space-y-1" hover={false}>
              <span className="text-[9px] font-mono text-muted-foreground uppercase block">
                 Master Routing Auth
              </span>
              <p className="text-xs font-bold text-foreground">Lumen Horizon Operations AP</p>
              <span className="text-[10px] font-mono text-primary font-bold block">**** 9012 Enterprise Vault</span>
           </GlassCard>
        </div>
      </div>

      {/* ── OVERLAY MODAL: INSPECT DETAILED PAYOUT FOOTPRINT ── */}
      <AnimatePresence>
        {inspectPayoutObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInspectPayoutObj(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6 text-xs font-sans"
            >
               <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 mb-4">
                  <div className="min-w-0">
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20 block w-fit mb-1">
                        Settlement Signature
                     </span>
                     <h3 className="text-sm font-bold text-foreground truncate">
                        {inspectPayoutObj.recipient}
                     </h3>
                     <p className="text-[10px] text-primary font-mono font-bold">{inspectPayoutObj.invoiceRef}</p>
                  </div>
                  <button onClick={() => setInspectPayoutObj(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-4">
                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Bound Target Convention
                     </span>
                     <p className="font-bold text-foreground">{inspectPayoutObj.eventBound}</p>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Line Item Deliverables Description
                     </span>
                     <p className="p-2.5 rounded-xl bg-accent/20 border border-border text-muted-foreground leading-relaxed">
                        "{inspectPayoutObj.description}"
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Total Amount</span>
                        <span className="font-black text-foreground text-sm">${inspectPayoutObj.amount.toLocaleString()}</span>
                     </div>
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Cryptographic Hash</span>
                        <span className="font-bold text-primary block truncate">{inspectPayoutObj.wireHash}</span>
                     </div>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Tripartite Validation Role
                     </span>
                     <p className="font-bold text-purple-500">{inspectPayoutObj.role}</p>
                  </div>
               </div>

               <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className={cn(
                    "font-mono font-bold text-[11px]",
                    inspectPayoutObj.status === "Paid" ? "text-emerald-500" : "text-amber-500"
                  )}>
                     ● Status: {inspectPayoutObj.status}
                  </span>

                  <button
                    onClick={() => setInspectPayoutObj(null)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-foreground font-bold border border-border hover:bg-accent/80 transition-colors"
                  >
                     Close Signature
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
