"use client";

import React from "react";
import { DollarSign, FileText, Download, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";

export default function ExhibitorBillingPage() {
  return (
    <DashboardShell 
      title="Invoices & Settlements" 
      subtitle="Track your spatial footprint payments and dynamic extra setup costs."
    >
      <div className="max-w-4xl space-y-6">
         <div className="grid sm:grid-cols-2 gap-4">
            <GlassCard className="p-6 border-border/40" hover={false}>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Total Footprint Cost</span>
               <h3 className="text-2xl font-black text-foreground">₹72,000</h3>
               <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Settled Full
               </div>
            </GlassCard>

            <GlassCard className="p-6 border-border/40" hover={false}>
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Dynamic Extra Setup</span>
               <h3 className="text-2xl font-black text-foreground">₹12,500</h3>
               <div className="mt-4 flex items-center gap-2 text-[10px] text-primary font-bold uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Auto-Pay Enabled
               </div>
            </GlassCard>
         </div>

         <div className="space-y-3 mt-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Recent Statements</h4>
            {[
               { id: "INV-2026-001", date: "May 10, 2026", amount: "₹72,000", status: "Paid", type: "Stall Booking" },
               { id: "INV-2026-005", date: "May 14, 2026", amount: "₹1,200", status: "Paid", type: "Electrical Setup" }
            ].map(inv => (
               <div key={inv.id} className="p-4 rounded-2xl glass border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-accent/40 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-foreground">{inv.id}</p>
                        <p className="text-[10px] text-muted-foreground">{inv.date} · {inv.type}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-black text-foreground">{inv.amount}</span>
                     <button className="h-8 w-8 rounded-lg glass grid place-items-center hover:bg-primary/10 hover:text-primary transition-all">
                        <Download className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </DashboardShell>
  );
}
