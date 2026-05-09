import { createFileRoute } from "@tanstack/react-router";
import { Hotel, Plane, BedDouble, Wallet } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui-ext/StatCard";
import { GlassCard } from "@/components/ui-ext/GlassCard";
import { HotelCard } from "@/components/events/HotelCard";
import { hotels } from "@/data/mock";

export const Route = createFileRoute("/hotel-travel")({ component: HotelTravel, head: () => ({ meta: [{ title: "Hotel & Travel — Eventra" }] }) });

function HotelTravel() {
  return (
    <DashboardShell title="Hotel & Travel" subtitle="Manage room blocks, partner inventory and traveler bookings.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BedDouble} label="Rooms booked" value={1284} delta="+9%" />
        <StatCard icon={Hotel} label="Partner hotels" value={42} delta="+2" />
        <StatCard icon={Plane} label="Flights arranged" value={612} delta="+18%" />
        <StatCard icon={Wallet} label="Revenue share" value={84200} prefix="$" delta="+12%" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Featured partner inventory</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        </GlassCard>
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold tracking-tight mb-4">Today's check-ins</h2>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/40 transition-colors">
                <div>
                  <p className="text-sm font-medium">Guest #{1240 + i}</p>
                  <p className="text-xs text-muted-foreground">{["Aurora Boutique","Skyline Loft","Grand Marquise","Harbor Suites","Aurora Boutique"][i]}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">Checked-in</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  );
}
