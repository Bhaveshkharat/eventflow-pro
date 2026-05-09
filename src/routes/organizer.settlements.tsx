import { createFileRoute } from "@tanstack/react-router";
import { 
  DollarSign, Clock, CheckCircle2, Download, 
  FileText, ArrowUpRight, TrendingUp, MoreVertical,
  Filter, Search, Calendar
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { GradientButton } from "@/components/ui-ext/GradientButton";
import { StatCard } from "@/components/ui-ext/StatCard";
import { settlements } from "@/data/mock";

export const Route = createFileRoute("/organizer/settlements")({ 
  component: OrganizerSettlements,
  head: () => ({ meta: [{ title: "Settlements — Eventra" }] }) 
});

function OrganizerSettlements() {
  return (
    <DashboardShell title="Settlements & Finance" subtitle="Track payouts, manage commissions and generate invoices.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Payouts" value={184200} prefix="$" delta="+12%" />
        <StatCard icon={Clock} label="Pending" value={42900} prefix="$" color="text-amber-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={342} />
        <StatCard icon={TrendingUp} label="Comm. Yield" value={14.2} suffix="%" delta="+0.8%" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Settlement Table */}
        <div className="lg:col-span-9 space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Payout History</h2>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg border border-white/5">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <input placeholder="Search records..." className="bg-transparent text-xs outline-none w-32" />
                 </div>
                 <button className="h-8 px-4 rounded-lg glass text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5" /> Filter
                 </button>
                 <button className="h-8 px-4 rounded-lg glass-strong text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                    <Download className="h-3.5 w-3.5" /> Export
                 </button>
              </div>
           </div>

           <GlassCard className="p-0 overflow-hidden" hover={false}>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border bg-accent/20">
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recipient</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {settlements.map(s => (
                         <tr key={s.id} className="hover:bg-accent/30 transition-colors group">
                            <td className="px-6 py-4">
                               <p className="text-[10px] font-mono font-bold text-primary">#{s.id.toUpperCase()}</p>
                               <p className="text-[9px] text-muted-foreground mt-0.5">{s.date}</p>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-xs font-semibold">{s.recipient}</p>
                               <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{s.role}</span>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[120px]">TechSummit 2026</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold">${s.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <div className={"flex items-center gap-1.5 text-[10px] font-bold " + (s.status === "Paid" ? "text-emerald-500" : "text-amber-500")}>
                                  {s.status === "Paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                  {s.status}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="h-7 px-3 rounded-lg glass text-[9px] font-bold uppercase tracking-widest hover:text-primary">Invoice</button>
                                  {s.status === "Pending" && (
                                     <button className="h-7 px-3 rounded-lg glass-strong bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Settle</button>
                                  )}
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </GlassCard>
        </div>

        {/* Financial Tools */}
        <div className="lg:col-span-3 space-y-6">
           <GlassCard className="p-6" hover={false}>
              <h3 className="font-bold flex items-center gap-2 mb-6">
                 <Calendar className="h-4 w-4 text-primary" /> Next Payout
              </h3>
              <div className="text-center">
                 <p className="text-3xl font-bold tracking-tighter">$14,290</p>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Expected July 15</p>
                 <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Tax Withheld</span>
                    <span>$1,429</span>
                 </div>
                 <div className="mt-2 h-[1px] bg-border" />
                 <GradientButton className="w-full mt-6 h-10" variant="glow">View Details</GradientButton>
              </div>
           </GlassCard>

           <div className="p-6 glass rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Invoicing</h3>
              <div className="space-y-3">
                 <InvoiceTool icon={FileText} label="Platform Fee Invoice" />
                 <InvoiceTool icon={DollarSign} label="Comm. Settlement" />
                 <InvoiceTool icon={ArrowUpRight} label="Tax Compliance Form" />
              </div>
           </div>

           <GlassCard className="p-6 bg-primary/5 border-primary/20" hover={false}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Payout Method</h3>
              <div className="flex items-center gap-3">
                 <div className="h-8 w-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-tighter">BANK</div>
                 <div>
                    <p className="text-xs font-bold">**** 9012</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Main Business Acct</p>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </DashboardShell>
  );
}

function InvoiceTool({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-xl glass hover:bg-accent/50 transition-all text-xs text-left group">
       <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
       {label}
    </button>
  );
}
