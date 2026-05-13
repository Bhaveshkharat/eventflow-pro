"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, CheckCircle2, Calendar, Layout, 
  Building2, Wrench, ArrowLeft, Download,
  Check, ShieldCheck, X
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VendorFulfillmentHistory() {
  // ── HISTORICAL FULFILLMENTS STATE ──
  const [historyLogs] = useState([
    {
      id: "FUL-TX-1092",
      title: "Master High-Definition Display Grid Array (16 LED Nodes)",
      eventTitle: "TechSummit 2025",
      clientBooth: "Booth #M-201 (Nexus Systems)",
      dateCompleted: "June 14, 2025",
      category: "AV System",
      payoutCleared: "$2,400",
      signoffAuthority: "Marcus Vance (Exhibitor Floor Agent)",
      serialHash: "SR_AV_991823901A",
      auditStatus: "Fully Reconciled & Audited"
    },
    {
      id: "FUL-TX-1044",
      title: "Redundant Fiber-Optic Drops (Twin Shards)",
      eventTitle: "WebConf Berlin 2025",
      clientBooth: "Booth #A-02 (CyberScale Labs)",
      dateCompleted: "August 06, 2025",
      category: "Network Infrastructure",
      payoutCleared: "$1,800",
      signoffAuthority: "Elena Rostova (Lead Systems Dev)",
      serialHash: "SR_NET_881923410E",
      auditStatus: "Fully Reconciled & Audited"
    },
    {
      id: "FUL-TX-0912",
      title: "Parametric Acoustic Ceiling Damping Panels",
      eventTitle: "Design Week Milano 2025",
      clientBooth: "Booth #P-44 (Aethel Designs)",
      dateCompleted: "April 12, 2025",
      category: "Rigging / Acoustic",
      payoutCleared: "$1,200",
      signoffAuthority: "David Kim (Principal Architect)",
      serialHash: "SR_RIG_441920112C",
      auditStatus: "Fully Reconciled & Audited"
    }
  ]);

  const [inspectHistoryObj, setInspectHistoryObj] = useState<any | null>(null);

  const handleDownloadCertificate = (log: any) => {
    toast.success(`Exporting signed structural delivery certificate "${log.id}" with matching serial hash strings.`);
  };

  return (
    <DashboardShell 
      title="Fulfillment History Archive" 
      subtitle="Audit verified structural installations fully deployed and cleared across previous international events. Includes signed client approvals and reconciled ledger payouts."
      backLink="/vendor"
    >
      {/* ── TOP BREADCRUMB HOOK ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-accent/20 border border-border/60">
        <div className="flex items-center gap-2.5">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Permanent Deployment Records
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Historical tasks carry immutable cryptographic hashes verified by on-site floor managers.
            </p>
          </div>
        </div>

        <Link href="/vendor">
          <button className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0">
            <ArrowLeft className="h-3 w-3" /> Execution Dashboard
          </button>
        </Link>
      </div>

      {/* History Array list */}
      <div className="space-y-4">
         {historyLogs.map((log) => (
            <GlassCard 
              key={log.id} 
              className="p-5 transition-all border border-border/60 hover:border-primary/40 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              hover={false}
            >
               <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                     <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 px-2 py-0.2 rounded border border-primary/20">
                        {log.id}
                     </span>
                     <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono uppercase flex items-center gap-1">
                        <Check className="h-2.5 w-2.5 stroke-[3]" /> {log.auditStatus}
                     </span>
                     <span className="text-[10px] font-mono text-muted-foreground font-bold">
                        Yield: {log.payoutCleared}
                     </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                     {log.title}
                  </h4>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                     <span className="font-semibold text-foreground/80">{log.eventTitle}</span>
                     <span>·</span>
                     <span className="text-[11px] font-mono">Completed: {log.dateCompleted}</span>
                     <span>·</span>
                     <span className="text-[11px] font-mono truncate max-w-[200px]">Client: {log.clientBooth}</span>
                  </div>
               </div>

               <div className="shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/40 flex flex-col md:items-end justify-between md:justify-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground hidden md:block">
                     Sign-off: {log.signoffAuthority.split(" ")[0]}
                  </span>

                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => handleDownloadCertificate(log)}
                       className="px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors flex items-center gap-1"
                       title="Export Delivery Certificate"
                     >
                        <Download className="h-3 w-3" /> Sign-off Manifest
                     </button>

                     <button
                       onClick={() => setInspectHistoryObj(log)}
                       className="px-2.5 py-1 rounded-lg bg-accent/60 text-foreground text-[11px] font-bold hover:bg-primary hover:text-white transition-colors border border-border/40"
                     >
                        Audit Details
                     </button>
                  </div>
               </div>
            </GlassCard>
         ))}
      </div>

      {/* ── OVERLAY MODAL: INSPECT HISTORY DETAILS ── */}
      <AnimatePresence>
        {inspectHistoryObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInspectHistoryObj(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6 text-xs"
            >
               <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60 mb-4">
                  <div className="min-w-0">
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20 block w-fit mb-1">
                        Historical Log Parameters
                     </span>
                     <h3 className="text-sm font-bold text-foreground truncate">
                        {inspectHistoryObj.title}
                     </h3>
                  </div>
                  <button onClick={() => setInspectHistoryObj(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-2 font-mono">
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Event Bound</span>
                        <span className="font-bold text-foreground truncate block">{inspectHistoryObj.eventTitle}</span>
                     </div>
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Settled Total</span>
                        <span className="font-bold text-emerald-500 block">{inspectHistoryObj.payoutCleared}</span>
                     </div>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Target Exhibitor Setup Footprint
                     </span>
                     <p className="font-bold text-foreground">{inspectHistoryObj.clientBooth}</p>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Physical Hardware Hash String
                     </span>
                     <p className="font-mono text-primary font-bold bg-accent/20 p-2 rounded-lg border border-border/40 text-[11px] truncate">
                        {inspectHistoryObj.serialHash}
                     </p>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Sign-off Verifying Party
                     </span>
                     <p className="font-medium text-muted-foreground">{inspectHistoryObj.signoffAuthority}</p>
                  </div>
               </div>

               <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono">Date: {inspectHistoryObj.dateCompleted}</span>

                  <button
                    onClick={() => setInspectHistoryObj(null)}
                    className="px-3 py-1 rounded-lg bg-accent text-foreground font-bold border border-border hover:bg-accent/80 transition-colors"
                  >
                     Dismiss Parameters
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
