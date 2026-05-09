import { createFileRoute } from "@tanstack/react-router";
import { Building2, Eye, MessageSquare, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { RegistrationsBarChart } from "@/components/charts/Charts";
import { attendees } from "@/data/mock";

export const Route = createFileRoute("/exhibitor")({ component: Exhibitor, head: () => ({ meta: [{ title: "Exhibitor Dashboard — Eventra" }] }) });

function Exhibitor() {
  return (
    <DashboardShell title="Exhibitor overview" subtitle="Track your booth performance and leads in real time.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Booth views" value={4820} delta="+18%" />
        <StatCard icon={Users} label="Leads captured" value={342} delta="+9%" />
        <StatCard icon={MessageSquare} label="Meetings booked" value={48} delta="+22%" />
        <StatCard icon={Building2} label="Materials downloaded" value={1267} delta="+4%" />
      </div>
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Visitor & engagement</h2>
          <RegistrationsBarChart />
        </GlassCard>
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Recent leads</h2>
          <div className="space-y-3">
            {attendees.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <img src={a.avatar} alt="" className="h-9 w-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full glass">{a.ticket}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
