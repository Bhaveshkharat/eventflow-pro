"use client";
import React from "react";
import { Truck, CheckSquare, Clock, FileText, Download, MoreHorizontal, ChevronRight, AlertCircle, Calendar } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { vendorTasks } from "@/data/mock";

export default function VendorDashboard() {
  return (
    <DashboardShell title="Service Hub" subtitle="Manage assigned tasks, upload documents and track payments.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CheckSquare} label="Assigned Tasks" value={vendorTasks.length} />
        <StatCard icon={Clock} label="Pending Docs" value={3} />
        <StatCard icon={FileText} label="Active Invoices" value={2} delta="+1" />
        <StatCard icon={Truck} label="Next On-site" value="June 11" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Task Management */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Work Schedule</h2>
              <div className="flex gap-2">
                 <button className="h-8 px-3 rounded-lg glass text-[10px] font-bold uppercase tracking-wider">All Events</button>
                 <button className="h-8 px-3 rounded-lg glass text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completed</button>
              </div>
           </div>

           <div className="space-y-4">
              {vendorTasks.map(t => (
                <GlassCard key={t.id} className="p-5" hover={true}>
                   <div className="flex items-center gap-4">
                      <div className={"h-10 w-10 rounded-xl flex items-center justify-center shrink-0 " + (t.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>
                         {t.status === "Completed" ? <CheckSquare className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold truncate">{t.title}</h3>
                            <span className={"text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter " + (t.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary")}>{t.status}</span>
                         </div>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{t.event}</p>
                      </div>
                      <div className="hidden md:block text-right px-6">
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Deadline</p>
                         <p className="text-xs font-bold">{t.deadline}</p>
                      </div>
                      <button className="h-9 w-9 rounded-xl glass grid place-items-center hover:text-primary transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                   </div>
                </GlassCard>
              ))}
           </div>

           {/* Document Uploads */}
           <div className="pt-8 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Safety & Compliance Documents</h2>
              <div className="grid md:grid-cols-2 gap-4">
                 <DocCard label="Insurance Certificate" status="Verified" />
                 <DocCard label="Safety Method Statement" status="Required" warning />
                 <DocCard label="Equipment Certifications" status="Pending Review" />
              </div>
           </div>
        </div>

        {/* Right Column: Invoices & Contact */}
        <div className="lg:col-span-4 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <FileText className="h-4 w-4 text-primary" /> Invoice Status
              </h3>
              <div className="space-y-4">
                 <InvoiceItem id="INV-2026-441" amount={12500} status="Paid" />
                 <InvoiceItem id="INV-2026-442" amount={4200} status="Pending" />
              </div>
              <GradientButton className="w-full mt-8 h-10" variant="outline">Generate New Invoice <Download className="ml-2 h-3.5 w-3.5" /></GradientButton>
           </GlassCard>

           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <AlertCircle className="h-4 w-4 text-primary" /> Emergency Contact
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                 For urgent on-site issues at TechSummit 2026, contact the Logistics Head:
              </p>
              <div className="mt-4 flex items-center gap-3">
                 <img src="https://i.pravatar.cc/80?img=15" className="h-10 w-10 rounded-full" alt="" />
                 <div>
                    <p className="text-xs font-bold">Jordan Lee</p>
                    <p className="text-[10px] text-primary font-bold">+1 (555) 482-9901</p>
                 </div>
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Event</p>
                 <p className="text-xs font-bold mt-1">Design Week Milano</p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function DocCard({ label, status, warning }: any) {
  return (
    <div className="p-5 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
       <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
             <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </div>
          {warning && <AlertCircle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />}
       </div>
       <p className="text-xs font-bold">{label}</p>
       <p className={"text-[10px] font-bold mt-2 uppercase tracking-tighter " + (status === "Verified" ? "text-emerald-500" : status === "Required" ? "text-rose-500" : "text-amber-500")}>{status}</p>
    </div>
  );
}

function InvoiceItem({ id, amount, status }: any) {
  return (
    <div className="flex items-center justify-between">
       <div>
          <p className="text-xs font-bold">{id}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">${amount.toLocaleString()}</p>
       </div>
       <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (status === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>{status}</span>
    </div>
  );
}
