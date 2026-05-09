import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Ticket, Users, Building2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { RevenueAreaChart, TicketDonut } from "@/components/charts/Charts";
import { attendees } from "@/data/mock";

export const Route = createFileRoute("/organizer")({ component: Organizer, head: () => ({ meta: [{ title: "Organizer Dashboard — Eventra" }] }) });

function Organizer() {
  return (
    <DashboardShell title="Organizer overview" subtitle="The pulse of TechSummit 2026 in real time.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Revenue" value={482350} delta="+12%" prefix="$" />
        <StatCard icon={Ticket} label="Tickets sold" value={9820} delta="+8%" />
        <StatCard icon={Users} label="Registrations" value={18420} delta="+15%" />
        <StatCard icon={Building2} label="Exhibitors" value={320} delta="+4%" />
      </div>
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold tracking-tight">Revenue trend</h2>
            <select className="text-xs glass rounded-full px-3 py-1.5 bg-transparent"><option>Last 12 months</option></select>
          </div>
          <RevenueAreaChart />
        </GlassCard>
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-2">Ticket mix</h2>
          <TicketDonut />
        </GlassCard>
      </div>

      <GlassCard className="mt-6 p-6" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold tracking-tight">Recent registrations</h2>
          <button className="text-xs gradient-text font-medium">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left font-medium py-3">Attendee</th>
                <th className="text-left font-medium py-3">Email</th>
                <th className="text-left font-medium py-3">Ticket</th>
                <th className="text-left font-medium py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(a => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="py-3 flex items-center gap-3"><img src={a.avatar} alt="" className="h-8 w-8 rounded-full" />{a.name}</td>
                  <td className="py-3 text-muted-foreground">{a.email}</td>
                  <td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full glass">{a.ticket}</span></td>
                  <td className="py-3">
                    <span className={"text-xs px-2 py-0.5 rounded-full " + (
                      a.status === "Checked-in" ? "bg-emerald-500/15 text-emerald-500" :
                      a.status === "Confirmed" ? "bg-sky-500/15 text-sky-500" : "bg-amber-500/15 text-amber-500"
                    )}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
}
