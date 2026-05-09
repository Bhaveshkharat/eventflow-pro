import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, Eye, Repeat } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { RevenueAreaChart, RegistrationsBarChart, TicketDonut } from "@/components/charts/Charts";
import { useEffect, useState } from "react";
import { Shimmer } from "@/components/ui-ext/Shimmer";

export const Route = createFileRoute("/analytics")({ component: Analytics, head: () => ({ meta: [{ title: "Analytics — Eventra" }] }) });

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [segment, setSegment] = useState("All");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [dateRange, segment]);

  return (
    <DashboardShell title="Analytics" subtitle="Deep insights across events, audience and revenue.">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-1">
        <div className="flex items-center gap-2 glass p-1 rounded-xl">
          {["7d", "30d", "90d", "12m"].map(r => (
            <button key={r} onClick={() => setDateRange(r)}
              className={"px-4 py-1.5 text-xs font-medium rounded-lg transition-all " + (dateRange === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {r.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
           <select value={segment} onChange={e => setSegment(e.target.value)} 
             className="rounded-xl glass px-4 py-2 text-xs bg-transparent outline-none ring-primary/20 focus:ring-2">
             <option value="All">All Segments</option>
             <option value="Visitors">Visitors only</option>
             <option value="Exhibitors">Exhibitors only</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-32 rounded-3xl" />)
        ) : (
          <>
            <StatCard icon={Eye} label="Page views" value={284912} delta="+22%" />
            <StatCard icon={Users} label="Unique visitors" value={48201} delta="+14%" />
            <StatCard icon={TrendingUp} label="Conversion" value={6} suffix="%" delta="+0.8%" />
            <StatCard icon={Repeat} label="Repeat attendees" value={42} suffix="%" delta="+3%" />
          </>
        )}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <div className="flex items-center justify-between mb-6">
             <h2 className="font-semibold tracking-tight">Revenue trend</h2>
             {loading && <Shimmer className="h-4 w-20" />}
          </div>
          {loading ? <Shimmer className="h-[260px] w-full" /> : <RevenueAreaChart />}
        </GlassCard>
        
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-6">Ticket mix</h2>
          {loading ? <div className="grid place-items-center h-[260px]"><Shimmer className="h-40 w-40 rounded-full" /></div> : <TicketDonut />}
        </GlassCard>

        <GlassCard className="lg:col-span-3 p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-6">Weekly registrations</h2>
          {loading ? <Shimmer className="h-[260px] w-full" /> : <RegistrationsBarChart />}
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
