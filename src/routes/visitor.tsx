import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket, Calendar, Heart, MapPin, QrCode } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { events } from "@/data/mock";

export const Route = createFileRoute("/visitor")({ component: Visitor, head: () => ({ meta: [{ title: "Visitor Dashboard — Eventra" }] }) });

function Visitor() {
  const upcoming = events.slice(0, 3);
  return (
    <DashboardShell title="Welcome back, Olivia" subtitle="Here's what's happening with your tickets and events.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ticket} label="Active tickets" value={4} delta="+1" />
        <StatCard icon={Calendar} label="Upcoming" value={3} />
        <StatCard icon={Heart} label="Saved events" value={12} delta="+3" />
        <StatCard icon={QrCode} label="Check-ins" value={28} delta="+5" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold tracking-tight">Your upcoming events</h2>
            <Link to="/events" className="text-xs gradient-text font-medium">Browse →</Link>
          </div>
          <div className="space-y-3">
            {upcoming.map(e => (
              <Link key={e.id} to="/events/$eventId" params={{ eventId: e.id }} className="flex items-center gap-4 rounded-xl p-3 hover:bg-accent/40 transition-colors group">
                <img src={e.image} alt="" className="h-16 w-24 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(e.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.city}</span>
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full glass">Pro</span>
              </Link>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight">Quick QR pass</h2>
          <p className="text-xs text-muted-foreground mt-1">Show this at the venue</p>
          <div className="mt-5 grid place-items-center p-6 rounded-2xl glass-strong">
            <div className="grid h-44 w-44 place-items-center rounded-2xl bg-foreground text-background">
              <QrCode className="h-32 w-32" />
            </div>
            <p className="mt-3 text-xs font-mono text-muted-foreground">TS26-PRO-94821</p>
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
