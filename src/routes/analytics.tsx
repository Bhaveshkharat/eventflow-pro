import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Eye, Repeat } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { RevenueAreaChart, RegistrationsBarChart, TicketDonut } from "@/components/charts/Charts";

export const Route = createFileRoute("/analytics")({ component: Analytics, head: () => ({ meta: [{ title: "Analytics — Eventra" }] }) });

function Analytics() {
  return (
    <DashboardShell title="Analytics" subtitle="Deep insights across events, audience and revenue.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Page views" value={284912} delta="+22%" />
        <StatCard icon={Users} label="Unique visitors" value={48201} delta="+14%" />
        <StatCard icon={TrendingUp} label="Conversion" value={6} suffix="%" delta="+0.8%" />
        <StatCard icon={Repeat} label="Repeat attendees" value={42} suffix="%" delta="+3%" />
      </div>
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Revenue</h2>
          <RevenueAreaChart />
        </GlassCard>
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-2">Ticket mix</h2>
          <TicketDonut />
        </GlassCard>
        <GlassCard className="lg:col-span-3 p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Weekly registrations</h2>
          <RegistrationsBarChart />
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
