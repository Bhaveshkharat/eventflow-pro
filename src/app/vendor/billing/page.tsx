"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, FileText, Download, PlusCircle, 
  CheckCircle2, Clock, AlertCircle, Send, 
  X, Check, Building2, Building, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { events } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VendorBillingSettlement() {
  // ── INVOICES (VENDOR -> ORGANIZER) STATE ──
  const [invoices, setInvoices] = useState([
    {
      id: "INV-2026-901",
      eventTitle: "TechSummit 2026",
      organizerEntity: "Lumen Horizon Operations",
      itemsDelivered: "Deploy 15A High-Voltage Electrical Drop & AV Cables",
      amount: "$1,350",
      dateIssued: "June 11, 2026",
      dueDate: "Net 15 Days",
      status: "Cleared Settlement",
      wireHash: "WIRE_TX_8819230192A",
      notes: "Hardware validation signature processed by on-site Floor Manager."
    },
    {
      id: "INV-2026-902",
      eventTitle: "TechSummit 2026",
      organizerEntity: "Lumen Horizon Operations",
      itemsDelivered: "Ultra-Low Latency Wired Internet Link (1 Gbps Array)",
      amount: "$450",
      dateIssued: "June 12, 2026",
      dueDate: "Net 15 Days",
      status: "Pending Clearing",
      wireHash: "Pending Wire Clearance",
      notes: "Awaiting automated escrow settlement batch execution."
    },
    {
      id: "INV-2026-804",
      eventTitle: "Design Week Milano",
      organizerEntity: "Milano Fiere Conventions",
      itemsDelivered: "Parametric Backlit Overhead Banner Mount Rigging Hooks",
      amount: "$800",
      dateIssued: "May 20, 2026",
      dueDate: "Net 30 Days",
      status: "Cleared Settlement",
      wireHash: "WIRE_TX_1102948192E",
      notes: "Direct deposit authorization cleared."
    }
  ]);

  // View state controller
  const [inspectInvoiceObj, setInspectInvoiceObj] = useState<any | null>(null);

  // Form engine state
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [targetEventId, setTargetEventId]   = useState(events[0].id);
  const [serviceDescription, setServiceDescription] = useState("");
  const [billedAmount, setBilledAmount]     = useState("");
  const [bankWireMemo, setBankWireMemo]     = useState("Corporate Routing Wire Acct #881920");

  const handleDispatchInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceDescription.trim() || !billedAmount.trim()) return;

    const matchedEvent = events.find(ev => ev.id === targetEventId) || events[0];
    const generatedInvId = `INV-2026-${Math.floor(Math.random() * 800) + 100}`;
    
    // Clean formatted currency logic
    const numericVal = parseFloat(billedAmount.replace(/[^0-9.]/g, ""));
    const finalAmountStr = isNaN(numericVal) ? `$${billedAmount}` : `$${numericVal.toLocaleString()}`;

    const newInvoiceRecord = {
      id: generatedInvId,
      eventTitle: matchedEvent.title,
      organizerEntity: `${matchedEvent.title} Operations Group`,
      itemsDelivered: serviceDescription,
      amount: finalAmountStr,
      dateIssued: "Just Dispatched",
      dueDate: "Net 15 Days",
      status: "Pending Clearing",
      wireHash: "Pending Escrow Hash",
      notes: bankWireMemo
    };

    setInvoices(prev => [newInvoiceRecord, ...prev]);
    setServiceDescription("");
    setBilledAmount("");
    setNewInvoiceOpen(false);
    toast.success(`Invoice block ${generatedInvId} compiled! Sent directly to Accounts Payable streams for ${matchedEvent.title} Organizers.`);
  };

  const handleDownloadPdf = (inv: any) => {
    toast.success(`Itemized corporate invoice payload "${inv.id}" exported as verifiable PDF string.`);
  };

  // Yield Metrics
  const totalCleared = invoices
    .filter(i => i.status.includes("Cleared"))
    .reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, ""), 10), 0);

  const totalPending = invoices
    .filter(i => i.status.includes("Pending"))
    .reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, ""), 10), 0);

  return (
    <DashboardShell 
      title="Billing & Settlement Hub" 
      subtitle="Audit itemized corporate invoices transmitted directly from Vendor operations to target Event Organizers. Track wire clearance states and settle batch drops."
      backLink="/vendor"
    >
      {/* Top action metric banner */}
      <div className="p-4 rounded-xl glass bg-accent/10 border border-border/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
               <DollarSign className="h-5 w-5" />
            </div>
            <div>
               <span className="text-xs font-bold text-foreground block">
                  Vendor-to-Organizer Accounts Ledger
               </span>
               <p className="text-[11px] text-muted-foreground mt-0.5">
                  Assigned installation sign-offs automatically generate payout claims sent directly to organizer financing streams.
               </p>
            </div>
         </div>

         <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button 
              onClick={() => setNewInvoiceOpen(true)}
              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
            >
               <PlusCircle className="h-4 w-4" /> Dispatch New Invoice
            </button>
         </div>
      </div>

      {/* Yield visual metrics strip */}
      <div className="grid grid-cols-2 gap-4 mb-8 font-mono">
         <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
            <div>
               <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-sans font-bold">
                  Cleared Settlement Yield
               </span>
               <span className="text-lg font-black text-emerald-500 mt-0.5 block">
                  ${totalCleared.toLocaleString()}
               </span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-60" />
         </div>

         <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
            <div>
               <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-sans font-bold">
                  Pending Organizer Clearance
               </span>
               <span className="text-lg font-black text-amber-500 mt-0.5 block">
                  ${totalPending.toLocaleString()}
               </span>
            </div>
            <Clock className="h-5 w-5 text-amber-500 opacity-60" />
         </div>
      </div>

      {/* Invoices Inventory Matrix */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
               Transmitted Invoices Inventory ({invoices.length})
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">Accounts Receivable</span>
         </div>

         <div className="space-y-3">
            {invoices.map((inv) => (
               <GlassCard 
                 key={inv.id}
                 className="p-5 transition-all border border-border/60 hover:border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                 hover={false}
               >
                  <div className="min-w-0 flex-1 pr-2">
                     <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold font-mono text-primary">
                           {inv.id}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.2 rounded font-mono uppercase",
                          inv.status.includes("Cleared") ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                        )}>
                           {inv.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate hidden md:inline">
                           Target: {inv.organizerEntity}
                        </span>
                     </div>

                     <h4 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                        {inv.itemsDelivered}
                     </h4>

                     <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground/80">{inv.eventTitle}</span>
                        <span>·</span>
                        <span className="text-[11px] font-mono">Issued: {inv.dateIssued}</span>
                        <span>·</span>
                        <span className="text-[11px] font-mono text-muted-foreground/70">Terms: {inv.dueDate}</span>
                     </div>
                  </div>

                  <div className="shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 flex flex-col sm:items-end justify-between sm:justify-center gap-2">
                     <div className="flex items-baseline gap-2 sm:justify-end">
                        <span className="text-xs text-muted-foreground block sm:hidden">Claimed:</span>
                        <span className="text-base font-black font-mono text-foreground">
                           {inv.amount}
                        </span>
                     </div>

                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownloadPdf(inv)}
                          className="px-2 py-1 rounded bg-background border border-border text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors flex items-center gap-1"
                          title="Export PDF Document"
                        >
                           <Download className="h-3 w-3" /> PDF
                        </button>

                        <button
                          onClick={() => setInspectInvoiceObj(inv)}
                          className="px-2.5 py-1 rounded bg-accent/60 text-foreground text-[11px] font-bold hover:bg-primary hover:text-white transition-colors border border-border/40"
                        >
                           Inspect
                        </button>
                     </div>
                  </div>
               </GlassCard>
            ))}
         </div>
      </div>

      {/* ── OVERLAY MODAL: DISPATCH NEW INVOICE TO ORGANIZER ENGINE ── */}
      <AnimatePresence>
        {newInvoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setNewInvoiceOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 320 }}
              className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl z-10 overflow-hidden p-6 max-h-[90vh] flex flex-col"
            >
               <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4 shrink-0">
                  <div>
                     <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 block w-fit mb-1">
                        B2B Claim Dispatcher
                     </span>
                     <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-primary shrink-0" /> Dispatch Invoice to Organizer
                     </h3>
                  </div>
                  <button onClick={() => setNewInvoiceOpen(false)} className="text-muted-foreground hover:text-foreground">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <form onSubmit={handleDispatchInvoice} className="space-y-4 overflow-y-auto flex-1 pr-1 no-scrollbar text-xs">
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Target Contracting Event Organizer *
                     </label>
                     <select
                       value={targetEventId}
                       onChange={(e) => setTargetEventId(e.target.value)}
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all cursor-pointer"
                     >
                        {events.map(ev => (
                           <option key={ev.id} value={ev.id}>
                              🏢 {ev.title} Operations Group
                           </option>
                        ))}
                     </select>
                     <span className="text-[9px] text-muted-foreground block mt-1">
                        Invoice addresses corporate financing identifiers bound to chosen convention.
                     </span>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Fulfillment Line Item Description *
                     </label>
                     <input 
                       type="text"
                       required
                       value={serviceDescription}
                       onChange={(e) => setServiceDescription(e.target.value)}
                       placeholder="e.g. Master Drop Rigging - Booths Array B-101 to B-104"
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-medium outline-none focus:border-primary transition-all"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Claim Payout Total (USD) *
                     </label>
                     <input 
                       type="text"
                       required
                       value={billedAmount}
                       onChange={(e) => setBilledAmount(e.target.value)}
                       placeholder="e.g. 1350"
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-mono font-bold outline-none focus:border-primary transition-all"
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Settlement Wire Deposit Instructions
                     </label>
                     <textarea 
                       rows={2}
                       value={bankWireMemo}
                       onChange={(e) => setBankWireMemo(e.target.value)}
                       placeholder="Corporate bank routing logs..."
                       className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-foreground font-mono outline-none focus:border-primary transition-all resize-none"
                     />
                  </div>

                  <div className="p-3 rounded-xl bg-accent/20 border border-border text-[10px] text-muted-foreground leading-tight space-y-1">
                     <p>
                        Dispatched invoices route to Accounts Payable layers. Approved hardware drop validation keys enable immediate wire processing logic.
                     </p>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                     <button
                       type="button"
                       onClick={() => setNewInvoiceOpen(false)}
                       className="px-3 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                     >
                        Abort
                     </button>
                     <GradientButton type="submit" size="sm" className="h-9 px-5 text-xs">
                        Transmit Invoice String
                     </GradientButton>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── OVERLAY MODAL: INSPECT INVOICE METADATA ── */}
      <AnimatePresence>
        {inspectInvoiceObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInspectInvoiceObj(null)}
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
                        Invoice Footprint
                     </span>
                     <h3 className="text-sm font-bold text-foreground font-mono">
                        {inspectInvoiceObj.id}
                     </h3>
                     <p className="text-[11px] text-muted-foreground truncate">{inspectInvoiceObj.organizerEntity}</p>
                  </div>
                  <button onClick={() => setInspectInvoiceObj(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-4 font-sans">
                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Delivered Systems Scope
                     </span>
                     <p className="font-bold text-foreground">{inspectInvoiceObj.itemsDelivered}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Claim Value</span>
                        <span className="font-bold text-foreground">{inspectInvoiceObj.amount}</span>
                     </div>
                     <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-[9px] text-muted-foreground block font-sans uppercase">Wire Audit Hash</span>
                        <span className="font-bold text-primary block truncate">{inspectInvoiceObj.wireHash}</span>
                     </div>
                  </div>

                  <div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Attached Telemetry Memo
                     </span>
                     <p className="p-2.5 rounded-xl bg-accent/20 border border-border text-muted-foreground leading-relaxed font-mono text-[11px]">
                        "{inspectInvoiceObj.notes}"
                     </p>
                  </div>
               </div>

               <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className={cn(
                    "font-mono font-bold text-[11px]",
                    inspectInvoiceObj.status.includes("Cleared") ? "text-emerald-500" : "text-amber-500"
                  )}>
                     ● {inspectInvoiceObj.status}
                  </span>

                  <button
                    onClick={() => setInspectInvoiceObj(null)}
                    className="px-3 py-1 rounded-lg bg-accent text-foreground font-bold border border-border hover:bg-accent/80 transition-colors"
                  >
                     Close Intercom
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
