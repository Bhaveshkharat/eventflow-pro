import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { events } from "@/data/mock";
import { SectionHeading } from "@/components/ui-ext/SectionHeading";
import { EmptyState } from "@/components/ui-ext/EmptyState";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({ meta: [{ title: "Events — Eventra" }, { name: "description", content: "Browse upcoming expos, conferences and summits worldwide." }] }),
});

const cats = ["All", ...Array.from(new Set(events.map(e => e.category)))];

function EventsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = useMemo(() => events.filter(e => (cat === "All" || e.category === cat) && (q === "" || e.title.toLowerCase().includes(q.toLowerCase()) || e.city.toLowerCase().includes(q.toLowerCase()))), [q, cat]);
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8">
        <SectionHeading eyebrow="Discover" title="Find your next event" description="From global expos to intimate summits — curated and easy to book." />
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-full glass px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or city…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <button className="md:hidden flex items-center justify-center gap-2 rounded-full glass px-4 py-3 text-sm"><SlidersHorizontal className="h-4 w-4" />Filters</button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={"px-3.5 py-1.5 text-xs rounded-full transition-all " + (cat === c ? "gradient-bg text-white shadow-glow" : "glass hover:scale-105")}>
              {c}
            </button>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20">
        {filtered.length === 0 ? (
          <EmptyState icon={Search} title="No events found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
